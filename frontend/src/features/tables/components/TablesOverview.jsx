import { FileDown, Plus, Armchair, LayoutGrid, List } from "lucide-react";
import { Button, IconButton, SearchField, Select } from "@/shared";
import { panelClass, secondaryText, tableStatuses } from "./tableStyles";

export function TablesHeader({ onReport, canReport }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="font-title text-title font-heading sm:text-main">Gestión de Mesas</h1>
        <p className={secondaryText}>Administra el estado y la ocupación de las mesas del restaurante.</p>
      </div>
      <div className="flex flex-wrap gap-3 [&>button:disabled]:opacity-50">
        <Button variant="tertiary" disabled={!canReport} onClick={onReport}>
          <FileDown className="mr-2 size-5" aria-hidden="true" />
          Reporte de mesas
        </Button>
        <Button disabled aria-describedby="tables-source-note">
          <Plus className="mr-2 size-5" aria-hidden="true" />
          Nueva mesa
        </Button>
      </div>
    </header>
  );
}

export function TablesStats({ tables, ready }) {
  const stats = [
    { label: "Total de mesas", value: "—", icon: Armchair, style: "bg-background-clear text-text-coffee" },
    { ...tableStatuses.available, label: "Disponibles", value: "—" },
    { ...tableStatuses.occupied, label: "Ocupadas", value: ready ? tables.filter((table) => table.status === "occupied").length : "—" },
    { ...tableStatuses.reserved, label: "Reservadas", value: "—" },
  ];

  return (
    <dl className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, style }) => (
        <div key={label} className={`${panelClass} flex flex-wrap items-center gap-3 p-3 sm:p-4`}>
          <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${style}`}>
            <Icon size={24} aria-hidden="true" />
          </span>
          <div>
            <dt className={`text-medium font-medium-custom ${secondaryText}`}>{label}</dt>
            <dd className="text-title font-heading">{value === "—" ? <span aria-label="Dato no disponible">—</span> : value}</dd>
          </div>
        </div>
      ))}
    </dl>
  );
}

export function TablesFilters({ filters, setFilters, zones, view, setView }) {
  const statusOptions = Object.entries(tableStatuses).map(([value, { label }]) => ({ value, label }));
  const zoneOptions = zones.map((zone) => ({ value: zone, label: zone }));

  return (
    <div className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_2fr_auto]">
      <Select variant="create" label="Estado" htmlFor="tables-status" value={filters.status} placeholder="Todos" options={statusOptions} onChange={(event) => setFilters({ ...filters, status: event.target.value })} />
      <Select variant="create" label="Zona" htmlFor="tables-zone" value={filters.zone} placeholder="Todas" options={zoneOptions} disabled={!zoneOptions.length} onChange={(event) => setFilters({ ...filters, zone: event.target.value })} />
      <SearchField variant="outlined" fullWidth value={filters.query} onChange={(query) => setFilters({ ...filters, query })} ariaLabel="Buscar mesa por nombre o número" placeholder="Buscar mesa…" className="min-w-0 bg-background-div [&_input]:min-w-0 [&_input]:placeholder:text-text-secondary [&_svg]:text-text-coffee" />
      <div className="flex gap-1" role="group" aria-label="Vista de mesas">
        <IconButton variant={view === "grid" ? "action" : "ghost"} ariaLabel="Vista de cuadrícula" aria-pressed={view === "grid"} hitSize={40} onClick={() => setView("grid")}><LayoutGrid size={20} aria-hidden="true" /></IconButton>
        <IconButton variant={view === "list" ? "action" : "ghost"} ariaLabel="Vista de lista" aria-pressed={view === "list"} hitSize={40} onClick={() => setView("list")}><List size={20} aria-hidden="true" /></IconButton>
      </div>
    </div>
  );
}
