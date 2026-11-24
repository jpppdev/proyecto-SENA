// backend/src/config/mailer.js
// Servicio centralizado de correo corporativo de Restaurante Aurum.
// Una única cuenta institucional del servidor envía los correos a cualquier usuario registrado.
import fs from "fs";
import dns from "dns/promises";
import { fileURLToPath } from "url";
import path from "path";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../../.env");

// Lee la configuración de correo en cada envío (permite cambiar .env sin reiniciar el servidor)
function getMailConfig() {
  let env = {};
  try {
    if (fs.existsSync(envPath)) {
      env = dotenv.parse(fs.readFileSync(envPath, "utf8"));
    }
  } catch (err) {
    console.error("Aviso al leer configuración de correo:", err.message);
  }

  const read = (key) => (env[key] ?? process.env[key] ?? "").trim();

  // Credenciales SMTP de la cuenta institucional (EMAIL_USER / EMAIL_PASS se mantienen por compatibilidad)
  const smtpUser = read("SMTP_USER") || read("EMAIL_USER");
  const smtpPass = (read("SMTP_PASS") || read("EMAIL_PASS")).replace(/\s+/g, "");

  return {
    restaurantName: read("RESTAURANT_NAME") || "Restaurante Aurum",
    fromName: read("MAIL_FROM_NAME") || read("RESTAURANT_NAME") || "Restaurante Aurum",
    // Dirección empresarial que verá el usuario como remitente
    fromAddress: read("MAIL_FROM_ADDRESS") || smtpUser,
    replyTo: read("MAIL_REPLY_TO") || read("MAIL_FROM_ADDRESS") || smtpUser,
    host: read("SMTP_HOST") || "smtp.gmail.com",
    port: Number(read("SMTP_PORT")) || 465,
    secure: (read("SMTP_SECURE") || "true").toLowerCase() !== "false",
    smtpUser,
    smtpPass,
  };
}

export const createMailTransporter = (config = getMailConfig()) => {
  if (
    !config.smtpUser ||
    !config.smtpPass ||
    config.smtpPass === "PEGA_AQUI_LA_CLAVE_DE_16_LETRAS_DE_COFEEAURUM"
  ) {
    throw new Error(
      `Falta pegar en SMTP_PASS (en backend/.env) la Contraseña de Aplicación de 16 letras generada desde la cuenta ${config.smtpUser || "cofeeaurum@gmail.com"}`
    );
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.smtpUser,
      pass: config.smtpPass,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
};

/**
 * Verifica que el dominio del correo exista y pueda recibir mensajes (registros MX/A en DNS).
 * Ej: "usuario@gmial.com" o "usuario@dominioinexistente.xyz" serán rechazados.
 */
export async function verifyEmailDomain(email) {
  const domain = String(email || "").split("@")[1]?.trim().toLowerCase();
  if (!domain) return false;

  try {
    const mxRecords = await dns.resolveMx(domain);
    if (mxRecords && mxRecords.length > 0) return true;
  } catch (err) {
    // Si el dominio no existe o no tiene MX, intentamos con registro A (algunos dominios reciben correo así)
    if (!["ENOTFOUND", "ENODATA", "ESERVFAIL", "ENOTIMP"].includes(err.code)) {
      // Error de red/DNS (sin internet, timeout): no bloqueamos al usuario por un fallo de infraestructura
      console.warn(`[mailer] No se pudo verificar el dominio ${domain}:`, err.code);
      return true;
    }
  }

  try {
    const aRecords = await dns.resolve4(domain);
    return aRecords.length > 0;
  } catch {
    return false;
  }
}

/**
 * Envía el correo de recuperación al correo registrado del usuario,
 * usando como remitente la dirección empresarial de Aurum.
 */
export async function sendRecoveryEmail(toEmail, token, userName = "Usuario") {
  const config = getMailConfig();
  const { restaurantName } = config;
  const transporter = createMailTransporter(config);

  const mailOptions = {
    from: `"${config.fromName} - Seguridad" <${config.fromAddress}>`,
    sender: config.smtpUser,
    replyTo: config.replyTo,
    to: toEmail,
    subject: `${restaurantName} | Código de seguridad para restablecer tu contraseña`,
    text:
      `Hola ${userName || "Usuario"},\n\n` +
      `Estás por restablecer la contraseña de tu cuenta (${toEmail}) en ${restaurantName}.\n` +
      `Tu código de verificación es: ${token}\n\n` +
      `El código es de un solo uso y vence en 15 minutos. Si no solicitaste este cambio, ignora este correo.`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 580px; margin: 0 auto; background-color: #161616; color: #f5f5f5; border-radius: 18px; overflow: hidden; border: 1px solid #d4af37;">

        <div style="background: linear-gradient(135deg, #241e14 0%, #141414 100%); padding: 28px 32px; text-align: center; border-bottom: 2px solid #d4af37;">
          <p style="margin: 0; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: #d4af37; font-weight: 700;">
            Notificación de Seguridad
          </p>
          <h1 style="margin: 8px 0 0 0; font-size: 28px; color: #ffffff; letter-spacing: 1px;">
            ${restaurantName}
          </h1>
        </div>

        <div style="padding: 32px;">
          <p style="font-size: 16px; margin-top: 0; color: #ffffff;">
            Hola, <strong>${userName || "Usuario"}</strong>:
          </p>

          <div style="background-color: #22201b; border-left: 4px solid #d4af37; padding: 16px 18px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 6px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #d4af37; font-weight: bold;">
              Acción solicitada en tu cuenta
            </p>
            <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #e8e8e8;">
              Estás por realizar el <strong>restablecimiento y cambio de la contraseña de acceso</strong> de tu cuenta (<strong>${toEmail}</strong>) en el sistema de gestión de <strong>${restaurantName}</strong>.
            </p>
          </div>

          <p style="font-size: 15px; line-height: 1.6; color: #d6d6d6;">
            Para autorizar el cambio, ingresa el siguiente <strong>código de verificación de 4 dígitos</strong> en el sistema:
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; padding: 16px 36px; border-radius: 14px; background-color: #262626; border: 2px solid #d4af37;">
              <span style="font-size: 11px; display: block; color: #b5b5b5; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 6px;">
                Tu código de verificación
              </span>
              <span style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #d4af37;">
                ${token}
              </span>
            </div>
          </div>

          <p style="font-size: 13px; line-height: 1.6; color: #a3a3a3; text-align: center; margin-bottom: 0;">
            Este código es de un solo uso y tiene una validez de <strong>15 minutos</strong>.<br/>
            Si no solicitaste cambiar tu contraseña en <strong>${restaurantName}</strong>, ignora este correo; tu cuenta permanecerá segura.
          </p>
        </div>

        <div style="background-color: #101010; padding: 18px 24px; text-align: center; border-top: 1px solid #2c2c2c;">
          <p style="margin: 0; font-size: 12px; color: #777777;">
            © ${new Date().getFullYear()} <strong>${restaurantName}</strong> — Sistema de Seguridad y Recuperación de Cuentas<br/>
            Mensaje automático, por favor no respondas a este correo.
          </p>
        </div>

      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("[mailer] Error enviando correo:", err.code || err.message);
    if (err.code === "EAUTH") {
      throw new Error(
        `Gmail rechazó la contraseña de ${config.smtpUser}. Asegúrate de pegar en SMTP_PASS (backend/.env) la Contraseña de Aplicación de 16 letras creada dentro de ${config.smtpUser}`
      );
    }
    if (err.responseCode === 550 || err.responseCode === 553) {
      throw new Error("El correo electrónico de destino no existe o no puede recibir mensajes");
    }
    throw new Error("No se pudo enviar el correo de recuperación. Intenta nuevamente más tarde.");
  }

  return { sentByEmail: true };
}
