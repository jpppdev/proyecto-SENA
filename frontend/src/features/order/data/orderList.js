const stateAliases = {
  pending: ["pending", "pendiente"],
  preparing: ["preparing", "en preparacion"],
  ready: ["ready", "lista", "listo"],
  delivered: ["delivered", "served", "completed", "entregada", "servida", "completada"],
  cancelled: ["cancelled", "canceled", "cancelada"],
  disabled: ["deshabilitada", "inactivo"],
};

export const orderStates = {
  pending: { label: "Pendiente", plural: "Pendientes", style: "bg-brand-soft/45 text-text-coffee" },
  preparing: { label: "En preparación", plural: "En preparación", style: "bg-border-clear2 text-text-brand" },
  ready: { label: "Lista", plural: "Listas", style: "bg-background-clear text-text-coffee" },
  delivered: { label: "Entregada", plural: "Entregadas", style: "bg-[var(--color-tertiary-200)] text-text-coffee" },
  cancelled: { label: "Cancelada", plural: "Canceladas", style: "bg-brand-light text-text-secondary" },
  disabled: { label: "Deshabilitada", style: "bg-brand-light text-text-secondary" },
  unknown: { label: "Sin estado", style: "bg-brand-light text-text-secondary" },
};

export const orderFilters = [
  { id: "all", label: "Todas" },
  { id: "mesa", label: "Mesa" },
  { id: "llevar", label: "Para llevar" },
  { id: "domicilio", label: "Delivery" },
  { id: "completed", label: "Completadas" },
  { id: "cancelled", label: "Canceladas" },
];

export const numberFormat = new Intl.NumberFormat("es-CO");
export const orderPrice = new Intl.NumberFormat("es-CO", {
  style: "currency", currency: "COP", minimumFractionDigits: 0,
});

function normalize(value) {
  return String(value ?? "").normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}

export function formatOrderNumber(id) {
  return "#ORD-" + String(id).padStart(4, "0");
}

export function describeOrder(order) {
  const rawStatus = normalize(order.status);
  const stage = Object.keys(stateAliases).find((key) => stateAliases[key].includes(rawStatus)) ?? "unknown";
  const status = orderStates[stage];
  const service = ["mesa", "llevar", "domicilio"].includes(order.orderType)
    ? order.orderType
    : Number(order.table) > 0 ? "mesa" : null;

  return {
    ...order,
    stage,
    service,
    statusLabel: stage === "unknown" || stage === "delivered" && ["servida", "completada"].includes(rawStatus)
      ? String(order.status ?? "").trim() || status.label
      : status.label,
  };
}

export function matchesOrderFilter(order, filter) {
  if (filter === "all") return true;
  if (filter === "completed") return order.stage === "delivered";
  if (filter === "cancelled") return order.stage === "cancelled";
  return order.service === filter;
}

export function matchesOrderSearch(order, search) {
  const query = normalize(search);
  if (!query) return true;

  const numberQuery = query.match(/^(?:#?ord-?|#)\s*(\d+)$/);
  if (numberQuery) return Number(order.id) === Number(numberQuery[1]);

  const tableQuery = query.match(/^mesa\s+(\d+)$/);
  if (tableQuery) return Number(order.table) === Number(tableQuery[1]);

  return [formatOrderNumber(order.id), order.id, order.table || "", order.customerName]
    .some((value) => normalize(value).includes(query));
}
