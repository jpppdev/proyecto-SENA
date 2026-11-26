import { useState } from "react";
import { Utensils } from "lucide-react";

export default function OrderProductImage({ src, className }) {
  const [failedSource, setFailedSource] = useState(null);

  return (
    <div className={`grid shrink-0 place-items-center overflow-hidden bg-background-clear text-text-coffee ${className}`}>
      {src && src !== failedSource ? (
        <img src={src} alt="" loading="lazy" className="size-full object-cover" onError={() => setFailedSource(src)} />
      ) : (
        <Utensils size={18} aria-hidden="true" />
      )}
    </div>
  );
}
