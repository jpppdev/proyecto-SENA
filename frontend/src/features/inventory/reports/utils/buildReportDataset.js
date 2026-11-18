
// Funcion utilitaria para construir el dataset de un reporte de inventario
// Patron: transformacion de datos (input -> output listo para exportar)
export function buildInventoryReportDataset({
  inventory = [],
  data,
  selectedFields,
  scope,
  barcode,
}) {
  const sourceItems = Array.isArray(data) && data.length > 0 ? data : inventory;
  let filteredItems = [...sourceItems];

  // Filtro por alcance
  if (scope === "barcode" && barcode && String(barcode).trim() !== "") {
    const query = String(barcode).trim().toLowerCase();

    filteredItems = filteredItems.filter((product) => {
      return [
        product.barcode,
        product.productName,
        product.brand,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );
    });
  }

  // Construccion de encabezados del reporte
  const headers = selectedFields.map((field) => field.label);

  // Construccion de filas del reporte
  const rows = filteredItems.map((product) =>
    selectedFields.map((field) => {
      const value = product[field.key];

      // Normalizacion de valores booleanos
      if (typeof value === "boolean") {
        return value ? "Si" : "No";
      }

      // Formateo del valor unitario como moneda colombiana
      if (field.key === "unitValue" && value !== null && value !== undefined) {
        return `$ ${Number(value).toLocaleString("es-CO")}`;
      }

      // Normalizacion de valores nulos o indefinidos
      return value ?? "";
    })
  );

  return {
    headers,
    rows,
  };
}
