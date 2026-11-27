import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/shared";
import { getOrderById } from "../services/orderServices";
import OrderForm from "./OrderForm";

export default function OrderEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(0);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getOrderById(id, controller.signal)
      .then((order) => {
        if (!controller.signal.aborted) setResult({ id, request, order });
      })
      .catch((error) => {
        if (!controller.signal.aborted) setResult({ id, request, error: error.message });
      });
    return () => controller.abort();
  }, [id, request]);

  const current = result?.id === id && result.request === request ? result : null;
  if (current?.order) return <OrderForm key={id} order={current.order} />;

  return (
    <section className="mx-auto w-full max-w-[1680px] space-y-4 p-6 text-text-primary [.dark_&]:text-text-inverse">
      <h1 className="text-title font-heading sm:text-main">Editar Orden #{id}</h1>
      {current?.error ? (
        <>
          <p role="alert">{current.error}</p>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => setRequest((previous) => previous + 1)}>Reintentar</Button>
            <Button variant="tertiary" onClick={() => navigate(-1)}>Volver a Órdenes</Button>
          </div>
        </>
      ) : (
        <p role="status">Cargando orden…</p>
      )}
    </section>
  );
}
