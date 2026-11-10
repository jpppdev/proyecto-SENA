import { Pencil, Eye, Ban } from "lucide-react";
import { 
  showDisableAlert, 
  showCancelDisableAlert, 
  showConfirmDisableAlert,
  showErrorAlert
} from "@/shared/services/alertService";
import { useNavigate } from "react-router-dom";
import { disableMenu } from "../services/menuServices";

export default function MenuRowActions({ product }) {
  const navigate = useNavigate();

  const handleView = () => {
    // Apunta a la ruta ViewMenu que ya existe en tu router.jsx
    navigate(`/dashboard/ViewMenu/${product.id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/menuEdit/${product.id}`);
  };

  const handleDisable = async () => {
    const result = await showDisableAlert({
      title: "¿Deshabilitar platillo?",
      text: `¿Deseas deshabilitar ${product?.menuName || "este platillo del menú"}?`,
      confirmButtonText: "Sí, deshabilitar",
    });

    if (result.isConfirmed) {
      try {
        await disableMenu(product.id);
        window.dispatchEvent(new CustomEvent("menu:updated"));
        await showConfirmDisableAlert({
          title: "Platillo deshabilitado",
          text: `El platillo ${product?.menuName ? `"${product.menuName}" ` : ""}ha sido deshabilitado correctamente.`,
        });
      } catch (error) {
        await showErrorAlert({
          title: "Error",
          text: error.message || "No se pudo deshabilitar el platillo.",
        });
      }
    } else if (result.dismiss) {
      await showCancelDisableAlert({
        title: "Acción cancelada",
        text: "El platillo no fue modificado.",
      });
    }
  };
  return (
    <div className="flex gap-2">
      <button type="button" onClick={handleView} title="Visualizar platillo" className="p-1 rounded hover:bg-gray-100 text-blue-600 transition-colors">
        <Eye size={16} /> 
      </button>
      
      <button type="button" onClick={handleEdit} title="Editar platillo" className="p-1 rounded hover:bg-gray-100 text-orange-500 transition-colors">
        <Pencil size={16} /> 
      </button>

      <button type="button" onClick={handleDisable} title="Deshabilitar platillo" className="p-1 rounded hover:bg-red-50 text-red-600 transition-colors">
        <Ban size={16} /> 
      </button>
    </div>
  );
}