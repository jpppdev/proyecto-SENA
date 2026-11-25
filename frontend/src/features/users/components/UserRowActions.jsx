// src/features/users/components/UserRowActions.jsx

import RowActions from "@/shared/components/RowActions";
import { useNavigate } from "react-router-dom";
import { 
  showDisableAlert, 
  showCancelDisableAlert, 
  showConfirmDisableAlert,
  showErrorAlert
} from "@/shared/services/alertService";
import { disableUser } from "../services/userServices";

export default function UserRowActions({ user }) {
  const navigate = useNavigate();

  // Redirige a la vista de detalle
  const handleView = () => {
    if (user?.id) {
      navigate(`/dashboard/userView/${user.id}`);
    }
  };

  // Redirige a la vista de edición
  const handleEdit = () => {
    if (user?.id) {
      navigate(`/dashboard/users/${user.id}/edit`);
    }
  };

  // Diálogo para deshabilitar usuario en la base de datos
  const handleDisable = async () => {
    const result = await showDisableAlert({
      title: "¿Deshabilitar usuario?",
      text: `¿Deseas deshabilitar a ${user?.userName || "este usuario"}?`,
      confirmButtonText: "Sí, deshabilitar",
    });

    if (result.isConfirmed) {
      try {
        await disableUser(user.id);
        window.dispatchEvent(new CustomEvent("users:updated"));
        await showConfirmDisableAlert({
          title: "Usuario deshabilitado",
          text: `El usuario ${user?.userName ? `"${user.userName}" ` : ""}ha sido deshabilitado correctamente.`,
        });
      } catch (error) {
        await showErrorAlert({
          title: "Error",
          text: error.message || "No se pudo deshabilitar el usuario.",
        });
      }
    } else if (result.dismiss) {
      await showCancelDisableAlert({
        title: "Acción cancelada",
        text: "El usuario no fue modificado.",
      });
    }
  };

  return (
    <RowActions
      entity="usuario"
      onView={handleView}
      onEdit={handleEdit}
      onDisable={handleDisable}
    />
  );
}
