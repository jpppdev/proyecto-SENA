import { Pencil, Eye, Trash } from "lucide-react";
import { showDeleteAlert, showCancelDeleteAlert,showConfirmDeleteAlert } from "../../../shared/service/alertService";
import { useNavigate } from "react-router-dom";

export default function OrderRowActions({ order }) {
  const navigate = useNavigate();

  
  const handleView = () => {
    navigate(`/dashboard/orderView/${order.id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/orders/${order.id}/edit`);
  };

  const handleDelete = async () => {
        const result =  await showDeleteAlert ({
          title: "Eliminar orden",
          text:`¿Estas seguro que deseas eliminar la orden ${order?.id}? `,
          
        })
        if (result.isConfirmed){
          await showConfirmDeleteAlert({
                title: "¡Usuario Eliminado!",
                text: `El usuario ${order?.id} ha sido eliminado con éxito.`
              });
          navigate(-1)
        } else if (result.dismiss){
            await showCancelDeleteAlert({
            title: "Eliminación cancelada",
            text: "El usuario no fue eliminado.",
        })
    
        }
  }
  return (
    <div className="flex gap-2">
      <button onClick={handleView} className="p-1 rounded hover:bg-gray-100 text-blue-600">
        <Eye size={16} /> 
      </button>
      
      <button onClick={handleEdit} className="p-1 rounded hover:bg-gray-100 text-orange-500">
        <Pencil size={16} /> 
      </button>

      <button onClick={handleDelete} className="p-1 rounded hover:bg-gray-100 text-red-600">
        <Trash size={16} /> 
      </button>
    </div>
  );
}