export default function StatusBadge({
  label,
  tone = "success",
  onClick,
  title = "Haz clic para cambiar el estado",
  outlined = false,
  className = "",
}) {
  const tones = {
    success: outlined
      ? "bg-green-100 text-green-700 border border-green-200"
      : "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: outlined
      ? "bg-red-100 text-red-700 border border-red-200"
      : "bg-red-100 text-red-700",
  };

  const Component = onClick ? "button" : "span";

  return (
    <Component
      {...(onClick ? { type: "button", onClick, title } : {})}
      className={`rounded-full text-xs transition-opacity ${
        onClick ? "cursor-pointer hover:opacity-80" : ""
      } ${tones[tone] ?? tones.success} ${className || "px-2 py-1 font-semibold"}`}
    >
      {label}
    </Component>
  );
}
