"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TLink from "@/components/TLink";
import Photo from "@/components/Photo";
import Bottle from "@/components/Bottle";
import Words from "@/components/Words";
import { Mark } from "@/components/Logo";
import { usePageTransition } from "@/components/Providers";
import { atelierPhotos, discoverySet, setItem, ingredients, monthNames, perfumeForMonth, perfumes, getPerfume } from "@/data/perfumes";
import useReady from "@/lib/useReady";
import { btn, btnGhost } from "@/lib/ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function HomeView() {
  const ready = useReady();
  const root = useRef<HTMLDivElement>(null);
  const year = useRef<HTMLElement>(null);
  const { addToBag, lenis } = usePageTransition();
  const [month, setMonth] = useState<number | null>(null);
  const [pick, setPick] = useState(10);

  useEffect(() => {
    const m = new Date().getMonth();
    setMonth(m);
    setPick(m);
  }, []);

  const now = month === null ? null : perfumeForMonth(month);
  const chosen = perfumeForMonth(pick);

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from("[data-panel]", { yPercent: 105, duration: 1.4, stagger: 0.09 })
          .from("[data-panel] img", { scale: 1.3, duration: 1.8, stagger: 0.09 }, 0)
          .from("[data-ch]", { yPercent: 110, duration: 1.3, stagger: 0.05 }, 0.3)
          .from("[data-hero-fade]", { opacity: 0, y: 14, duration: 0.9, stagger: 0.08 }, 0.8);

        gsap.fromTo(
          "[data-statement] [data-w]",
          { opacity: 0.14 },
          { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "[data-statement]", start: "top 78%", end: "bottom 50%", scrub: true } }
        );

        gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
          gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });

      const bgs = gsap.utils.toArray<HTMLElement>("[data-bg]");
      const layers = gsap.utils.toArray<HTMLElement>("[data-layer]");
      const inners = gsap.utils.toArray<HTMLElement>("[data-layer-in]");
      const txts = gsap.utils.toArray<HTMLElement>("[data-txt]");
      const bottles = gsap.utils.toArray<HTMLElement>("[data-yb]");
      const segs = gsap.utils.toArray<HTMLElement>("[data-seg]");

      gsap.set(layers.slice(1), { yPercent: 100 });
      gsap.set(inners.slice(1), { yPercent: -100 });
      gsap.set(bgs.slice(1), { opacity: 0 });
      gsap.set(txts.slice(1), { autoAlpha: 0, y: 50 });
      gsap.set(bottles.slice(1), { autoAlpha: 0, y: 60 });
      gsap.set("[data-ring]", { rotate: -90 });
      gsap.set(segs, { scaleX: 0 });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: { trigger: year.current, start: "top top", end: "bottom bottom", scrub: 0.7 },
      });

      tl.to(segs[0], { scaleX: 1, duration: 1 }, 0);
      for (let i = 1; i < perfumes.length; i++) {
        const at = i - 0.7;
        const p = perfumes[i];
        tl.to(layers[i], { yPercent: 0, duration: 0.7, ease: "power2.inOut" }, at)
          .to(inners[i], { yPercent: 0, duration: 0.7, ease: "power2.inOut" }, at)
          .to(bgs[i], { opacity: 1, duration: 0.5 }, at + 0.1)
          .to("[data-ink]", { color: p.ink, duration: 0.3 }, at + 0.2)
          .to("[data-ring]", { rotate: -90 - 90 * i, duration: 0.7, ease: "power2.inOut" }, at)
          .to(txts[i - 1], { autoAlpha: 0, y: -50, duration: 0.3, ease: "power2.in" }, at)
          .to(txts[i], { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, at + 0.35)
          .to(bottles[i - 1], { autoAlpha: 0, y: -60, duration: 0.3, ease: "power2.in" }, at)
          .to(bottles[i], { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, at + 0.3)
          .to(segs[i], { scaleX: 1, duration: 1 }, i);
      }

      mm.add("(min-width: 56.3125rem) and (prefers-reduced-motion: no-preference)", () => {
        const track = document.querySelector<HTMLElement>("[data-track]");
        if (!track) return;
        gsap.to(track, {
          x: () => -(track.scrollWidth - window.innerWidth),
          ease: "none",
          scrollTrigger: {
            trigger: "[data-ing]",
            start: "top top",
            end: () => `+=${track.scrollWidth - window.innerWidth}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] }
  );

  const jump = (i: number) => {
    const el = year.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const y = top + span * ((i + 0.05) / perfumes.length);
    if (lenis) lenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div ref={root}>
      <section className="flex min-h-svh flex-col px-gutter pt-20 pb-4 tab:pt-[5.75rem] short:min-h-[38rem]">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2 pb-4">
          <p data-hero-fade className="max-w-[30ch] text-lg leading-snug tab:text-xl">
            Four perfumes, one for each season, made in Grasse while that season lasts.
          </p>
          <p data-hero-fade className="flex min-h-6 items-center gap-2 text-sm text-moss">
            {now && (
              <>
                <span className="size-2.5 rounded-full" style={{ backgroundColor: now.color }} />
                In season now: {now.name}
              </>
            )}
          </p>
        </div>

        <div className="flex min-h-[26rem] flex-1 flex-col gap-2 overflow-hidden rounded-[1.25rem] tab:flex-row short:flex-row">
          {perfumes.map((p, i) => (
            <TLink
              key={p.slug}
              href={`/fragrance/${p.slug}`}
              text={p.name}
              color={p.color}
              ink={p.ink}
              data-panel
              data-cursor="Discover"
              className="group relative min-h-0 flex-1 overflow-hidden rounded-[1.25rem] transition-[flex-grow] duration-700 ease-q tab:hover:grow-[2.2] short:hover:grow-[2.2]"
              style={{ backgroundColor: p.color }}
            >
              <Photo
                id={p.photos.hero}
                alt=""
                tone={p.color}
                priority={i < 2}
                sizes="(min-width: 901px) 40vw, 100vw"
                className="absolute inset-0"
                imgClassName="transition-transform duration-[1.4s] ease-q group-hover:scale-[1.06]"
              />
              <span className="absolute inset-x-0 bottom-0 h-3/5 bg-linear-to-t from-grove/60 to-transparent" />
              <span className="absolute top-3 left-3 rounded-full bg-chalk px-3 py-1 text-sm font-medium text-grove tab:top-4 tab:left-4">{p.season}</span>
              <span className="absolute right-3 bottom-3 left-3 flex items-end justify-between gap-3 text-chalk tab:right-5 tab:bottom-5 tab:left-5">
                <span>
                  <span className="block text-sm opacity-85">{p.months}</span>
                  <span className="block text-2xl leading-tight font-semibold [font-stretch:82%] tab:text-d3">{p.name}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-chalk text-grove transition-transform duration-500 ease-q group-hover:rotate-[-45deg]"
                >
                  <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M2 8h12M9 3l5 5-5 5" />
                  </svg>
                </span>
              </span>
            </TLink>
          ))}
        </div>

        <div className="flex items-end justify-between gap-6 pt-3">
          <h1 className="leading-none">
            <span className="sr-only">Quatréa, a year in four perfumes</span>
            <span aria-hidden="true" className="flex overflow-hidden pb-[0.05em] text-[min(27vw,29svh)] leading-[0.95] font-bold tracking-[-0.035em]">
              {"quatréa".split("").map((c, i) => (
                <span key={i} data-ch className="inline-block">
                  {c}
                </span>
              ))}
            </span>
          </h1>
          <div data-hero-fade className="hidden max-w-[16rem] pb-[2.2svh] text-right text-moss tab:block">
            <p>Scroll to walk through the year, one season at a time.</p>
            <span aria-hidden="true" className="mt-4 ml-auto block h-14 w-px origin-top animate-drip bg-grove" />
          </div>
        </div>
      </section>

      <section className="px-gutter py-28 tab:py-44">
        <Words
          as="p"
          mask={false}
          data-statement
          className="max-w-[20ch] text-d1 font-semibold [font-stretch:82%]"
          text="We make each perfume only while its season lasts. When the blossom falls or the snow melts, that batch is done until next year."
        />
        <div className="mt-14 grid gap-8 tab:mt-20 tab:grid-cols-12">
          <p className="max-w-[44ch] text-lg text-moss tab:col-span-5 tab:col-start-7">
            It means fewer bottles and some waiting. It also means the cherry blossom in Cerisier was picked this spring, and the lemons in Citron Salé were on a tree in Amalfi a few weeks before you opened the box.
          </p>
          <div className="tab:col-span-5 tab:col-start-7">
            <TLink href="/atelier" text="Atelier" className={btnGhost}>
              How we make them
            </TLink>
          </div>
        </div>
      </section>

      <section ref={year} aria-labelledby="year-title" className="relative h-[460svh]">
        <h2 id="year-title" className="sr-only">
          The year in four perfumes
        </h2>
        <div className="sticky top-0 h-svh overflow-hidden">
          {perfumes.map((p) => (
            <div key={p.slug} data-bg aria-hidden="true" className="absolute inset-0" style={{ backgroundColor: p.color }} />
          ))}

          <div
            data-ink
            className="relative grid h-full grid-rows-[auto_1fr] content-center items-center gap-6 px-gutter pt-20 pb-16 text-grove tab:grid-cols-[1fr_auto_1fr] tab:grid-rows-1 tab:gap-[4vw] tab:pb-20 short:grid-cols-[auto_1fr] short:grid-rows-1 short:gap-8 short:pb-12"
          >
            <div className="relative order-2 grid tab:order-1 short:order-2">
              {perfumes.map((p) => (
                <div key={p.slug} data-txt className="col-start-1 row-start-1">
                  <p className="text-sm font-medium opacity-80 tab:text-base">
                    {p.season}, {p.months}
                  </p>
                  <p className="mt-2 text-d1 font-semibold [font-stretch:80%] short:text-[2.6rem]">{p.name}</p>
                  <p className="mt-4 max-w-[32ch] text-lg leading-snug short:hidden">{p.line}</p>
                  <TLink
                    href={`/fragrance/${p.slug}`}
                    text={p.name}
                    color={p.color}
                    ink={p.ink}
                    className="mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-current px-6 font-medium short:mt-3"
                  >
                    <span style={{ color: p.color }}>Discover {p.name}</span>
                  </TLink>
                </div>
              ))}
            </div>

            <div className="relative order-1 mx-auto size-[min(74vw,42svh)] tab:order-2 tab:size-[min(64svh,34vw)] short:order-1 short:size-[48svh]">
              <div data-ring aria-hidden="true" className="absolute -inset-[13%] [container-type:inline-size] tab:-inset-[15%]">
                {monthNames.map((m, i) => (
                  <span
                    key={m}
                    className="absolute top-1/2 left-1/2 block origin-center -translate-x-1/2 -translate-y-1/2 text-[0.7rem] font-medium tab:text-sm"
                    style={{ transform: `rotate(${i * 30}deg) translateY(calc(-50cqw + 0.6em))` }}
                  >
                    {m.slice(0, 3)}
                  </span>
                ))}
              </div>
              <span aria-hidden="true" className="absolute -top-[5%] left-1/2 h-[4%] w-px -translate-x-1/2 bg-current" />
              <div className="absolute inset-0 overflow-hidden rounded-full bg-grove/10 [contain:paint]">
                {perfumes.map((p, i) => (
                  <div key={p.slug} data-layer className="absolute inset-0 overflow-hidden">
                    <div data-layer-in className="absolute inset-0">
                      <Photo id={p.photos.wide} alt="" tone={p.color} sizes="(min-width: 901px) 34vw, 74vw" className="absolute inset-0" priority={i === 0} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative order-3 hidden h-[56svh] tab:block">
              {perfumes.map((p) => (
                <div key={p.slug} data-yb className="absolute inset-0 grid place-items-center">
                  <Bottle liquid={p.liquid} name={p.name} no={p.no} className="h-full" />
                </div>
              ))}
            </div>
          </div>

          <div data-ink className="absolute inset-x-0 bottom-0 grid grid-cols-4 gap-2 px-gutter pb-5 text-grove">
            {perfumes.map((p, i) => (
              <button key={p.slug} type="button" onClick={() => jump(i)} className="group grid gap-2 text-left text-xs font-medium tab:text-sm">
                <span className="relative block h-0.5 overflow-hidden rounded bg-current/25">
                  <span data-seg className="absolute inset-0 origin-left bg-current" />
                </span>
                <span className="opacity-80 transition-opacity group-hover:opacity-100">{p.season}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section data-ing aria-labelledby="ing-title" className="overflow-hidden py-24 tab:py-0">
        <div className="tab:flex tab:h-svh tab:items-center tab:pt-16">
          <div
            data-track
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-gutter pb-4 [scrollbar-width:none] tab:w-max tab:snap-none tab:gap-6 tab:overflow-visible tab:pb-0"
          >
            <div className="flex w-[80vw] shrink-0 snap-start flex-col justify-end tab:w-[26rem] tab:pr-10">
              <h2 id="ing-title" className="text-d2">
                Ten ingredients from ten places.
              </h2>
              <p className="mt-5 max-w-[34ch] text-moss">We buy from growers we visit every year, and we only buy what we can use in a single season.</p>
              <p className="mt-6 hidden text-sm text-moss tab:block">Keep scrolling</p>
            </div>
            {ingredients.map((g, i) => {
              const p = getPerfume(g.in);
              return (
                <figure key={g.name} className={`w-[64vw] shrink-0 snap-start tab:w-[19rem] ${i % 2 ? "tab:mt-24" : "tab:-mt-16"}`}>
                  <Photo id={g.photo} alt={g.name} tone={p?.color} sizes="(min-width: 901px) 19rem, 64vw" className="aspect-[3/4] rounded-[1.25rem]" />
                  <figcaption className="mt-4 flex items-start justify-between gap-3">
                    <span>
                      <span className="block text-xl font-semibold [font-stretch:85%]">{g.name}</span>
                      <span className="block text-sm text-moss">{g.place}</span>
                    </span>
                    {p && (
                      <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium" style={{ backgroundColor: p.color, color: p.ink }}>
                        {p.name}
                      </span>
                    )}
                  </figcaption>
                </figure>
              );
            })}
            <div aria-hidden="true" className="w-px shrink-0 tab:w-[8vw]" />
          </div>
        </div>
      </section>

      <section aria-labelledby="finder-title" className="px-gutter py-24 tab:py-36">
        <div className="grid gap-12 tab:grid-cols-12 tab:items-center">
          <div className="tab:col-span-5">
            <h2 id="finder-title" className="text-d2">
              Which month feels like you?
            </h2>
            <p className="mt-5 max-w-[38ch] text-lg text-moss">Your birthday, a trip you still think about, or just today. Pick a month and we will match it to a perfume.</p>

            <div role="radiogroup" aria-labelledby="finder-title" className="mt-10 grid grid-cols-3 gap-2 tab:grid-cols-4">
              {monthNames.map((m, i) => {
                const p = perfumeForMonth(i);
                const on = i === pick;
                return (
                  <button
                    key={m}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => setPick(i)}
                    className={`flex h-12 items-center gap-2 rounded-full border px-4 text-left text-[0.95rem] font-medium transition-colors duration-300 ${
                      on ? "border-grove bg-grove text-chalk" : "border-line hover:border-grove/50"
                    }`}
                  >
                    <span aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="truncate">{m.slice(0, 3)}</span>
                    {month === i && <span className="sr-only">(this month)</span>}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="tab:col-span-6 tab:col-start-7" aria-live="polite">
            <div key={chosen.slug} className="relative grid animate-rise overflow-hidden rounded-[2rem]" style={{ backgroundColor: chosen.color, color: chosen.ink }}>
              <Photo id={chosen.photos.detail} alt="" tone={chosen.color} sizes="(min-width: 901px) 46vw, 100vw" className="aspect-[4/3] tab:aspect-[16/11]" />
              <div className="grid gap-5 p-6 tab:grid-cols-[1fr_auto] tab:items-end tab:p-9">
                <div>
                  <p className="text-sm font-medium opacity-80">
                    {monthNames[pick]} belongs to {chosen.season.toLowerCase()}
                  </p>
                  <p className="mt-1 text-d2 font-semibold [font-stretch:80%]">{chosen.name}</p>
                  <p className="mt-3 max-w-[36ch]">{chosen.line}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <TLink href={`/fragrance/${chosen.slug}`} text={chosen.name} color={chosen.color} ink={chosen.ink} className="inline-flex h-12 items-center rounded-full bg-current px-6 font-medium">
                    <span style={{ color: chosen.color }}>Discover</span>
                  </TLink>
                </div>
              </div>
              <Bottle liquid={chosen.liquid} name={chosen.name} no={chosen.no} shadow={false} className="absolute top-5 right-5 h-32 tab:top-7 tab:right-7 tab:h-44" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="set-title" className="px-gutter pb-24 tab:pb-36">
        <div className="grid overflow-hidden rounded-[2rem] bg-sun tab:grid-cols-2">
          <div className="relative min-h-[22rem] overflow-hidden">
            <div data-drift className="absolute -inset-y-[10%] inset-x-0">
              <Photo id={atelierPhotos.still} alt="A clear glass perfume bottle on a stone ledge" tone="#e3c46a" sizes="(min-width: 901px) 50vw, 100vw" className="absolute inset-0" />
            </div>
          </div>
          <div className="flex flex-col justify-center gap-6 p-7 tab:p-14">
            <h2 id="set-title" className="max-w-[14ch] text-d2">
              Not sure yet? Try all four.
            </h2>
            <p className="max-w-[40ch]">
              {discoverySet.detail}, one for each season. Buy a full bottle within 60 days and we take the €{discoverySet.price} off your order.
            </p>
            <div className="flex h-28 items-end gap-3">
              {perfumes.map((p) => (
                <Bottle key={p.slug} liquid={p.liquid} name={p.name} no={p.no} className="h-full" />
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-5">
              <button type="button" onClick={() => addToBag(setItem)} className={btn}>
                Add to bag, €{discoverySet.price}
              </button>
              <span className="text-sm">Free shipping in the EU</span>
            </div>
          </div>
        </div>
      </section>

      <div aria-hidden="true" className="overflow-hidden border-y border-line py-6 select-none">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 items-center">
              {perfumes.map((p) => (
                <span key={p.slug} className="flex items-center gap-[3vw] pr-[3vw] text-d1 font-semibold [font-stretch:80%]">
                  {p.name}
                  <Mark className="size-[0.6em]" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
