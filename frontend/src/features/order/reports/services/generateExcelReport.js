// Libreria para manipulacion y generacion de archivos Excel
import * as XLSX from "xlsx";

// Funcion utilitaria para generar un archivo Excel a partir de datos tabulares
// Patron: exportacion de datos (dataset -> archivo descargable)
export function generateExcelReport({
  headers, // Array de encabezados (columnas)
  rows, // Array de filas (array de arrays)
  fileName = "user-report.xlsx", // Nombre del archivo de salida
  sheetName = "Usuarios", // Nombre de la hoja
}) {
  // Estructura final de la hoja:
  // Primera fila = headers
  // Siguientes filas = datos
  const worksheetData = [
    headers,
    ...rows,
  ];

  // Convierte un array de arrays (AOA = Array of Arrays) en una hoja de Excel
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Crea un nuevo libro de Excel (workbook)
  const workbook = XLSX.utils.book_new();

  // Agrega la hoja al libro
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  // Genera y descarga el archivo Excel en el cliente
  XLSX.writeFile(workbook, fileName);
}
