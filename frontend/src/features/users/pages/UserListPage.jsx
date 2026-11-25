// src/users/pagesUserListPage.js

import ListPageHeader from "@/shared/components/ListPageHeader";
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

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let active = true;
    let latestRequest = 0;

    const loadUsers = async () => {
      const request = ++latestRequest;
      try {
        const data = await getUsers();
        if (!active || request !== latestRequest) return;
        setUsersData(data);
        setError("");
      } catch {
        if (!active || request !== latestRequest) return;
        setError("No se pudo cargar el listado de usuarios.");
      } finally {
        if (active && request === latestRequest) setIsLoading(false);
      }
    };

    loadUsers();
    window.addEventListener("users:updated", loadUsers);
    return () => {
      active = false;
      window.removeEventListener("users:updated", loadUsers);
    };
  }, [retryCount]);

  const retryLoading = () => {
    setError("");
    setIsLoading(true);
    setRetryCount((count) => count + 1);
  };

  return (
    <div className="min-w-0 p-4 sm:p-6">
      <ListPageHeader
        title="Listado de Usuarios"
        description="Consulta, gestiona y administra los usuarios del sistema."
      >
        <Button variant="tertiary" onClick={() => setIsReportModalOpen(true)}>
          <FileDown className="mr-2 size-5 shrink-0" aria-hidden="true" />
          Reportar usuario
        </Button>
        <Button onClick={() => navigate("/dashboard/userCreate")}>
          Crear usuario
        </Button>
      </ListPageHeader>
      
      
      
      

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
        data={usersData}
      />

    </div>
  );
}
