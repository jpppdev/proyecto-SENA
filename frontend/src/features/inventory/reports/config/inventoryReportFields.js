// Configuración de campos disponibles para el reporte de inventario
export const inventoryReportFields = [
  {
    key: "barcode",
    label: "Código",
    default: true,
  },
  {
    key: "productName",
    label: "Producto",
    default: true,
  },
  {
    key: "brand",
    label: "Marca",
    default: true,
  },
  {
    key: "quantity",
    label: "Stock",
    default: true,
  },
  {
    key: "unitValue",
    label: "Valor Unitario",
    default: true,
  },
  {
    key: "status",
    label: "Estado",
    default: false,
  },
];