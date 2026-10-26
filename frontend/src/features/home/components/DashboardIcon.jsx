import { ReceiptText, Hourglass, Package, ClipboardList, Truck, Utensils, Users } from "lucide-react";

const icons = { orders: ReceiptText, pending: Hourglass, inventory: Package, review: ClipboardList, provider: Truck, menu: Utensils, users: Users };
const tones = {
  orange: "bg-orange-100 text-orange-600",
  amber: "bg-amber-100 text-amber-600",
  red: "bg-red-100 text-red-600",
  purple: "bg-violet-100 text-violet-600",
};

export default function DashboardIcon({ name, tone = "orange" }) {
  const Icon = icons[name];
  return <span className={`inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tones[tone]}`}><Icon size={24} aria-hidden="true" /></span>;
}
