// src/features/users/components/UserRowActions.jsx

import { Pencil, Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@/shared";
import { 
  showDeleteAlert, 
  showCancelDeleteAlert, 
  showConfirmDeleteAlert 
} from "@/shared/services/alertService";

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

  // Diálogo para eliminar con dos botones
  const handleDelete = async () => {
    const result = await showDeleteAlert({
      title: "¿Eliminar usuario?",
      text: `¿Deseas eliminar a ${user?.userName || "este usuario"}?`,
    });

    if (result.isConfirmed) {
      console.log("Usuario eliminado:", user?.id);
      await showConfirmDeleteAlert({
        title: "Usuario eliminado",
        text: `El usuario ${user?.userName ? `"${user.userName}" ` : ""}ha sido eliminado correctamente.`,
      });
    } else if (result.dismiss) {
      await showCancelDeleteAlert({
        title: "Eliminación cancelada",
        text: "El usuario no fue eliminado.",
      });
    }
  };

  return (
    <div className="flex items-center gap-1">
      <IconButton
        variant="info"
        onClick={handleView}
        ariaLabel="Visualizar usuario"
        title="Visualizar usuario"
        hitSize={32}
        iconSize={16}
      >
        <Eye size={16} />
      </IconButton>
      
      <IconButton
        variant="warning"
        onClick={handleEdit}
        ariaLabel="Editar usuario"
        title="Editar usuario"
        hitSize={32}
        iconSize={16}
      >
        <Pencil size={16} />
      </IconButton>

      <IconButton
        variant="danger"
        onClick={handleDelete}
        ariaLabel="Eliminar usuario"
        title="Eliminar usuario"
        hitSize={32}
        iconSize={16}
      >
        <Trash size={16} />
      </IconButton>
    </div>
  );
}
