import { useEffect, useState } from "react";
import { getInventory } from "@/features/inventory/services/inventoryServices";
import { getOrders } from "@/features/order/services/orderServices";

const refreshInterval = 60_000;

export default function useDashboardData() {
  const [orders, setOrders] = useState({ data: null, error: false });
  const [inventory, setInventory] = useState({ data: null, error: false });
  const [request, setRequest] = useState(0);

  useEffect(() => {
    let ordersRequest;
    let inventoryRequest;

    async function load(fetchData, setResult, signal) {
      try {
        const data = await fetchData(signal);
        if (!signal.aborted) setResult({ data, error: false });
      } catch {
        if (!signal.aborted) setResult((previous) => ({ ...previous, error: true }));
      }
    }

    function loadOrders() {
      ordersRequest?.abort();
      ordersRequest = new AbortController();
      return load(getOrders, setOrders, ordersRequest.signal);
    }

    function loadInventory() {
      inventoryRequest?.abort();
      inventoryRequest = new AbortController();
      return load(getInventory, setInventory, inventoryRequest.signal);
    }

    function refresh() {
      if (document.hidden) return;
      loadOrders();
      loadInventory();
    }

    refresh();
    const timer = window.setInterval(refresh, refreshInterval);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("orders:updated", loadOrders);
    window.addEventListener("inventory:updated", loadInventory);

    return () => {
      ordersRequest?.abort();
      inventoryRequest?.abort();
      window.clearInterval(timer);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("orders:updated", loadOrders);
      window.removeEventListener("inventory:updated", loadInventory);
    };
  }, [request]);

  return { orders, inventory, retry: () => setRequest((previous) => previous + 1) };
}
