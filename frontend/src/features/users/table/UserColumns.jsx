// src/feautures/

import StatusSwitch from "@/shared/components/StatusSwitch";
import UserRowActions from "@/features/users/components/UserRowActions";
import { updateUserStatus } from "@/features/users/services/userServices";
import { showSuccessAlert, showErrorAlert } from "@/shared/services/alertService";

// Definición de las columnas de la tabla de usuarios
export const UserColumns = [
  // Columna ID
  {
    accessorKey: "id",
    header: "Id",
  },

  // Columna Nombre
  {
    accessorKey: "userName",
    header: "Nombre",
  },

  // Columna Email
  {
    accessorKey: "userEmail",
    header: "Email",
  },

  // Columna Telefono
  {
    accessorKey: "userPhone",
    header: "Telefono",
  },

  // Columna Estado (activo / inactivo)
  {
    accessorKey: "is_active",
    header: "Estado",
    cell: ({ row }) => {
      const user = row.original;
      const isChecked = Boolean(user.is_active ?? user.isActive);

      const handleChange = async (value) => {
        try {
          await updateUserStatus(user.id, value);
          window.dispatchEvent(new CustomEvent("users:updated"));
          await showSuccessAlert({
            title: value ? "Usuario habilitado" : "Usuario deshabilitado",
            text: `El estado de ${user.userName || "el usuario"} fue actualizado.`,
            timer: 1500,
          });
        } catch (error) {
          console.error("Error actualizando estado:", error);
          await showErrorAlert({
            title: "Error",
            text: error.message || "No se pudo actualizar el estado del usuario.",
            timer: 2000,
          });
        }
      };

      return (
        <StatusSwitch
          checked={isChecked}
          onChange={handleChange}
        />
      );
    },
  },

  // Columna de acciones (editar / deshabilitar)
  {
    id: "actions",
    cell: ({ row }) => <UserRowActions user={row.original} />,
  },
];
