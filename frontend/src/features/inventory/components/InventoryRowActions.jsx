import { Pencil, Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { 
  showDeleteAlert, 
  showCancelDeleteAlert, 
  showConfirmDeleteAlert 
} from "@/shared/services/alertService";
import { inventory } from "../data/inventory";

export default function InventoryRowActions({ product }) {
  const navigate = useNavigate();

  const handleEdit = () => {
    // Redirige a la ruta de edición de inventario
    navigate(`/dashboard/inventory/${product.id}/edit`);
  };

  const handleView = () => {
    // Redirige a la vista de detalles del producto
    navigate(`/dashboard/ViewInventory/${product.id}`);
  };

  const handleDelete =  async () => {
      const result = await showDeleteAlert({
        title: "¿Eliminar inventario?",
        text: `¿Deseas eliminar a ${inventory?.productName || "este producto del inventario"}?`,
      });
  
      if (result.isConfirmed) {
        console.log("orden eliminada:", inventory?.id);
        await showConfirmDeleteAlert({
          title: "inventario eliminado",
          text: `el producto ${inventory?.productName ? `"${inventory.productName}" ` : ""}ha sido eliminado correctamente.`,
        });
      } else if (result.dismiss) {
        await showCancelDeleteAlert({
          title: "Eliminación cancelada",
          text: "el producto no fue eliminado.",
        });
      }
    }
  return (
    <div className="flex gap-2">
      {/* Botón Visualizar (Ojo) */}
      <button onClick={handleView} className="p-1 rounded hover:bg-gray-100 text-blue-600">
        <Eye size={16} /> 
      </button>
      
      {/* Botón Editar (Lápiz) */}
      <button onClick={handleEdit} className="p-1 rounded hover:bg-gray-100 text-orange-500">
        <Pencil size={16} /> 
      </button>

      {/* Botón Eliminar (Basura) */}
      <button onClick={handleDelete} className="p-1 rounded hover:bg-gray-100 text-red-600">
        <Trash size={16} /> 
      </button>
    </div>
  );
}