import { API_URL } from "@/features/config";

const MENU_URL = `${API_URL}/menu`;

export async function createMenu(menuData) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(MENU_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(menuData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || "Error al crear platillo del menú");
  }

  return response.json();
}

export const createMenuItem = createMenu;

export async function getMenus() {
  const token = sessionStorage.getItem("token");
  const response = await fetch(MENU_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener menú");
  }

  return response.json();
}

export const getMenu = getMenus;

export async function getMenuById(id) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${MENU_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener platillo del menú");
  }

  return response.json();
}

export async function updateMenu(id, menuData) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${MENU_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(menuData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || "Error al actualizar platillo del menú");
  }

  return response.json();
}

export const updateMenuItem = updateMenu;

export async function updateMenuStatus(id, isActive) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${MENU_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || "Error al cambiar estado del platillo");
  }

  return response.json();
}

export async function disableMenu(id) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${MENU_URL}/${id}/disable`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || "Error al deshabilitar platillo del menú");
  }

  return response.json();
}

export const deleteMenu = disableMenu;
