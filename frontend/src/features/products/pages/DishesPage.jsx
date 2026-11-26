import { useEffect, useState } from "react";
import Card from "@/shared/components/Card";
import MenuRowActions from "@/features/menu/components/MenuRowActions";
import DishCategories from "../components/DishCategories";
import DishPagination from "../components/DishPagination";
import { products } from "../data/products";
import { getProducts } from "../services/productServices";
import { usePermissions } from "@/features/permissions";

const PAGE_SIZE = 10;

export default function DishesPage() {
  const { can } = usePermissions();
  const canManageDish = can("menu", "edit") || can("menu", "delete");
  const [catalog, setCatalog] = useState(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const [category, setCategory] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    let request = 0;
    const loadProducts = async () => {
      const current = ++request;
      try {
        const data = await getProducts();
        if (current === request) {
          setCatalog(data);
          setLoadFailed(false);
        }
      } catch {
        if (current === request) setLoadFailed(true);
      }
    };

    loadProducts();
    window.addEventListener("menu:updated", loadProducts);
    return () => {
      request++;
      window.removeEventListener("menu:updated", loadProducts);
    };
  }, []);

  const showingExamples = loadFailed && catalog === null;
  const dishes = catalog ?? (showingExamples ? products : []);
  const counts = new Map();
  for (const dish of dishes) {
    counts.set(dish.category, (counts.get(dish.category) ?? 0) + 1);
  }

  const selectedCategory = counts.has(category) ? category : null;
  const filtered = selectedCategory === null ? dishes : dishes.filter((dish) => dish.category === selectedCategory);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  function selectCategory(nextCategory) {
    setCategory(nextCategory);
    setPage(1);
  }

  return (
    <section className="mx-auto flex max-w-(--breakpoint-2xl) flex-col gap-5 px-3 py-5 text-text-primary sm:px-6 in-[.dark]:bg-background-inverse in-[.dark]:text-text-inverse" aria-labelledby="dishes-title">
      <h1 id="dishes-title" className="sr-only">Platillos</h1>
      <DishCategories counts={counts} total={dishes.length} selected={selectedCategory} onSelect={selectCategory} />

      {loadFailed && (
        <p role="status" className="text-small">
          {showingExamples ? "No se pudo cargar el menú. Se muestran platillos de ejemplo." : "No se pudo actualizar el menú. Se muestran los últimos datos cargados."}
        </p>
      )}

      {visible.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visible.map((dish) => (
              <Card
                 key={dish.id}
                product={dish}
                actions={
                  catalog !== null && canManageDish && (
                    <MenuRowActions product={{ ...dish, menuName: dish.title }} catalog />
                  )
                }
              />
            ))}
          </div>
          <DishPagination page={currentPage} pageCount={pageCount} start={start + 1} end={start + visible.length} total={filtered.length} onChange={setPage} />
        </>
      ) : (
        <p role="status" className="py-8 text-center text-medium">{catalog === null ? "Cargando platillos…" : "No hay platillos disponibles."}</p>
      )}
    </section>
  );
}
