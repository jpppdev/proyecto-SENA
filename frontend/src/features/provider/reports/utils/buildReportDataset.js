
// Funcion utilitaria para construir el dataset de un reporte de proveedores
// Patron: transformacion de datos (input -> output listo para exportar)
export function buildProviderReportDataset({
  providers = [],
  data,
  selectedFields,
  scope,
  documentNumber,
}) {
  const sourceItems = Array.isArray(data) && data.length > 0 ? data : providers;
  let filteredItems = [...sourceItems];

  // Filtro por alcance
  if (
    scope === "document" &&
    documentNumber &&
    String(documentNumber).trim() !== ""
  ) {
    const query = String(documentNumber).trim().toLowerCase();

    filteredItems = filteredItems.filter((provider) => {
      return [
        provider.documentType,
        provider.documentNumber,
        provider.providerName,
        provider.products,
        provider.phone,
        provider.id,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query)
      );
    });
  }

  // Construccion de encabezados del reporte
  const headers = selectedFields.map((field) => field.label);

  // Construccion de filas del reporte
  const rows = filteredItems.map((provider) =>
    selectedFields.map((field) => {
      const value = provider[field.key];

      // Normalizacion: convierte booleanos a texto legible
      if (typeof value === "boolean") {
        return value ? "Si" : "No";
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
