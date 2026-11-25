
// Funcion utilitaria para construir el dataset de un reporte de menu
// Patron: transformacion de datos (input -> output listo para exportar)
export function buildMenuReportDataset({
  menu = [],
  data,
  selectedFields,
  scope,
}) {
  const sourceItems = Array.isArray(data) && data.length > 0 ? data : menu;
  let filteredItems = [...sourceItems];

  // Filtro por alcance
  if (scope === "available") {
    filteredItems = filteredItems.filter(
      (product) => product.isActive === true
    );
  }

  if (scope === "unavailable") {
    filteredItems = filteredItems.filter(
      (product) => product.isActive === false
    );
  }

  // Construccion de encabezados del reporte
  const headers = selectedFields.map((field) => field.label);

  // Construccion de filas del reporte
  const rows = filteredItems.map((product) =>
    selectedFields.map((field) => {
      const value = product[field.key];

      // Normalizacion: convierte booleanos a texto legible
      if (typeof value === "boolean") {
        return value ? "Disponible" : "Agotado";
      }

      // Normalizacion: formatea el precio
      if (field.key === "price" && value !== null && value !== undefined) {
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
