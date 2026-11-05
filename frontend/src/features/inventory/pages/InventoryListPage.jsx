// src/users/pagesUserListPage.js

import { useState, useEffect } from "react";
import { DataTable, Button } from "@/shared";
import { InventoryColumns } from "../table/InventoryColumns";
import { getInventory } from "../services/inventoryServices";
import { Link } from "react-router-dom";
import ReportConfigModal from "@/features/users/reports/components/ReportConfigModal";

export default function InventoryListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [inventoryData, setInventoryData] = useState([]);

  useEffect(() => {
    getInventory()
      .then((data) => setInventoryData(data))
      .catch((error) => console.error("Error cargando inventario:", error));
  }, []);

  return (
    <div className="p-6">
      
      <h1 className="text-[length:var(--text-main)] font-semibold mb-4 text-[color:var(--color-text-primary)] ">Listado de Inventario</h1>

      
      <div className="flex justify-end items-center gap-4 pb-10">

        {/* botón de reportar usuario */}
        <Button onClick={() => setIsReportModalOpen(true)}>
          Reportar producto
        </Button>


        {/* botón de reportar crear usuario */}
        <Link to="/dashboard/inventoryCreate" className="text-h1 font-heading">
          <Button>Crear producto</Button>
        </Link>

      </div>

      <DataTable data={inventoryData} columns={InventoryColumns} />

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

    </div>
  );
}
