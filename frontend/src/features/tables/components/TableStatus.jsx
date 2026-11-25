import { tableStatuses } from "./tableStyles";

export default function TableStatus({ status }) {
  const { label, icon: Icon, style } = tableStatuses[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-medium font-medium-custom ${style}`}>
      <Icon size={16} aria-hidden="true" />
      {label}
    </span>
  );
}
