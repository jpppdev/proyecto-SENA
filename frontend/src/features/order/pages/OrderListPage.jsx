import ListPageHeader from "@/shared/components/ListPageHeader";
import { useState, useEffect } from "react";
import { FileDown } from "lucide-react";
import { DataTable, Button } from "@/shared";
import { OrderColumns } from "../table/OrderColumns";
import { getOrders } from "../services/orderServices";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "@/features/permissions";
// CORRECCIÓN 2: Importamos el modal desde el módulo de usuarios donde ya existe
import  OrderReportConfigModal  from "@/features/order/reports/components/OrderReportConfigModal";

export default function OrderListPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [ordersData, setOrdersData] = useState([]);

  const loadOrders = () => {
    getOrders()
      .then((data) => setOrdersData(data))
      .catch((error) => console.error("Error cargando ordenes:", error));
  };

  useEffect(() => {
    loadOrders();
    window.addEventListener("orders:updated", loadOrders);
    return () => window.removeEventListener("orders:updated", loadOrders);
  }, []);

  return (
    <div className="min-w-0 p-4 sm:p-6">
      <ListPageHeader
        title="Listado de Órdenes"
        description="Consulta y gestiona las órdenes registradas."
      >
        <Button variant="tertiary" onClick={() => setIsReportModalOpen(true)}>
          <FileDown className="mr-2 size-5 shrink-0" aria-hidden="true" />
          Reportar orden
        </Button>
        {can("orders", "create") && (
          <Button onClick={() => navigate("/dashboard/orderCreate")}>
            Crear orden
          </Button>
        )}
      </ListPageHeader>

      <DataTable data={ordersData} columns={OrderColumns} />

      <OrderReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        module="orders"
        data={ordersData}
      />
    </div>
  );
}
