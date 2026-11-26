import { API_URL } from "@/features/config";
import { readSessionPayload } from "@/features/auth/session";
import { getPermissionsData } from "@/features/permissions/services/permissionServices";

const TABLES_URL = `${API_URL}/tables`;

function getAuthHeaders(includeJson = false) {
  const token = sessionStorage.getItem("token");
  const headers = {};
  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }
  if (token && token !== "null" && token !== "undefined") {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

export async function getTables() {
  const response = await fetch(TABLES_URL, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Error al obtener las mesas");
  }

  return response.json();
}

export async function getTableById(id) {
  const response = await fetch(`${TABLES_URL}/${id}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Error al obtener la mesa");
  }

  return response.json();
}

export async function createTable(tableData) {
  const response = await fetch(TABLES_URL, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(tableData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Error al crear la mesa");
  }

  return response.json();
}

export async function updateTable(id, tableData) {
  const response = await fetch(`${TABLES_URL}/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(true),
    body: JSON.stringify(tableData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Error al actualizar la mesa");
  }

  return response.json();
}

export async function updateTableStatus(id, status) {
  const response = await fetch(`${TABLES_URL}/${id}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Error al cambiar el estado de la mesa");
  }

  return response.json();
}

export async function releaseTable(id) {
  const response = await fetch(`${TABLES_URL}/${id}/release`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Error al liberar la mesa");
  }

  return response.json();
}

export async function disableTable(id) {
  const response = await fetch(`${TABLES_URL}/${id}/disable`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || error.message || "Error al deshabilitar la mesa");
  }

  return response.json();
}

export async function getTableUserContext() {
  const payload = readSessionPayload();
  if (!payload?.id) {
    return { orderPermissions: [], isAdmin: false };
  }

  const data = await getPermissionsData();
  const user = data.users?.find((entry) => String(entry.id) === String(payload.id));
  if (!user) {
    return { orderPermissions: [], isAdmin: false };
  }

  const orderPermissions =
    data.userPermissions?.[String(payload.id)]?.orders ??
    data.rolePermissions?.[user.roleName]?.orders ??
    [];

  const isAdmin =
    String(user.roleName || "").toLowerCase() === "administrador" ||
    Boolean(user.isSuperUser);

  return { orderPermissions, isAdmin };
}
