import { Armchair, EllipsisVertical } from "lucide-react";
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from "@/shared";
import TableStatus from "./TableStatus";
import { panelClass, secondaryText } from "./tableStyles";

function TableCard({ table, selected, onSelect, compact }) {
  return (
    <article className={`${panelClass} relative ${selected ? "ring-2 ring-brand" : ""}`}>
      <button
        type="button"
        aria-pressed={selected}
        onClick={() => onSelect(table.number)}
        className={`flex h-full w-full min-w-0 items-center gap-2 rounded-2xl p-3 focus-visible:outline-2 focus-visible:outline-focus-ring ${compact ? "flex-wrap pr-9 text-left" : "flex-col text-center"}`}
      >
        <Armchair className="shrink-0 text-text-brand [.dark_&]:text-brand-soft" size={28} aria-hidden="true" />
        <span className={compact ? "mr-auto" : ""}>
          <span className="block font-heading">{table.name}</span>
          <span className={`block text-medium ${secondaryText}`}>{table.zone ?? "Zona sin confirmar"}</span>
        </span>
        <TableStatus status={table.status} />
      </button>
      <div className="absolute right-1 top-1">
        <Dropdown>
          <DropdownTrigger>
            <button type="button" className="grid size-8 place-items-center rounded-md hover:bg-background-clear hover:text-text-coffee focus-visible:outline-2 focus-visible:outline-focus-ring" aria-label={`Acciones de ${table.name}`}>
              <EllipsisVertical size={18} aria-hidden="true" />
            </button>
          </DropdownTrigger>
          <DropdownContent className="right-0 z-10 border-border-clear2 bg-background-div! text-text-coffee!">
            <DropdownItem onClick={() => onSelect(table.number)}>Ver información</DropdownItem>
            <DropdownItem asChild>
              <button type="button" disabled aria-describedby="tables-source-note" className="opacity-50">Editar mesa</button>
            </DropdownItem>
          </DropdownContent>
        </Dropdown>
      </div>
    </article>
  );
}

export default function TablesGrid({ tables, selectedNumber, onSelect, view }) {
  const compact = view === "list";
  return (
    <div className={`grid content-start gap-3 ${compact ? "grid-cols-1" : "grid-cols-1 min-[440px]:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4"}`}>
      {tables.map((table) => (
        <TableCard key={table.number} table={table} selected={table.number === selectedNumber} onSelect={onSelect} compact={compact} />
      ))}
    </div>
  );
}
