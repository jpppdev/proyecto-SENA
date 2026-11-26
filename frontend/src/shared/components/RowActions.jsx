import { Ban, Eye, Pencil } from "lucide-react";
import { IconButton } from "./IconButton";

export default function RowActions({ entity, onView, onEdit, onDisable }) {
  const viewLabel = `Visualizar ${entity}`;
  const editLabel = `Editar ${entity}`;
  const disableLabel = `Deshabilitar ${entity}`;

  return (
    <div className="flex gap-2">
      {onView && (
        <IconButton
          ariaLabel={viewLabel}
          title={viewLabel}
          variant="action"
          hitSize={46}
          iconSize={20}
          onClick={onView}
        >
          <Eye size={20} aria-hidden="true" />
        </IconButton>
      )}

      {onEdit && (
        <IconButton
          ariaLabel={editLabel}
          title={editLabel}
          variant="action"
          hitSize={46}
          iconSize={20}
          onClick={onEdit}
        >
          <Pencil size={20} aria-hidden="true" />
        </IconButton>
      )}

      {onDisable && (
        <button
          type="button"
          aria-label={disableLabel}
          title={disableLabel}
          onClick={onDisable}
          className="p-1 rounded hover:bg-brand-light text-red-600 transition-colors"
        >
          <Ban size={16} aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
