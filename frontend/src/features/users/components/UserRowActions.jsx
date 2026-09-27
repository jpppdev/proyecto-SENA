// src/features/users/components/UserRowActions.jsx

import { Pencil, Eye, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showDeleteAlert, showCancelDeleteAlert } from "@/shared/services/alertService";

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
    } else if (result.dismiss) {
      await showCancelDeleteAlert({
        title: "Eliminación cancelada",
        text: "El usuario no fue eliminado.",
    })
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
        onClick={handleDelete} 
        className="p-1 rounded hover:bg-gray-100 text-red-600 transition-colors"
        title="Eliminar usuario"
      >
        <Trash size={16} /> 
      </button>
    </div>
  );
}