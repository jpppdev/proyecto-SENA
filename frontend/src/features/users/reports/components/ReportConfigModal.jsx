// Hook para manejo de estado local en componentes funcionales
import { useState, useEffect } from "react";

// Configuracion de campos disponibles por modulo para el reporte
import { reportModulesConfig } from "../config/userReportFields";

// Caso de uso que orquesta la generacion del reporte
import { generateUserReport } from "../services/generateUserReport";

// Componentes UI reutilizables (design system)
import { Button, Input, Select, Checkbox } from "@/shared";

// Componente modal para configuracion de reportes de todos los modulos
export default function ReportConfigModal({ isOpen, onClose, module = "users", data = [] }) {
  const moduleConfig = reportModulesConfig[module] || reportModulesConfig.users;
  const availableFields = moduleConfig.fields;

  // Estado del formato de salida
  const [format, setFormat] = useState("pdf");

  // Estado del alcance del reporte
  const [scope, setScope] = useState("all");

  // Estado para filtro
  const [documentNumber, setDocumentNumber] = useState("");

  // Estado de campos seleccionados
  const [selectedFields, setSelectedFields] = useState(() =>
    availableFields.filter((field) => field.default),
  );

  useEffect(() => {
    setSelectedFields(availableFields.filter((field) => field.default));
    setScope("all");
    setDocumentNumber("");
  }, [module, availableFields]);

  // Control de render: si el modal no esta abierto, no se monta en el DOM
  if (!isOpen) return null;

  // Handler para activar/desactivar campos del reporte
  const handleFieldToggle = (field) => {
    const exists = selectedFields.find((selectedField) => selectedField.key === field.key);

    if (exists) {
      setSelectedFields(selectedFields.filter((selectedField) => selectedField.key !== field.key));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  // Handler principal para generar el reporte conectado a la BD
  const handleGenerateReport = async () => {
    await generateUserReport({
      module,
      data,
      format,
      selectedFields,
      scope,
      documentNumber,
    });

    onClose();
  };

  return (
    // Overlay del modal
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      {/* Contenedor del modal */}
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg">
        {/* Titulo */}
        <h2 className="mb-6 text-xl font-semibold">{moduleConfig.modalTitle}</h2>

        {/* Seleccion de formato */}
        <div className="mb-4">
          <Select
            label="Formato del reporte"
            name="reportFormat"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            options={[
              { label: "PDF", value: "pdf" },
              { label: "Excel", value: "excel" },
            ]}
          />
        </div>

        {/* Seleccion de campos */}
        <div className="mb-4">
          <p className="mb-2 font-medium">Campos del reporte</p>

          {/* Grid de checkboxes */}
          <div className="grid grid-cols-2 gap-2">
            {availableFields.map((field) => {
              const checked = selectedFields.some((selectedField) => selectedField.key === field.key);

              return (
                <Checkbox
                  key={field.key}
                  id={field.key}
                  name={field.key}
                  label={field.label}
                  checked={checked}
                  onChange={() => handleFieldToggle(field)}
                />
              );
            })}
          </div>
        </div>

        {/* Seleccion de alcance */}
        <div className="mb-4">
          <Select
            label="Alcance del reporte"
            name="reportScope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            options={[
              { label: moduleConfig.scopeAllLabel, value: "all" },
              { label: moduleConfig.scopeFilterLabel, value: "document" },
            ]}
          />
        </div>

        {/* Campo condicional para filtro */}
        {scope === "document" && (
          <div className="mb-4">
            <Input
              label={moduleConfig.filterInputLabel}
              name="documentNumber"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              placeholder={moduleConfig.filterPlaceholder}
              htmlFor="report-document-number"
            />
          </div>
        )}

        {/* Acciones del modal */}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleGenerateReport}>Generar reporte</Button>
        </div>
      </div>
    </div>
  );
}
