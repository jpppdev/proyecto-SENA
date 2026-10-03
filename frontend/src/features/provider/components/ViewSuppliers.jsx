import { Link, useParams } from "react-router-dom";
import {
  User,
  FileText,
  Phone,
  Mail,
  MapPin,
  Package,
  MessageSquare,
  ToggleRight,
  Edit,
  Ban,
  PackageOpen,
  AlertTriangle,
  DollarSign,
  CircleDollarSign,
  Layers,
  Calendar,
} from "lucide-react";

import { Button } from "@/shared";
import { providers } from "../data/provider";

export default function ViewSuppliers() {
  const { id } = useParams();

  const supplier = providers.find(
    (item) => String(item.id) === String(id)
  );

  if (!supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-div">
        <p className="text-title font-heading text-text-primary">
          Proveedor no encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/src/assets/images/fondo.png')] bg-cover bg-center p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div>

            <h1 className="text-main font-heading text-text-primary">
              Visualizar Proveedor
            </h1>

          </div>

          <Link to="/dashboard/providerList">
            <Button>
              Volver a la lista
            </Button>
          </Link>

        </div>


        {/* TARJETA PRINCIPAL */}
        <div className="bg-brand-light rounded-2xl shadow-md p-6 mb-5">

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">

            {/* ICONO */}
            <div className="flex-shrink-0">

              <div className="w-32 h-32 rounded-full bg-brand flex items-center justify-center">

                <User
                  size={45}
                  className="text-text-inverse"
                />

              </div>

            </div>


            {/* INFORMACIÓN */}
            <div className="flex-1">

              <h2 className="text-title font-heading text-text-secondary mb-2">
                {supplier.providerName}
              </h2>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand text-text-inverse text-small font-body mb-4">

                <Package size={20} />

                Proveedor

              </div>


              <div className="space-y-2 text-body text-text-secondary">

                <div className="flex items-center gap-2">

                  <Mail
                    size={20}
                    className="text-brand"
                  />

                  <span>
                    {supplier.email}
                  </span>

                </div>


                <div className="flex items-center gap-2">

                  <Phone
                    size={20}
                    className="text-brand"
                  />

                  <span>
                    {supplier.phone}
                  </span>

                </div>

              </div>

            </div>


            {/* ID */}
            <div className="lg:border-l lg:pl-8 min-w-[150px] border-border">

              <p className="text-body text-text-secondary mb-2">
                ID de proveedor
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-background-div">

                <span className="text-small font-body text-text-secondary">
                  PRV-{String(supplier.id).padStart(5, "0")}
                </span>

              </div>

            </div>


            {/* ESTADO */}
            <div className="lg:border-l lg:pl-8 min-w-[150px] border-border">

              <p className="text-body text-text-secondary mb-2">
                Estado del proveedor
              </p>

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-small font-body bg-brand text-text-inverse">

                <span className="w-2 h-2 rounded-full bg-text-inverse"></span>

                {supplier.isActive
                  ? "Habilitado"
                  : "Inhabilitado"}

              </span>

            </div>

          </div>

        </div>


        {/* PESTAÑAS */}
        <div className="bg-brand-light rounded-2xl shadow-md mb-5">

          <div className="flex items-center">

            <div className="px-6 py-4 text-text-secondary flex items-center gap-2">

              <User size={20} />

              Información general

            </div>

            <div className="px-6 py-4 text-text-secondary flex items-center gap-2">

              <Package size={20} />

              Suministros

            </div>

          </div>

        </div>


        {/* CONTENIDO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* DATOS DEL PROVEEDOR */}
          <div className="lg:col-span-2">

            <div className="bg-brand-light rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 pb-4 mb-6">

                <div>

                  <User
                    size={20}
                    className="text-brand"
                  />

                </div>

                <div>

                  <h2 className="font-heading text-title text-text-secondary">
                    Datos del proveedor
                  </h2>

                  <p className="text-body text-text-secondary">
                    Información básica del proveedor
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

                {/* FOTO */}
                <div className="flex-shrink-0">

                  <img
                    src={supplier.supplierImage}
                    alt="Foto del proveedor"
                    className="w-32 h-32 object-cover rounded-full border-4 border-brand"
                  />

                </div>


                {/* ID */}
                <div className="flex gap-3">

                  <FileText
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      ID
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {supplier.id || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* MARCA */}
                <div className="flex gap-3">

                  <FileText
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Marca
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {supplier.brand || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* NOMBRE */}
                <div className="flex gap-3">

                  <User
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Nombre del proveedor
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {supplier.providerName || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CODIGO DE BARRAS */}
                <div className="flex gap-3">

                  <Mail
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Codigo de Barras
                    </p>

                    <p className="font-body mt-1 break-all text-text-secondary">
                      {supplier.barCode || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CUENTADANTE */}
                <div className="flex gap-3">

                  <User
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Cuentadante
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {supplier.custodian || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CANTIDAD */}
                <div className="flex gap-3">

                  <Package
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Cantidad
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {supplier.quantity || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CANTIDAD TOTAL */}
                <div className="flex gap-3">

                  <PackageOpen
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Cantidad total
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {supplier.totalQuantity || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CANTIDAD MÍNIMA */}
                <div className="flex gap-3">

                  <AlertTriangle
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Cantidad mínima
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {supplier.minimumQuantity || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* VALOR UNITARIO */}
                <div className="flex gap-3">

                  <DollarSign
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Valor unitario
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {supplier.unitValue || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* VALOR TOTAL */}
                <div className="flex gap-3">

                  <CircleDollarSign
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Valor total
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {supplier.totalValue || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* ESTADO */}
                <div className="flex gap-3">

                  <ToggleRight
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Estado
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {supplier.status || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* LOTE */}
                <div className="flex gap-3">

                  <Layers
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Lote
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {supplier.lot || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* FECHA DE VENCIMIENTO */}
                <div className="flex gap-3">

                  <Calendar
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Fecha de vencimiento
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {supplier.expirationDate || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* DESCRIPCIÓN */}
                <div className="flex gap-3">

                  <FileText
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Descripción
                    </p>

                    <p className="font-body mt-1 break-all text-text-secondary">
                      {supplier.description || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* UBICACIÓN */}
                <div className="flex gap-3">

                  <MapPin
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Ubicación
                    </p>

                    <p className="font-body mt-1 break-all text-text-secondary">
                      {supplier.location || "No registrado"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* DERECHA */}
          <div className="space-y-5">


            {/* SUMINISTRO */}
            <div className="bg-brand-light rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 mb-5">

                <Package
                  size={20}
                  className="text-brand"
                />

                <h2 className="font-heading text-title text-text-secondary">
                  Suministro principal
                </h2>

              </div>


              <div className="bg-background-div rounded-lg p-4">

                <p className="font-body text-text-secondary">
                  {supplier.products || "No registrado"}
                </p>

              </div>

            </div>


            {/* OBSERVACIONES */}
            <div className="bg-brand-light rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 mb-5">

                <MessageSquare
                  size={20}
                  className="text-brand"
                />

                <h2 className="font-heading text-title text-text-secondary">
                  Observaciones
                </h2>

              </div>


              <p className="text-text-secondary">
                {supplier.observations ||
                  "Sin observaciones registradas."}
              </p>

            </div>


            {/* ACCIONES */}
            <div className="bg-brand-light rounded-2xl shadow-md px-8 p-4">

              <div className="flex flex-col gap-1.5">

                <Button>
                  <span className="flex items-center justify-center gap-2">

                    <Edit size={20} />

                    Editar proveedor

                  </span>
                </Button>


                <Button>
                  <span className="flex items-center justify-center gap-2">

                    <ToggleRight size={20} />

                    Cambiar estado

                  </span>
                </Button>


                <Button>
                  <span className="flex items-center justify-center gap-2">

                    <Ban size={20} />

                    Desactivar proveedor

                  </span>
                </Button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

