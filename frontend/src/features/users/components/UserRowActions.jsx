// src/features/users/components/UserRowActions.jsx

import { Pencil, Eye, Ban } from "lucide-react";
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
    <div className="flex gap-2">
      <button 
        type="button"
        onClick={handleView} 
        className="p-1 rounded hover:bg-gray-100 text-blue-600 transition-colors"
        title="Visualizar usuario"
      >
        <Eye size={16} /> 
      </button>
      
      <button 
        type="button"
        onClick={handleEdit} 
        className="p-1 rounded hover:bg-gray-100 text-orange-500 transition-colors"
        title="Editar usuario"
      >
        <Pencil size={16} /> 
      </button>

      <button 
        type="button"
        onClick={handleDisable} 
        className="p-1 rounded hover:bg-gray-100 text-red-600 transition-colors"
        title="Deshabilitar usuario"
      >
        <Ban size={16} /> 
      </button>
    </div>
  );
}