import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  User,
  FileText,
  Phone,
  Mail,
  Hash,
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

import { Breadcrumbs, Button } from "@/shared";
import { getProviderById, updateProviderStatus, disableProvider } from "../services/providerServices";
import { showSuccessAlert, showErrorAlert, showDisableAlert } from "@/shared/services/alertService";

export default function ViewSuppliers() {
  const { id } = useParams();
  return <SupplierDetails key={id} id={id} />;
}

function SupplierDetails({ id }) {
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getProviderById(id)
      .then((data) => {
        if (!active) return;
        setSupplier(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Error al cargar proveedor:", err);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleToggleStatus = async () => {
    if (!supplier) return;
    try {
      const nextStatus = !supplier.isActive;
      await updateProviderStatus(supplier.id, nextStatus);
      setSupplier((prev) => ({ ...prev, isActive: nextStatus }));
      await showSuccessAlert({
        title: nextStatus ? "Proveedor habilitado" : "Proveedor inhabilitado",
        text: `El estado de ${supplier.providerName} cambió a ${nextStatus ? "Habilitado" : "Inhabilitado"}.`,
        timer: 2000,
      });
    } catch (err) {
      await showErrorAlert({
        title: "Error",
        text: err.message || "No se pudo cambiar el estado del proveedor.",
      });
    }
  };

  const handleDisableProvider = async () => {
    if (!supplier) return;
    const confirm = await showDisableAlert({
      title: "¿Deshabilitar proveedor?",
      text: `¿Deseas deshabilitar a ${supplier.providerName}?`,
      confirmButtonText: "Sí, deshabilitar",
    });
    if (!confirm.isConfirmed) return;

    try {
      await disableProvider(supplier.id);
      setSupplier((prev) => ({ ...prev, isActive: false }));
      await showSuccessAlert({
        title: "Proveedor deshabilitado",
        text: `${supplier.providerName} fue deshabilitado correctamente.`,
        timer: 2000,
      });
    } catch (err) {
      await showErrorAlert({
        title: "Error",
        text: err.message || "No se pudo deshabilitar el proveedor.",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-clear text-text-secondary">
        Cargando datos...
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-clear text-text-secondary">
        <p className="text-title font-title font-heading text-text-primary">
          Proveedor no encontrado
        </p>
      </div>
    );
  }

  return (
    <div className="contenedor-1 mx-auto min-h-screen max-w-410 px-4 py-5 font-title text-medium text-text-coffee min-[801px]:px-8 min-[801px]:py-7">
      <Breadcrumbs
        items={[
          { label: "Inicio", to: "/dashboard/home" },
          { label: "Proveedores", to: "/dashboard/providerList" },
          { label: "Visualizar proveedor" },
        ]}
      />

      {/* HEADER */}
      <header className="contenedor-2 mt-5 mb-6 flex flex-col items-start justify-between gap-5 min-[801px]:flex-row min-[801px]:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div>
            <h1 className="text-title leading-tight font-medium-custom tracking-tight text-text-primary min-[501px]:text-[28px] min-[801px]:text-[35px]">
              Visualizar Proveedor
            </h1>
            <p className="mt-1 text-medium text-text-coffee">
              Consulta la información detallada del proveedor, sus suministros y su estado en el sistema.
            </p>
          </div>
        </div>

        <Link to="/dashboard/providerList">
          <Button className="inline-flex min-h-10 w-full items-center justify-center rounded-[10px] border border-brand px-5 py-2.5 text-medium font-medium-custom text-text-coffee transition-colors hover:bg-border-clear2/60 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand">
            Volver a la lista
          </Button>
        </Link>
      </header>

      {/* TARJETA PRINCIPAL */}
      <section className="contenedor-3 bg-background-positive/72 border border-solid border-background-clear rounded-xl shadow-[0_4px_18px] shadow-text-coffee/3 p-5 mb-6">
        <div className="contenedor-4 grid items-center gap-5 min-[501px]:grid-cols-[auto_minmax(0,1fr)] min-[1151px]:grid-cols-[auto_minmax(0,1.65fr)_minmax(145px,0.7fr)_minmax(170px,1fr)]">
          {/* FOTO */}
          <div className="contenedor-5 shrink-0">
            {supplier.supplierImage ? (
              <img
                src={supplier.supplierImage}
                alt="Foto del proveedor"
                className="size-27.5 rounded-full bg-background-clear object-cover min-[501px]:size-36"
              />
            ) : (
              <div className="flex size-27.5 items-center justify-center rounded-full bg-border-clear2 text-brand-hover min-[501px]:size-36">
                <Package size={45} />
              </div>
            )}
          </div>

          {/* INFORMACIÓN */}
          <div className="contenedor-6 min-w-0">
            <h2 className="contenedor-6.1 mb-2 text-title leading-tight font-medium-custom tracking-tight text-text-primary wrap-anywhere min-[801px]:text-[29px]">
              {supplier.providerName}
            </h2>

            <div className="contenedor-6.2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-border-clear2 text-brand-hover text-small font-normal mb-4">
              <Package size={20} />
              Proveedor
            </div>

            <div className="contenedor-6.3 space-y-3 text-medium text-text-secondary wrap-anywhere">
              <div className="flex items-center gap-2">
                <Mail size={20} className="shrink-0 text-text-brand" />
                <span>{supplier.email}</span>
              </div>

              <div className="flex items-center gap-2">
                <Phone size={20} className="shrink-0 text-text-brand" />
                <span>{supplier.phone}</span>
              </div>
            </div>
          </div>

          {/* ID */}
          <div className="self-stretch border-background-clear min-[1151px]:border-l min-[1151px]:pl-6">
            <p className="text-small text-text-muted mb-2">
              ID de proveedor
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-background-clear/75">
              <Hash size={20} className="text-text-secondary" />

              <span className="text-small font-medium-custom text-text-coffee">
                PRV-{String(supplier.id).padStart(5, "0")}
              </span>
            </div>
          </div>

          {/* ESTADO */}
          <div className="self-stretch border-background-clear min-[1151px]:border-l min-[1151px]:pl-6">
            <p className="text-small text-text-muted mb-2">
              Estado del proveedor
            </p>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-medium font-medium-custom ${
                supplier.isActive
                  ? "bg-surface-muted/55 text-text-secondary"
                  : "bg-brand-soft/30 text-text-coffee"
              }`}
            >
              <span className="order-last size-2.5 rounded-full bg-current"></span>
              {supplier.isActive ? "Habilitado" : "Inhabilitado"}
            </span>
          </div>
        </div>
      </section>

      {/* PESTAÑAS */}
      <div className="my-4 overflow-x-auto rounded-xl border border-background-clear bg-background-positive/68 px-1">
        <div className="flex items-center">
          <div className="flex shrink-0 items-center gap-2 whitespace-nowrap border-b-3 border-brand px-4 py-3.5 font-medium-custom text-text-brand min-[801px]:gap-4 min-[801px]:px-6">
            <User size={20} />
            Información General
          </div>

        </div>
      </div>

      {/* CONTENIDO */}
      <div className="grid grid-cols-1 gap-4 min-[801px]:grid-cols-[minmax(0,1.86fr)_minmax(280px,1fr)]">
        {/* COLUMNA PRINCIPAL */}
        <div className="min-w-0 space-y-4">
          {/* DATOS DEL PROVEEDOR */}
          <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">
            <div className="mb-5 flex items-center gap-4">
              <User size={20} className="shrink-0 text-text-brand" />

              <div>
                <h2 className="text-body font-medium-custom text-text-primary">
                  Datos del proveedor
                </h2>

                <p className="text-medium text-text-secondary">
                  Información básica del proveedor
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-9 gap-y-6 min-[501px]:grid-cols-2">
              {/* NOMBRE */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <User
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">
                    Nombre del proveedor
                  </p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.providerName || "No registrado"}
                  </p>
                </div>
              </div>

              {/* ID */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <FileText
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">ID</p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.id || "No registrado"}
                  </p>
                </div>
              </div>

              {/* MARCA */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <FileText
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">Marca</p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.brand || "No registrado"}
                  </p>
                </div>
              </div>

              {/* CÓDIGO DE BARRAS */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <Hash
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">
                    Código de barras
                  </p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.barCode || "No registrado"}
                  </p>
                </div>
              </div>

              {/* CUENTADANTE */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <User
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">Cuentadante</p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.custodian || "No registrado"}
                  </p>
                </div>
              </div>

              {/* UBICACIÓN */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <MapPin
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">Ubicación</p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.location || "No registrado"}
                  </p>
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <FileText
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">Descripción</p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.description || "No registrado"}
                  </p>
                </div>
              </div>

              {/* ESTADO */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <ToggleRight
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">Estado</p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.status || "No registrado"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* DATOS DEL SUMINISTRO */}
          <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">
            <div className="mb-5 flex items-center gap-4">
              <Package size={20} className="shrink-0 text-text-brand" />

              <div>
                <h2 className="text-body font-medium-custom text-text-primary">
                  Datos del suministro
                </h2>

                <p className="text-medium text-text-secondary">
                  Información de inventario y valores del proveedor
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-5 gap-y-4 min-[501px]:grid-cols-2">
              {/* CANTIDAD */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <Package className="shrink-0 text-text-brand" size={20} />

                <div>
                  <p className="text-small text-text-muted">Cantidad</p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.quantity || "No registrado"}
                  </p>
                </div>
              </div>

              {/* CANTIDAD TOTAL */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <PackageOpen className="shrink-0 text-text-brand" size={20} />

                <div>
                  <p className="text-small text-text-muted">Cantidad total</p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.totalQuantity || "No registrado"}
                  </p>
                </div>
              </div>

              {/* CANTIDAD MÍNIMA */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <AlertTriangle className="shrink-0 text-text-brand" size={20} />

                <div>
                  <p className="text-small text-text-muted">Cantidad mínima</p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.minimumQuantity || "No registrado"}
                  </p>
                </div>
              </div>

              {/* VALOR UNITARIO */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <DollarSign className="shrink-0 text-text-brand" size={20} />

                <div>
                  <p className="text-small text-text-muted">Valor unitario</p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.unitValue || "No registrado"}
                  </p>
                </div>
              </div>

              {/* VALOR TOTAL */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <CircleDollarSign
                  className="shrink-0 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">Valor total</p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.totalValue || "No registrado"}
                  </p>
                </div>
              </div>

              {/* LOTE */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <Layers className="shrink-0 text-text-brand" size={20} />

                <div>
                  <p className="text-small text-text-muted">Lote</p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.lot || "No registrado"}
                  </p>
                </div>
              </div>

              {/* FECHA DE VENCIMIENTO */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <Calendar className="shrink-0 text-text-brand" size={20} />

                <div>
                  <p className="text-small text-text-muted">
                    Fecha de vencimiento
                  </p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {supplier.expirationDate || "No registrado"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="min-w-0 space-y-4">
          {/* SUMINISTRO PRINCIPAL */}
          <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-body font-medium-custom text-text-primary">
                Suministro principal
              </h2>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-border-clear2 text-brand-hover font-normal text-small">
              <Package size={20} />
              {supplier.products || "No registrado"}
            </div>
          </div>

          {/* OBSERVACIONES */}
          <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare size={20} className="shrink-0 text-text-brand" />

              <h2 className="text-body font-medium-custom text-text-primary">
                Observaciones
              </h2>
            </div>

            <p className="text-medium text-text-secondary wrap-anywhere">
              {supplier.observations || "Sin observaciones registradas."}
            </p>
          </div>

          {/* ACCIONES */}
          <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">
            <div className="flex flex-col gap-2.5">
              <Link to={`/dashboard/providerEdit/${supplier.id}`}>
                <Button className="flex min-h-10 w-full items-center rounded-lg border border-background-clear bg-border-clear2/30 px-4 py-2.5 text-left text-medium text-text-coffee transition-colors hover:bg-border-clear2/70 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand">
                  <span className="flex w-full items-center gap-4 [&>svg]:shrink-0 [&>svg]:text-text-brand">
                    <Edit size={20} />
                    Editar proveedor
                  </span>
                </Button>
              </Link>

              <Button onClick={handleToggleStatus}>
                <span className="flex items-center justify-center gap-2">
                  <ToggleRight size={20} />
                  Cambiar estado
                </span>
              </Button>

              <Button onClick={handleDisableProvider}>
                <span className="flex items-center justify-center gap-2">
                  <Ban size={20} />
                  Deshabilitar proveedor
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}