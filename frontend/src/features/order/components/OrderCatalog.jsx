import { useState } from "react";
import { LayoutGrid, Plus, Search } from "lucide-react";
import { Button, Select } from "@/shared";
import OrderProductImage from "./OrderProductImage";
import OrderSection from "./OrderSection";

const normalize = (text) => text.normalize("NFD").replace(/\p{M}/gu, "").toLocaleLowerCase("es");
const getCategory = (product) => product.category || "General";

export default function OrderCatalog({ menu, error, disabled, formatPrice, onAdd, onRetry }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const categories = [...new Set((menu ?? []).map(getCategory))];
  const activeCategory = !menu || categories.includes(category) ? category : "";
  const query = normalize(search.trim());
  const visibleProducts = menu?.filter((product) =>
    (!activeCategory || getCategory(product) === activeCategory) &&
    normalize(product.menuName).includes(query)
  );

  return (
    <OrderSection id="order-catalog-heading" icon="2" title="Agregar Productos">
      <div className="grid gap-2.5 sm:grid-cols-[2fr_1fr]">
        <div className="relative min-w-0">
          <Search size={19} aria-hidden="true" className="pointer-events-none absolute left-3 top-2.5 text-text-secondary" />
          <input
            type="search"
            aria-label="Buscar producto"
            placeholder="Buscar producto (ej. hamburguesa, pizza…)"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => { if (event.key === "Enter") event.preventDefault(); }}
            className="form-field-create-control pl-9"
          />
        </div>
        <Select
          variant="create"
          htmlFor="order-category"
          label={<span className="sr-only">Categoría de productos</span>}
          placeholder="Todas las categorías"
          value={activeCategory}
          disabled={!menu?.length}
          onChange={(event) => setCategory(event.target.value)}
          options={categories.map((name) => ({ label: name, value: name }))}
        />
      </div>
      {!!categories.length && (
        <div role="group" aria-label="Filtrar por categoría" className="mt-3 flex flex-wrap gap-2">
          {["", ...categories].map((name) => (
            <Button
              key={name}
              aria-pressed={activeCategory === name}
              onClick={() => setCategory(name)}
              className={`inline-flex min-h-9 items-center gap-2 rounded-full border px-3 py-1 text-medium font-medium-custom focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${activeCategory === name ? "border-brand-hover bg-linear-to-b from-brand to-brand-hover text-text-inverse shadow-sm" : "border-border-clear hover:border-brand"}`}
            >
              {!name && <LayoutGrid size={16} aria-hidden="true" />}
              {name || "Todos"}
            </Button>
          ))}
        </div>
      )}
      {error ? (
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p role="alert" className="text-medium text-error [.dark_&]:text-brand-soft">{error}</p>
          <Button onClick={onRetry} className="rounded-lg border border-brand px-3 py-1 text-medium">Reintentar</Button>
        </div>
      ) : visibleProducts?.length ? (
        <ul className="mt-5 grid grid-cols-[repeat(auto-fill,minmax(min(100%,9rem),1fr))] gap-3">
          {visibleProducts.map((product) => (
            <li key={product.id} className="flex min-w-0 flex-col overflow-hidden rounded-xl border border-border-clear/45 bg-background-div shadow-sm [.dark_&]:border-border-strong [.dark_&]:bg-background-inverse">
              <OrderProductImage src={product.menuImage} className="aspect-[2/1]" />
              <div className="flex flex-1 flex-col gap-1 px-2.5 py-2">
                <h3 className="break-words text-medium leading-tight font-medium-custom">{product.menuName}</h3>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-1">
                  <span className="text-body font-heading text-text-brand [.dark_&]:text-brand-soft">{formatPrice(product.price)}</span>
                  <Button
                    aria-label={`Agregar ${product.menuName}`}
                    disabled={disabled}
                    onClick={() => onAdd(product)}
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-b from-brand to-brand-hover text-text-inverse shadow-sm enabled:hover:bg-brand-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:opacity-50"
                  >
                    <Plus size={20} aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p role="status" className="mt-5 text-medium">{!menu ? "Cargando menú…" : menu.length ? "No se encontraron productos." : "No hay productos activos."}</p>
      )}
    </OrderSection>
  );
}
