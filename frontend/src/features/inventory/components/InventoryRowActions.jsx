import { Pencil, Eye, Trash } from "lucide-react";
import { showDeleteAlert,showCancelDeleteAlert } from "../../../shared/service/alertService";
import { useNavigate } from "react-router-dom";
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

  const handleDelete = async () => {
       const result =  await showDeleteAlert ({
              title: "Eliminar inventario",
              text:`¿Estas seguro que deseas elimina a ${inventory.productName}? `,
              
            })
            if (result.isConfirmed){
              navigate(-1)
            } else if (result.dismiss){
                await showCancelDeleteAlert({
                title: "Eliminación cancelada",
                text: "El producto no fue eliminado.",
            })
        
            }
  };

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