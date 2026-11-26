import { UserCheck } from "lucide-react";
import { Button, Select } from "@/shared";

export default function PermissionsFilters({
  roles,
  selectedRole,
  onRoleChange,
  userOptions,
  selectedUserId,
  onUserChange,
  onClearUser,
  selectedUserObj,
}) {
  return (
    <>
      <div className="mb-8 flex flex-col lg:flex-row lg:items-end gap-6">
        <div className="w-full min-w-0 max-w-100">
          <Select
            variant="create"
            label={selectedUserId ? "Rol asignado al Usuario" : "Seleccionar Rol a Configurar"}
            name="selectedRole"
            value={selectedRole}
            onChange={onRoleChange}
            htmlFor="role-select"
            options={roles}
          />
        </div>

        <div className="w-full min-w-0 max-w-100">
          <Select
            variant="create"
            label="Asignar Permiso Específico a Usuario (BD)"
            name="selectedUser"
            value={selectedUserId}
            onChange={onUserChange}
            htmlFor="user-select"
            options={userOptions}
          />
        </div>

        {selectedUserId && (
          <Button
            type="button"
            variant="secondary"
            size="md"
            onClick={onClearUser}
            className="rounded-xl"
          >
            Volver a permisos por rol
          </Button>
        )}
      </div>

      {selectedUserObj && (
        <div className="mb-8 flex items-center gap-3 rounded-2xl bg-background-div/90 border-2 border-border-hover px-5 py-3.5 text-sm font-semibold text-text-primary shadow-md">
          <UserCheck className="text-brand shrink-0" size={22} />
          <span>
            Editando permisos específicos para el usuario:{" "}
            <strong className="font-extrabold text-text-negative">
              {selectedUserObj.userName} {selectedUserObj.userLastname || ""}
            </strong>{" "}
            <span className="font-bold text-text-brand">({selectedUserObj.userEmail})</span>
          </span>
        </div>
      )}
    </>
  );
}
