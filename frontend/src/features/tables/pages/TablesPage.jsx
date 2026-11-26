import { useEffect, useState } from "react";
import { Button } from "@/shared";
import { getMenu } from "@/features/menu/services/menuServices";
import { generateExcelReport } from "@/features/order/reports/services/generateExcelReport";
import {
  showConfirmDisableAlert,
  showDisableAlert,
  showErrorAlert,
  showSuccessAlert,
} from "@/shared/services/alertService";
import TableDetails from "../components/TableDetails";
import TableFormModal from "../components/TableFormModal";
import TablesGrid from "../components/TablesGrid";
import { TablesFilters, TablesHeader, TablesStats } from "../components/TablesOverview";
import { panelClass, tableStatuses } from "../components/tableStyles";
import {
  createTable,
  disableTable,
  getTables,
  getTableUserContext,
  releaseTable,
  updateTable,
} from "../services/tableServices";

const initialFilters = { status: "", zone: "", query: "" };

export default function TablesPage() {
  const [data, setData] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const [userContext, setUserContext] = useState({ orderPermissions: [], isAdmin: false });
  const [menuImages, setMenuImages] = useState(() => new Map());
  const [filters, setFilters] = useState(initialFilters);
  const [view, setView] = useState("grid");
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  useEffect(() => {
    let active = true;
    let latestRequest = 0;

    const loadTables = async () => {
      const request = ++latestRequest;
      try {
        const tables = await getTables();
        if (active && request === latestRequest) setData({ tables });
      } catch (error) {
        if (active && request === latestRequest) setData({ error: error.message });
      }
    };

    loadTables();
    window.addEventListener("tables:updated", loadTables);
    window.addEventListener("orders:updated", loadTables);
    window.addEventListener("focus", loadTables);
    return () => {
      active = false;
      window.removeEventListener("tables:updated", loadTables);
      window.removeEventListener("orders:updated", loadTables);
      window.removeEventListener("focus", loadTables);
    };
  }, [attempt]);

  useEffect(() => {
    let active = true;
    getTableUserContext()
      .then((ctx) => { if (active) setUserContext(ctx); })
      .catch(() => { if (active) setUserContext({ orderPermissions: [], isAdmin: false }); });
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
    && (!query
      || table.name.toLocaleLowerCase("es").includes(query)
      || String(table.number).includes(query))
  );
  const selectedTable = filteredTables.find(({ number }) => number === selectedNumber)
    ?? filteredTables.find(({ status }) => status === "occupied")
    ?? filteredTables[0];

  function openCreateModal() {
    setEditingTable(null);
    setIsModalOpen(true);
  }

  function openEditModal(table) {
    setEditingTable(table);
    setIsModalOpen(true);
  }

  async function handleSaveTable(payload) {
    try {
      if (editingTable) {
        await updateTable(editingTable.id, payload);
        await showSuccessAlert({
          title: "Mesa actualizada",
          text: `${payload.name} se actualizó correctamente.`,
          timer: 1500,
        });
      } else {
        await createTable(payload);
        setSelectedNumber(payload.number);
        await showSuccessAlert({
          title: "Mesa creada",
          text: `${payload.name} fue creada correctamente.`,
          timer: 1500,
        });
      }
      window.dispatchEvent(new CustomEvent("tables:updated"));
    } catch (error) {
      await showErrorAlert({
        title: "Error",
        text: error.message || "No se pudo guardar la mesa.",
        timer: 2500,
      });
      throw error;
    }
  }

  async function handleReleaseTable(table) {
    const confirm = await showDisableAlert({
      title: `¿Liberar ${table.name}?`,
      text:
        table.activeOrders?.length > 0
          ? "La mesa pasará a estado Disponible y sus pedidos activos se marcarán como completados."
          : "La mesa pasará a estado Disponible.",
      confirmButtonText: "Sí, liberar",
    });
    if (!confirm.isConfirmed) return;

    try {
      await releaseTable(table.id);
      window.dispatchEvent(new CustomEvent("tables:updated"));
      window.dispatchEvent(new CustomEvent("orders:updated"));
      await showSuccessAlert({
        title: "Mesa liberada",
        text: `${table.name} ahora está disponible.`,
        timer: 1500,
      });
    } catch (error) {
      await showErrorAlert({
        title: "Error",
        text: error.message || "No se pudo liberar la mesa.",
        timer: 2500,
      });
    }
  }

  async function handleDisableTable(table) {
    const confirm = await showDisableAlert({
      title: `¿Deshabilitar ${table.name}?`,
      text: "La mesa dejará de mostrarse en el listado activo.",
      confirmButtonText: "Sí, deshabilitar",
    });
    if (!confirm.isConfirmed) return;

    try {
      await disableTable(table.id);
      window.dispatchEvent(new CustomEvent("tables:updated"));
      await showConfirmDisableAlert({
        title: "Mesa deshabilitada",
        text: `${table.name} fue deshabilitada correctamente.`,
      });
    } catch (error) {
      await showErrorAlert({
        title: "Error",
        text: error.message || "No se pudo deshabilitar la mesa.",
        timer: 2500,
      });
    }
  }

  function handleReport() {
    try {
      generateExcelReport({
        headers: ["Número", "Mesa", "Zona", "Capacidad", "Estado"],
        rows: filteredTables.map(({ number, name, zone, capacity, status }) =>
          [number, name, zone ?? "Sin zona", capacity ?? "", tableStatuses[status]?.label ?? status]
        ),
        fileName: "Reporte_Mesas_Aurum.xlsx",
        sheetName: "Mesas",
      });
    } catch {
      showErrorAlert({ title: "Error", text: "No se pudo generar el reporte de mesas." });
    }
  }

  return (
    <div className="min-w-0 space-y-4 p-4 text-text-primary sm:p-6 [.dark_&]:bg-background-inverse [.dark_&]:text-text-inverse">
      <TablesHeader
        onReport={handleReport}
        canReport={filteredTables.length > 0}
        onCreate={openCreateModal}
        canCreate={userContext.isAdmin}
      />
      <TablesStats tables={tables} ready={Boolean(data?.tables)} />
      <TablesFilters filters={filters} setFilters={setFilters} zones={zones} view={view} setView={setView} />

      {!data ? (
        <p role="status" className={`${panelClass} p-4`}>Cargando mesas…</p>
      ) : data.error ? (
        <div className={`${panelClass} space-y-3 p-4`}>
          <p role="alert">{data.error}</p>
          <Button onClick={() => { setData(null); setAttempt(attempt + 1); }}>Reintentar</Button>
        </div>
      ) : !filteredTables.length ? (
        <p role="status" className={`${panelClass} p-4`}>
          {tables.length ? "No hay mesas que coincidan con los filtros." : "Todavía no hay mesas registradas."}
        </p>
      ) : (
        <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <TablesGrid
            tables={filteredTables}
            selectedNumber={selectedTable.number}
            onSelect={setSelectedNumber}
            onEdit={openEditModal}
            onDisable={handleDisableTable}
            canManage={userContext.isAdmin}
            view={view}
          />
          <TableDetails
            key={selectedTable.id ?? selectedTable.number}
            table={selectedTable}
            orderPermissions={userContext.orderPermissions}
            menuImages={menuImages}
            canManage={userContext.isAdmin}
            onEdit={openEditModal}
            onRelease={handleReleaseTable}
          />
        </div>
      )}

      <TableFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveTable}
        initialTable={editingTable}
      />
    </div>
  );
}
