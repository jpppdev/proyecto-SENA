// src/users/pagesUserListPage.js

import ListPageHeader from "@/shared/components/ListPageHeader";
import { useState, useEffect } from "react";
import { FileDown } from "lucide-react";
import { DataTable, Button } from "@/shared";
import { InventoryColumns } from "../table/InventoryColumns";
import { getInventory } from "../services/inventoryServices";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/features/permissions";
import InventoryReportConfigModal from "@/features/inventory/reports/components/InventoryReportConfigModal";

export default function InventoryListPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [inventoryData, setInventoryData] = useState([]);

  const loadInventory = () => {
    getInventory()
      .then((data) => setInventoryData(data))
      .catch((error) => console.error("Error cargando inventario:", error));
  };

  useEffect(() => {
    loadInventory();
    window.addEventListener("inventory:updated", loadInventory);
    return () => window.removeEventListener("inventory:updated", loadInventory);
  }, []);

  return (
    <div className="min-w-0 p-4 sm:p-6">
      <ListPageHeader
        title="Listado de Inventario"
        description="Consulta las existencias y administra los productos del inventario."
      >
        <Button variant="tertiary" onClick={() => setIsReportModalOpen(true)}>
          <FileDown className="mr-2 size-5 shrink-0" aria-hidden="true" />
          Reportar producto
        </Button>
        {can("inventory", "create") && (
          <Button onClick={() => navigate("/dashboard/inventoryCreate")}>
            Crear producto
          </Button>
        )}
      </ListPageHeader>

      <DataTable data={inventoryData} columns={InventoryColumns} />

      <InventoryReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        module="inventory"
        data={inventoryData}
      />

    </div>
  );
}
