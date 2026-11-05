import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, DataTable } from "@/shared";
import { ProviderColumns } from "../table/ProviderColumns"; 
import { getProviders } from "../services/providerServices";

export default function ProviderListPage() {
  const [providersData, setProvidersData] = useState([]);

  useEffect(() => {
    getProviders()
      .then((data) => setProvidersData(data))
      .catch((error) => console.error("Error cargando proveedores:", error));
  }, []);

  return (
    <div className="p-6">
      
      <h1 className="text-[length:var(--text-main)] font-semibold mb-4 text-[color:var(--color-text-primary)] ">
        Listado de Proveedores
      </h1>
      
      <div className="flex justify-end items-center gap-4 pb-10">
        
        {/* botón de crear proveedor */}
        <Link to="/dashboard/providerCreate" className="text-h1 font-heading">
          <Button>Crear proveedor</Button>
        </Link>

      </div>

      <DataTable data={providersData} columns={ProviderColumns} />

    </div>
  );
}