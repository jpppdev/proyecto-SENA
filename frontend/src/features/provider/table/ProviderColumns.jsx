// src/features/providers/table/ProviderColumns.jsx

import { StatusBadge } from "@/shared";
import ProviderRowActions from "../components/ProviderRowActions";
import { updateProviderStatus } from "../services/providerServices";

export const ProviderColumns = [
  {
    accessorKey: "documentNumber",
    header: "Documento",
    cell: ({ row }) => {
      // Unimos el tipo (NIT/CC) con el número para una vista más limpia
      const type = row.original.documentType;
      const number = row.getValue("documentNumber");
      return `${type} ${number}`;
    }
  },
  {
    accessorKey: "providerName",
    header: "Proveedor",
  },
  {
    accessorKey: "products",
    header: "Suministro Principal",
  },
  {
    accessorKey: "phone",
    header: "Teléfono",
  },
  {
    accessorKey: "isActive",
    header: "Estado",
    cell: ({ row }) => {
      const provider = row.original;
      const isActive = Boolean(provider.isActive);
      const handleToggle = async () => {
        try {
          await updateProviderStatus(provider.id, !isActive);
          window.dispatchEvent(new CustomEvent("providers:updated"));
        } catch (err) {
          console.error("Error cambiando estado del proveedor:", err);
        }
      };
      return (
        <StatusBadge
          label={isActive ? "ACTIVO" : "INACTIVO"}
          tone={isActive ? "success" : "danger"}
          onClick={handleToggle}
        />
      );
    }
  },
  {
    id: "acciones",
    header: "Acciones",
    cell: ({ row }) => {
      const provider = row.original;
      return <ProviderRowActions provider={provider} />;
    },
  },
];