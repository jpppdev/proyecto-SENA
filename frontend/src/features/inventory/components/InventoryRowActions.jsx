import RowActions from "@/shared/components/RowActions";
import { useNavigate } from "react-router-dom";
import { 
  showDisableAlert, 
  showCancelDisableAlert, 
  showConfirmDisableAlert,
  showErrorAlert
} from "@/shared/services/alertService";
import { disableInventory } from "../services/inventoryServices";

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

  const handleDisable = async () => {
    const result = await showDisableAlert({
      title: "¿Deshabilitar producto?",
      text: `¿Deseas deshabilitar ${product?.productName || "este producto del inventario"}?`,
      confirmButtonText: "Sí, deshabilitar",
    });

    if (result.isConfirmed) {
      try {
        await disableInventory(product.id);
        window.dispatchEvent(new CustomEvent("inventory:updated"));
        await showConfirmDisableAlert({
          title: "Producto deshabilitado",
          text: `El producto ${product?.productName ? `"${product.productName}" ` : ""}ha sido deshabilitado correctamente.`,
        });
      } catch (error) {
        await showErrorAlert({
          title: "Error",
          text: error.message || "No se pudo deshabilitar el producto.",
        });
      }
    } else if (result.dismiss) {
      await showCancelDisableAlert({
        title: "Acción cancelada",
        text: "El producto no fue modificado.",
      });
    }
  };
  return (
    <RowActions
      entity="producto"
      onView={handleView}
      onEdit={handleEdit}
      onDisable={handleDisable}
    />
  );
}
