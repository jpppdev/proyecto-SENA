import { API_URL } from "@/features/config";

const INVENTORY_URL = `${API_URL}/inventory`;

export async function createInventory(inventoryData) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(INVENTORY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(inventoryData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || "Error al crear producto de inventario");
  }

  return response.json();
}

export async function getInventories() {
  const token = sessionStorage.getItem("token");
  const response = await fetch(INVENTORY_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener inventario");
  }

  return response.json();
}

export const getInventory = getInventories;

export async function getInventoryById(id) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${INVENTORY_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener producto de inventario");
  }

  return response.json();
}
