// src/orders/table/OrderColumns.jsx

import { StatusBadge } from "@/shared";
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
      const storedStatus = String(order.status ?? "").trim();
      const normalizedStatus = storedStatus.toLowerCase();
      const status = ["", "pending", "pendiente"].includes(normalizedStatus)
        ? "En preparación"
        : storedStatus;
      const isDisabled =
        normalizedStatus === "deshabilitada" ||
        normalizedStatus === "cancelada" ||
        normalizedStatus === "inactivo";

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
        <StatusBadge
          label={String(status).toUpperCase()}
          tone={isDisabled ? "danger" : status.toLowerCase() === "en preparación" ? "warning" : "success"}
          onClick={handleToggle}
          className="px-2.5 py-1 font-semibold"
        />
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
