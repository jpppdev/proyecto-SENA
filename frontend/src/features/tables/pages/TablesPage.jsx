import { useEffect, useState } from "react";
import { Button } from "@/shared";
import { getMenu } from "@/features/menu/services/menuServices";
import { generateExcelReport } from "@/features/order/reports/services/generateExcelReport";
import { showErrorAlert } from "@/shared/services/alertService";
import TableDetails from "../components/TableDetails";
import TablesGrid from "../components/TablesGrid";
import { TablesFilters, TablesHeader, TablesStats } from "../components/TablesOverview";
import { panelClass, secondaryText, tableStatuses } from "../components/tableStyles";
import { getOrderPermissions, getTablesFromOrders } from "../services/tableServices";

const initialFilters = { status: "", zone: "", query: "" };

export default function TablesPage() {
  const [data, setData] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [orderPermissions, setOrderPermissions] = useState([]);
  const [menuImages, setMenuImages] = useState(() => new Map());
  const [filters, setFilters] = useState(initialFilters);
  const [view, setView] = useState("grid");
  const [selectedNumber, setSelectedNumber] = useState(null);

  useEffect(() => {
    let active = true;
    let latestRequest = 0;

    const loadTables = async () => {
      const request = ++latestRequest;
      try {
        const tables = await getTablesFromOrders();
        if (active && request === latestRequest) setData({ tables });
      } catch (error) {
        if (active && request === latestRequest) setData({ error: error.message });
      }
    };

    loadTables();
    window.addEventListener("orders:updated", loadTables);
    window.addEventListener("focus", loadTables);
    return () => {
      active = false;
      window.removeEventListener("orders:updated", loadTables);
      window.removeEventListener("focus", loadTables);
    };
  }, [attempt]);

  useEffect(() => {
    let active = true;
    getOrderPermissions()
      .then((permissions) => { if (active) setOrderPermissions(permissions); })
      .catch(() => { if (active) setOrderPermissions([]); });
    getMenu()
      .then((items) => {
        if (!active) return;
        const images = items
          .filter(({ menuImage }) => menuImage && !menuImage.startsWith("https://via.placeholder.com/"))
          .map(({ id, menuImage }) => [String(id), menuImage]);
        setMenuImages(new Map(images));
      })
      .catch(() => { if (active) setMenuImages(new Map()); });
    return () => { active = false; };
  }, []);

  const tables = data?.tables ?? [];
  const zones = [...new Set(tables.map(({ zone }) => zone).filter(Boolean))].sort();
  const query = filters.query.trim().toLocaleLowerCase("es");
  const filteredTables = tables.filter((table) =>
    (!filters.status || table.status === filters.status)
    && (!filters.zone || table.zone === filters.zone)
    && (!query || table.name.toLocaleLowerCase("es").includes(query))
  );
  const selectedTable = filteredTables.find(({ number }) => number === selectedNumber)
    ?? filteredTables.find(({ status }) => status === "occupied")
    ?? filteredTables[0];

  function handleReport() {
    try {
      generateExcelReport({
        headers: ["Número", "Mesa", "Zona", "Capacidad", "Estado"],
        rows: filteredTables.map(({ number, name, zone, capacity, status }) =>
          [number, name, zone ?? "Sin confirmar", capacity ?? "", tableStatuses[status].label]
        ),
        fileName: "Reporte_Mesas_Aurum.xlsx",
        sheetName: "Mesas en órdenes",
      });
    } catch {
      showErrorAlert({ title: "Error", text: "No se pudo generar el reporte de mesas." });
    }
  }

  return (
    <div className="min-w-0 space-y-4 p-4 text-text-primary sm:p-6 [.dark_&]:bg-background-inverse [.dark_&]:text-text-inverse">
      <TablesHeader onReport={handleReport} canReport={filteredTables.length > 0} />
      <TablesStats tables={tables} ready={Boolean(data?.tables)} />
      <TablesFilters filters={filters} setFilters={setFilters} zones={zones} view={view} setView={setView} />
      <p id="tables-source-note" className={`text-medium ${secondaryText}`}>
        Esta vista y su reporte muestran las mesas que aparecen en órdenes. El catálogo de mesas, sus zonas, las reservas y las acciones de crear, editar y liberar requieren una API de mesas.
      </p>

      {!data ? (
        <p role="status" className={`${panelClass} p-4`}>Cargando mesas…</p>
      ) : data.error ? (
        <div className={`${panelClass} space-y-3 p-4`}>
          <p role="alert">{data.error}</p>
          <Button onClick={() => { setData(null); setAttempt(attempt + 1); }}>Reintentar</Button>
        </div>
      ) : !filteredTables.length ? (
        <p role="status" className={`${panelClass} p-4`}>
          {tables.length ? "No hay mesas que coincidan con los filtros." : "Todavía no hay mesas asociadas a órdenes."}
        </p>
      ) : (
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <TablesGrid tables={filteredTables} selectedNumber={selectedTable.number} onSelect={setSelectedNumber} view={view} />
          <TableDetails key={selectedTable.number} table={selectedTable} orderPermissions={orderPermissions} menuImages={menuImages} />
        </div>
      )}
    </div>
  );
}
