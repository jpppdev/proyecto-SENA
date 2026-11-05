// frontend/src/features/auth/services/authService.js
// Consumir API login
// 🤣🤣
// const API_URL = "http://localhost:4000/api/auth";

import { API_URL } from "@/features/config";

const AUTH_API_URL = `${API_URL}/auth`;

export async function login(userData) {

  const response = await fetch(`${AUTH_API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      email: userData.email || userData.userEmail,
      password: userData.password || userData.userPassword,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error login");
  }

  return response.json();
}
