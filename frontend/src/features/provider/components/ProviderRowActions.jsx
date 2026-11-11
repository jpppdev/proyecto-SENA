import { Pencil, Eye, Ban } from "lucide-react";
import { 
  showDisableAlert, 
  showCancelDisableAlert, 
  showConfirmDisableAlert,
  showErrorAlert
} from "@/shared/services/alertService";
import { useNavigate } from "react-router-dom";
import { disableProvider } from "../services/providerServices";

export default function ProviderRowActions({ provider }) {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(`/dashboard/ViewSuppliers/${provider.id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/providerEdit/${provider.id}`);
  };

  const handleDisable = async () => {
    const result = await showDisableAlert({
      title: "¿Deshabilitar proveedor?",
      text: `¿Deseas deshabilitar a ${provider?.providerName || "este proveedor"}?`,
      confirmButtonText: "Sí, deshabilitar",
    });

    if (result.isConfirmed) {
      try {
        await disableProvider(provider.id);
        window.dispatchEvent(new CustomEvent("providers:updated"));
        await showConfirmDisableAlert({
          title: "Proveedor deshabilitado",
          text: `El proveedor ${provider?.providerName ? `"${provider.providerName}" ` : ""}ha sido deshabilitado correctamente.`,
        });
      } catch (error) {
        await showErrorAlert({
          title: "Error",
          text: error.message || "No se pudo deshabilitar el proveedor.",
        });
      }
    } else if (result.dismiss) {
      await showCancelDisableAlert({
        title: "Acción cancelada",
        text: "El proveedor no fue modificado.",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <button type="button" onClick={handleView} title="Visualizar proveedor" className="p-1 rounded hover:bg-gray-100 text-blue-600 transition-colors">
        <Eye size={16} /> 
      </button>
      
      <button type="button" onClick={handleEdit} title="Editar proveedor" className="p-1 rounded hover:bg-gray-100 text-orange-500 transition-colors">
        <Pencil size={16} /> 
      </button>

      <button type="button" onClick={handleDisable} title="Deshabilitar proveedor" className="p-1 rounded hover:bg-red-50 text-red-600 transition-colors">
        <Ban size={16} /> 
      </button>
    </div>
  );
}