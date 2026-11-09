"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { usePathname } from "next/navigation";
import TLink from "./TLink";
import Logo from "./Logo";
import Bottle from "./Bottle";
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
            <SeasonMenu pathname={pathname} />
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setBagOpen(true);
              }}
              aria-label={`Open bag, ${bag} ${bag === 1 ? "item" : "items"}`}
              className="flex h-10 items-center gap-2 rounded-full border border-line px-4 text-[0.95rem] font-medium transition-colors duration-300 hover:border-grove"
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

function SeasonMenu({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      box.current?.querySelector<HTMLButtonElement>("button")?.focus();
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", key);
    };
  }, [open]);

  const hover = (on: boolean) => (e: ReactPointerEvent) => {
    if (e.pointerType !== "mouse") return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(on), on ? 60 : 220);
  };

  return (
    <div ref={box} className="relative hidden tab:block" onPointerEnter={hover(true)} onPointerLeave={hover(false)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="season-menu"
        className={`flex h-10 items-center gap-2.5 rounded-full border pr-3.5 pl-2.5 text-[0.95rem] font-medium transition-colors duration-300 ${
          open ? "border-grove bg-grove text-chalk" : "border-line hover:border-grove"
        }`}
      >
        <span aria-hidden="true" className="flex -space-x-1">
          {perfumes.map((p) => (
            <span key={p.slug} className={`size-3.5 rounded-full ring-2 transition-[box-shadow] ${open ? "ring-grove" : "ring-chalk"}`} style={{ backgroundColor: p.color }} />
          ))}
        </span>
        Seasons
        <svg aria-hidden="true" viewBox="0 0 12 12" className={`size-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </button>

      <div
        id="season-menu"
        inert={!open}
        className={`absolute top-full right-0 w-[22rem] pt-2 transition-[opacity,translate,visibility] duration-300 ease-q ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1.5 opacity-0"
        }`}
      >
        <ul className="grid gap-1 rounded-[1.25rem] border border-line bg-chalk p-2 shadow-[0_1.25rem_2.5rem_-1rem_rgb(31_58_46/0.3)]">
          {perfumes.map((p) => {
            const here = pathname === `/fragrance/${p.slug}`;
            return (
              <li key={p.slug}>
                <TLink
                  href={`/fragrance/${p.slug}`}
                  text={p.name}
                  color={p.color}
                  ink={p.ink}
                  aria-current={here ? "page" : undefined}
                  className={`group flex items-center gap-3 rounded-xl p-2 transition-colors duration-300 ${here ? "bg-grove/8" : "hover:bg-grove/5"}`}
                >
                  <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-lg" style={{ backgroundColor: p.color }}>
                    <Bottle liquid={p.liquid} name={p.name} no={p.no} shadow={false} className="h-9 transition-transform duration-500 ease-q group-hover:-translate-y-0.5 group-hover:rotate-[-6deg]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold [font-stretch:85%]">{p.name}</span>
                    <span className="block text-sm text-moss">
                      {p.season}, {p.months}
                    </span>
                  </span>
                  <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0 -translate-x-1 opacity-0 transition-[opacity,translate] duration-300 group-hover:translate-x-0 group-hover:opacity-100" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M2 8h12M9 3l5 5-5 5" />
                  </svg>
                </TLink>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
