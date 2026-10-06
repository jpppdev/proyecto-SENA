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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-title font-heading text-text-primary">
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
            <h1 className="text-main font-heading text-text-primary">
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
        <div className="bg-brand-light rounded-2xl shadow-md p-6 mb-5">

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">

            {/* NÚMERO DE ORDEN */}
            <div className="flex-1">

              <div className="flex items-center gap-3">

                <div>
                  <h2 className="text-title font-heading text-text-secondary">
                    Orden #{order.id}
                  </h2>

                  <div className="flex items-center gap-2 mt-3">

                    <ClipboardList
                      size={20}
                      className="text-brand"
                    />

                    <span className="text-body text-text-secondary">
                      Información de la orden
                    </span>

                  </div>

                </div>

              </div>

            </div>


            {/* ESTADO */}
            <div className="lg:border-l lg:pl-8 min-w-[180px] border-border">

              <p className="text-body text-text-secondary mb-2">
                Estado
              </p>

              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-small font-body bg-brand text-text-inverse">

                <span className="w-2 h-2 rounded-full bg-text-inverse"></span>

                {order.status || "Activo"}

              </span>

            </div>

          </div>

        </div>


        {/* PESTAÑAS */}
        <div className="bg-brand-light rounded-2xl shadow-md mb-5">

          <div className="flex items-center">

            <div className="px-6 py-4 text-text-secondary flex items-center gap-2">

              <ClipboardList size={20} />

              Información general

            </div>

            <div className="px-6 py-4 text-text-secondary flex items-center gap-2">

              <Utensils size={20} />

              Platillos

            </div>

          </div>

        </div>


        {/* CONTENIDO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* INFORMACIÓN GENERAL */}
          <div className="lg:col-span-2">

            <div className="bg-brand-light rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 pb-4 mb-6">

                <ClipboardList
                  size={20}
                  className="text-brand"
                />

                <div>

                  <h2 className="font-heading text-title text-text-secondary">
                    Datos de la orden
                  </h2>

                  <p className="text-body text-text-secondary">
                    Información general de la orden
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

                {/* NÚMERO DE MESA */}
                <div className="flex gap-3">

                  <Hash
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Número de mesa
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {order.table || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* MESERO RESPONSABLE */}
                <div className="flex gap-3">

                  <User
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Mesero responsable
                    </p>

                    <p className="font-body mt-1 text-text-secondary">
                      {order.waiter || "No registrado"}
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
                      {order.status || "Activo"}
                    </p>

                  </div>

                </div>


                {/* OBSERVACIONES */}
                <div className="flex gap-3">

                  <MessageSquare
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Observaciones especiales
                    </p>

                    <p className="font-body mt-1 break-all text-text-secondary">
                      {order.observations || "Sin observaciones"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* RESUMEN */}
          <div className="space-y-5">

            <div className="bg-brand-light rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 mb-5">

                <Utensils
                  size={20}
                  className="text-brand"
                />

                <h2 className="font-heading text-title text-text-secondary">
                  Resumen
                </h2>

              </div>

              <div className="space-y-4">

                <div>

                  <p className="text-small text-text-secondary">
                    Número de orden
                  </p>

                  <p className="font-body mt-1 text-text-secondary">
                    #{order.id}
                  </p>

                </div>


                <div>

                  <p className="text-small text-text-secondary">
                    Total de platillos
                  </p>

                  <p className="font-body mt-1 text-text-secondary">
                    {order.dishes?.length || 0}
                  </p>

                </div>


                <div>

                  <p className="text-small text-text-secondary">
                    Total de la orden
                  </p>

                  <p className="font-body mt-1 text-text-secondary">
                    ${order.total || "0"}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* PLATILLOS */}
        <div className="bg-brand-light rounded-2xl shadow-md p-6 mt-5">

          <div className="flex items-center gap-3 pb-4 mb-6">

            <Utensils
              size={20}
              className="text-brand"
            />

            <div>

              <h2 className="font-heading text-title text-text-secondary">
                Platillos seleccionados
              </h2>

              <p className="text-body text-text-secondary">
                Platillos incluidos en la orden
              </p>

            </div>

          </div>


          <div className="space-y-4">

            {order.dishes.map((dish, index) => (

              <div
                key={index}
                className="border border-border rounded-lg p-4"
              >

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                  {/* PLATILLO */}
                  <div className="flex gap-3">

                    <Utensils
                      className="text-brand mt-1"
                      size={20}
                    />

                    <div>

                      <p className="text-small text-text-secondary">
                        Platillo
                      </p>

                      <p className="font-body mt-1 text-text-secondary">
                        {dish.name || "No registrado"}
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
                        {dish.quantity || "No registrado"}
                      </p>

                    </div>

                  </div>


                  {/* PRECIO */}
                  <div className="flex gap-3">

                    <ClipboardList
                      className="text-brand mt-1"
                      size={20}
                    />

                    <div>

                      <p className="text-small text-text-secondary">
                        Precio
                      </p>

                      <p className="font-body mt-1 text-text-secondary">
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

