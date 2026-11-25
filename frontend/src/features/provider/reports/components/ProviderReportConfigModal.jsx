
import { useState } from "react";
import { Button } from "@/shared";
import { X, Check } from "lucide-react";
import {
  showSuccessAlert,
  showErrorAlert,
} from "@/shared/services/alertService";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ProviderReportConfigModal({
  isOpen,
  onClose,
  data = [],
}) {
  const [format, setFormat] = useState("PDF");
  const [scope, setScope] = useState("Todos los proveedores");

  const [fields, setFields] = useState({
    documentType: true,
    documentNumber: true,
    providerName: true,
    email: true,
    phone: true,
    address: false,
    isActive: true,
  });

  if (!isOpen) return null;

  const toggleField = (fieldName) => {
    setFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!data || data.length === 0) {
      showErrorAlert({
        title: "Sin datos",
        text: "No hay proveedores registrados para exportar.",
      });
      return;
    }

    try {
      // Filtrar proveedores según el alcance seleccionado
      let filteredData = [...data];

      if (scope === "Solo activos") {
        filteredData = data.filter(
          (provider) => provider.isActive === true
        );
      } else if (scope === "Solo inactivos") {
        filteredData = data.filter(
          (provider) => provider.isActive === false
        );
      }

      if (filteredData.length === 0) {
        showErrorAlert({
          title: "Sin resultados",
          text: "No hay proveedores que coincidan con el alcance seleccionado.",
        });
        return;
      }

      // Preparar los datos para exportar
      const reportData = filteredData.map((provider) => {
        const row = {};

        if (fields.documentType) {
          row["Tipo de documento"] = provider.documentType || "";
        }

        if (fields.documentNumber) {
          row["Documento"] = provider.documentNumber || "";
        }

        if (fields.providerName) {
          row["Proveedor"] = provider.providerName || "";
        }

        if (fields.email) {
          row["Correo"] = provider.email || "";
        }

        if (fields.phone) {
          row["Teléfono"] = provider.phone || "";
        }

        if (fields.address) {
          row["Dirección"] = provider.address || "";
        }

        if (fields.isActive) {
          row["Activo"] = provider.isActive ? "Sí" : "No";
        }

        return row;
      });

      if (Object.keys(reportData[0]).length === 0) {
        showErrorAlert({
          title: "Error",
          text: "Debes seleccionar al menos un campo para exportar.",
        });
        return;
      }

      // Generar Excel
      if (format === "EXCEL") {
        const worksheet = XLSX.utils.json_to_sheet(reportData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
          workbook,
          worksheet,
          "Proveedores Aurum"
        );

        XLSX.writeFile(
          workbook,
          "Reporte_Proveedores_Aurum.xlsx"
        );

      // Generar PDF
      } else if (format === "PDF") {
        const doc = new jsPDF();

        doc.setFontSize(18);
        doc.text("Reporte de Proveedores - Aurum", 14, 22);

        const headers = Object.keys(reportData[0]);
        const body = reportData.map((provider) =>
          Object.values(provider)
        );

        autoTable(doc, {
          startY: 30,
          head: [headers],
          body: body,
          theme: "grid",
          headStyles: {
            fillColor: [217, 101, 2],
          },
        });

        doc.save("Reporte_Proveedores_Aurum.pdf");
      }

      onClose();

      await showSuccessAlert({
        title: "¡Reporte Generado!",
        text: `Tu archivo ${format} se ha descargado correctamente.`,
        timer: 2000,
      });

    } catch (error) {
      console.error("Error generando reporte:", error);

      showErrorAlert({
        title: "Error",
        text: "Hubo un problema al procesar los datos.",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <form
        onSubmit={handleGenerate}
        className="relative w-full max-w-[560px] bg-background-div rounded-3xl shadow-2xl p-6"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 h-12 w-12 flex items-center justify-center text-text-secondary hover:text-text-brand transition-colors rounded-full"
        >
          <X size={24} />
        </button>

        <h2 className="text-title font-heading text-text-negative mb-6">
          Generar reporte de proveedores
        </h2>

        {/* Formato del reporte */}
        <div className="mb-6">
          <label className="block text-medium font-weight-medium-custom text-text-secondary mb-2">
            Formato del reporte
          </label>

          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full h-14 rounded-xl border border-border-strong bg-transparent px-4 text-body text-text-secondary focus:border-focus-border focus:outline-none focus:ring-1 focus:ring-focus-ring cursor-pointer"
          >
            <option value="PDF">Documento PDF (.pdf)</option>
            <option value="EXCEL">Hoja de cálculo Excel (.xlsx)</option>
          </select>
        </div>

        {/* Campos a exportar */}
        <div className="mb-6">
          <label className="block text-medium font-weight-medium-custom text-text-secondary mb-2">
            Campos a exportar
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {Object.entries({
              documentType: "Tipo de documento",
              documentNumber: "Documento",
              providerName: "Proveedor",
              email: "Correo",
              phone: "Teléfono",
              address: "Dirección",
              isActive: "Activo",
            }).map(([key, label]) => (
              <label
                key={key}
                className="flex items-center min-h-[48px] gap-4 cursor-pointer group rounded-lg hover:bg-surface-muted/30 px-2 -ml-2 transition-colors"
              >
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                    fields[key]
                      ? "border-brand bg-brand text-text-primary"
                      : "border-border-strong bg-transparent group-hover:border-brand"
                  }`}
                >
                  {fields[key] && (
                    <Check size={16} strokeWidth={3} />
                  )}
                </div>

                <input
                  type="checkbox"
                  className="hidden"
                  checked={fields[key]}
                  onChange={() => toggleField(key)}
                />

                <span className="text-body text-text-secondary">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Alcance del reporte */}
        <div className="mb-8">
          <label className="block text-medium font-weight-medium-custom text-text-secondary mb-2">
            Alcance del reporte
          </label>

          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="w-full h-14 rounded-xl border border-border-strong bg-transparent px-4 text-body text-text-secondary focus:border-focus-border focus:outline-none focus:ring-1 focus:ring-focus-ring cursor-pointer"
          >
            <option value="Todos los proveedores">
              Todos los proveedores
            </option>
            <option value="Solo activos">
              Solo proveedores activos
            </option>
            <option value="Solo inactivos">
              Solo proveedores inactivos
            </option>
          </select>
        </div>

        {/* Botones */}
        <div className="w-full flex items-center justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            type="button"
            size="md"
            onClick={onClose}
          >
            Cancelar
          </Button>

          <Button
            variant="primary"
            type="submit"
            size="md"
          >
            Generar reporte
          </Button>
        </div>
      </form>
    </div>
  );
}
