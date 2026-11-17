import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, DataTable } from "@/shared";
import { ProviderColumns } from "../table/ProviderColumns"; 
import { getProviders } from "../services/providerServices";
import ReportConfigModal from "@/features/users/reports/components/ReportConfigModal";

export default function ProviderListPage() {
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
    <div className="p-6">
      
      <h1 className="text-[length:var(--text-main)] font-semibold mb-4 text-[color:var(--color-text-primary)] ">
        Listado de Proveedores
      </h1>
      
      <div className="flex justify-end items-center gap-4 pb-10">
        {/* botón de reportar proveedor */}
        <Button onClick={() => setIsReportModalOpen(true)}>
          Reportar proveedor
        </Button>
        
        {/* botón de crear proveedor */}
        <Link to="/dashboard/providerCreate" className="text-h1 font-heading">
          <Button>Crear proveedor</Button>
        </Link>

      </div>

      <DataTable data={providersData} columns={ProviderColumns} />

      <ReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        module="providers"
        data={providersData}
      />

    </div>
  );
}