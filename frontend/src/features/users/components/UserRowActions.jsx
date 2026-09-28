// Iconos usados en los botones de acciones
import { Pencil, Eye , Trash} from "lucide-react";

import { showDeleteAlert, showCancelDeleteAlert } from "../../../shared/service/alertService";
// Hook de React Router para navegar programáticamente entre rutas
import { useNavigate } from "react-router-dom";



// Componente que renderiza las acciones de cada fila de usuario
// Recibe como prop el objeto user
export default function UserRowActions({ user }) {


  // const handleEdit = () => {
  //   console.log("Editar usuario", user.id);
  // };


  // Hook que permite redirigir a otra ruta desde código
  const navigate = useNavigate();


  // Acción para editar el usuario
  // Redirige a la página de edición usando el id del usuario
  const handleEdit = () => {
    navigate(`/dashboard/users/${user.id}/edit`);
  };

  const handleView = () => {
    navigate(`/dashboard/userView/${user.id}`);
  };

  // Acción para eliminar el usuario
  // Actualmente solo imprime en consola el id
  // En una aplicación real aquí se llamaría a la API
  const handleDelete = async () => {
    const result =  await showDeleteAlert ({
      title: "Eliminar usario",
      text:`¿EStas seguro que deseas elimina a ${user?.userName}? `,
      
    })
    if (result.isConfirmed){
      navigate(-1)
    } else if (result.dismiss){
        await showCancelDeleteAlert({
        title: "Eliminación cancelada",
        text: "El usuario no fue eliminado.",
    })

    }
    
  };


 return (
    <div className="flex gap-2">
      {/* Botón Visualizar (Ojo) */}
      <button onClick={handleView} className="p-1 rounded hover:bg-gray-100 text-blue-600">
        <Eye size={16} /> 
      </button>
      
      {/* Botón Editar (Lápiz) ---> AQUÍ CONECTAMOS LA FUNCIÓN */}
      <button onClick={handleEdit} className="p-1 rounded hover:bg-gray-100 text-orange-500">
        <Pencil size={16} /> 
      </button>

      {/* Botón Eliminar (Cambié el icono a Trash para que tenga sentido) */}
      <button onClick={handleDelete} className="p-1 rounded hover:bg-gray-100 text-red-600">
        <Trash size={16} /> 
      </button>
    </div>
  )
}


