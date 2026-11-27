// backend/src/features/auth/auth.service.js 
// Lógica de autenticación + JWT + Recuperación de contraseña con Nodemailer
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken"; 
import { authRepository } from "./auth.repository.js"; 
import { sendRecoveryEmail, verifyEmailDomain } from "../../config/mailer.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DEFAULT_JWT_SECRET = "ee8TMRCy2AqKoWblBOFgK824RZ9MMUh1lcyvgi4pR6g";

export const authService = { 
    async login(credentials) {
        const email = String(credentials?.email || credentials?.userEmail || "").trim();
        const password = String(credentials?.password || credentials?.userPassword || "");

        const user = await authRepository.findByEmail(email); 

        if (!user) { 
            throw new Error("Credenciales inválidas"); 
        } 

        // Soporta hash de bcrypt ($2a$, $2b$, $2y$) o texto plano (con o sin espacios accidentales)
        const storedPassword = String(user.user_password ?? user.password ?? "");
        let isMatch = false;

        if (storedPassword.startsWith("$2")) {
            isMatch = await bcrypt.compare(password, storedPassword);
            if (!isMatch && password.trim() !== password) {
                isMatch = await bcrypt.compare(password.trim(), storedPassword);
            }
        } else {
            isMatch =
                password === storedPassword ||
                password.trim() === storedPassword.trim();
        }

        if (!isMatch) { 
            throw new Error("Credenciales inválidas"); 
        } 

        if (user.is_active === false) {
            throw new Error("Tu cuenta está deshabilitada. Contacta al administrador");
        }

        const roleName = user.roleName || (user.isSuperUser ? "administrador" : "usuario");
        const isSuperUser = Boolean(user.isSuperUser || roleName === "administrador");

        const token = jwt.sign( 
            { id: user.id, email: user.user_email, name: user.user_name, roleName, isSuperUser }, 
            process.env.JWT_SECRET || DEFAULT_JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES || "8h" }, 
        ); 
        
        return { 
            token, 
            user: { 
                id: user.id, 
                email: user.user_email,
                name: user.user_name,
                roleName,
                isSuperUser,
            }, 
        }; 
    },

    async forgotPassword(emailInput) {
        const email = String(emailInput || "").trim().toLowerCase();
        if (!email) {
            throw new Error("Debes ingresar un correo electrónico");
        }

        // 1. Validación de formato
        if (!EMAIL_REGEX.test(email)) {
            throw new Error("El formato del correo electrónico no es válido");
        }

        // 2. Validación de que el dominio del correo exista y reciba mensajes (DNS MX)
        const domainExists = await verifyEmailDomain(email);
        if (!domainExists) {
            throw new Error("El dominio del correo electrónico no existe o no puede recibir mensajes");
        }

        // 3. Validación de que el correo esté registrado en el sistema
        const user = await authRepository.findByEmail(email);
        if (!user) {
            throw new Error("No existe ningún usuario registrado con este correo electrónico");
        }

        // 4. Validación de que la cuenta esté habilitada
        if (user.is_active === false) {
            throw new Error("La cuenta asociada a este correo está deshabilitada. Contacta al administrador");
        }

        // El token se envía al correo con el que el usuario está registrado
        const recipientEmail = email;

        // Generamos un token numérico de 4 dígitos (compatible con las 4 casillas de ResetPasswordToken.jsx)
        const token = String(Math.floor(1000 + Math.random() * 9000));
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos de validez

        await authRepository.saveResetToken(recipientEmail, token, expiresAt);

        await sendRecoveryEmail(recipientEmail, token, user.user_name);

        return {
            message: `Hemos enviado el código de recuperación al correo ${recipientEmail}.`,
            email: recipientEmail,
            sentByEmail: true,
        };
    },

    async verifyResetToken({ email, token }) {
        const cleanToken = String(token || "").trim();
        if (cleanToken.length !== 4) {
            throw new Error("El código debe tener 4 dígitos");
        }

        const tokenRecord = await authRepository.findValidResetToken(email, cleanToken);
        if (!tokenRecord) {
            throw new Error("El código ingresado es inválido o ha expirado");
        }

        return {
            valid: true,
            email: tokenRecord.user_email,
            message: "Código verificado correctamente",
        };
    },

    async resetPassword({ email, token, password }) {
        const cleanToken = String(token || "").trim();
        const cleanPassword = String(password || "");

        if (!cleanPassword || cleanPassword.length < 8) {
            throw new Error("La nueva contraseña debe tener al menos 8 caracteres");
        }

        const tokenRecord = await authRepository.findValidResetToken(email, cleanToken);
        if (!tokenRecord) {
            throw new Error("El código de recuperación es inválido o ha expirado");
        }

        const targetEmail = email || tokenRecord.user_email;
        const hashedPassword = await bcrypt.hash(cleanPassword, 12);

        const updatedUser = await authRepository.updatePasswordByEmail(targetEmail, hashedPassword);
        if (!updatedUser) {
            throw new Error("No se pudo actualizar la contraseña del usuario");
        }

        await authRepository.markTokenAsUsed(tokenRecord.id_token);

        return {
            message: "Tu contraseña ha sido actualizada correctamente",
        };
    },
};
