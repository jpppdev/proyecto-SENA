import { Armchair, Ban, Check, Clock, UsersRound } from "lucide-react";
import { Button } from "@/shared";
import OrderSection from "./OrderSection";

const statuses = {
  available: { label: "Disponible", Icon: Armchair, style: "bg-background-clear text-text-coffee border-border-clear" },
  occupied: { label: "Ocupada", Icon: UsersRound, style: "bg-brand-soft/50 text-text-coffee border-brand-soft" },
  reserved: { label: "Reservada", Icon: Clock, style: "bg-border-clear2 text-text-brand border-border-clear" },
  out_of_service: { label: "Fuera de servicio", Icon: Ban, style: "bg-surface-muted text-text-secondary border-surface-muted" },
};

export default function OrderTablePicker({ tables, assignedTable, value, needsTable, disabled, error, loadError, onChange, onRetry }) {
  return (
    <OrderSection id="order-tables-heading" icon={<Armchair size={22} />} title="Seleccionar Mesa">
      <ul className="mb-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-small">
        {Object.values(statuses).map(({ label, Icon, style }) => (
          <li key={label} className="flex items-center gap-1.5">
            <span className={`grid size-6 place-items-center rounded-full border ${style}`}>
              <Icon size={14} aria-hidden="true" />
            </span>
            {label}
          </li>
        ))}
      </ul>
      {!needsTable ? (
        <p className="text-medium">Selecciona el servicio en mesa para asignar una mesa.</p>
      ) : loadError ? (
        <div className="flex flex-wrap items-center gap-3">
          <p role="alert" className="text-medium text-error [.dark_&]:text-brand-soft">{loadError}</p>
          <Button onClick={onRetry} size="sm" variant="tertiary" className="rounded-lg border border-brand px-3 py-1 text-medium">Reintentar</Button>
        </div>
      ) : !tables?.length ? (
        <p role="status" className="text-medium">{tables ? "No hay mesas registradas." : "Cargando mesas…"}</p>
      ) : (
        <div role="group" aria-labelledby="order-tables-heading" aria-describedby={error ? "order-table-error" : undefined} className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {tables.map(({ tableNumber, status }) => {
            const isAssigned = String(tableNumber) === assignedTable;
            const { label, Icon, style } = statuses[status] ?? statuses.out_of_service;
            const selected = value === String(tableNumber);
            return (
              <button
                key={tableNumber}
                type="button"
                aria-label={`Mesa ${tableNumber}, ${isAssigned ? "asignada a esta orden" : label}`}
                aria-pressed={selected}
                disabled={disabled || (!isAssigned && status !== "available")}
                onClick={() => onChange(String(tableNumber))}
                className={`relative flex min-h-20 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-3 text-medium font-medium-custom enabled:cursor-pointer enabled:hover:border-brand focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${selected ? "border-brand-hover bg-linear-to-b from-brand to-brand-hover text-text-inverse" : style}`}
              >
                <Icon size={23} aria-hidden="true" />
                Mesa {tableNumber}
                {isAssigned && <span className="text-small">Mesa actual</span>}
                {selected && <Check size={17} aria-hidden="true" className="absolute right-1 top-1 rounded-full bg-background-positive p-0.5 text-text-brand" />}
              </button>
            );
          })}
        </div>
      )}
      {needsTable && tables?.length > 0 && !assignedTable && !tables.some(({ status }) => status === "available") && (
        <p role="status" className="mt-3 text-medium">No hay mesas disponibles.</p>
      )}
      {needsTable && error && <p id="order-table-error" role="alert" className="mt-2 text-small text-error [.dark_&]:text-brand-soft">{error}</p>}
    </OrderSection>
  );
}
