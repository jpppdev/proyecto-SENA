import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button, SearchField } from "@/shared";
import ListPageHeader from "@/shared/components/ListPageHeader";
import { usePermissions } from "@/features/permissions";
import OrderCard from "../components/OrderCard";
import { OrderFilters, OrderStatistics } from "../components/OrderListControls";
import OrderPagination from "../components/OrderPagination";
import { describeOrder, matchesOrderFilter, matchesOrderSearch, numberFormat } from "../data/orderList";
import OrderReportConfigModal from "../reports/components/OrderReportConfigModal";
import { getOrders } from "../services/orderServices";

export default function OrderBoardPage() {
  const navigate = useNavigate();
  const { can } = usePermissions();
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [ordersData, setOrdersData] = useState(null);
  const [error, setError] = useState("");
  const [request, setRequest] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(6);

  useEffect(() => {
    let controller;
    async function loadOrders() {
      controller?.abort();
      controller = new AbortController();
      const { signal } = controller;
      try {
        const data = await getOrders(signal, { includeDetails: true });
        if (!signal.aborted) {
          setOrdersData(data);
          setError("");
        }
      } catch (loadError) {
        if (!signal.aborted) setError(loadError.message);
      }
    }
    loadOrders();
    window.addEventListener("orders:updated", loadOrders);
    window.addEventListener("focus", loadOrders);
    return () => {
      controller?.abort();
      window.removeEventListener("orders:updated", loadOrders);
      window.removeEventListener("focus", loadOrders);
    };
  }, [request]);

  const orders = ordersData?.map(describeOrder);
  const results = orders?.filter((order) => matchesOrderFilter(order, filter) && matchesOrderSearch(order, search)) ?? [];
  const pageCount = Math.ceil(results.length / pageSize);
  const currentPage = Math.min(page, Math.max(0, pageCount - 1));
  const pageOrders = results.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  return (
    <div className="mx-auto w-full max-w-[1680px] space-y-4 p-3 sm:p-6 text-text-primary [.dark_&]:text-text-inverse">
      <SearchField
        value={search}
        onChange={(value) => { setSearch(value); setPage(0); }}
        placeholder="Buscar órdenes, mesa o cliente…"
        ariaLabel="Buscar por número de orden, mesa o cliente"
        variant="outlined"
        fullWidth
        className="min-w-0 max-w-3xl rounded-full! border-border-clear/45! bg-background-div! shadow-sm [&_input]:min-w-0 [&_input]:placeholder-text-secondary! [&_svg]:text-text-brand! [.dark_&]:bg-background-inverse! [.dark_&]:[&_input]:placeholder-text-inverse!"
      />

      <section className="min-w-0 space-y-5 rounded-3xl border border-border-clear/35 bg-background-div/55 p-3 shadow-sm sm:p-5 lg:p-6 [.dark_&]:border-border-strong [.dark_&]:bg-background-inverse/80">
        <div className="[&_header]:mb-0 [&_header_h1]:text-title [&_header_h1]:sm:text-main [.dark_&]:[&_header_h1]:text-text-inverse [.dark_&]:[&_header_p]:text-text-inverse">
          <ListPageHeader
            title="Todas las órdenes"
            description={orders ? `${numberFormat.format(orders.length)} total` : "— total"}
          >
            <Button variant="tertiary" disabled={!orders?.length} onClick={() => setIsReportModalOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-border-clear px-3 text-medium font-medium-custom enabled:cursor-pointer enabled:hover:border-brand focus-visible:outline-2 focus-visible:outline-focus-ring disabled:opacity-50">
              <FileDown size={17} aria-hidden="true" /> Reportar orden
            </Button>
            {can("orders", "create") && (
              <Button onClick={() => navigate("/dashboard/orderCreate")} className="min-h-10 cursor-pointer rounded-xl bg-brand-hover px-3 text-medium font-medium-custom text-text-inverse hover:bg-text-coffee focus-visible:outline-2 focus-visible:outline-focus-ring">
                Crear orden
              </Button>
            )}
          </ListPageHeader>
        </div>

        <OrderStatistics orders={orders} />
        <OrderFilters orders={orders} filter={filter} onChange={(value) => { setFilter(value); setPage(0); }} />

        {error && (
          <div className="flex flex-wrap items-center gap-3">
            <p role="alert" className="text-medium text-error [.dark_&]:text-brand-soft">{error}</p>
            <Button variant="tertiary" onClick={() => setRequest((previous) => previous + 1)}>Reintentar</Button>
          </div>
        )}
        {pageOrders.length > 0 ? (
          <>
            <p className="sr-only" role="status">{numberFormat.format(results.length)} órdenes encontradas</p>
            <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {pageOrders.map((order) => <li key={order.id} className="min-w-0"><OrderCard order={order} /></li>)}
            </ul>
          </>
        ) : (
          <p role="status" className="rounded-2xl border border-border-clear/40 p-4 text-medium">
            {orders ? orders.length ? "No se encontraron órdenes con estos criterios." : "Todavía no hay órdenes registradas." : error ? "El listado de órdenes no está disponible." : "Cargando órdenes…"}
          </p>
        )}
        {results.length > 0 && (
          <OrderPagination
            page={currentPage}
            pageCount={pageCount}
            pageSize={pageSize}
            onPageChange={setPage}
            onSizeChange={(value) => { setPageSize(value); setPage(0); }}
          />
        )}
      </section>

      <OrderReportConfigModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        data={ordersData ?? []}
      />
    </div>
  );
}
