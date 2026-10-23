const Card = ({ product }) => {
  const { title, image, price, description } = product;

  return (
    <div
      className="
        w-72
        shrink-0
        overflow-hidden
        rounded-[26px]
        border-2
        border-orange-500/50
        bg-gradient-to-b
        from-orange-950
        to-[#401500]
        text-white
        shadow-lg
        shadow-orange-950/20
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-orange-400/80
        hover:shadow-xl
        hover:shadow-orange-950/40
      "
    >
      {/* Imagen del producto */}
      <div className="flex h-48 items-center justify-center px-3 pt-4">
        <img
          src={image}
          alt={title}
          className="
            h-full
            w-full
            object-contain
            drop-shadow-[0_8px_12px_rgba(0,0,0,0.35)]
          "
        />
      </div>

      {/* Información del producto */}
      <div className="space-y-2 px-5 pb-6 pt-3">
        <span className="block text-sm font-bold text-orange-400">
          Burger
        </span>

        <h2 className="text-[28px] font-extrabold leading-tight tracking-tight">
          {title}
        </h2>

        <p className="text-base leading-relaxed text-orange-50/80">
          {description}
        </p>

        <p className="pt-2 text-[30px] font-extrabold leading-none text-orange-500">
          ${Number(price).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </div>
    </div>
  );
};

export default Card;