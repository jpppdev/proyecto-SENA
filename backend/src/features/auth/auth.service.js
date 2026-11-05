// backend/src/features/auth/auth.service.js 
// Lógica de autenticación + JWT 
import bcrypt from "bcrypt"; 
import jwt from "jsonwebtoken"; 
import { authRepository } from "./auth.repository.js"; 

export const authService = { 
    async login(credentials) {
        const email = credentials.email || credentials.userEmail;
        const password = credentials.password || credentials.userPassword;

        const user = await authRepository.findByEmail(email); 
        console.log("USER ENCONTRADO:", user); 

        if (!user) { 
            throw new Error("Credenciales inválidas"); 
        } 

        // SE CAMBIO AQUI: se cambio user.password por user.user_password
        // Soporta hash de bcrypt ($2b$...) o texto plano si fue insertado manualmente en SQL
        const isMatch = user.user_password?.startsWith("$2")
            ? await bcrypt.compare(password, user.user_password)
            : password === user.user_password; 

        if (!isMatch) { 
            throw new Error("Credenciales inválidas"); 
        } 

        if (!user.is_active) { 
            throw new Error("Usuario inactivo"); 
        } 

        const token = jwt.sign( 
            { id: user.id, email: user.user_email }, 
            process.env.JWT_SECRET, 
            { expiresIn: process.env.JWT_EXPIRES }, 
        ); 
        
        return { 
            token, 
            user: { 
                id: user.id, 
                email: user.user_email, 
            }, 
        }; 
    }, 
};
