import { API_URL } from "@/features/config";

const PRODUCTS_URL = `${API_URL}/products`;

export async function createProduct(productData) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(PRODUCTS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || "Error al crear producto");
  }

  return response.json();
}

export async function getProducts() {
  const token = sessionStorage.getItem("token");
  const response = await fetch(PRODUCTS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }

  return response.json();
}

export async function getProductById(id) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${PRODUCTS_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener producto");
  }

  return response.json();
}
