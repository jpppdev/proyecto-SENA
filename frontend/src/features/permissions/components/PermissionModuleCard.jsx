import { Checkbox } from "@/shared";

export default function PermissionModuleCard({
  module,
  currentModulePerms,
  onTogglePermission,
  onSelectAllModule,
}) {
  const allSelected = currentModulePerms.length === module.actions.length;

  return (
    <div className="bg-background-div/40 rounded-3xl p-6 shadow-sm border border-border/50 flex flex-col gap-4 transition-all hover:bg-background-div/50">
      <div className="flex items-center justify-between border-b border-border-clear pb-3">
        <div className="flex items-center gap-3 text-text-primary font-extrabold text-lg">
          <div className="bg-brand p-2 rounded-xl text-text-inverse shadow-md">
            {module.icon}
          </div>
          {module.name}
        </div>
      </div>

      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={() => onSelectAllModule(module.id, !allSelected)}
          className="text-xs font-bold text-text-coffee hover:text-text-primary underline transition-colors"
        >
          {allSelected ? "Desmarcar todos" : "Seleccionar todos"}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {module.actions.map((action) => (
          <div
            key={action.key}
            className="flex items-center justify-between bg-background-div/75 p-3 rounded-xl border border-border/80"
          >
            <span className="text-sm font-semibold text-text-negative">
              {action.label}
            </span>
            <Checkbox
              id={`${module.id}-${action.key}`}
              name={`${module.id}-${action.key}`}
              label=""
              checked={currentModulePerms.includes(action.key)}
              onChange={() => onTogglePermission(module.id, action.key)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
