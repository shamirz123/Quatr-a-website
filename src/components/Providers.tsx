"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import Preloader from "./Preloader";
import Cursor from "./Cursor";
import BagDrawer from "./BagDrawer";
import type { BagItem } from "@/data/perfumes";

gsap.registerPlugin(ScrollTrigger);

export interface GoOptions {
  text?: string;
  color?: string;
  ink?: string;
  x?: number;
  y?: number;
}

interface TransitionValue {
  go: (href: string, options?: GoOptions) => void;
  lenis: Lenis | null;
  bag: number;
  items: BagItem[];
  addToBag: (item: Omit<BagItem, "qty">) => void;
  setQty: (id: string, qty: number) => void;
  clearBag: () => void;
  bagOpen: boolean;
  setBagOpen: (open: boolean) => void;
}

const TransitionCtx = createContext<TransitionValue>({
  go: () => {},
  lenis: null,
  bag: 0,
  items: [],
  addToBag: () => {},
  setQty: () => {},
  clearBag: () => {},
  bagOpen: false,
  setBagOpen: () => {},
});
export const usePageTransition = () => useContext(TransitionCtx);

export default function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const veil = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLSpanElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const busy = useRef(false);
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [items, setItems] = useState<BagItem[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const loaded = useRef(false);
  const bag = items.reduce((n, i) => n + i.qty, 0);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("q-bag") ?? "[]");
      if (Array.isArray(saved)) setItems(saved.filter((i) => i && typeof i.id === "string" && i.qty > 0));
    } catch {}
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem("q-bag", JSON.stringify(items));
    } catch {}
  }, [items]);

  const addToBag = useCallback((item: Omit<BagItem, "qty">) => {
    setItems((list) => {
      const found = list.find((i) => i.id === item.id);
      if (found) return list.map((i) => (i.id === item.id ? { ...i, qty: Math.min(i.qty + 1, 9) } : i));
      return [...list, { ...item, qty: 1 }];
    });
    setToast(`${item.name} is in your bag`);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3200);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    setItems((list) => (qty <= 0 ? list.filter((i) => i.id !== id) : list.map((i) => (i.id === id ? { ...i, qty: Math.min(qty, 9) } : i))));
  }, []);

  const clearBag = useCallback(() => setItems([]), []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const l = new Lenis({ lerp: 0.1, wheelMultiplier: 0.95, touchMultiplier: 1.2 });
    lenisRef.current = l;
    setLenis(l);

    l.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      l.destroy();
      lenisRef.current = null;
    };
  }, []);

  const go = useCallback(
    (href: string, { text = "", color = "#1f3a2e", ink = "#f3f3ef", x, y }: GoOptions = {}) => {
      const v = veil.current;
      const tt = title.current;
      if (!v || !tt || busy.current) return;
      if (href === pathname) {
        lenisRef.current?.scrollTo(0);
        return;
      }
      busy.current = true;
      document.body.style.pointerEvents = "none";
      tt.textContent = text;

      const cx = x ?? innerWidth / 2;
      const cy = y ?? innerHeight / 2;
      const r = Math.hypot(Math.max(cx, innerWidth - cx), Math.max(cy, innerHeight - cy));

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        router.push(href);
        return;
      }

      gsap
        .timeline()
        .set(v, { visibility: "visible", yPercent: 0, backgroundColor: color, color: ink, clipPath: `circle(0px at ${cx}px ${cy}px)` })
        .to(v, { clipPath: `circle(${r}px at ${cx}px ${cy}px)`, duration: 0.85, ease: "power3.inOut" })
        .fromTo(tt, { yPercent: 110 }, { yPercent: 0, duration: 0.6, ease: "power3.out" }, 0.35)
        .add(() => router.push(href), 0.9);
    },
    [pathname, router]
  );

  useEffect(() => {
    const l = lenisRef.current;
    if (l) l.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);

    document.body.style.pointerEvents = "";
    const t = setTimeout(() => ScrollTrigger.refresh(), 120);
    if (!busy.current) return () => clearTimeout(t);

    gsap
      .timeline({ delay: 0.15, onComplete: () => void (busy.current = false) })
      .to(title.current, { yPercent: -110, duration: 0.45, ease: "power3.in" })
      .to(veil.current, { yPercent: -100, duration: 0.85, ease: "power4.inOut" }, 0.2)
      .set(veil.current, { visibility: "hidden", yPercent: 0 });

    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => setBagOpen(false), [pathname]);

  return (
    <TransitionCtx.Provider value={{ go, lenis, bag, items, addToBag, setQty, clearBag, bagOpen, setBagOpen }}>
      <Preloader />
      <Cursor />
      {children}
      <div ref={veil} aria-hidden="true" className="invisible fixed inset-0 z-[90] grid place-items-center overflow-hidden px-gutter">
        <span className="block overflow-hidden pb-[0.1em]">
          <span ref={title} className="block text-center text-mega font-semibold [font-stretch:80%]" />
        </span>
      </div>
      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-5 left-1/2 z-[80] flex max-w-[calc(100vw-2.5rem)] -translate-x-1/2 items-center gap-3 rounded-full bg-grove py-3 pr-6 pl-3 text-sm text-chalk shadow-[0_0.75rem_2rem_-0.75rem_rgb(31_58_46/0.5)] transition-[opacity,translate] duration-500 ease-q ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <span aria-hidden="true" className="grid size-6 shrink-0 place-items-center rounded-full bg-sun text-xs text-grove">
          ✓
        </span>
        <span className="truncate">{toast}</span>
        <button
          type="button"
          tabIndex={toast ? 0 : -1}
          onClick={() => {
            setToast("");
            setBagOpen(true);
          }}
          className="ml-1 shrink-0 rounded-full bg-chalk px-3 py-1 text-xs font-medium text-grove"
        >
          View bag
        </button>
      </div>
      <BagDrawer />
    </TransitionCtx.Provider>
  );
}
