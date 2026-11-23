// src/features/users/components/UserRowActions.jsx

import { Pencil, Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@/shared/components/IconButton";
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
    <div className="flex gap-2">
      <IconButton
        ariaLabel="Visualizar usuario"
        variant="action"
        hitSize={46}
        iconSize={20}
        onClick={handleView} 
        title="Visualizar usuario"
      >
        <Eye size={20} />
      </IconButton>
      
      <IconButton
        ariaLabel="Editar usuario"
        variant="action"
        hitSize={46}
        iconSize={20}
        onClick={handleEdit} 
        title="Editar usuario"
      >
        <Pencil size={20} />
      </IconButton>

      <IconButton
        ariaLabel="Eliminar usuario"
        variant="danger"
        hitSize={46}
        iconSize={20}
        onClick={handleDelete} 
        title="Eliminar usuario"
      >
        <Trash size={20} />
      </IconButton>
    </div>
  );
}
