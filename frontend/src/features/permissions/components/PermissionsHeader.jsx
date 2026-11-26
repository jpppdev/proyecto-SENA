import { Shield } from "lucide-react";

export default function PermissionsHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 px-4">
      <div>
        <h1 className="text-3xl font-extrabold text-text-primary mb-1 drop-shadow-sm flex items-center gap-3">
          <Shield className="text-brand" size={32} />
          Gestión de Permisos
        </h1>
        <p className="text-sm font-medium text-text-coffee">
          Configura los niveles de acceso por rol o asigna permisos específicos a cualquier usuario de la base de datos.
        </p>
      </div>
    </div>
  );
}
