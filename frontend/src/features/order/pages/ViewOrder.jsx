import { Link, useParams } from "react-router-dom";
import {
  Utensils,
  User,
  Hash,
  ClipboardList,
  MessageSquare,
  ToggleRight,
  Package,
} from "lucide-react";

import { Button } from "@/shared";
import { orders } from "../data/order";

export default function OrderViewPage() {
  const { id } = useParams();

  const order = orders.find((item) => String(item.id) === String(id));

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--color-background)]">
        <p className="text-title font-[var(--font-weight-bold)] text-[color:var(--color-text-primary)]">
          Orden no encontrada
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[url('/src/assets/images/imagen-fondo.png')] bg-cover bg-center p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <div>
            <h1 className="text-main font-[var(--font-weight-bold)] text-[color:var(--color-text-primary)]">
              Visualizar Orden
            </h1>
          </div>

          <Link to="/dashboard/orderList">
            <Button>
              Volver a la lista
            </Button>
          </Link>

        </div>


        {/* TARJETA PRINCIPAL */}
        <div className="bg-[color:var(--color-brand-light)] rounded-2xl shadow-md p-6 mb-5">

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">

            {/* NÚMERO DE ORDEN */}
            <div className="flex-1">

              <div className="flex items-center gap-3">

                <div>
                  <h2 className="text-title font-[var(--font-weight-bold)] text-[color:var(--color-text-secondary)]">
                    Orden #{order.id}
                  </h2>

                  <div className="flex items-center gap-2 mt-3">

                    <ClipboardList
                      size={20}
                      className="text-[color:var(--color-brand)]"
                    />

                    <span className="text-body text-[color:var(--color-text-secondary)]">
                      Información de la orden
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* ESTADO */}
            <div className="lg:border-l lg:pl-8 min-w-[180px] border-[color:var(--color-border)]">

              <p className="text-body text-[color:var(--color-text-secondary)] mb-2">
                Estado
              </p>

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-small font-[var(--font-weight-regular)] bg-[color:var(--color-brand)] text-[color:var(--color-text-inverse)]">

                <span className="w-2 h-2 rounded-full bg-[color:var(--color-text-inverse)]"></span>

                {order.status || "Activo"}

              </span>

            </div>

          </div>

        </div>


        {/* PESTAÑAS */}
        <div className="bg-[color:var(--color-brand-light)] rounded-2xl shadow-md mb-5">

          <div className="flex items-center">

            <div className="px-6 py-4 text-[color:var(--color-text-secondary)] flex items-center gap-2">

              <ClipboardList size={20} />

              Información general

            </div>

            <div className="px-6 py-4 text-[color:var(--color-text-secondary)] flex items-center gap-2">

              <Utensils size={20} />

              Platillos

            </div>

          </div>

        </div>


        {/* CONTENIDO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* INFORMACIÓN GENERAL */}
          <div className="lg:col-span-2">

            <div className="bg-[color:var(--color-brand-light)] rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 pb-4 mb-6">

                <ClipboardList
                  size={20}
                  className="text-[color:var(--color-brand)]"
                />

                <div>

                  <h2 className="font-[var(--font-weight-bold)] text-title text-[color:var(--color-text-secondary)]">
                    Datos de la orden
                  </h2>

                  <p className="text-body text-[color:var(--color-text-secondary)]">
                    Información general de la orden
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

                {/* NÚMERO DE MESA */}
                <div className="flex gap-3">

                  <Hash
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Número de mesa
                    </p>

                    <p className="font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {order.table || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* MESERO RESPONSABLE */}
                <div className="flex gap-3">

                  <User
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Mesero responsable
                    </p>

                    <p className="font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {order.waiter || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* ESTADO */}
                <div className="flex gap-3">

                  <ToggleRight
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Estado
                    </p>

                    <p className="font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {order.status || "Activo"}
                    </p>

                  </div>

                </div>


                {/* OBSERVACIONES */}
                <div className="flex gap-3">

                  <MessageSquare
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Observaciones especiales
                    </p>

                    <p className="font-[var(--font-weight-regular)] mt-1 break-all text-[color:var(--color-text-secondary)]">
                      {order.observations || "Sin observaciones"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* RESUMEN */}
          <div className="space-y-5">

            <div className="bg-[color:var(--color-brand-light)] rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 mb-5">

                <Utensils
                  size={20}
                  className="text-[color:var(--color-brand)]"
                />

                <h2 className="font-[var(--font-weight-bold)] text-title text-[color:var(--color-text-secondary)]">
                  Resumen
                </h2>

              </div>

              <div className="space-y-4">

                <div>

                  <p className="text-small text-[color:var(--color-text-secondary)]">
                    Número de orden
                  </p>

                  <p className="font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                    #{order.id}
                  </p>

                </div>


                <div>

                  <p className="text-small text-[color:var(--color-text-secondary)]">
                    Total de platillos
                  </p>

                  <p className="font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                    {order.dishes?.length || 0}
                  </p>

                </div>


                <div>

                  <p className="text-small text-[color:var(--color-text-secondary)]">
                    Total de la orden
                  </p>

                  <p className="font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                    ${order.total || "0"}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* PLATILLOS */}
        <div className="bg-[color:var(--color-brand-light)] rounded-2xl shadow-md p-6 mt-5">

          <div className="flex items-center gap-3 pb-4 mb-6">

            <Utensils
              size={20}
              className="text-[color:var(--color-brand)]"
            />

            <div>

              <h2 className="font-[var(--font-weight-bold)] text-title text-[color:var(--color-text-secondary)]">
                Platillos seleccionados
              </h2>

              <p className="text-body text-[color:var(--color-text-secondary)]">
                Platillos incluidos en la orden
              </p>

            </div>

          </div>


          <div className="space-y-4">

            {order.dishes.map((dish, index) => (

              <div
                key={index}
                className="border border-[color:var(--color-border)] rounded-lg p-4"
              >

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* PLATILLO */}
                  <div className="flex gap-3">

                    <Utensils
                      className="text-[color:var(--color-brand)] mt-1"
                      size={20}
                    />

                    <div>

                      <p className="text-small text-[color:var(--color-text-secondary)]">
                        Platillo
                      </p>

                      <p className="font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                        {dish.name || "No registrado"}
                      </p>

                    </div>

                  </div>


                  {/* CANTIDAD */}
                  <div className="flex gap-3">

                    <Package
                      className="text-[color:var(--color-brand)] mt-1"
                      size={20}
                    />

                    <div>

                      <p className="text-small text-[color:var(--color-text-secondary)]">
                        Cantidad
                      </p>

                      <p className="font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                        {dish.quantity || "No registrado"}
                      </p>

                    </div>

                  </div>


                  {/* PRECIO */}
                  <div className="flex gap-3">

                    <ClipboardList
                      className="text-[color:var(--color-brand)] mt-1"
                      size={20}
                    />

                    <div>

                      <p className="text-small text-[color:var(--color-text-secondary)]">
                        Precio
                      </p>

                      <p className="font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                        ${dish.price || "0"}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>
  );
}