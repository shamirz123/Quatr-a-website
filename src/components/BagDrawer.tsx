"use client";

import { useEffect, useRef, useState } from "react";
import TLink from "./TLink";
import { Mark } from "./Logo";
import { usePageTransition } from "./Providers";
import Bottle from "./Bottle";
import { getPerfume, perfumes, setItem } from "@/data/perfumes";
import { btn } from "@/lib/ui";

const FREE_GIFT = 150;

export default function BagDrawer() {
  const { items, bag, setQty, clearBag, bagOpen, setBagOpen, addToBag, lenis } = usePageTransition();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const [order, setOrder] = useState<string | null>(null);

  const subtotal = items.reduce((n, i) => n + i.price * i.qty, 0);
  const hasSet = items.some((i) => i.id === setItem.id);
  const left = Math.max(0, FREE_GIFT - subtotal);

  useEffect(() => {
    if (!bagOpen) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const back = document.activeElement as HTMLElement | null;
    closeBtn.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setBagOpen(false);
      if (e.key !== "Tab" || !panel.current) return;
      const f = panel.current.querySelectorAll<HTMLElement>("button, a[href], input");
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.documentElement.style.overflow = "";
      back?.focus?.();
    };
  }, [bagOpen, lenis, setBagOpen]);

  useEffect(() => {
    if (!bagOpen) setOrder(null);
  }, [bagOpen]);

  const checkout = () => {
    setOrder(`Q${String(Date.now()).slice(-6)}`);
    clearBag();
  };

  return (
    <div className={`fixed inset-0 z-[85] transition-[visibility] ${bagOpen ? "visible" : "invisible delay-700"}`} inert={!bagOpen}>
      <button
        type="button"
        aria-label="Close bag"
        tabIndex={-1}
        onClick={() => setBagOpen(false)}
        className={`absolute inset-0 bg-grove/40 transition-opacity duration-500 ${bagOpen ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="bag-title"
        className={`absolute inset-y-0 right-0 flex w-full max-w-[28rem] flex-col bg-chalk shadow-[-1rem_0_3rem_-1rem_rgb(31_58_46/0.3)] transition-transform duration-700 ease-q tab:inset-y-3 tab:right-3 tab:rounded-[1.75rem] ${
          bagOpen ? "translate-x-0" : "translate-x-[105%]"
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-6 py-5">
          <h2 id="bag-title" className="text-2xl font-semibold [font-stretch:85%]">
            Your bag <span className="text-moss tabular-nums">({bag})</span>
          </h2>
          <button
            ref={closeBtn}
            type="button"
            onClick={() => setBagOpen(false)}
            aria-label="Close bag"
            className="relative grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-grove"
          >
            <span className="absolute h-0.5 w-4 rotate-45 rounded bg-current" />
            <span className="absolute h-0.5 w-4 -rotate-45 rounded bg-current" />
          </button>
        </div>

        {order ? (
          <div role="status" className="flex flex-1 animate-rise flex-col justify-center gap-5 px-6 py-10">
            <span className="grid size-14 place-items-center rounded-full bg-sun text-xl">✓</span>
            <h3 className="text-d3">Thank you, your order is in.</h3>
            <p className="text-moss">
              Order <span className="font-medium text-grove">{order}</span>. This is a concept store, so nothing was charged and nothing will ship.
            </p>
            <button type="button" onClick={() => setBagOpen(false)} className={`${btn} mt-2 w-fit`}>
              Keep browsing
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center gap-6 px-6 py-10">
            <div className="flex gap-2" aria-hidden="true">
              {perfumes.map((p) => (
                <span key={p.slug} className="size-4 rounded-full" style={{ backgroundColor: p.color }} />
              ))}
            </div>
            <h3 className="text-d3">Your bag is empty</h3>
            <p className="max-w-[30ch] text-moss">Pick a season to start, or try all four with the discovery set.</p>
            <div className="flex flex-wrap gap-2">
              <TLink href="/collection" text="Collection" className={btn}>
                See the collection
              </TLink>
              <button type="button" onClick={() => addToBag(setItem)} className="h-13 rounded-full border border-line px-6 font-medium transition-colors hover:border-grove">
                Add the set, €{setItem.price}
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="border-b border-line px-6 py-4 text-sm">
              {left > 0 ? (
                <p>
                  Spend <span className="font-semibold">€{left}</span> more for a free travel spray.
                </p>
              ) : (
                <p className="font-medium">You get a free travel spray with this order.</p>
              )}
              <span className="mt-2.5 block h-1.5 overflow-hidden rounded-full bg-grove/10">
                <span className="block h-full origin-left rounded-full bg-grove transition-transform duration-700 ease-q" style={{ transform: `scaleX(${Math.min(1, subtotal / FREE_GIFT)})` }} />
              </span>
            </div>

            <ul className="flex-1 overflow-y-auto overscroll-contain px-6" data-lenis-prevent>
              {items.map((i) => (
                <li key={i.id} className="flex gap-4 border-b border-line py-5 last:border-0">
                  <span className="grid size-20 shrink-0 place-items-center rounded-2xl" style={{ backgroundColor: i.color }} aria-hidden="true">
                    {(() => {
                      const p = i.slug ? getPerfume(i.slug) : undefined;
                      return p ? <Bottle liquid={p.liquid} name={p.name} no={p.no} shadow={false} className="h-16" /> : <Mark className="size-9" />;
                    })()}
                  </span>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        {i.slug ? (
                          <TLink href={`/fragrance/${i.slug}`} text={i.name} className="block truncate text-lg font-semibold [font-stretch:85%] hover:underline">
                            {i.name}
                          </TLink>
                        ) : (
                          <p className="truncate text-lg font-semibold [font-stretch:85%]">{i.name}</p>
                        )}
                        <p className="text-sm text-moss">{i.detail}</p>
                      </div>
                      <p className="shrink-0 font-medium tabular-nums">€{i.price * i.qty}</p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <div className="flex items-center rounded-full border border-line" role="group" aria-label={`Quantity of ${i.name}`}>
                        <button type="button" onClick={() => setQty(i.id, i.qty - 1)} aria-label={`One less ${i.name}`} className="grid size-9 place-items-center rounded-full text-lg hover:bg-grove/8">
                          −
                        </button>
                        <span className="w-7 text-center tabular-nums" aria-live="polite">
                          {i.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(i.id, i.qty + 1)}
                          disabled={i.qty >= 9}
                          aria-label={`One more ${i.name}`}
                          className="grid size-9 place-items-center rounded-full text-lg hover:bg-grove/8 disabled:opacity-40"
                        >
                          +
                        </button>
                      </div>
                      <button type="button" onClick={() => setQty(i.id, 0)} className="text-sm text-moss underline decoration-1 underline-offset-4 hover:text-grove">
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            {!hasSet && (
              <div className="mx-6 mb-4 flex items-center justify-between gap-4 rounded-2xl bg-frost px-4 py-3 text-sm">
                <p>Add the discovery set for €{setItem.price}?</p>
                <button type="button" onClick={() => addToBag(setItem)} className="shrink-0 rounded-full bg-grove px-4 py-2 font-medium text-chalk">
                  Add
                </button>
              </div>
            )}

            <div className="border-t border-line px-6 pt-5 pb-6">
              <dl className="grid gap-1.5 text-[0.95rem]">
                <div className="flex justify-between">
                  <dt className="text-moss">Subtotal</dt>
                  <dd className="tabular-nums">€{subtotal}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-moss">Shipping</dt>
                  <dd>Free in the EU</dd>
                </div>
                <div className="mt-2 flex justify-between text-xl font-semibold">
                  <dt>Total</dt>
                  <dd className="tabular-nums">€{subtotal}</dd>
                </div>
              </dl>
              <button type="button" onClick={checkout} className={`${btn} mt-5 w-full`}>
                Check out, €{subtotal}
              </button>
              <p className="mt-3 text-center text-xs text-moss">Concept store. No payment is taken.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
