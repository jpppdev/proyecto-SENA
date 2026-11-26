// src/features/inventory/table/InventoryColumns.jsx

import { StatusBadge } from "@/shared";
import InventoryRowActions from "../components/InventoryRowActions";
import { updateInventoryStatus } from "../services/inventoryServices";

export const InventoryColumns = [
  {
    accessorKey: "barcode",
    header: "Código",
  },
  {
    accessorKey: "productName",
    header: "Producto",
  },
  {
    accessorKey: "brand",
    header: "Marca",
  },
  {
    accessorKey: "quantity",
    header: "Stock",
  },
  {
    accessorKey: "unitValue",
    header: "Valor Unitario",
    // Esta función formatea el número para que se vea como moneda (ej. $ 25.000)
    cell: ({ row }) => {
      const value = row.getValue("unitValue");
      return `$ ${value.toLocaleString("es-CO")}`;
    }
  },
  {
    accessorKey: "status",
    header: "Estado",
    cell: ({ row }) => {
      const product = row.original;
      const status = row.getValue("status");
      const isActive = Boolean(product.isActive ?? status !== "inactivo");

      const handleToggle = async () => {
        try {
          await updateInventoryStatus(product.id, !isActive);
          window.dispatchEvent(new CustomEvent("inventory:updated"));
        } catch (err) {
          console.error("Error cambiando estado del producto:", err);
        }
      };

      const tone =
        status === "disponible"
          ? "success"
          : status === "agotado" || status === "inactivo"
            ? "danger"
            : "warning";

      return (
        <StatusBadge
          label={String(status || "").toUpperCase()}
          tone={tone}
          onClick={handleToggle}
        />
      );
    }
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      
      const product = row.original;
      
      
      return <InventoryRowActions product={product} />;
    },
  },
];