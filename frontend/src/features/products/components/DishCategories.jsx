import { CakeSlice, Coffee, Grid2X2, Soup, Utensils } from "lucide-react";

const categoryIcons = [
  [/bebida|café|jugo/i, Coffee],
  [/postre/i, CakeSlice],
  [/entrada|pasta|sopa/i, Soup],
];

export default function DishCategories({ counts, total, selected, onSelect }) {
  const categories = [[null, total], ...counts];

  return (
    <div role="group" aria-label="Categorías de platillos" className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map(([category, count]) => {
        const active = category === selected;
        const Icon = category === null ? Grid2X2 : categoryIcons.find(([pattern]) => pattern.test(category))?.[1] ?? Utensils;

        return (
          <button
            key={category ?? ""}
            type="button"
            aria-pressed={active}
            onClick={() => onSelect(category)}
            className={`flex min-h-11 min-w-0 items-center gap-2 rounded-xl border px-2 py-1 text-left text-small font-medium-custom shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring ${active ? "border-brand bg-brand text-text-success hover:bg-brand-hover" : "border-border-clear2 bg-background-div text-text-primary hover:bg-brand-soft [.dark_&]:border-border-strong [.dark_&]:bg-background-inverse [.dark_&]:text-text-inverse"}`}
          >
            <Icon size={17} aria-hidden="true" className={`shrink-0 ${active ? "text-current" : "text-text-brand [.dark_&]:text-brand-soft"}`} />
            <span className="min-w-0 flex-1 wrap-break-word">{category ?? "Todos"}</span>
            <span className="shrink-0 rounded-full bg-background-clear px-1.5 py-0.5 text-text-coffee">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
