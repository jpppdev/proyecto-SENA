import { API_URL } from "@/features/config";

const ORDERS_URL = `${API_URL}/orders`;

export async function createOrder(orderData) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(ORDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || "Error al crear la orden");
  }

  return response.json();
}

export async function getOrders() {
  const token = sessionStorage.getItem("token");
  const response = await fetch(ORDERS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener las órdenes");
  }

  return response.json();
}

export async function getOrderById(id) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${ORDERS_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener la orden");
  }

  return response.json();
}
