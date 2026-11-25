import { API_URL } from "@/features/config";

const AUTH_API_URL = `${API_URL}/auth`;

export async function login(userData) {
  const email = String(userData.email || userData.userEmail || "").trim();
  const password = String(userData.password || userData.userPassword || "");

  let response;
  try {
    response = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté iniciado.");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error ||
      error.message ||
      (response.status === 401
        ? "Revisa tus credenciales y verifica que tu cuenta esté activa."
        : "El servidor no pudo procesar el inicio de sesión. Inténtalo de nuevo.")
    );
  }

  return response.json();
}

export async function requestPasswordReset(email) {
  const response = await fetch(`${AUTH_API_URL}/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: String(email || "").trim(),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Error al solicitar el código de recuperación");
  }

  return response.json();
}

export async function verifyResetToken({ email, token }) {
  const response = await fetch(`${AUTH_API_URL}/verify-reset-token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: String(email || "").trim(),
      token: String(token || "").trim(),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "El código ingresado es inválido o ha expirado");
  }

  return response.json();
}

export async function resetPassword({ email, token, password }) {
  const response = await fetch(`${AUTH_API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: String(email || "").trim(),
      token: String(token || "").trim(),
      password: String(password || ""),
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Error al actualizar la contraseña");
  }

  return response.json();
}
