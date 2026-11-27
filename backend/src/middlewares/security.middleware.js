// backend/src/middlewares/security.middleware.js
// Middleware de defensa en profundidad contra inyecciones SQL (SQL Injection).
// Nota: todas las consultas SQL del proyecto usan placeholders parametrizados ($1, $2, ...);
// este middleware añade una capa previa de inspección y validación de parámetros.

const SQL_INJECTION_PATTERNS = [
  /(?:;|'|")\s*\b(?:DROP|ALTER|TRUNCATE|EXEC|EXECUTE)\b/i,
  /\bUNION\s+(?:ALL\s+)?SELECT\b/i,
  /(?:'|"|`)\s*(?:OR|AND)\s+(?:\d+\s*=\s*\d+|'[^']*'\s*=\s*'[^']*'|TRUE|FALSE)/i,
  /\b(?:OR|AND)\s+1\s*=\s*1\b/i,
  /(?:'|"|;)\s*--/,
  /\/\*[\s\S]*?\*\//,
  /\b(?:PG_SLEEP|SLEEP|WAITFOR\s+DELAY|BENCHMARK)\s*\(/i,
];

// Campos que pueden contener caracteres especiales legítimos (contraseñas hasheadas con bcrypt o imágenes base64)
const EXCLUDED_KEYS = new Set([
  "password",
  "userPassword",
  "confirmPassword",
  "userImage",
  "menuImage",
  "supplierImage",
  "image",
  "imageUrl",
  "userAvatarUrl",
  "supplierImage",
  "dataBase64",
]);

function hasSqlInjectionPattern(value) {
  if (typeof value !== "string") return false;
  // Ignorar data URLs de imágenes
  if (value.startsWith("data:image/")) return false;
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(value));
}

function inspectObject(obj, parentKey = "") {
  if (obj === null || obj === undefined) return false;

  if (typeof obj === "string") {
    if (EXCLUDED_KEYS.has(parentKey)) return false;
    return hasSqlInjectionPattern(obj);
  }

  if (Array.isArray(obj)) {
    return obj.some((item) => inspectObject(item, parentKey));
  }

  if (typeof obj === "object") {
    for (const [key, val] of Object.entries(obj)) {
      if (EXCLUDED_KEYS.has(key)) continue;
      if (inspectObject(val, key)) return true;
    }
  }

  return false;
}

export function sqlInjectionGuard(req, res, next) {
  // 1. Validar parámetros numéricos comunes (:id, :userId) si están presentes
  for (const paramKey of ["id", "userId"]) {
    const val = req.params?.[paramKey];
    if (val !== undefined && !/^\d+$/.test(String(val))) {
      return res.status(400).json({
        error: "Parámetro de identificador inválido.",
      });
    }
  }

  // 2. Inspeccionar query, params y body en busca de patrones de inyección SQL
  if (
    inspectObject(req.query) ||
    inspectObject(req.params) ||
    inspectObject(req.body)
  ) {
    console.warn(
      `[SECURITY] Posible intento de SQL Injection bloqueado en ${req.method} ${req.originalUrl}`
    );
    return res.status(400).json({
      error: "Solicitud rechazada por contener patrones no permitidos.",
    });
  }

  next();
}
