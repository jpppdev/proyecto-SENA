const orderList = "/dashboard/orderList";
const inventoryList = "/dashboard/inventoryList";
const pendingLimitSeconds = 15 * 60;
const number = new Intl.NumberFormat("es");

const orderStates = {
  pending: { label: "Pendiente", stage: "pending" },
  pendiente: { label: "Pendiente", stage: "pending" },
  "en preparación": { label: "En preparación", stage: "preparing" },
  servida: { label: "Servida", stage: "served" },
};

export function buildDashboardSummary(orders, inventory) {
  const normalizedOrders = orders?.map((order) => {
    const status = String(order.status ?? "").trim();
    const state = Object.hasOwn(orderStates, status.toLowerCase()) ? orderStates[status.toLowerCase()] : null;
    return { ...order, status: state?.label ?? (status || "Sin estado"), stage: state?.stage };
  });
  const pending = normalizedOrders?.filter(({ stage }) => stage === "pending");
  const inPreparation = normalizedOrders?.filter(({ stage }) => stage === "preparing");
  const delayed = pending?.filter(({ ageSeconds }) => ageSeconds >= pendingLimitSeconds);
  const exhausted = inventory?.filter(({ status }) => status === "agotado");
  const lowStock = inventory?.filter(({ status }) => status === "bajo stock");

  const indicators = [
    { label: "Órdenes activas", count: pending && pending.length + inPreparation.length, icon: "orders", tone: "orange", to: orderList },
    { label: "Órdenes pendientes", count: pending?.length, icon: "pending", tone: "amber", to: orderList },
    { label: "Productos agotados", count: exhausted?.length, icon: "inventory", tone: "red", to: inventoryList },
    { label: "Productos con stock bajo", count: lowStock?.length, icon: "review", tone: "amber", to: inventoryList },
  ].map(({ count, ...item }) => ({ ...item, value: count == null ? "—" : number.format(count) }));

  const alerts = [];
  if (exhausted?.length) alerts.push({
    title: "Productos agotados", description: exhausted.length === 1 ? exhausted[0].productName : number.format(exhausted.length) + " productos sin existencias.",
    icon: "inventory", tone: "red", to: inventoryList,
  });
  if (lowStock?.length) alerts.push({
    title: "Stock bajo", description: lowStock.length === 1 ? lowStock[0].productName : number.format(lowStock.length) + " productos llegaron a su mínimo de inventario.",
    icon: "review", tone: "amber", to: inventoryList,
  });
  if (delayed?.length) alerts.push({
    title: "Órdenes pendientes con demora", description: delayed.length === 1 ? "La orden #" + delayed[0].id + " lleva al menos 15 minutos pendiente." : number.format(delayed.length) + " órdenes llevan al menos 15 minutos pendientes.",
    icon: "pending", tone: "orange", to: delayed.length === 1 ? orderList.replace("orderList", "orderView/" + delayed[0].id) : orderList,
  });

  const recentOrders = normalizedOrders?.sort((first, second) =>
    (first.ageSeconds ?? Infinity) - (second.ageSeconds ?? Infinity) || Number(second.id) - Number(first.id)
  ).slice(0, 5);

  return { indicators, recentOrders, alerts };
}
