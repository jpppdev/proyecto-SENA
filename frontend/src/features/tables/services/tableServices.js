import { getOrders } from "@/features/order/services/orderServices";
import { getPermissionsData } from "@/features/permissions/services/permissionServices";

const activeOrderStatuses = new Set(["pending", "pendiente", "en preparación"]);

export async function getTablesFromOrders() {
  const orders = await getOrders();
  const tables = new Map();

  for (const order of orders) {
    const number = Number(order.table);
    if (!Number.isInteger(number) || number <= 0) continue;

    if (!tables.has(number)) {
      tables.set(number, { number, name: `Mesa ${number}`, zone: null, capacity: null, activeOrders: [] });
    }
    if (activeOrderStatuses.has(String(order.status).trim().toLowerCase())) {
      tables.get(number).activeOrders.push(order);
    }
  }

  return Array.from(tables.values(), (table) => ({
    ...table,
    status: table.activeOrders.length ? "occupied" : "unknown",
  })).sort((first, second) => first.number - second.number);
}

export async function getOrderPermissions() {
  const token = sessionStorage.getItem("token");
  const payload = token?.split(".")[1];
  if (!payload) return [];

  const { id } = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  const data = await getPermissionsData();
  const user = data.users?.find((entry) => String(entry.id) === String(id));
  if (!user) return [];

  return data.userPermissions?.[String(id)]?.orders ?? data.rolePermissions?.[user.roleName]?.orders ?? [];
}
