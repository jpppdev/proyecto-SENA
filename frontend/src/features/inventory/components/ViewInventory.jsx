import { Link, useParams } from "react-router-dom";
import {
  Package,
  Tag,
  Barcode,
  User,
  Boxes,
  AlertTriangle,
  DollarSign,
  ToggleRight,
  Layers,
  Calendar,
  FileText,
  MapPin,
  Hash,
  Image,
} from "lucide-react";

import { Button } from "@/shared";
import { inventory } from "../data/inventory";

export default function InventoryViewPage() {
  const { id } = useParams();

  const product = inventory.find(
    (product) => String(product.id) === String(id)
  );

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--color-surface)]">
        <p className="text-title font-[var(--font-weight-bold)] text-[color:var(--color-text-primary)]">
          Producto no encontrado
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
            <h1 className="text-main font-[var(--font-weight-bold)] text-[color:var(--color-text-primary)]">
              Visualizar Inventario
            </h1>
          </div>

          <Link to="/dashboard/inventoryList">
            <Button>
              Volver a la lista
            </Button>
          </Link>

        </div>


        {/* TARJETA PRINCIPAL */}
        <div className="bg-[color:var(--color-brand-light)] rounded-2xl shadow-md p-6 mb-5">

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">

            {/* IMAGEN */}
            <div className="flex-shrink-0">

              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-[var(--black)] bg-[color:var(--color-surface)] flex items-center justify-center">

                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    size={32}
                    className="text-[color:var(--color-text-secondary)]"
                  />
                )}

              </div>

            </div>


            {/* INFORMACIÓN PRINCIPAL */}
            <div className="flex-1">

              <h2 className="text-title font-[var(--font-weight-bold)] text-[color:var(--color-text-secondary)] mb-2">
                {product.productName}
              </h2>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[color:var(--color-brand)] text-[color:var(--color-text-inverse)] text-small font-[var(--font-weight-regular)]">

                <ToggleRight size={20} />

                {product.status || "No registrado"}

              </div>

            </div>


            {/* ID */}
            <div className="lg:border-l lg:pl-8 min-w-[150px] border-[color:var(--color-border)]">

              <p className="text-small text-[color:var(--color-text-secondary)] mb-2">
                ID del producto
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[color:var(--color-surface)]">

                <Hash
                  size={20}
                  className="text-[color:var(--color-text-secondary)]"
                />

                <span className="text-small font-[var(--font-weight-regular)] text-[color:var(--color-text-secondary)]">
                  {product.id}
                </span>

              </div>

            </div>


            {/* CANTIDAD TOTAL */}
            <div className="lg:border-l lg:pl-8 min-w-[150px] border-[color:var(--color-border)]">

              <p className="text-small text-[color:var(--color-text-secondary)] mb-2">
                Cantidad total
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[color:var(--color-surface)]">

                <Boxes
                  size={20}
                  className="text-[color:var(--color-text-secondary)]"
                />

                <span className="text-small font-[var(--font-weight-regular)] text-[color:var(--color-text-secondary)]">
                  {product.totalQuantity ?? product.quantity}
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* PESTAÑAS */}
        <div className="bg-[color:var(--color-brand-light)] rounded-2xl shadow-md mb-5">

          <div className="flex items-center">

            <div className="px-6 py-4 text-[color:var(--color-text-secondary)] flex items-center gap-2">
              <Package size={20} />
              Información general
            </div>

            <div className="px-6 py-4 text-[color:var(--color-text-secondary)] flex items-center gap-2">
              <Layers size={20} />
              Lote
            </div>

          </div>

        </div>


        {/* CONTENIDO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* INFORMACIÓN DEL PRODUCTO */}
          <div className="lg:col-span-2">

            <div className="bg-[color:var(--color-brand-light)] rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 pb-4 mb-6">

                <Package
                  size={20}
                  className="text-[color:var(--color-brand)]"
                />

                <div>

                  <h2 className="font-[var(--font-weight-bold)] text-title text-[color:var(--color-text-secondary)]">
                    Datos del producto
                  </h2>

                  <p className="text-body text-[color:var(--color-text-secondary)]">
                    Información general del producto
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

                {/* ID */}
                <div className="flex gap-3">

                  <Hash
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      ID
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.id || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* MARCA */}
                <div className="flex gap-3">

                  <Tag
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Marca
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.brand || "No registrada"}
                    </p>

                  </div>

                </div>


                {/* NOMBRE */}
                <div className="flex gap-3">

                  <Package
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Nombre del producto
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.productName || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CÓDIGO DE BARRAS */}
                <div className="flex gap-3">

                  <Barcode
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Código de barras
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 break-all text-[color:var(--color-text-secondary)]">
                      {product.barCode || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CUENTADANTE */}
                <div className="flex gap-3">

                  <User
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Cuentadante
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.custodian || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CANTIDAD */}
                <div className="flex gap-3">

                  <Boxes
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Cantidad
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.quantity ?? "No registrada"}
                    </p>

                  </div>

                </div>


                {/* CANTIDAD TOTAL */}
                <div className="flex gap-3">

                  <Boxes
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Cantidad total
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.totalQuantity ?? product.quantity ?? "No registrada"}
                    </p>

                  </div>

                </div>


                {/* CANTIDAD MÍNIMA */}
                <div className="flex gap-3">

                  <AlertTriangle
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Cantidad mínima
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.minimumQuantity ?? "No registrada"}
                    </p>

                  </div>

                </div>


                {/* VALOR UNITARIO */}
                <div className="flex gap-3">

                  <DollarSign
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Valor unitario
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.unitValue !== undefined
                        ? `$${Number(product.unitValue).toLocaleString("es-CO")}`
                        : "No registrado"}
                    </p>

                  </div>

                </div>


                {/* VALOR TOTAL */}
                <div className="flex gap-3">

                  <DollarSign
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Valor total
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.totalValue !== undefined
                        ? `$${Number(product.totalValue).toLocaleString("es-CO")}`
                        : "No registrado"}
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

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.status || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* LOTE */}
                <div className="flex gap-3">

                  <Layers
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Lote
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.lot ?? "No registrado"}
                    </p>

                  </div>

                </div>


                {/* FECHA DE VENCIMIENTO */}
                <div className="flex gap-3">

                  <Calendar
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Fecha de vencimiento
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.expirationDate || "No registrada"}
                    </p>

                  </div>

                </div>


                {/* DESCRIPCIÓN */}
                <div className="flex gap-3 md:col-span-2">

                  <FileText
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Descripción
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 break-all text-[color:var(--color-text-secondary)]">
                      {product.description || "No registrada"}
                    </p>

                  </div>

                </div>


                {/* UBICACIÓN */}
                <div className="flex gap-3">

                  <MapPin
                    className="text-[color:var(--color-brand)] mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-[color:var(--color-text-secondary)]">
                      Ubicación
                    </p>

                    <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                      {product.location || "No registrada"}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>


          {/* IMAGEN Y LOTE */}
          <div className="space-y-5">

            {/* IMAGEN */}
            <div className="bg-[color:var(--color-brand-light)] rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 mb-5">

                <Image
                  size={20}
                  className="text-[color:var(--color-brand)]"
                />

                <h2 className="font-[var(--font-weight-bold)] text-title text-[color:var(--color-text-secondary)]">
                  Imagen del producto
                </h2>

              </div>


              <div className="w-full aspect-square rounded-xl overflow-hidden border border-[color:var(--color-border)] bg-[color:var(--color-surface)] flex items-center justify-center">

                {product.image ? (

                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <p className="text-body text-[color:var(--color-text-secondary)]">
                    Sin imagen registrada
                  </p>

                )}

              </div>

            </div>


            {/* LOTE */}
            <div className="bg-[color:var(--color-brand-light)] rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 mb-5">

                <Layers
                  size={20}
                  className="text-[color:var(--color-brand)]"
                />

                <h2 className="font-[var(--font-weight-bold)] text-title text-[color:var(--color-text-secondary)]">
                  Información del lote
                </h2>

              </div>


              <div className="space-y-4">

                <div>

                  <p className="text-small text-[color:var(--color-text-secondary)]">
                    Lote
                  </p>

                  <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                    {product.lot ?? "No registrado"}
                  </p>

                </div>


                <div>

                  <p className="text-small text-[color:var(--color-text-secondary)]">
                    Estado del lote
                  </p>

                  <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                    {product.status || "No registrado"}
                  </p>

                </div>


                <div>

                  <p className="text-small text-[color:var(--color-text-secondary)]">
                    Vencimiento
                  </p>

                  <p className="text-body font-[var(--font-weight-regular)] mt-1 text-[color:var(--color-text-secondary)]">
                    {product.expirationDate || "No registrada"}
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

