import { Pencil, Eye, Trash } from "lucide-react";
import { 
  showDeleteAlert, 
  showCancelDeleteAlert, 
  showConfirmDeleteAlert 
} from "@/shared/services/alertService";
import { useNavigate } from "react-router-dom";

export default function ProviderRowActions({ provider }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/ViewSuppliers/${provider.id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/providerEdit/${provider.id}`);
  };

  const handleDelete =  async () => {
      const result = await showDeleteAlert({
        title: "¿Eliminar proveedor?",
        text: `¿Deseas eliminar a ${provider?.providerName || "este proveedor"}?`,
      });
  
      if (result.isConfirmed) {
        console.log("proveedor eliminado:", provider?.id);
        await showConfirmDeleteAlert({
          title: "Usuario eliminado",
          text: `El usuario ${provider?.providerName ? `"${provider.providerName}" ` : ""}ha sido eliminado correctamente.`,
        });
      } else if (result.dismiss) {
        await showCancelDeleteAlert({
          title: "Eliminación cancelada",
          text: "El proveedor no fue eliminado.",
        });
      }
    }

  return (
    <div className="flex gap-2">
      <button onClick={handleView} className="p-1 rounded hover:bg-gray-100 text-blue-600 transition-colors">
        <Eye size={16} /> 
      </button>
      
      <button onClick={handleEdit} className="p-1 rounded hover:bg-gray-100 text-orange-500 transition-colors">
        <Pencil size={16} /> 
      </button>

      <button onClick={handleDelete} className="p-1 rounded hover:bg-red-50 text-red-600 transition-colors">
        <Trash size={16} /> 
      </button>
    </div>
  );
}