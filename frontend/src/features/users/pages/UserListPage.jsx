// src/users/pagesUserListPage.js

import { useState, useEffect } from "react";
import { DataTable, Button } from "@/shared";
import { UserColumns } from "../table/UserColumns";
import { getUsers } from "../services/userServices";
import { Link } from "react-router-dom";
import ReportConfigModal from "../reports/components/ReportConfigModal";

export default function UserListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);
  
  useEffect(() => {
    getUsers()
      .then((data) => setUsersData(data))
      .catch((error) => console.error("Error cargando usuarios:", error));
  }, []);

  return (
    <div className="p-6">
      
      <h1 className="text-[color:var(--color-text-primary)] text-[length:var(--text-main)] font-semibold mb-4  ">Listado de Usuarios</h1>
      {/* color de texto,  */}
      
      <div className="flex justify-end items-center gap-4 pb-10">


        {/* botón de reportar usuario */}
        <Button onClick={() => setIsReportModalOpen(true)}>
          Reportar usuario
        </Button>


        {/* botón de reportar crear usuario */}
        <Link to="/dashboard/userCreate" className="text-h1 font-heading">
          <Button>Crear usuario</Button>
        </Link>

      </div>

      <DataTable data={usersData} columns={UserColumns} />

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

    </div>
  );
}