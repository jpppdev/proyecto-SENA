import { getUsers } from "../../services/userServices";
import { getInventory } from "@/features/inventory/services/inventoryServices";
import { getOrders } from "@/features/order/services/orderServices";
import { getMenu } from "@/features/menu/services/menuServices";
import { getProviders } from "@/features/provider/services/providerServices";
import { reportModulesConfig } from "../config/userReportFields";
import { buildReportDataset } from "../utils/buildReportDataset";
import { generateExcelReport } from "./generateExcelReport";
import { generatePdfReport } from "./generatePdfReport";
import { showErrorAlert } from "@/shared/services/alertService";

const fetchersByModule = {
  users: getUsers,
  inventory: getInventory,
  orders: getOrders,
  menu: getMenu,
  providers: getProviders,
};

// Caso de uso: orquestador de generacion de reportes conectado al backend y BD
export async function generateUserReport({
  module = "users",
  data = [],
  format, // "excel" | "pdf"
  selectedFields, // Campos seleccionados por el usuario
  scope, // Alcance del reporte
  documentNumber, // Filtro opcional
}) {
  const moduleConfig = reportModulesConfig[module] || reportModulesConfig.users;
  const fetcher = fetchersByModule[module] || getUsers;

  let records = Array.isArray(data) ? data : [];
  try {
    const apiData = await fetcher();
    if (Array.isArray(apiData) && apiData.length > 0) {
      records = apiData;
    }
  } catch (err) {
    console.error(`Error obteniendo datos de ${module} para el reporte:`, err);
  }

  // Construccion del dataset desde los datos de PostgreSQL
  const { headers, rows } = buildReportDataset({
    data: records,
    selectedFields,
    scope,
    documentNumber,
    filterKey: moduleConfig.filterKey,
  });

  // Validacion: evita generar archivos vacios
  if (!rows.length) {
    await showErrorAlert({
      title: "Sin datos",
      text: "No hay registros que coincidan para generar el reporte.",
      timer: 2500,
    });
    return;
  }

  // Generacion de timestamp para nombres unicos de archivo
  const timestamp = new Date().toISOString().slice(0, 10);

  // Seleccion de estrategia de exportacion segun formato
  if (format === "excel") {
    generateExcelReport({
      headers,
      rows,
      fileName: `${moduleConfig.filePrefix}-${timestamp}.xlsx`,
      sheetName: moduleConfig.sheetName,
    });
  }

  if (format === "pdf") {
    generatePdfReport({
      headers,
      rows,
      fileName: `${moduleConfig.filePrefix}-${timestamp}.pdf`,
      title: moduleConfig.title,
    });
  }
}
