// URL base de endpoint de usarios en el backend
// En desarrollo apunta al servidor Express local
// En produccion deberia provenir de variables de entrono
import { API_URL } from "@/features/config"

const USERS_URL = `${API_URL}/users`;

// funcion para cerar un usario en el backend
// Recibe un objeto con los datos del usuario
// retorna la respuesta JSON del servidor

export async function createUser(userData){
const token = sessionStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
  };

  if (token && token !== "null" && token !== "undefined") {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const response = await fetch(USERS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

  if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Error al crear usuario");
  }

  return response.json();
  };

export async function getUsers() {
  const token = sessionStorage.getItem("token");
  const response = await fetch(USERS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener los usuarios");
  }
  return response.json();
}
export async function getUserById(id) {
  const token = sessionStorage.getItem("token");
  
  const response = await fetch(`${USERS_URL}/${id}`, {
    method: "GET",
    headers: { 
      Authorization: `Bearer ${token}` 
    }
  });

  if (!response.ok) {
    throw new Error("Error al obtener los datos del usuario");
  }
  
  return response.json();
}

export async function updateUser(id, userData) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${USERS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || "Error al actualizar usuario");
  }

  return response.json();
}

export async function updateUserStatus(id, isActive) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${USERS_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || "Error al cambiar estado del usuario");
  }

  return response.json();
}

export async function disableUser(id) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${USERS_URL}/${id}/disable`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || error.message || "Error al deshabilitar usuario");
  }

  return response.json();
}

export const deleteUser = disableUser;
