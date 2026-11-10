// src/orders/table/OrderColumns.jsx

import OrderRowActions from "@/features/order/components/OrderRowActions";
import { updateOrderStatus } from "@/features/order/services/orderServices";

export const OrderColumns = [
  {
    accessorKey: "id",
    header: "Id",
  },

  {
    accessorKey: "customerName",
    header: "Cliente",
  },

  {
    accessorKey: "date",
    header: "Fecha",
  },

  {
    accessorKey: "time",
    header: "Hora",
  },

  {
    accessorKey: "table",
    header: "Mesa",
  },

  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => {
      const total = row.original.total;

      return `$${total.toLocaleString("es-CO")}`;
    },
  },

  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const order = row.original;
      const status = order.status || "Pendiente";
      const isDisabled =
        status.toLowerCase() === "deshabilitada" ||
        status.toLowerCase() === "cancelada" ||
        status.toLowerCase() === "inactivo";

      const handleToggle = async () => {
        try {
          const nextStatus = isDisabled ? "En preparación" : "Deshabilitada";
          await updateOrderStatus(order.id, nextStatus);
          window.dispatchEvent(new CustomEvent("orders:updated"));
        } catch (err) {
          console.error("Error cambiando estado de la orden:", err);
        }
      };

      return (
        <button
          type="button"
          onClick={handleToggle}
          title="Haz clic para cambiar el estado"
          className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 ${
            isDisabled
              ? "bg-red-100 text-red-700"
              : "bg-green-100 text-green-700"
          }`}
        >
          {String(status).toUpperCase()}
        </button>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <OrderRowActions order={row.original} />
    ),
  },
];