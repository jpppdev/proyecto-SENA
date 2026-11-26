export default function OrderSection({ id, icon, title, children }) {
  return (
    <section aria-labelledby={id} className="min-w-0 rounded-3xl border border-border-clear/40 bg-background-div/80 p-4 shadow-sm sm:p-5 [.dark_&]:border-border-strong [.dark_&]:bg-background-inverse">
      <h2 id={id} className="mb-4 flex items-center gap-3 text-subtitle font-heading sm:text-title">
        <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center rounded-xl bg-linear-to-b from-brand to-brand-hover text-text-inverse shadow-sm">
          {icon}
        </span>
        {title}
      </h2>
      {children}
    </section>
  );
}
