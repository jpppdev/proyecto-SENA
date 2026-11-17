// src/features/inventory/table/InventoryColumns.jsx

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

      return (
        <button
          type="button"
          onClick={handleToggle}
          title="Haz clic para cambiar el estado"
          className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer transition-opacity hover:opacity-80 ${
            status === 'disponible' ? 'bg-green-100 text-green-700' : 
            status === 'agotado' || status === 'inactivo' ? 'bg-red-100 text-red-700' : 
            'bg-yellow-100 text-yellow-700'
          }`}
        >
          {String(status || "").toUpperCase()}
        </button>
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