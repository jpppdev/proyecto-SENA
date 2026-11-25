export default function ListPageHeader({ title, description, children }) {
  return (
    <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-text-primary text-main font-title font-heading">{title}</h1>
        <p className="mt-1 text-medium text-text-secondary sm:text-body">{description}</p>
      </div>

      <div className="flex flex-wrap items-center gap-4">{children}</div>
    </header>
  );
}
