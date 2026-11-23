// Funcion utilitaria para construir el dataset de un reporte (tabla)
// Patron: transformacion de datos (input -> output listo para exportar)
export function buildReportDataset({
  users = [], // Array de registros origen
  data, // Alias opcional para registros de cualquier modulo
  selectedFields, // Campos seleccionados para el reporte [{ key, label }]
  scope, // Alcance del reporte: "all" | "document"
  documentNumber, // Valor de filtro (si aplica)
  filterKey = "userDocumentNumber",
}) {
  const sourceItems = Array.isArray(data) && data.length > 0 ? data : users;
  let filteredItems = [...sourceItems];

  // Filtro por alcance
  if (scope === "document" && documentNumber && String(documentNumber).trim() !== "") {
    const query = String(documentNumber).trim().toLowerCase();
    filteredItems = filteredItems.filter((item) => {
      const primaryVal = String(item[filterKey] ?? "").toLowerCase();
      if (primaryVal.includes(query)) return true;

      // Busqueda flexible en campos identificadores comunes del registro
      return [
        item.userDocumentNumber,
        item.userName,
        item.barcode,
        item.productName,
        item.customerName,
        item.menuName,
        item.category,
        item.documentNumber,
        item.providerName,
        item.id,
      ].some((val) => String(val ?? "").toLowerCase().includes(query));
    });
  }

  // Construccion de encabezados del reporte
  const headers = selectedFields.map((field) => field.label);

  // Construccion de filas del reporte
  const rows = filteredItems.map((item) =>
    selectedFields.map((field) => {
      const value = item[field.key];

      // Normalizacion: convierte booleanos a texto legible
      if (typeof value === "boolean") {
        return value ? "Si" : "No";
      }

      // Normalizacion: evita undefined o null en el reporte
      return value ?? "";
    }),
  );

  return {
    headers,
    rows,
  };
}
