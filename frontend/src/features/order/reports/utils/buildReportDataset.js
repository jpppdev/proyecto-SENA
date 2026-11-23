
// Funcion utilitaria para construir el dataset de un reporte de ordenes
// Patron: transformacion de datos (input -> output listo para exportar)
export function buildOrderReportDataset({
  orders = [],
  data,
  selectedFields,
  scope,
}) {
  const sourceItems = Array.isArray(data) && data.length > 0 ? data : orders;
  let filteredItems = [...sourceItems];

  // Filtro por alcance
  if (scope === "pending") {
    filteredItems = filteredItems.filter(
      (order) =>
        String(order.status || "Pendiente").toLowerCase() === "pendiente"
    );
  }

  if (scope === "preparing") {
    filteredItems = filteredItems.filter(
      (order) =>
        String(order.status || "").toLowerCase() === "en preparación"
    );
  }

  if (scope === "cancelled") {
    filteredItems = filteredItems.filter(
      (order) =>
        String(order.status || "").toLowerCase() === "cancelada"
    );
  }

  if (scope === "disabled") {
    filteredItems = filteredItems.filter(
      (order) =>
        String(order.status || "").toLowerCase() === "deshabilitada"
    );
  }

  // Construccion de encabezados del reporte
  const headers = selectedFields.map((field) => field.label);

  // Construccion de filas del reporte
  const rows = filteredItems.map((order) =>
    selectedFields.map((field) => {
      const value = order[field.key];

      // Normalizacion: formatea el total
      if (field.key === "total" && value !== null && value !== undefined) {
        return `$ ${Number(value).toLocaleString("es-CO")}`;
      }

      // Normalizacion: evita undefined o null en el reporte
      return value ?? "";
    })
  );

  return {
    headers,
    rows,
  };
}
