import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, DataTable } from "@/shared";
import { MenuColumns } from "../table/MenuColumns";
import { getMenu } from "../services/menuServices";
import ReportConfigModal from "@/features/users/reports/components/ReportConfigModal";

export default function MenuListPage() {
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [menuData, setMenuData] = useState([]);

  const loadMenu = () => {
    getMenu()
      .then((data) => setMenuData(data))
      .catch((error) => console.error("Error cargando menu:", error));
  };

  useEffect(() => {
    loadMenu();
    window.addEventListener("menu:updated", loadMenu);
    return () => window.removeEventListener("menu:updated", loadMenu);
  }, []);

  return (
    <div className="p-6">
      
      <h1 className="text-[length:var(--text-main)] font-semibold mb-4 text-[color:var(--color-text-primary)]">
        Listado del Menú
      </h1>
      
      <div className="flex justify-end items-center gap-4 pb-10">
        {/* botón de reportar menú */}
        <Button onClick={() => setIsReportModalOpen(true)}>
          Reportar menú
        </Button>
        
        {/* botón de crear platillo */}
        <Link to="/dashboard/menuCreate" className="text-h1 font-heading">
          <Button>Agregar al menú</Button>
        </Link>

      </div>

      <DataTable data={menuData} columns={MenuColumns} />

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        module="menu"
        data={menuData}
      />

    </div>
  );
}