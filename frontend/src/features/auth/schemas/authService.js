import { API_URL } from "@/features/config";

export async function login({ email, userEmail, password, userPassword }) {
  let response;
  try {
    response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email || userEmail,
        password: password || userPassword,
      }),
    });
  } catch {
    throw new Error("No se pudo conectar con el servidor. Verifica que el backend esté iniciado.");
  }

  if (response.status === 401) {
    throw new Error("Revisa tus credenciales y verifica que tu cuenta esté activa.");
  }

  if (!response.ok) {
    throw new Error("El servidor no pudo procesar el inicio de sesión. Inténtalo de nuevo.");
  }

  return response.json();
}
