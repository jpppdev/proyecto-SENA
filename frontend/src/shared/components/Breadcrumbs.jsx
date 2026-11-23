import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export default function Breadcrumbs({ items = [] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Ruta de navegación"
      className="mb-4 text-[14px] text-text-coffee font-medium-custom"
      style={{ fontFamily: "Helvetica, Arial, sans-serif" }}
    >
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => {
          const isCurrentPage = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight aria-hidden="true" className="h-4 w-4 text-text-muted" />
              )}
              {item.to && !isCurrentPage ? (
                <Link
                  to={item.to}
                  className="hover:underline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={isCurrentPage ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
