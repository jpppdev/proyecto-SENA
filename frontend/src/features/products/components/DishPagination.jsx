import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "@/shared/components/Button";

export default function DishPagination({ page, pageCount, start, end, total, onChange }) {
  const firstPage = Math.max(1, Math.min(page - 2, pageCount - 4));
  const pages = Array.from({ length: Math.min(5, pageCount) }, (_, index) => firstPage + index);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-clear2 pt-4 text-small text-text-secondary [.dark_&]:border-border-strong [.dark_&]:text-text-inverse">
      <p aria-live="polite">Mostrando {start}–{end} de {total} platillos</p>
      <nav aria-label="Páginas de platillos" className="flex flex-wrap items-center gap-1 [&_button]:px-2 [&_button]:focus-visible:outline-2 [&_button]:focus-visible:outline-focus-ring [&_button]:disabled:opacity-50 [&_button]:before:hidden [.dark_&]:[&_button:not([aria-current])]:text-text-inverse">
        <Button variant="tertiary" size="sm" aria-label="Página anterior" disabled={page === 1} onClick={() => onChange(page - 1)}>
          <ChevronLeft size={16} aria-hidden="true" />
        </Button>
        {pages.map((number) => (
          <Button key={number} variant={page === number ? "primary" : "tertiary"} size="sm" aria-label={`Página ${number}`} aria-current={page === number ? "page" : undefined} onClick={() => onChange(number)}>
            {number}
          </Button>
        ))}
        <Button variant="tertiary" size="sm" aria-label="Página siguiente" disabled={page === pageCount} onClick={() => onChange(page + 1)}>
          <ChevronRight size={16} aria-hidden="true" />
        </Button>
      </nav>
    </div>
  );
}
