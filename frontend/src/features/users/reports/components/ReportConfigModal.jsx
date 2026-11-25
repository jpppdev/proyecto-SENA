import { useState } from "react";
import { Button } from "@/shared";
import { X, Check } from "lucide-react";
import { showSuccessAlert, showErrorAlert } from "@/shared/services/alertService";

import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// 1. Cambiamos usersData por data aquí
export default function ReportConfigModal({ isOpen, onClose, data = [] }) {
  const [format, setFormat] = useState("PDF");
  const [scope, setScope] = useState("Todos los usuarios");
  
  const [fields, setFields] = useState({
    nombre: true,
    email: true,
    tipoDocumento: true,
    documento: true,
    telefono: false,
    activo: false,
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

    // 2. Evaluamos la nueva variable data
    if (!data || data.length === 0) {
      showErrorAlert({ title: "Sin datos", text: "No hay usuarios registrados para exportar." });
      return;
    }

    try {
      // 3. Mapeamos sobre data usando los campos exactos de tu base de datos
      const filteredData = data.map((user) => {
        const row = {};
        
        // Usamos los accessorKey exactos de tu UserColumns
        if (fields.nombre) row["Nombre"] = user.userName || "";
        if (fields.email) row["Email"] = user.userEmail || "";
        // Tipo y Número de documento no están en las columnas, 
        // pero incluimos las versiones más probables por si el backend las envía
        if (fields.tipoDocumento) row["Tipo Doc"] = user.documentType || user.user_document_types || user.tipo_documento || "";
        if (fields.documento) row["Documento"] = user.documentNumber || user.document_number || user.documento || "";
        if (fields.telefono) row["Teléfono"] = user.userPhone || "";
        // El estado en tus columnas viene como is_active
        if (fields.activo) {
          row["Activo"] = user.is_active || user.isActive ? "Sí" : "No";
        }
        
        return row;
      });

      if (Object.keys(filteredData[0]).length === 0) {
        showErrorAlert({ title: "Error", text: "Debes seleccionar al menos un campo para exportar." });
        return;
      }

      if (format === "EXCEL") {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios Aurum");
        XLSX.writeFile(workbook, "Reporte_Usuarios_Aurum.xlsx");
        
      } else if (format === "PDF") {
        const doc = new jsPDF();
        
        doc.setFontSize(18);
        doc.text("Reporte de Usuarios - Aurum", 14, 22);
        
        const headers = Object.keys(filteredData[0]);
        const body = filteredData.map(obj => Object.values(obj));

        autoTable(doc, {
          startY: 30,
          head: [headers],
          body: body,
          theme: 'grid',
          headStyles: { fillColor: [217, 101, 2] }, 
        });

        doc.save("Reporte_Usuarios_Aurum.pdf");
      }

      onClose();

      await showSuccessAlert({
        title: "¡Reporte Generado!",
        text: `Tu archivo ${format} se ha descargado correctamente.`,
        timer: 2000,
      });

    } catch (error) {
      console.error("Error generando reporte:", error);
      showErrorAlert({ title: "Error", text: "Hubo un problema al procesar los datos." });
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
          Generar reporte de usuarios
        </h2>

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

        <div className="mb-6">
          <label className="block text-medium font-weight-medium-custom text-text-secondary mb-2">
            Campos a exportar
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            {Object.entries({
              nombre: "Nombre",
              email: "Email",
              tipoDocumento: "Tipo de documento",
              documento: "Documento",
              telefono: "Teléfono",
              activo: "Activo",
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
                  {fields[key] && <Check size={16} strokeWidth={3} />}
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

        <div className="mb-8">
          <label className="block text-medium font-weight-medium-custom text-text-secondary mb-2">
            Alcance del reporte
          </label>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="w-full h-14 rounded-xl border border-border-strong bg-transparent px-4 text-body text-text-secondary focus:border-focus-border focus:outline-none focus:ring-1 focus:ring-focus-ring cursor-pointer"
          >
            <option value="Todos los usuarios">Todos los usuarios</option>
            <option value="Solo activos">Solo usuarios activos</option>
            <option value="Solo inactivos">Solo usuarios inactivos</option>
            <option value="Administradores">Solo Administradores</option>
          </select>
        </div>

        <div className="w-full flex items-center justify-end gap-2 pt-2">
          <Button
            variant="secondary"
            type="submit"
            size="md"
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