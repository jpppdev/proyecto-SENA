import RowActions from "@/shared/components/RowActions";
import { Ban, Eye, Settings } from "lucide-react";
import { Button } from "@/shared";
import { 
  showDisableAlert, 
  showCancelDisableAlert, 
  showConfirmDisableAlert,
  showErrorAlert
} from "@/shared/services/alertService";
import { useNavigate } from "react-router-dom";
import { disableOrder } from "../services/orderServices";
import { usePermissions } from "@/features/permissions";

export default function OrderRowActions({ order, variant }) {
  const navigate = useNavigate();
  const { can } = usePermissions();

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

  const canView = can("orders", "view");
  const canEdit = can("orders", "edit");
  const canDisable = can("orders", "delete");

  if (variant === "card") {
    const manage = canEdit && (!canView || ["pending", "preparing"].includes(order.stage));
    const primaryLabel = manage ? "Gestionar" : "Ver detalle";
    const PrimaryIcon = manage ? Settings : Eye;
    const iconClass = "grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl bg-background-clear/55 hover:bg-background-clear focus-visible:outline-2 focus-visible:outline-focus-ring [.dark_&]:bg-surface-muted [.dark_&]:text-text-primary";

    return (
      <div className="mt-auto flex gap-2">
        {(canView || canEdit) && (
          <Button
            onClick={manage ? handleEdit : handleView}
            className="inline-flex min-h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-background-clear/75 px-2 text-medium font-medium-custom hover:bg-background-clear focus-visible:outline-2 focus-visible:outline-focus-ring [.dark_&]:bg-surface-muted [.dark_&]:text-text-primary"
          >
            <PrimaryIcon size={18} aria-hidden="true" /> {primaryLabel}
          </Button>
        )}
        {canView && canEdit && (
          <Button onClick={manage ? handleView : handleEdit} aria-label={manage ? "Ver detalle" : "Gestionar"} title={manage ? "Ver detalle" : "Gestionar"} className={iconClass}>
            {manage ? <Eye size={17} aria-hidden="true" /> : <Settings size={17} aria-hidden="true" />}
          </Button>
        )}
        {canDisable && order.stage !== "disabled" && (
          <Button onClick={handleDisable} aria-label="Deshabilitar orden" title="Deshabilitar orden" className={iconClass}>
            <Ban size={17} aria-hidden="true" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <RowActions
      entity="orden"
      onView={canView ? handleView : undefined}
      onEdit={canEdit ? handleEdit : undefined}
      onDisable={canDisable ? handleDisable : undefined}
    />
  );
}
