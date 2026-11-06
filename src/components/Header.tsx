"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import TLink from "./TLink";
import Logo from "./Logo";
import { usePageTransition } from "./Providers";
import { perfumes } from "@/data/perfumes";

const nav = [
  { href: "/collection", label: "Collection" },
  { href: "/atelier", label: "Atelier" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const { bag, lenis, setBagOpen } = usePageTransition();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open, lenis]);

  useEffect(() => {
    let last = false;
    const onScroll = () => {
      const s = window.scrollY > 24;
      if (s === last) return;
      last = s;
      setScrolled(s);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const active = (href: string) => pathname.startsWith(href);
  const solid = scrolled || open;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b bg-chalk transition-[background-color,border-color] duration-500 ${
          solid ? "border-line" : "border-transparent tab:bg-chalk/0"
        }`}
      >
        <div className="flex h-16 items-center justify-between gap-6 px-gutter tab:h-[4.75rem]">
          <TLink href="/" text="quatréa" aria-label="Quatréa, home" className="relative z-10 text-[0.95rem]">
            <Logo />
          </TLink>

          <nav aria-label="Main" className="hidden items-center gap-1 tab:flex">
            {nav.map((l) => (
              <TLink
                key={l.href}
                href={l.href}
                text={l.label}
                aria-current={active(l.href) ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors duration-300 ${
                  active(l.href) ? "bg-grove text-chalk" : "hover:bg-grove/8"
                }`}
              >
                {l.label}
              </TLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 tab:flex" aria-hidden="true">
              {perfumes.map((p) => (
                <TLink
                  key={p.slug}
                  href={`/fragrance/${p.slug}`}
                  text={p.name}
                  color={p.color}
                  ink={p.ink}
                  tabIndex={-1}
                  title={`${p.name}, ${p.season.toLowerCase()}`}
                  className="block size-3 rounded-full ring-grove/30 transition-transform duration-300 hover:scale-150 hover:ring-1"
                  style={{ backgroundColor: p.color }}
                >
                  <span className="sr-only">{p.name}</span>
                </TLink>
              ))}
            </span>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setBagOpen(true);
              }}
              aria-label={`Open bag, ${bag} ${bag === 1 ? "item" : "items"}`}
              className="ml-3 flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[0.95rem] font-medium transition-colors duration-300 hover:border-grove"
            >
              Bag
              <span key={bag} className={`grid size-6 place-items-center rounded-full text-xs tabular-nums transition-colors ${bag ? "animate-rise bg-sun" : "bg-grove/8"}`}>
                {bag}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative grid size-10 place-items-center rounded-full bg-grove text-chalk tab:hidden"
            >
              <span className={`absolute h-0.5 w-4 rounded bg-current transition-transform duration-500 ease-q ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute h-0.5 w-4 rounded bg-current transition-transform duration-500 ease-q ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        id="mobile-menu"
        inert={!open}
        className={`fixed inset-x-0 top-16 bottom-0 z-40 flex flex-col overflow-y-auto bg-chalk px-gutter pt-6 pb-8 transition-[clip-path,visibility] duration-700 ease-q tab:hidden ${
          open ? "visible [clip-path:inset(0_0_0_0)]" : "invisible [clip-path:inset(0_0_100%_0)]"
        }`}
      >
        <nav aria-label="Mobile" className="grid">
          {[{ href: "/", label: "Home" }, ...nav].map((l, i) => (
            <TLink
              key={l.href}
              href={l.href}
              text={l.label}
              className={`border-b border-line py-3 text-d2 font-semibold [font-stretch:80%] transition-[opacity,translate] duration-700 ease-q short:py-1 short:text-2xl ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
            >
              {l.label}
            </TLink>
          ))}
        </nav>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-8">
          {perfumes.map((p) => (
            <TLink
              key={p.slug}
              href={`/fragrance/${p.slug}`}
              text={p.name}
              color={p.color}
              ink={p.ink}
              className="flex min-h-24 flex-col justify-between rounded-2xl p-4 short:min-h-16"
              style={{ backgroundColor: p.color, color: p.ink }}
            >
              <span className="text-sm opacity-80">{p.season}</span>
              <span className="text-xl font-semibold [font-stretch:80%]">{p.name}</span>
            </TLink>
          ))}
        </div>
      </div>
    </>
  );
}
