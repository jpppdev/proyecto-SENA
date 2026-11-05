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
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-title font-heading text-text-primary">
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
            <h1 className="text-main font-heading text-text-primary">
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
        <div className="bg-brand-light rounded-2xl shadow-md p-6 mb-5">

          <div className="flex flex-col lg:flex-row lg:items-center gap-6">

            {/* IMAGEN */}
            <div className="flex-shrink-0">

              <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-black bg-surface flex items-center justify-center">

                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    size={32}
                    className="text-text-secondary"
                  />
                )}

              </div>

            </div>


            {/* INFORMACIÓN PRINCIPAL */}
            <div className="flex-1">

              <h2 className="text-title font-heading text-text-secondary mb-2">
                {product.productName}
              </h2>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand text-text-inverse text-small font-body">

                <ToggleRight size={20} />

                {product.status || "No registrado"}

              </div>

            </div>


            {/* ID */}
            <div className="lg:border-l lg:pl-8 min-w-[150px] border-border">

              <p className="text-small text-text-secondary mb-2">
                ID del producto
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface">

                <Hash
                  size={20}
                  className="text-text-secondary"
                />

                <span className="text-small font-body text-text-secondary">
                  {product.id}
                </span>

              </div>

            </div>


            {/* CANTIDAD TOTAL */}
            <div className="lg:border-l lg:pl-8 min-w-[150px] border-border">

              <p className="text-small text-text-secondary mb-2">
                Cantidad total
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface">

                <Boxes
                  size={20}
                  className="text-text-secondary"
                />

                <span className="text-small font-body text-text-secondary">
                  {product.totalQuantity ?? product.quantity}
                </span>

              </div>

            </div>

          </div>

        </div>


        {/* PESTAÑAS */}
        <div className="bg-brand-light rounded-2xl shadow-md mb-5">

          <div className="flex items-center">

            <div className="px-6 py-4 text-text-secondary flex items-center gap-2">
              <Package size={20} />
              Información general
            </div>

            <div className="px-6 py-4 text-text-secondary flex items-center gap-2">
              <Layers size={20} />
              Lote
            </div>

          </div>

        </div>


        {/* CONTENIDO */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* INFORMACIÓN DEL PRODUCTO */}
          <div className="lg:col-span-2">

            <div className="bg-brand-light rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 pb-4 mb-6">

                <Package
                  size={20}
                  className="text-brand"
                />

                <div>

                  <h2 className="font-heading text-title text-text-secondary">
                    Datos del producto
                  </h2>

                  <p className="text-body text-text-secondary">
                    Información general del producto
                  </p>

                </div>

              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">

                {/* ID */}
                <div className="flex gap-3">

                  <Hash
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      ID
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {product.id || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* MARCA */}
                <div className="flex gap-3">

                  <Tag
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Marca
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {product.brand || "No registrada"}
                    </p>

                  </div>

                </div>


                {/* NOMBRE */}
                <div className="flex gap-3">

                  <Package
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Nombre del producto
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {product.productName || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CÓDIGO DE BARRAS */}
                <div className="flex gap-3">

                  <Barcode
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Código de barras
                    </p>

                    <p className="text-body font-body mt-1 break-all text-text-secondary">
                      {product.barCode || "No registrado"}
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

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {product.custodian || "No registrado"}
                    </p>

                  </div>

                </div>


                {/* CANTIDAD */}
                <div className="flex gap-3">

                  <Boxes
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Cantidad
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {product.quantity ?? "No registrada"}
                    </p>

                  </div>

                </div>


                {/* CANTIDAD TOTAL */}
                <div className="flex gap-3">

                  <Boxes
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Cantidad total
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {product.totalQuantity ?? product.quantity ?? "No registrada"}
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

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {product.minimumQuantity ?? "No registrada"}
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

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {product.unitValue !== undefined
                        ? `$${Number(product.unitValue).toLocaleString("es-CO")}`
                        : "No registrado"}
                    </p>

                  </div>

                </div>


                {/* VALOR TOTAL */}
                <div className="flex gap-3">

                  <DollarSign
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Valor total
                    </p>

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {product.totalValue !== undefined
                        ? `$${Number(product.totalValue).toLocaleString("es-CO")}`
                        : "No registrado"}
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
                      {product.status || "No registrado"}
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

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {product.lot ?? "No registrado"}
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

                    <p className="text-body font-body mt-1 text-text-secondary">
                      {product.expirationDate || "No registrada"}
                    </p>

                  </div>

                </div>


                {/* DESCRIPCIÓN */}
                <div className="flex gap-3 md:col-span-2">

                  <FileText
                    className="text-brand mt-1"
                    size={20}
                  />

                  <div>

                    <p className="text-small text-text-secondary">
                      Descripción
                    </p>

                    <p className="text-body font-body mt-1 break-all text-text-secondary">
                      {product.description || "No registrada"}
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

                    <p className="text-body font-body mt-1 text-text-secondary">
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
            <div className="bg-brand-light rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 mb-5">

                <Image
                  size={20}
                  className="text-brand"
                />

                <h2 className="font-heading text-title text-text-secondary">
                  Imagen del producto
                </h2>

              </div>


              <div className="w-full aspect-square rounded-xl overflow-hidden border border-border bg-surface flex items-center justify-center">

                {product.image ? (

                  <img
                    src={product.image}
                    alt={product.productName}
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <p className="text-body text-text-secondary">
                    Sin imagen registrada
                  </p>

                )}

              </div>

            </div>


            {/* LOTE */}
            <div className="bg-brand-light rounded-2xl shadow-md p-6">

              <div className="flex items-center gap-3 mb-5">

                <Layers
                  size={20}
                  className="text-brand"
                />

                <h2 className="font-heading text-title text-text-secondary">
                  Información del lote
                </h2>

              </div>


              <div className="space-y-4">

                <div>

                  <p className="text-small text-text-secondary">
                    Lote
                  </p>

                  <p className="text-body font-body mt-1 text-text-secondary">
                    {product.lot ?? "No registrado"}
                  </p>

                </div>


                <div>

                  <p className="text-small text-text-secondary">
                    Estado del lote
                  </p>

                  <p className="text-body font-body mt-1 text-text-secondary">
                    {product.status || "No registrado"}
                  </p>

                </div>


                <div>

                  <p className="text-small text-text-secondary">
                    Vencimiento
                  </p>

                  <p className="text-body font-body mt-1 text-text-secondary">
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

