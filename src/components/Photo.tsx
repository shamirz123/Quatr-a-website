"use client";

import { useEffect, useRef, useState, type HTMLAttributes } from "react";
import { photo, photoSet } from "@/data/perfumes";

type PhotoProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  alt: string;
  tone?: string;
  sizes?: string;
  priority?: boolean;
  imgClassName?: string;
  [data: `data-${string}`]: string | boolean | undefined;
};

export default function Photo({ id, alt, tone = "#d9d9d2", sizes = "100vw", priority, className = "", imgClassName = "", style, ...rest }: PhotoProps) {
  const img = useRef<HTMLImageElement>(null);
  const [state, setState] = useState<"wait" | "ok" | "fail">("wait");

  useEffect(() => {
    const el = img.current;
    if (el?.complete) setState(el.naturalWidth > 0 ? "ok" : "fail");
  }, [id]);

  const pos = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className) ? "" : "relative";

  return (
    <div className={`${pos} overflow-hidden ${className}`} style={{ backgroundColor: tone, ...style }} {...rest}>
      <img
        ref={img}
        src={photo(id, 1200)}
        srcSet={photoSet(id)}
        sizes={sizes}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        draggable={false}
        onLoad={() => setState("ok")}
        onError={() => setState("fail")}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-700 ${state === "ok" ? "opacity-100" : "opacity-0"} ${imgClassName}`}
      />
    </div>
  );
}
