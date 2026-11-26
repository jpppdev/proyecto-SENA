import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button, Input, Select } from "@/shared";
import { panelClass, secondaryText } from "./tableStyles";

const DEFAULT_FORM = {
  number: "",
  name: "",
  zone: "",
  capacity: "4",
  status: "available",
};

const ZONE_SUGGESTIONS = ["Salón principal", "Terraza", "Barra", "VIP", "Segundo piso"];

export default function TableFormModal({ isOpen, onClose, onSubmit, initialTable = null }) {
  const isEditMode = Boolean(initialTable);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (initialTable) {
      setForm({
        number: String(initialTable.number ?? ""),
        name: initialTable.name ?? "",
        zone: initialTable.zone ?? "",
        capacity: String(initialTable.capacity ?? "4"),
        status: initialTable.status && initialTable.status !== "unknown" ? initialTable.status : "available",
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [isOpen, initialTable]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors = {};
    const num = Number(form.number);
    const cap = Number(form.capacity);

    if (!form.number || !Number.isInteger(num) || num <= 0) {
      nextErrors.number = "Ingresa un número entero mayor a 0";
    }
    if (!form.capacity || !Number.isInteger(cap) || cap <= 0) {
      nextErrors.capacity = "La capacidad debe ser un entero mayor a 0";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        number: Number(form.number),
        name: form.name.trim() || `Mesa ${Number(form.number)}`,
        zone: form.zone.trim(),
        capacity: Number(form.capacity),
        status: form.status,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="table-modal-title"
    >
      <div className={`${panelClass} w-full max-w-md p-6 text-text-primary [.dark_&]:text-text-inverse`}>
        <div className="mb-4 flex items-center justify-between gap-2 border-b border-border-clear2 pb-3">
          <div>
            <h2 id="table-modal-title" className="text-title font-heading">
              {isEditMode ? `Editar ${initialTable.name}` : "Nueva mesa"}
            </h2>
            <p className={`text-small ${secondaryText}`}>
              {isEditMode
                ? "Actualiza los datos de la mesa seleccionada."
                : "Crea una mesa nueva para el restaurante."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="rounded-lg p-1.5 hover:bg-background-clear"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-4 [&>div]:!w-full">
          <Input
            variant="tertiary"
            size="md"
            htmlFor="table-number"
            name="number"
            type="number"
            min="1"
            label="Número de mesa *"
            placeholder="Ej: 4"
            value={form.number}
            onChange={handleChange}
            error={errors.number}
          />

          <Input
            variant="tertiary"
            size="md"
            htmlFor="table-name"
            name="name"
            type="text"
            label="Nombre o identificador"
            placeholder="Ej: Mesa 4 (opcional)"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            variant="tertiary"
            size="md"
            htmlFor="table-zone"
            name="zone"
            type="text"
            list="table-zones-list"
            label="Zona"
            placeholder="Ej: Salón principal, Terraza, VIP"
            value={form.zone}
            onChange={handleChange}
          />
          <datalist id="table-zones-list">
            {ZONE_SUGGESTIONS.map((zoneName) => (
              <option key={zoneName} value={zoneName} />
            ))}
          </datalist>

          <Input
            variant="tertiary"
            size="md"
            htmlFor="table-capacity"
            name="capacity"
            type="number"
            min="1"
            label="Capacidad (personas) *"
            placeholder="Ej: 4"
            value={form.capacity}
            onChange={handleChange}
            error={errors.capacity}
          />

          <Select
            label="Estado"
            htmlFor="table-status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={[
              { value: "available", label: "Disponible" },
              { value: "reserved", label: "Reservada" },
              { value: "occupied", label: "Ocupada" },
            ]}
          />

          <div className="flex justify-end gap-3 border-t border-border-clear2 pt-4">
            <Button variant="tertiary" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Guardando..."
                : isEditMode
                ? "Guardar cambios"
                : "Crear mesa"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
