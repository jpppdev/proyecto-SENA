// Componente Select reutilizable
import { useId } from "react";

export default function Select({
  label,
  name,
  value,
  error,
  onChange,
  options = [],
  htmlFor,
  variant = "primary",
  placeholder = "Seleccione una opción",
  disabled = false,
}) {
  const fieldId = useId();
  const isCreate = variant === "create";
  const id = htmlFor ?? fieldId;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className={isCreate ? "form-field-create" : "w-[320px]"}>
      {label && (
        <label htmlFor={id} className={isCreate ? "form-field-create-label" : "block text-caption mb-0 text-text-muted"}>
          {label}
        </label>
      )}

      <select
        id={id}
        value={value}
        onChange={onChange}
        name={name}
        disabled={disabled}
        className={isCreate ? "form-field-create-control" : "w-full h-12 rounded-md border border-border px-4"}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
      >
        <option value="">{placeholder}</option>

        {options.map((option) => {
          const optionValue = option.value ?? option.id;

          return (
            <option key={optionValue} value={optionValue}>
              {option.label}
            </option>
          );
        })}
      </select>

      {error && <p id={errorId} className={isCreate ? "mt-1 text-small text-error" : "text-caption text-red-600 mt-1"}>{error}</p>}
    </div>
  );
}
