"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TLink from "@/components/TLink";
import Photo from "@/components/Photo";
import Bottle from "@/components/Bottle";
import Words from "@/components/Words";
import { usePageTransition } from "@/components/Providers";
import { discoverySet, perfumeItem, perfumes, setItem, sizes } from "@/data/perfumes";
import useReady from "@/lib/useReady";
import { btn } from "@/lib/ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const rows = [
  { label: "Season", get: (i: number) => perfumes[i].months },
  { label: "Opens with", get: (i: number) => perfumes[i].notes.top.slice(0, 2).join(", ") },
  { label: "Heart", get: (i: number) => perfumes[i].notes.heart.slice(0, 2).join(", ") },
  { label: "Lasts", get: (i: number) => perfumes[i].lasts },
  { label: "Best for", get: (i: number) => perfumes[i].wear },
];

export default function CollectionView() {
  const ready = useReady();
  const root = useRef<HTMLDivElement>(null);
  const { addToBag, lenis } = usePageTransition();

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from("[data-title] [data-w]", { yPercent: 105, duration: 1.2, stagger: 0.06 })
          .from("[data-fade]", { opacity: 0, y: 16, duration: 0.9, stagger: 0.06 }, 0.4);

        gsap.utils.toArray<HTMLElement>("[data-row]").forEach((row) => {
          const img = row.querySelector("[data-drift]");
          const frame = row.querySelector("[data-frame]");
          if (img) gsap.fromTo(img, { yPercent: -7 }, { yPercent: 7, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
          if (frame) gsap.from(frame, { clipPath: "inset(12% 8% 12% 8% round 2rem)", ease: "none", scrollTrigger: { trigger: row, start: "top 95%", end: "top 35%", scrub: true } });
          gsap.from(row.querySelectorAll("[data-bottle]"), { yPercent: 25, rotate: -6, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "center center", scrub: true } });
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] }
  );

  const scrollTo = (slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: -90, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={root}>
      <section className="px-gutter pt-32 pb-16 tab:pt-44 tab:pb-24">
        <Words as="h1" data-title text="The collection" className="text-mega" />
        <div className="mt-8 grid gap-8 tab:grid-cols-12 tab:items-end">
          <p data-fade className="max-w-[40ch] text-lg text-moss tab:col-span-5">
            Four eaux de parfum, each made in one season and named for it. Each one comes in 50 or 100 ml, in refillable glass made in Normandy.
          </p>
          <nav data-fade aria-label="Jump to a perfume" className="flex flex-wrap gap-2 tab:col-span-6 tab:col-start-7 tab:justify-end">
            {perfumes.map((p) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => scrollTo(p.slug)}
                className="flex h-11 items-center gap-2 rounded-full px-4 font-medium transition-transform duration-300 hover:-translate-y-0.5"
                style={{ backgroundColor: p.color, color: p.ink }}
              >
                {p.name}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <div className="grid gap-24 px-gutter pb-28 tab:gap-40 tab:pb-40">
        {perfumes.map((p, i) => {
          const flip = i % 2 === 1;
          return (
            <article key={p.slug} id={p.slug} data-row aria-labelledby={`${p.slug}-name`} className="grid scroll-mt-24 gap-8 tab:grid-cols-12 tab:items-center tab:gap-6">
              <TLink
                href={`/fragrance/${p.slug}`}
                text={p.name}
                color={p.color}
                ink={p.ink}
                tabIndex={-1}
                aria-hidden="true"
                data-cursor="Discover"
                className={`relative block tab:col-span-7 ${flip ? "tab:col-start-6" : ""}`}
              >
                <div data-frame className="relative aspect-[4/5] overflow-hidden rounded-[2rem] tab:aspect-[16/12]" style={{ backgroundColor: p.color }}>
                  <div data-drift className="absolute -inset-y-[9%] inset-x-0">
                    <Photo id={p.photos.hero} alt="" tone={p.color} sizes="(min-width: 901px) 58vw, 100vw" className="absolute inset-0" />
                  </div>
                </div>
                <div
                  className={`absolute -bottom-6 grid h-[46%] place-items-center rounded-[1.5rem] px-6 py-5 tab:-bottom-10 tab:h-[52%] ${flip ? "left-4 tab:-left-10" : "right-4 tab:-right-10"}`}
                  style={{ backgroundColor: p.color }}
                >
                  <Bottle data-bottle liquid={p.liquid} name={p.name} no={p.no} className="h-full" />
                </div>
              </TLink>

              <div className={`tab:col-span-4 ${flip ? "tab:col-start-1 tab:row-start-1" : "tab:col-start-9"}`}>
                <p className="flex items-center gap-2 text-sm font-medium text-moss">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  N°{p.no}, {p.season}
                </p>
                <h2 id={`${p.slug}-name`} className="mt-3 text-d1">
                  {p.name}
                </h2>
                <p className="mt-4 max-w-[34ch] text-lg leading-snug">{p.line}</p>
                <dl className="mt-7 grid gap-2 border-t border-line pt-5 text-[0.95rem]">
                  <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                    <dt className="text-moss">Top</dt>
                    <dd>{p.notes.top.join(", ")}</dd>
                  </div>
                  <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                    <dt className="text-moss">Heart</dt>
                    <dd>{p.notes.heart.join(", ")}</dd>
                  </div>
                  <div className="grid grid-cols-[6.5rem_1fr] gap-3">
                    <dt className="text-moss">Base</dt>
                    <dd>{p.notes.base.join(", ")}</dd>
                  </div>
                </dl>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <TLink href={`/fragrance/${p.slug}`} text={p.name} color={p.color} ink={p.ink} className={btn}>
                    Discover {p.name}
                  </TLink>
                  <button
                    type="button"
                    onClick={() => addToBag(perfumeItem(p, sizes[0].ml))}
                    className="h-13 rounded-full border border-line px-6 font-medium transition-colors duration-300 hover:border-grove"
                  >
                    Add {sizes[0].ml} ml, €{sizes[0].price}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <section aria-labelledby="compare-title" className="border-t border-line px-gutter py-24 tab:py-32">
        <h2 id="compare-title" className="text-d2">
          Side by side
        </h2>
        <p className="mt-4 max-w-[40ch] text-moss">The short version, if you already know what you like.</p>
        <div className="mt-10 overflow-x-auto [scrollbar-width:thin]">
          <table className="w-full min-w-[46rem] border-collapse text-left">
            <thead>
              <tr>
                <th scope="col" className="w-[12%] pb-4 align-bottom text-sm font-normal text-moss">
                  <span className="sr-only">Detail</span>
                </th>
                {perfumes.map((p) => (
                  <th key={p.slug} scope="col" className="w-[22%] pr-4 pb-4 align-bottom">
                    <span className="mb-3 block h-2 w-10 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-2xl font-semibold [font-stretch:82%]">{p.name}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-t border-line">
                  <th scope="row" className="py-4 pr-4 align-top text-sm font-normal text-moss">
                    {r.label}
                  </th>
                  {perfumes.map((p, i) => (
                    <td key={p.slug} className="py-4 pr-4 align-top">
                      {r.get(i)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="px-gutter pb-24 tab:pb-32">
        <div className="flex flex-col gap-6 rounded-[2rem] bg-frost p-7 tab:flex-row tab:items-center tab:justify-between tab:p-12">
          <div>
            <h2 className="text-d3">Still deciding?</h2>
            <p className="mt-2 max-w-[44ch]">
              The discovery set has all four in {discoverySet.detail.replace("4 × ", "")} bottles, and the €{discoverySet.price} comes off your first full bottle.
            </p>
          </div>
          <button type="button" onClick={() => addToBag(setItem)} className={`${btn} shrink-0`}>
            Add the set, €{discoverySet.price}
          </button>
        </div>
      </section>
    </div>
  );
}
