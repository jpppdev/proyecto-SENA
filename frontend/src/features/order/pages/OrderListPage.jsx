import { useState, useEffect } from "react";
import { DataTable, Button } from "@/shared";
import { OrderColumns } from "../table/OrderColumns";
import { getOrders } from "../services/orderServices";
import { Link } from "react-router-dom";
// CORRECCIÓN 2: Importamos el modal desde el módulo de usuarios donde ya existe
import { ReportConfigModal } from "@/features/users";

export default function OrderListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [ordersData, setOrdersData] = useState([]);

  useEffect(() => {
    getOrders()
      .then((data) => setOrdersData(data))
      .catch((error) => console.error("Error cargando ordenes:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-[length:var(--text-main)] font-semibold mb-4 text-[color:var(--color-text-primary)]">
        Listado de Órdenes
      </h1>

      <div className="flex justify-end items-center gap-4 pb-10">
        <Button onClick={() => setIsReportModalOpen(true)}>
          Reportar orden
        </Button>

        <Link to="/dashboard/orderCreate" className="text-h1 font-heading">
          <Button>Crear orden</Button>
        </Link>
      </div>

      <DataTable data={ordersData} columns={OrderColumns} />

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />
    </div>
  );
}