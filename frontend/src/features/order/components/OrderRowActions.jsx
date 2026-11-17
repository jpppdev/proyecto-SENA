import { Pencil, Eye, Ban } from "lucide-react";
import { 
  showDisableAlert, 
  showCancelDisableAlert, 
  showConfirmDisableAlert,
  showErrorAlert
} from "@/shared/services/alertService";
import { useNavigate } from "react-router-dom";
import { disableOrder } from "../services/orderServices";

export default function OrderRowActions({ order }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/orderView/${order.id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/orders/${order.id}/edit`);
  };

  const handleDisable = async () => {
    const result = await showDisableAlert({
      title: "¿Deshabilitar orden?",
      text: `¿Deseas deshabilitar la orden #${order?.id} de ${order?.customerName || "este cliente"}?`,
      confirmButtonText: "Sí, deshabilitar",
    });

    if (result.isConfirmed) {
      try {
        await disableOrder(order.id);
        window.dispatchEvent(new CustomEvent("orders:updated"));
        await showConfirmDisableAlert({
          title: "Orden deshabilitada",
          text: `La orden #${order?.id} ha sido deshabilitada correctamente.`,
        });
      } catch (error) {
        await showErrorAlert({
          title: "Error",
          text: error.message || "No se pudo deshabilitar la orden.",
        });
      }
    } else if (result.dismiss) {
      await showCancelDisableAlert({
        title: "Acción cancelada",
        text: "La orden no fue modificada.",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <button type="button" onClick={handleView} title="Visualizar orden" className="p-1 rounded hover:bg-gray-100 text-blue-600">
        <Eye size={16} /> 
      </button>
      
      <button type="button" onClick={handleEdit} title="Editar orden" className="p-1 rounded hover:bg-gray-100 text-orange-500">
        <Pencil size={16} /> 
      </button>

      <button type="button" onClick={handleDisable} title="Deshabilitar orden" className="p-1 rounded hover:bg-gray-100 text-red-600">
        <Ban size={16} /> 
      </button>
    </div>
  );
}