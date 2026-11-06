"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = dot.current;
    const lb = label.current;
    if (!el || !lb || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const x = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3" });
    let current = "";
    let shown = false;

    const move = (e: PointerEvent) => {
      if (!shown) {
        shown = true;
        gsap.set(el, { x: e.clientX, y: e.clientY });
        el.style.opacity = "1";
      }
      x(e.clientX);
      y(e.clientY);
    };

    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor]");
      const next = t?.dataset.cursor ?? "";
      if (next === current) return;
      current = next;
      lb.textContent = next;
      el.dataset.on = next ? "1" : "";
    };

    const leave = () => {
      shown = false;
      el.style.opacity = "0";
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", over, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", over);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={dot} aria-hidden="true" className="group pointer-events-none fixed top-0 left-0 z-[95] opacity-0 transition-opacity duration-300">
      <div className="grid size-24 -translate-x-1/2 -translate-y-1/2 scale-0 place-items-center rounded-full bg-grove text-sm font-medium text-chalk transition-transform duration-500 ease-q group-data-[on=1]:scale-100">
        <span ref={label} />
      </div>
    </div>
  );
}
