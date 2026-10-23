// src/features/providers/table/ProviderColumns.jsx

import ProviderRowActions from "../components/ProviderRowActions";

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
      const isActive = row.getValue("isActive");
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
          isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isActive ? 'ACTIVO' : 'INACTIVO'}
        </span>
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