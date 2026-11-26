import ListPageHeader from "@/shared/components/ListPageHeader";
import { useState, useEffect } from "react";
import { FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, DataTable } from "@/shared";
import { ProviderColumns } from "../table/ProviderColumns"; 
import { getProviders } from "../services/providerServices";
import { usePermissions } from "@/features/permissions";
import ProviderReportConfigModal from "@/features/provider/reports/components/ProviderReportConfigModal";

export default function ProviderListPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [providersData, setProvidersData] = useState([]);

  const loadProviders = () => {
    getProviders()
      .then((data) => setProvidersData(data))
      .catch((error) => console.error("Error cargando proveedores:", error));
  };

  useEffect(() => {
    loadProviders();
    window.addEventListener("providers:updated", loadProviders);
    return () => window.removeEventListener("providers:updated", loadProviders);
  }, []);

  return (
    <div className="min-w-0 p-4 sm:p-6">
      <ListPageHeader
        title="Listado de Proveedores"
        description="Consulta y administra los proveedores del restaurante."
      >
        <Button variant="tertiary" onClick={() => setIsReportModalOpen(true)}>
          <FileDown className="mr-2 size-5 shrink-0" aria-hidden="true" />
          Reportar proveedor
        </Button>
        {can("providers", "create") && (
          <Button onClick={() => navigate("/dashboard/providerCreate")}>
            Crear proveedor
          </Button>
        )}
      </ListPageHeader>

      <DataTable data={providersData} columns={ProviderColumns} />

      <ProviderReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        module="providers"
        data={providersData}
      />

    </div>
  );
}