import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Utensils,
  DollarSign,
  Image,
  Tag,
  FileText,
  Hash,
  Edit,
  ToggleRight,
  Ban,
} from "lucide-react";

import { Breadcrumbs, Button } from "@/shared";
import { usePermissions } from "@/features/permissions";
import { getMenuById, updateMenuStatus, disableMenu } from "../services/menuServices";
import { showSuccessAlert, showErrorAlert, showDisableAlert } from "@/shared/services/alertService";

export default function ViewMenu() {
  const { id } = useParams();
  return <DishDetails key={id} id={id} />;
}

function DishDetails({ id }) {
  const { can } = usePermissions();
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    let active = true;
    getMenuById(id)
      .then((data) => {
        if (!active) return;
        setDish(data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        console.error("Error al cargar platillo:", err);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const handleToggleStatus = async () => {
    if (!dish) return;
    try {
      const nextStatus = !dish.isActive;
      await updateMenuStatus(dish.id, nextStatus);
      setDish((prev) => ({ ...prev, isActive: nextStatus }));
      await showSuccessAlert({
        title: nextStatus ? "Platillo habilitado" : "Platillo deshabilitado",
        text: `El estado de ${dish.menuName} cambió a ${nextStatus ? "Habilitado" : "Deshabilitado"}.`,
        timer: 2000,
      });
    } catch (err) {
      await showErrorAlert({
        title: "Error",
        text: err.message || "No se pudo cambiar el estado del platillo.",
      });
    }
  };

  const handleDisableDish = async () => {
    if (!dish) return;
    const confirm = await showDisableAlert({
      title: "¿Deshabilitar platillo?",
      text: `¿Deseas deshabilitar ${dish.menuName}?`,
      confirmButtonText: "Sí, deshabilitar",
    });
    if (!confirm.isConfirmed) return;

    try {
      await disableMenu(dish.id);
      setDish((prev) => ({ ...prev, isActive: false }));
      await showSuccessAlert({
        title: "Platillo deshabilitado",
        text: `${dish.menuName} fue deshabilitado correctamente.`,
        timer: 2000,
      });
    } catch (err) {
      await showErrorAlert({
        title: "Error",
        text: err.message || "No se pudo deshabilitar el platillo.",
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

  if (!dish) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-clear text-text-secondary">
        <p className="text-title font-title font-heading text-text-primary">
          Platillo no encontrado
        </p>
      </div>
    );
  }

  const hasValidImage = Boolean(dish.menuImage) && !imgError;

  return (
    <div className="contenedor-1 mx-auto min-h-screen max-w-410 px-4 py-5 font-title text-medium text-text-coffee min-[801px]:px-8 min-[801px]:py-7">
      <Breadcrumbs
        items={[
          { label: "Inicio", to: "/dashboard/home" },
          { label: "Menú", to: "/dashboard/menuList" },
          { label: "Visualizar platillo" },
        ]}
      />

      {/* HEADER */}
      <header className="contenedor-2 mt-5 mb-6 flex flex-col items-start justify-between gap-5 min-[801px]:flex-row min-[801px]:items-center">
        <div className="flex min-w-0 items-center gap-3">
          <div>
            <h1 className="text-title leading-tight font-medium-custom tracking-tight text-text-primary min-[501px]:text-[28px] min-[801px]:text-[35px]">
              Visualizar Platillo
            </h1>
            <p className="mt-1 text-medium text-text-coffee">
              Consulta la información detallada del platillo, su categoría, precio y estado en el menú.
            </p>
          </div>
        </div>

        <Link to="/dashboard/menuList">
          <Button className="inline-flex min-h-10 w-full items-center justify-center rounded-[10px] border border-brand px-5 py-2.5 text-medium font-medium-custom text-text-coffee transition-colors hover:bg-border-clear2/60 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand">
            Volver a la lista
          </Button>
        </Link>
      </header>

      {/* TARJETA PRINCIPAL */}
      <section className="contenedor-3 bg-background-positive/72 border border-solid border-background-clear rounded-xl shadow-[0_4px_18px] shadow-text-coffee/3 p-5 mb-6">
        <div className="contenedor-4 grid items-center gap-5 min-[501px]:grid-cols-[auto_minmax(0,1fr)] min-[1151px]:grid-cols-[auto_minmax(0,1.65fr)_minmax(145px,0.7fr)_minmax(170px,1fr)]">
          {/* IMAGEN */}
          <div className="contenedor-5 shrink-0">
            {hasValidImage ? (
              <img
                src={dish.menuImage}
                alt={dish.menuName}
                onError={() => setImgError(true)}
                className="size-27.5 rounded-full bg-background-clear object-cover min-[501px]:size-36"
              />
            ) : (
              <div className="flex size-27.5 items-center justify-center rounded-full bg-border-clear2 text-brand-hover min-[501px]:size-36">
                <Utensils size={45} />
              </div>
            )}
          </div>

          {/* INFORMACIÓN PRINCIPAL */}
          <div className="contenedor-6 min-w-0">
            <h2 className="contenedor-6.1 mb-2 text-title leading-tight font-medium-custom tracking-tight text-text-primary wrap-anywhere min-[801px]:text-[29px]">
              {dish.menuName}
            </h2>

            <div className="contenedor-6.2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-border-clear2 text-brand-hover text-small font-normal mb-4">
              <Tag size={20} />
              {dish.category || "Platillo"}
            </div>

            <div className="contenedor-6.3 space-y-3 text-medium text-text-secondary wrap-anywhere">
              <div className="flex items-center gap-2">
                <DollarSign size={20} className="shrink-0 text-text-brand" />
                <span>Precio: ${dish.price || "0"}</span>
              </div>

              <div className="flex items-center gap-2">
                <Utensils size={20} className="shrink-0 text-text-brand" />
                <span>Categoría: {dish.category || "No registrada"}</span>
              </div>
            </div>
          </div>

          {/* ID */}
          <div className="self-stretch border-background-clear min-[1151px]:border-l min-[1151px]:pl-6">
            <p className="text-small text-text-muted mb-2">
              ID de platillo
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-background-clear/75">
              <Hash size={20} className="text-text-secondary" />

              <span className="text-small font-medium-custom text-text-coffee">
                MNU-{String(dish.id).padStart(5, "0")}
              </span>
            </div>
          </div>

          {/* ESTADO */}
          <div className="self-stretch border-background-clear min-[1151px]:border-l min-[1151px]:pl-6">
            <p className="text-small text-text-muted mb-2">
              Estado del platillo
            </p>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-medium font-medium-custom ${
                dish.isActive
                  ? "bg-surface-muted/55 text-text-secondary"
                  : "bg-brand-soft/30 text-text-coffee"
              }`}
            >
              <span className="order-last size-2.5 rounded-full bg-current"></span>
              {dish.isActive ? "Habilitado" : "Deshabilitado"}
            </span>
          </div>
        </div>
      </section>

      {/* PESTAÑAS */}
      <div className="my-4 overflow-x-auto rounded-xl border border-background-clear bg-background-positive/68 px-1">
        <div className="flex items-center">
          <div className="flex shrink-0 items-center gap-2 whitespace-nowrap border-b-3 border-brand px-4 py-3.5 font-medium-custom text-text-brand min-[801px]:gap-4 min-[801px]:px-6">
            <Utensils size={20} />
            Información General
          </div>

        </div>
      </div>

      {/* CONTENIDO */}
      <div className="grid grid-cols-1 gap-4 min-[801px]:grid-cols-[minmax(0,1.86fr)_minmax(280px,1fr)]">
        {/* COLUMNA PRINCIPAL */}
        <div className="min-w-0 space-y-4">
          {/* DATOS DEL PLATILLO */}
          <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">
            <div className="mb-5 flex items-center gap-4">
              <Utensils size={20} className="shrink-0 text-text-brand" />

              <div>
                <h2 className="text-body font-medium-custom text-text-primary">
                  Datos del platillo
                </h2>

                <p className="text-medium text-text-secondary">
                  Información general del menú
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-x-9 gap-y-6 min-[501px]:grid-cols-2">
              {/* NOMBRE DEL PLATILLO */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <Utensils
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">
                    Nombre del platillo
                  </p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {dish.menuName || "No registrado"}
                  </p>
                </div>
              </div>

              {/* PRECIO */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <DollarSign
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
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

              {/* CATEGORÍA */}
              <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">
                <Tag
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">
                    Categoría
                  </p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {dish.category || "No registrada"}
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
                    {dish.isActive ? "Habilitado" : "Deshabilitado"}
                  </p>
                </div>
              </div>

              {/* DESCRIPCIÓN */}
              <div className="flex min-w-0 items-start gap-3 min-[501px]:col-span-2 [&>div]:min-w-0">
                <FileText
                  className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                  size={20}
                />

                <div>
                  <p className="text-small text-text-muted">
                    Descripción
                  </p>

                  <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                    {dish.description || "No registrada"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA */}
        <div className="min-w-0 space-y-4">
          {/* IMAGEN DEL PLATILLO */}
          <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">
            <div className="flex items-center gap-3 mb-5">
              <Image size={20} className="shrink-0 text-text-brand" />

              <h2 className="text-body font-medium-custom text-text-primary">
                Imagen del platillo
              </h2>
            </div>

            <div className="w-full aspect-square rounded-xl overflow-hidden border border-background-clear bg-background-clear/45 flex items-center justify-center">
              {hasValidImage ? (
                <img
                  src={dish.menuImage}
                  alt={dish.menuName}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-medium text-text-muted">
                  Sin imagen registrada
                </div>
              )}
            </div>
          </div>

          {/* ACCIONES */}
          {(can("menu", "edit") || can("menu", "delete")) && (
            <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">
              <div className="flex flex-col gap-2.5">
                {can("menu", "edit") && (
                  <>
                    <Link to={`/dashboard/menuEdit/${dish.id}`}>
                      <Button className="flex min-h-10 w-full items-center rounded-lg border border-background-clear bg-border-clear2/30 px-4 py-2.5 text-left text-medium text-text-coffee transition-colors hover:bg-border-clear2/70 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand">
                        <span className="flex w-full items-center gap-4 [&>svg]:shrink-0 [&>svg]:text-text-brand">
                          <Edit size={20} />
                          Actualizar menú
                        </span>
                      </Button>
                    </Link>

                    <Button onClick={handleToggleStatus}>
                      <span className="flex items-center justify-center gap-2">
                        <ToggleRight size={20} />
                        Cambiar estado
                      </span>
                    </Button>
                  </>
                )}

                {can("menu", "delete") && (
                  <Button onClick={handleDisableDish}>
                    <span className="flex items-center justify-center gap-2">
                      <Ban size={20} />
                      Deshabilitar platillo
                    </span>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}