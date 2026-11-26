import RowActions from "@/shared/components/RowActions";
import { 
  showDisableAlert, 
  showCancelDisableAlert, 
  showConfirmDisableAlert,
  showErrorAlert
} from "@/shared/services/alertService";
import { useNavigate } from "react-router-dom";
import { disableProvider } from "../services/providerServices";
import { usePermissions } from "@/features/permissions";

export default function ProviderRowActions({ provider }) {
  const navigate = useNavigate();
  const { can } = usePermissions();

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
    <RowActions
      entity="proveedor"
      onView={can("providers", "view") ? handleView : undefined}
      onEdit={can("providers", "edit") ? handleEdit : undefined}
      onDisable={can("providers", "delete") ? handleDisable : undefined}
    />
  );
}
