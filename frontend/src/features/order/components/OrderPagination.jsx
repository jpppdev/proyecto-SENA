import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared";

const pageSizes = [5, 6, 7, 10, 20, 50];
const buttonClass = "grid size-9 place-items-center rounded-xl border border-border-clear enabled:cursor-pointer enabled:hover:border-brand focus-visible:outline-2 focus-visible:outline-focus-ring disabled:opacity-40";

export default function OrderPagination({ page, pageCount, pageSize, onPageChange, onSizeChange }) {
  const actions = [
    { label: "Primera página", Icon: ChevronFirst, target: 0, disabled: page === 0 },
    { label: "Página anterior", Icon: ChevronLeft, target: page - 1, disabled: page === 0 },
    { label: "Página siguiente", Icon: ChevronRight, target: page + 1, disabled: page === pageCount - 1 },
    { label: "Última página", Icon: ChevronLast, target: pageCount - 1, disabled: page === pageCount - 1 },
  ];

  return (
    <nav aria-label="Paginación de órdenes" className="flex flex-wrap items-center justify-between gap-3 text-medium">
      <label className="inline-flex items-center gap-2">
        Órdenes por página
        <select value={pageSize} onChange={(event) => onSizeChange(Number(event.target.value))} className="form-field-create-control w-auto px-2">
          {pageSizes.map((size) => <option key={size}>{size}</option>)}
        </select>
      </label>
      {pageCount > 1 && (
        <div className="flex flex-wrap items-center gap-1.5">
          {actions.map(({ label, Icon, target, disabled }) => (
            <Button key={label} aria-label={label} title={label} disabled={disabled} onClick={() => onPageChange(target)} className={buttonClass}>
              <Icon size={17} aria-hidden="true" />
            </Button>
          ))}
          <label className="ml-1 inline-flex items-center gap-2">
            Página
            <select aria-label="Ir a página" value={page} onChange={(event) => onPageChange(Number(event.target.value))} className="form-field-create-control w-auto px-2">
              {Array.from({ length: pageCount }, (_, index) => <option key={index} value={index}>{index + 1}</option>)}
            </select>
            de {pageCount}
          </label>
        </div>
      )}
    </nav>
  );
}
