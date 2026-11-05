import { Pencil, Eye, Trash } from "lucide-react";
import { 
  showDeleteAlert, 
  showCancelDeleteAlert, 
  showConfirmDeleteAlert 
} from "@/shared/services/alertService";
import { useNavigate } from "react-router-dom";

export default function MenuRowActions({ product }) {
  const navigate = useNavigate();

  const handleView = () => {
    // Apunta a la ruta ViewMenu que ya existe en tu router.jsx
    navigate(`/dashboard/ViewMenu/${product.id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/menuEdit/${product.id}`);
  };

  const handleDelete =  async () => {
      const result = await showDeleteAlert({
        title: "¿Eliminar orden?",
        text: `¿Deseas eliminar a ${menu?.menuName || "esta order"}?`,
      });
  
      if (result.isConfirmed) {
        console.log("orden eliminada:", menu?.id);
        await showConfirmDeleteAlert({
          title: "Orden eliminada",
          text: `La orden ${menu?.meuName ? `"${menu.menuName}" ` : ""}ha sido eliminado correctamente.`,
        });
      } else if (result.dismiss) {
        await showCancelDeleteAlert({
          title: "Eliminación cancelada",
          text: "La orden no fue eliminado.",
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