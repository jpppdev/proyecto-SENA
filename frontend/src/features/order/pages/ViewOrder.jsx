import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Utensils,
  User,
  Hash,
  ClipboardList,
  MessageSquare,
  ToggleRight,
  Package,
  DollarSign,
  Edit,
  Ban,
} from "lucide-react";

import { Breadcrumbs, Button } from "@/shared";
import { getOrderById, updateOrderStatus, disableOrder } from "../services/orderServices";
import { showSuccessAlert, showErrorAlert, showDisableAlert } from "@/shared/services/alertService";

export default function OrderViewPage() {
  const { id } = useParams();
  return <OrderDetails key={id} id={id} />;
}

function OrderDetails({ id }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getOrderById(id)
      .then((data) => {
        if (!active) return;
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Error al cargar la orden:", err);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleToggleStatus = async () => {
    if (!order) return;
    try {
      const nextStatus = order.status === "Deshabilitada" ? "En preparación" : "Deshabilitada";
      await updateOrderStatus(order.id, nextStatus);
      setOrder((prev) => ({ ...prev, status: nextStatus }));
      await showSuccessAlert({
        title: "Estado actualizado",
        text: `El estado de la orden #${order.id} cambió a ${nextStatus}.`,
        timer: 2000,
      });
    } catch (err) {
      await showErrorAlert({
        title: "Error",
        text: err.message || "No se pudo cambiar el estado de la orden.",
      });
    }
  };

  const handleDisableOrder = async () => {
    if (!order) return;
    const confirm = await showDisableAlert({
      title: "¿Deshabilitar orden?",
      text: `¿Deseas deshabilitar la orden #${order.id}?`,
      confirmButtonText: "Sí, deshabilitar",
    });
    if (!confirm.isConfirmed) return;

    try {
      await disableOrder(order.id);
      setOrder((prev) => ({ ...prev, status: "Deshabilitada" }));
      await showSuccessAlert({
        title: "Orden deshabilitada",
        text: `La orden #${order.id} fue deshabilitada correctamente.`,
        timer: 2000,
      });
    } catch (err) {
      await showErrorAlert({
        title: "Error",
        text: err.message || "No se pudo deshabilitar la orden.",
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

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-clear text-text-secondary">
        <p className="text-title font-title font-heading text-text-primary">
          Orden no encontrada
        </p>
      </div>
    );
  }

  const isDisabled = order.status === "Deshabilitada";

  return (
    <div className="contenedor-1 mx-auto min-h-screen max-w-410 px-4 py-5 font-title text-medium text-text-coffee min-[801px]:px-8 min-[801px]:py-7">
      <Breadcrumbs
        items={[
          { label: "Inicio", to: "/dashboard/home" },
          { label: "Órdenes", to: "/dashboard/orderList" },
          { label: "Visualizar orden" },
        ]}
      />

      {/* HEADER */}
      <header className="contenedor-2 mt-5 mb-6 flex flex-col items-start justify-between gap-5 min-[801px]:flex-row min-[801px]:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div>
            <h1 className="text-title leading-tight font-medium-custom tracking-tight text-text-primary min-[501px]:text-[28px] min-[801px]:text-[35px]">
              Visualizar Orden
            </h1>
            <p className="mt-1 text-medium text-text-coffee">
              Consulta la información detallada de la orden, los platillos solicitados y su estado en el sistema.
            </p>
          </div>
        </div>

        <Link to="/dashboard/orderList">
          <Button className="inline-flex min-h-10 w-full items-center justify-center rounded-[10px] border border-brand px-5 py-2.5 text-medium font-medium-custom text-text-coffee transition-colors hover:bg-border-clear2/60 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand">
            Volver a la lista
          </Button>
        </Link>
      </header>

      {/* TARJETA PRINCIPAL */}
      <section className="contenedor-3 bg-background-positive/72 border border-solid border-background-clear rounded-xl shadow-[0_4px_18px] shadow-text-coffee/3 p-5 mb-6">
        <div className="contenedor-4 grid items-center gap-5 min-[501px]:grid-cols-[auto_minmax(0,1fr)] min-[1151px]:grid-cols-[auto_minmax(0,1.65fr)_minmax(145px,0.7fr)_minmax(170px,1fr)]">
          {/* ICONO PRINCIPAL */}
          <div className="contenedor-5 shrink-0">
            <div className="flex size-27.5 items-center justify-center rounded-full bg-border-clear2 text-brand-hover min-[501px]:size-36">
              <ClipboardList size={45} />
            </div>
          </div>

          {/* INFORMACIÓN */}
          <div className="contenedor-6 min-w-0">
            <h2 className="contenedor-6.1 mb-2 text-title leading-tight font-medium-custom tracking-tight text-text-primary wrap-anywhere min-[801px]:text-[29px]">
              Orden #{order.id}
            </h2>

            <div className="contenedor-6.2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-border-clear2 text-brand-hover text-small font-normal mb-4">
              <Utensils size={20} />
              Pedido de restaurante
            </div>

            <div className="contenedor-6.3 space-y-3 text-medium text-text-secondary wrap-anywhere">
              <div className="flex items-center gap-2">
                <Hash size={20} className="shrink-0 text-text-brand" />
                <span>Mesa: {order.table || "No registrada"}</span>
              </div>

              <div className="flex items-center gap-2">
                <User size={20} className="shrink-0 text-text-brand" />
                <span>Mesero: {order.waiter || "No registrado"}</span>
              </div>
            </div>
          </div>

          {/* ID */}
          <div className="self-stretch border-background-clear min-[1151px]:border-l min-[1151px]:pl-6">
            <p className="text-small text-text-muted mb-2">
              ID de orden
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-background-clear/75">
              <Hash size={20} className="text-text-secondary" />

              <span className="text-small font-medium-custom text-text-coffee">
                ORD-{String(order.id).padStart(5, "0")}
              </span>
            </div>
          </div>

          {/* ESTADO */}
          <div className="self-stretch border-background-clear min-[1151px]:border-l min-[1151px]:pl-6">
            <p className="text-small text-text-muted mb-2">
              Estado de la orden
            </p>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-medium font-medium-custom ${
                !isDisabled
                  ? "bg-surface-muted/55 text-text-secondary"
                  : "bg-brand-soft/30 text-text-coffee"
              }`}
            >
              <span className="order-last size-2.5 rounded-full bg-current"></span>
              {order.status || "Activo"}
            </span>
          </div>
        </div>
      </section>

      {/* PESTAÑAS */}
      <div className="my-4 overflow-x-auto rounded-xl border border-background-clear bg-background-positive/68 px-1">
        <div className="flex items-center">
          <div className="flex shrink-0 items-center gap-2 whitespace-nowrap border-b-3 border-brand px-4 py-3.5 font-medium-custom text-text-brand min-[801px]:gap-4 min-[801px]:px-6">
            <ClipboardList size={20} />
            Información General
          </div>

        </div>
      </div>

      {/* CONTENIDO */}
      <div className="grid grid-cols-1 gap-4 min-[801px]:grid-cols-[minmax(0,1.86fr)_minmax(280px,1fr)]">
        {/* COLUMNA PRINCIPAL */}
        <div className="min-w-0 space-y-4">
          {/* DATOS DE LA ORDEN */}
          <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">
            <div className="mb-5 flex items-center gap-4">
              <ClipboardList size={20} className="shrink-0 text-text-brand" />

              <div>
                <h2 className="text-body font-medium-custom text-text-primary">
                  Datos de la orden
                </h2>

                <p className="text-medium text-text-secondary">
                  Información general de la orden
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-9 gap-y-6 min-[501px]:grid-cols-2">
              {/* NÚMERO DE MESA */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <Hash
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">
                    Número de mesa
                  </p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {order.table || "No registrado"}
                  </p>
                </div>
              </div>

              {/* MESERO RESPONSABLE */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <User
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">
                    Mesero responsable
                  </p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {order.waiter || "No registrado"}
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
                  <p className="text-small text-text-muted">
                    Estado
                  </p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {order.status || "Activo"}
                  </p>
                </div>
              </div>

              {/* OBSERVACIONES */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <MessageSquare
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">
                    Observaciones especiales
                  </p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {order.observations || "Sin observaciones"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* PLATILLOS SELECCIONADOS */}
          <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">
            <div className="mb-5 flex items-center gap-4">
              <Utensils size={20} className="shrink-0 text-text-brand" />

              <div>
                <h2 className="text-body font-medium-custom text-text-primary">
                  Platillos seleccionados
                </h2>

                <p className="text-medium text-text-secondary">
                  Platillos incluidos en la orden
                </p>
              </div>
            </div>

            {order.dishes && order.dishes.length > 0 ? (
              <div className="space-y-3">
                {order.dishes.map((dish, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-background-clear bg-background-clear/45 p-4"
                  >
                    <div className="grid grid-cols-1 gap-4 min-[501px]:grid-cols-3">
                      {/* PLATILLO */}
                      <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                        <Utensils
                          className="shrink-0 text-text-brand mt-0.5"
                          size={20}
                        />

                        <div>
                          <p className="text-small text-text-muted">
                            Platillo
                          </p>

                          <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                            {dish.name || "No registrado"}
                          </p>
                        </div>
                      </div>

                      {/* CANTIDAD */}
                      <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                        <Package
                          className="shrink-0 text-text-brand mt-0.5"
                          size={20}
                        />

                        <div>
                          <p className="text-small text-text-muted">
                            Cantidad
                          </p>

                          <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                            {dish.quantity || "No registrado"}
                          </p>
                        </div>
                      </div>

                      {/* PRECIO */}
                      <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                        <DollarSign
                          className="shrink-0 text-text-brand mt-0.5"
                          size={20}
                        />

                        <div>
                          <p className="text-small text-text-muted">
                            Precio
                          </p>

                          <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                            ${dish.price || "0"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-medium text-text-secondary">
                No hay platillos registrados en esta orden.
              </p>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="min-w-0 space-y-4">
          {/* RESUMEN */}
          <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-body font-medium-custom text-text-primary">
                Resumen
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-small text-text-muted">
                  Número de orden
                </p>

                <p className="mt-1 text-medium text-text-secondary">
                  #{order.id}
                </p>
              </div>

              <div>
                <p className="text-small text-text-muted">
                  Total de platillos
                </p>

                <p className="mt-1 text-medium text-text-secondary">
                  {order.dishes?.length || 0}
                </p>
              </div>

              <div>
                <p className="text-small text-text-muted mb-2">
                  Total de la orden
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-border-clear2 text-brand-hover font-medium-custom text-medium">
                  <DollarSign size={18} />
                  {order.total || "0"}
                </div>
              </div>
            </div>
          </div>

          {/* ACCIONES */}
          <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">
            <div className="flex flex-col gap-2.5">
              <Link to={`/dashboard/orders/${order.id}/edit`}>
                <Button className="flex min-h-10 w-full items-center rounded-lg border border-background-clear bg-border-clear2/30 px-4 py-2.5 text-left text-medium text-text-coffee transition-colors hover:bg-border-clear2/70 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand">
                  <span className="flex w-full items-center gap-4 [&>svg]:shrink-0 [&>svg]:text-text-brand">
                    <Edit size={20} />
                    Editar orden
                  </span>
                </Button>
              </Link>

              <Button onClick={handleToggleStatus}>
                <span className="flex items-center justify-center gap-2">
                  <ToggleRight size={20} />
                  Cambiar estado
                </span>
              </Button>

              <Button onClick={handleDisableOrder}>
                <span className="flex items-center justify-center gap-2">
                  <Ban size={20} />
                  Deshabilitar orden
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}