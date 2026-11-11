import { API_URL } from "@/features/config";

const PROVIDERS_URL = `${API_URL}/providers`;

export async function createProvider(providerData) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(PROVIDERS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(providerData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || "Error al crear proveedor");
  }

  return response.json();
}

export async function getProviders() {
  const token = sessionStorage.getItem("token");
  const response = await fetch(PROVIDERS_URL, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener proveedores");
  }

  return response.json();
}

export async function getProviderById(id) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${PROVIDERS_URL}/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Error al obtener proveedor");
  }

  return response.json();
}

export async function updateProvider(id, providerData) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${PROVIDERS_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(providerData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || "Error al actualizar proveedor");
  }

  return response.json();
}

export async function updateProviderStatus(id, isActive) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${PROVIDERS_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ isActive }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || "Error al cambiar estado del proveedor");
  }

  return response.json();
}

export async function disableProvider(id) {
  const token = sessionStorage.getItem("token");
  const response = await fetch(`${PROVIDERS_URL}/${id}/disable`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || error.error || "Error al deshabilitar proveedor");
  }

  return response.json();
}

export const deleteProvider = disableProvider;
