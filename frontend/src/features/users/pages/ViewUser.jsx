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

import { Button } from "@/shared";
import { users } from "../data/users";

export default function UserViewPage() {
  const { id } = useParams();

  const user = users.find((item) => item.id === Number(id));

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-title font-heading text-text-primary">
          Usuario no encontrado
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
            <div className="flex items-center gap-3">

              <div>

                <h1 className="text-main font-heading text-text-primary">
                  Visualizar usuario
                </h1>

              </div>

            </div>
          </div>

          <Link to="/dashboard/userList">
            <Button>
              Volver a la lista
            </Button>
          </Link>

        </div>


        {/* TARJETA PRINCIPAL */}
        <div className="bg-brand-light rounded-2xl shadow-md p-6 mb-5">

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">

            {/* FOTO */}
            <div className="flex-shrink-0">

              <img
                src={user.userImage}
                alt="Foto del usuario"
                className="w-32 h-32 object-cover rounded-full border-4 border-black"
              />

            </div>


            {/* INFORMACIÓN */}
            <div className="flex-1">

              <h2 className="text-title font-heading text-text-secondary mb-2">
                {user.userName}
              </h2>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand text-text-inverse text-small font-body mb-4">

                <Shield size={20} />

                {user.isSuperUser
                  ? "Administrador"
                  : "Usuario"}

              </div>

              <div className="space-y-2 text-body text-text-secondary">

                <div className="flex items-center gap-2">

                  <Mail
                    size={20}
                    className="text-brand"
                  />

                  <span>{user.userEmail}</span>

                </div>

                <div className="flex items-center gap-2">

                  <Phone
                    size={20}
                    className="text-brand"
                  />

                  <span>{user.userPhone}</span>

                </div>

              </div>

            </div>


            {/* ID */}
            <div className="lg:border-l lg:pl-8 min-w-[150px] border-border">

              <p className="text-small text-text-secondary mb-2">
                ID de usuario
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface">

                <Hash
                  size={20}
                  className="text-text-secondary"
                />

                <span className="text-small font-body text-text-secondary">
                  USR-{String(user.id).padStart(5, "0")}
                </span>

              </div>

            </div>


            {/* ESTADO */}
            <div className="lg:border-l lg:pl-8 min-w-[150px] border-border">

              <p className="text-small text-text-secondary mb-2">
                Estado de la cuenta
              </p>

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-small font-body bg-brand text-text-inverse">

                <span className="w-2 h-2 rounded-full bg-text-inverse"></span>

                {user.isActive ? "Activo" : "Inactivo"}

              </span>

            </div>

          </div>

        </div>


        {/* PESTAÑAS */}
        <div className="bg-brand-light rounded-2xl shadow-md mb-5">

          <div className="flex items-center">

            <div className="px-6 py-4 text-text-secondary flex items-center gap-2">

              <User size={20} />

              Información General

            </div>

            <div className="px-6 py-4 text-text-secondary flex items-center gap-2">

              <Shield size={20} />

              Roles y Permisos

            </div>

          </div>

        </div>


        {/* CONTENIDO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* COLUMNA PRINCIPAL */}
          <div className="lg:col-span-2 space-y-5">

            {/* DATOS PERSONALES */}
            <div className="bg-brand-light rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 pb-4 mb-6">

                <User
                  size={20}
                  className="text-brand"
                />

                <div>

                  <h2 className="font-heading text-title text-text-secondary">
                    Datos personales
                  </h2>

                  <p className="text-body text-text-secondary">
                    Información personal del usuario
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

                {/* NOMBRE */}
                <div className="flex gap-3">

                  <User
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Nombre completo
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {user.userName || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* TIPO DOCUMENTO */}
                <div className="flex gap-3">

                  <FileText
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Tipo de documento
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {user.userDocumentType || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* DOCUMENTO */}
                <div className="flex gap-3">

                  <FileText
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Documento de identidad
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {user.userDocumentNumber || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CORREO */}
                <div className="flex gap-3">

                  <Mail
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Correo electrónico
                    </p>

                    <p className="text-body font-body mt-1 break-all text-text-secondary">
                      {user.userEmail || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CONFIRMACIÓN CORREO */}
                <div className="flex gap-3">

                  <Mail
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Confirmación correo electrónico
                    </p>

                    <p className="text-body font-body mt-1 break-all text-text-secondary">
                      {user.confirmEmail || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* TELÉFONO */}
                <div className="flex gap-3">

                  <Phone
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Teléfono
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {user.userPhone || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* SEGUNDO TELÉFONO */}
                <div className="flex gap-3">

                  <Phone
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Segundo teléfono
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {user.secondUserPhone || "No registrado"}
                    </p>

                  </div>

                </div>

              </div>

            </div>


            {/* DATOS DE LA EMPRESA */}
            <div className="bg-brand-light rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 pb-4 mb-6">

                <Shield
                  size={20}
                  className="text-brand"
                />

                <div>

                  <h2 className="font-heading text-title text-text-secondary">
                    Datos de la empresa
                  </h2>

                  <p className="text-body text-text-secondary">
                    Información laboral del usuario
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

                {/* CORREO EMPRESARIAL */}
                <div className="flex gap-3">

                  <Mail
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Correo electrónico empresarial
                    </p>

                    <p className="text-body font-body mt-1 break-all text-text-secondary">
                      {user.businessEmail || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CONFIRMACIÓN CORREO EMPRESARIAL */}
                <div className="flex gap-3">

                  <Mail
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Confirmación correo electrónico empresarial
                    </p>

                    <p className="text-body font-body mt-1 break-all text-text-secondary">
                      {user.confirmBusinessEmail || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* FECHA INICIO LABORAL */}
                <div className="flex gap-3">

                  <Calendars
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Fecha inicio laboral
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {user.workStartDate || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* FECHA FIN LABORAL */}
                <div className="flex gap-3">

                  <Calendars
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Fecha fin laboral
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {user.workEndDate || "No registrado"}
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

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {user.isActive ? "Activo" : "Inactivo"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* COLUMNA DERECHA */}
          <div className="space-y-5">

            {/* ROL */}
            <div className="bg-brand-light rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 mb-5">

                <h2 className="font-heading text-title text-text-secondary">
                  Rol asignado
                </h2>

              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand text-text-inverse font-body text-small">

                <Shield size={20} />

                {user.isSuperUser
                  ? "Administrador"
                  : "Usuario"}

              </div>

            </div>


            {/* ACCIONES */}
            <div className="bg-brand-light rounded-2xl shadow-md px-8 p-4">

              <div className="flex flex-col gap-1.5">

                <Link to={`/dashboard/users/${user.id}/edit`}>
                  <Button>
                    <span className="flex items-center justify-center gap-2">

                      <Edit size={20} />

                      Editar usuario

                    </span>
                  </Button>
                </Link>


                <Button>
                  <span className="flex items-center justify-center gap-2">

                    <ToggleRight size={20} />

                    Cambiar estado

                  </span>
                </Button>


                <Button>
                  <span className="flex items-center justify-center gap-2">

                    <Ban size={20} />

                    Desactivar usuario

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

