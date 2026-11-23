// src/users/pagesUserListPage.js

import { useState, useEffect } from "react";
import { FileDown, Users } from "lucide-react";
import { DataTable, Breadcrumbs, Button } from "@/shared";
import { UserColumns } from "../table/UserColumns";
import { getUsers } from "../services/userServices";
import { useNavigate } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";

const breadcrumbs = [
  { label: "Inicio", to: "/dashboard/home" },
  { label: "Usuarios" },
];

export default function UserListPage() {
  const navigate = useNavigate();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);

  const loadUsers = () => {
    getUsers()
      .then((data) => setUsersData(data))
      .catch((error) => console.error("Error cargando usuarios:", error));
  };

  useEffect(() => {
    loadUsers();
    window.addEventListener("users:updated", loadUsers);
    return () => window.removeEventListener("users:updated", loadUsers);
  }, []);

  return (
    <div className="contenedor-1 min-w-0 p-4 sm:p-6">
      <Breadcrumbs items={breadcrumbs} />
      <header className="contenedor-2 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="contenedor-3 flex min-w-0 items-center gap-4">
          <Users className="size-9 shrink-0 text-text-brand sm:size-13" aria-hidden="true" />
          <div className="contenedor-4 min-w-0"> 
            <h1 className=" contenedor-5
              text-text-primary
              text-main
              font-title font-heading">
              {/* Aplica un interlineado
                Aplica un grosor
                Aplica un espaciado entre letras
              */} 
              Listado de Usuarios</h1>
            <p className="contenedor-6 mt-1 text-medium text-text-secondary sm:text-body">Consulta, gestiona y administra los usuarios del sistema.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          {/* botón de reportar usuario */}
          <Button variant="tertiary" onClick={() => setIsReportModalOpen(true)}>
            <FileDown className="mr-2 size-5 shrink-0" aria-hidden="true" />
            Reportar usuario
          </Button>
          {/* Botón para crear usuario */}
          <Button onClick={() => navigate("/dashboard/userCreate")}>
            Crear usuario
          </Button>
        </div>
      </header>
      
      
      
      

      <section aria-label="Listado de usuarios" aria-busy={isLoading}>
        {isLoading ? (
          <p role="status" className="py-6 text-text-secondary">Cargando usuarios…</p>
        ) : error ? (
          <div className="space-y-3 py-6">
            <p role="alert" className="text-error">{error}</p>
            <Button onClick={retryLoading}>Reintentar</Button>
          </div>
        ) : usersData.length === 0 ? (
          <p role="status" className="py-6 text-text-secondary">No hay usuarios registrados.</p>
        ) : (
          <DataTable data={usersData} columns={UserColumns} />
        )}
      </section>

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        module="users"
        data={usersData}
      />

    </div>
  );
}
