import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  User,
  Shield,
  Mail,
  Phone,
  FileText,
  Hash,
  Edit,
  Ban,
  ToggleRight,
  Calendars,
} from "lucide-react";

import { Button, Breadcrumbs } from "@/shared";
import { getUserById} from "../services/userServices";

export default function UserViewPage() {
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserById(id)
      .then((data) => {
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar el usuario:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background-clear text-text-secondary">Cargando datos...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-clear text-text-secondary">
        <p className="text-title font-title font-heading text-text-primary">
          Usuario no encontrado
        </p>
      </div>
    );
  }

return (
  <div className="contenedor-1 mx-auto min-h-screen max-w-410 px-4 py-5 font-title text-medium text-text-coffee min-[801px]:px-8 min-[801px]:py-7">
    <Breadcrumbs items={[{ label: "Inicio", to: "/dashboard/home" }, { label: "Usuarios", to: "/dashboard/userList" }, { label: "Visualizar usuario" }]} />
    {/* HEADER */}
    <header className="contenedor-2 mt-5 mb-6 flex flex-col items-start justify-between gap-5 min-[801px]:flex-row min-[801px]:items-center">

      <div className="flex min-w-0 items-center gap-3">
        <div>
          <h1 className="text-title leading-tight font-medium-custom tracking-tight text-text-primary min-[501px]:text-[28px] min-[801px]:text-[35px]">
            Visualizar usuario
          </h1>
          <p className="mt-1 text-medium text-text-coffee">Consulta la información detallada del usuario y su estado en el sistema.</p>
        </div>
      </div>

      <Link to="/dashboard/userList">
        <Button className="inline-flex min-h-10 w-full items-center justify-center rounded-[10px] border border-brand px-5 py-2.5 text-medium font-medium-custom text-text-coffee transition-colors hover:bg-border-clear2/60 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand">
          Volver a la lista
        </Button>
      </Link>

    </header>


    {/* TARJETA PRINCIPAL */}
    <section className="
        contenedor-3
        bg-background-positive/72
        border border-solid
        border-background-clear
        rounded-xl
        shadow-[0_4px_18px] shadow-text-coffee/3
        p-5
        mb-6">

      {/* contenedor que tiene la primera information, tiene 4 contenedores */}
      <div className="contenedor-4 grid items-center gap-5 min-[501px]:grid-cols-[auto_minmax(0,1fr)] min-[1151px]:grid-cols-[auto_minmax(0,1.65fr)_minmax(145px,0.7fr)_minmax(170px,1fr)]">

        {/* FOTO */}
        <div className=" contenedor-5 shrink-0">

          <img
            src={user.userImage}
            alt="Foto del usuario"
            className="size-27.5 rounded-full bg-background-clear object-cover min-[501px]:size-36"
          />
        </div>


        {/* INFORMACIÓN */}
        <div className="contenedor-6 min-w-0">

          {/* nombre del usuario */}
          <h2 className="contenedor-6.1 mb-2 text-title leading-tight font-medium-custom tracking-tight text-text-primary wrap-anywhere min-[801px]:text-[29px]">
            {user.userName}
          </h2>

          {/* contenedor del rol */}
          <div className="contenedor-6.2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-border-clear2 text-brand-hover text-small font-normal mb-4">
                <Shield size={20} />

                {user.isSuperUser
                  ? "Administrador"
                  : "Usuario"}
          </div>

          <div className="contenedor-6.3 space-y-3 text-medium text-text-secondary wrap-anywhere">

            {/* contenedor del correo electrónico */}
            <div className="flex items-center gap-2">
              <Mail
                  size={20}
                  className="shrink-0 text-text-brand"
                  />
                <span>{user.userEmail}</span>
            </div>

            {/* contenedor del numero telefónico */}
            <div className="flex items-center gap-2">
              <Phone
                  size={20}
                  className="shrink-0 text-text-brand"
                  />
              <span>{user.userPhone}</span>

            </div>

          </div>

        </div>


            {/* ID */}
            <div className="self-stretch border-background-clear min-[1151px]:border-l min-[1151px]:pl-6">

              <p className="text-small text-text-muted mb-2">
                ID de usuario
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-background-clear/75">

                <Hash
                  size={20}
                  className="text-text-secondary"
                />

                <span className="text-small font-medium-custom text-text-coffee">
                  USR-{String(user.id).padStart(5, "0")}
                </span>

              </div>

            </div>


            {/* ESTADO */}
            <div className="self-stretch border-background-clear min-[1151px]:border-l min-[1151px]:pl-6">

              <p className="text-small text-text-muted mb-2">
                Estado de la cuenta
              </p>

              <span className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-medium font-medium-custom ${user.isActive ? "bg-surface-muted/55 text-text-secondary" : "bg-brand-soft/30 text-text-coffee"}`}>

                <span className="order-last size-2.5 rounded-full bg-current"></span>

                {user.isActive ? "Activo" : "Inactivo"}

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

            <div className="flex shrink-0 items-center gap-2 whitespace-nowrap border-b-3 border-transparent px-4 py-3.5 text-text-coffee [&>svg]:text-text-brand min-[801px]:gap-4 min-[801px]:px-6">

              <Shield size={20} />

              Roles y Permisos

            </div>

          </div>

        </div>


        {/* CONTENIDO */}
        <div className="grid grid-cols-1 gap-4 min-[801px]:grid-cols-[minmax(0,1.86fr)_minmax(280px,1fr)]">

          {/* COLUMNA PRINCIPAL */}
          <div className="min-w-0 space-y-4">

            {/* DATOS PERSONALES */}
            <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">

              <div className="mb-5 flex items-center gap-4">

                <User
                  size={20}
                  className="shrink-0 text-text-brand"
                />

                <div>

                  <h2 className="text-body font-medium-custom text-text-primary">
                    Datos personales
                  </h2>

                  <p className="text-medium text-text-secondary">
                    Información personal del usuario
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
                      Nombre completo
                    </p>

                    <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                      {user.userName || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* TIPO DOCUMENTO */}
                <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">

                  <FileText
                    className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-muted">
                      Tipo de documento
                    </p>

                    <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                      {user.userDocumentType || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* DOCUMENTO */}
                <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">

                  <FileText
                    className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-muted">
                      Documento de identidad
                    </p>

                    <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                      {user.userDocumentNumber || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CORREO */}
                <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">

                  <Mail
                    className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-muted">
                      Correo electrónico
                    </p>

                    <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                      {user.userEmail || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CONFIRMACIÓN CORREO */}
                <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">

                  <Mail
                    className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-muted">
                      Confirmación correo electrónico
                    </p>

                    <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                      {user.confirmEmail || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* TELÉFONO */}
                <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">

                  <Phone
                    className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-muted">
                      Teléfono
                    </p>

                    <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                      {user.userPhone || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* SEGUNDO TELÉFONO */}
                <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">

                  <Phone
                    className="box-content shrink-0 rounded-full bg-border-clear2/45 p-2 text-text-brand"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-muted">
                      Segundo teléfono
                    </p>

                    <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                      {user.secondUserPhone || "No registrado"}
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* DATOS DE LA EMPRESA */}
            <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">

              <div className="mb-5 flex items-center gap-4">

                <Shield
                  size={20}
                  className="shrink-0 text-text-brand"
                />

                <div>

                  <h2 className="text-body font-medium-custom text-text-primary">
                    Datos de la empresa
                  </h2>

                  <p className="text-medium text-text-secondary">
                    Información laboral del usuario
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 gap-x-5 gap-y-4 min-[501px]:grid-cols-2">

                {/* CORREO EMPRESARIAL */}
                <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">

                  <Mail
                    className="shrink-0 text-text-brand"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-muted">
                      Correo electrónico empresarial
                    </p>

                    <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                      {user.businessEmail || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CONFIRMACIÓN CORREO EMPRESARIAL */}
                <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">

                  <Mail
                    className="shrink-0 text-text-brand"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-muted">
                      Confirmación correo electrónico empresarial
                    </p>

                    <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                      {user.confirmBusinessEmail || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* FECHA INICIO LABORAL */}
                <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">

                  <Calendars
                    className="shrink-0 text-text-brand"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-muted">
                      Fecha inicio laboral
                    </p>

                    <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                      {user.workStartDate || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* FECHA FIN LABORAL */}
                <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">

                  <Calendars
                    className="shrink-0 text-text-brand"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-muted">
                      Fecha fin laboral
                    </p>

                    <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                      {user.workEndDate || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* ESTADO */}
                <div className="flex min-w-0 items-start gap-3 [&>div]:min-w-0">

                  <ToggleRight
                    className="shrink-0 text-text-brand"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-muted">
                      Estado
                    </p>

                    <p className="mt-1 text-medium text-text-secondary wrap-anywhere">
                      {user.isActive ? "Activo" : "Inactivo"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* COLUMNA DERECHA */}
          <div className="min-w-0 space-y-4">

            {/* ROL */}
            <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">

              <div className="flex items-center gap-3 mb-5">

                <h2 className="text-body font-medium-custom text-text-primary">
                  Rol asignado
                </h2>

              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-border-clear2 text-brand-hover font-normal text-small">

                <Shield size={20} />

                {user.isSuperUser
                  ? "Administrador"
                  : "Usuario"}

              </div>

            </div>


            {/* ACCIONES */}
            <div className="rounded-xl border border-background-clear bg-background-positive/72 p-5 shadow-[0_4px_18px] shadow-text-coffee/3">

              <div className="flex flex-col gap-2.5">

                <Link to={`/dashboard/users/${user.id}/edit`}>
                  <Button className="flex min-h-10 w-full items-center rounded-lg border border-background-clear bg-border-clear2/30 px-4 py-2.5 text-left text-medium text-text-coffee transition-colors hover:bg-border-clear2/70 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand">
                    <span className="flex w-full items-center gap-4 [&>svg]:shrink-0 [&>svg]:text-text-brand">

                      <Edit size={20} />

                      Editar usuario

                    </span>
                  </Button>
                </Link>


                <Button className="flex min-h-10 w-full items-center rounded-lg border border-background-clear bg-border-clear2/30 px-4 py-2.5 text-left text-medium text-text-coffee transition-colors hover:bg-border-clear2/70 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand">
                  <span className="flex w-full items-center gap-4 [&>svg]:shrink-0 [&>svg]:text-text-brand">

                    <ToggleRight size={20} />

                    Cambiar estado

                  </span>
                </Button>


                <Button className="flex min-h-10 w-full items-center rounded-lg border border-background-clear bg-border-clear2/30 px-4 py-2.5 text-left text-medium text-text-coffee transition-colors hover:bg-border-clear2/70 focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-brand">
                  <span className="flex w-full items-center gap-4 [&>svg]:shrink-0 [&>svg]:text-text-brand">

                    <Ban size={20} />

                    Desactivar usuario

                  </span>
                </Button>

              </div>

            </div>

          </div>

        </div>

      </div>


  );
}

