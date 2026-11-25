import { Pencil, Eye, Ban } from "lucide-react";
import RowActions from "@/shared/components/RowActions";
import { 
  showDisableAlert, 
  showCancelDisableAlert, 
  showConfirmDisableAlert,
  showErrorAlert
} from "@/shared/services/alertService";
import { useNavigate } from "react-router-dom";
import { disableMenu } from "../services/menuServices";

const catalogAction = "flex min-h-8 flex-1 items-center justify-center rounded-lg border transition-colors focus-visible:outline-2 focus-visible:outline-focus-ring";
const catalogSecondaryAction = `${catalogAction} border-border-clear2 text-text-brand hover:bg-brand-soft [.dark_&]:text-brand-soft [.dark_&]:hover:bg-background-inverse`;

export default function MenuRowActions({ product, catalog = false }) {
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
  if (!catalog) {
    return (
      <RowActions
        entity="platillo"
        onView={handleView}
        onEdit={handleEdit}
        onDisable={handleDisable}
      />
    );
  }

  return (
    <div className="mt-2 flex gap-2">
      <button type="button" onClick={handleView} aria-label={`Ver ${product.menuName}`} title="Visualizar platillo" className={`${catalogAction} border-brand bg-brand text-text-success hover:bg-brand-hover`}>
        <Eye size={16} />
      </button>
      
      <button type="button" onClick={handleEdit} aria-label={`Editar ${product.menuName}`} title="Editar platillo" className={catalogSecondaryAction}>
        <Pencil size={16} />
      </button>

      <button type="button" onClick={handleDisable} aria-label={`Deshabilitar ${product.menuName}`} title="Deshabilitar platillo" disabled={product.isActive === false} className={`${catalogSecondaryAction} disabled:opacity-50`}>
        <Ban size={16} />
      </button>
    </div>
  );
}
