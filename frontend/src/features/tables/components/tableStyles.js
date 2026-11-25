import { CalendarClock, CircleCheck, CircleHelp, UsersRound } from "lucide-react";

export const panelClass = "min-w-0 rounded-2xl border border-border-clear2 bg-background-div shadow-sm [.dark_&]:border-border-strong [.dark_&]:bg-background-inverse";
export const secondaryText = "text-text-secondary [.dark_&]:text-text-inverse";

export const tableStatuses = {
  available: { label: "Disponible", icon: CircleCheck, style: "bg-green-100 text-green-800" },
  occupied: { label: "Ocupada", icon: UsersRound, style: "bg-brand-soft/50 text-text-coffee" },
  reserved: { label: "Reservada", icon: CalendarClock, style: "bg-violet-100 text-violet-800" },
  unknown: { label: "Sin confirmar", icon: CircleHelp, style: "bg-background-clear text-text-coffee" },
};

export function formatMoney(amount) {
  return Number(amount).toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 });
}
