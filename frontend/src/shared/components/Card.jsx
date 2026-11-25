export default function Card({ product, actions }) {
  const { title, image, price, description, isActive } = product;

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border-clear2 bg-background-div shadow-sm transition-shadow hover:shadow-md [.dark_&]:border-border-strong [.dark_&]:bg-background-inverse">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-background-clear">
        <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover" />
        {typeof isActive === "boolean" && (
          <span className={`absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-background-positive px-2 py-1 text-small font-medium-custom ${isActive ? "text-success" : "text-error"}`}>
            {isActive ? "Activo" : "Inactivo"}
            <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3">
        <h2 className="text-body leading-tight font-medium-custom text-text-primary [.dark_&]:text-text-inverse">{title}</h2>
        <p className="mb-1 text-small leading-snug text-text-secondary [.dark_&]:text-text-inverse">{description}</p>
        <p className="mt-auto text-subtitle leading-tight font-medium-custom text-text-brand [.dark_&]:text-brand-soft">
          ${price.toLocaleString("es-CO")}
        </p>
        {actions}
      </div>
    </article>
  );
}
