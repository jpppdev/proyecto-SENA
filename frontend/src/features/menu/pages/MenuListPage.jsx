import ListPageHeader from "@/shared/components/ListPageHeader";
import { useState, useEffect } from "react";
import { FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, DataTable } from "@/shared";
import { MenuColumns } from "../table/MenuColumns";
import { getMenu } from "../services/menuServices";
import { usePermissions } from "@/features/permissions";
import MenuReportConfigModal from "@/features/menu/reports/components/MenuReportConfigModal";

export default function MenuListPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();
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
    <div className="min-w-0 p-4 sm:p-6">
      <ListPageHeader
        title="Listado del Menú"
        description="Consulta y administra los platillos del menú."
      >
        <Button variant="tertiary" onClick={() => setIsReportModalOpen(true)}>
          <FileDown className="mr-2 size-5 shrink-0" aria-hidden="true" />
          Reportar menú
        </Button>
        {can("menu", "create") && (
          <Button onClick={() => navigate("/dashboard/menuCreate")}>
            Agregar al menú
          </Button>
        )}
      </ListPageHeader>

      <DataTable data={menuData} columns={MenuColumns} />

      <MenuReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        module="menu"
        data={menuData}
      />

    </div>
  );
}
