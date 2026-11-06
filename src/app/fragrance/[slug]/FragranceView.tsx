"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TLink from "@/components/TLink";
import Photo from "@/components/Photo";
import Bottle from "@/components/Bottle";
import Words from "@/components/Words";
import { usePageTransition } from "@/components/Providers";
import { perfumeItem, sizes, type NoteStage, type Perfume } from "@/data/perfumes";
import useReady from "@/lib/useReady";
import { btn } from "@/lib/ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const stages: { key: NoteStage; title: string; text: string; mix: number }[] = [
  { key: "top", title: "The first fifteen minutes", text: "What you smell on the card in the shop. Bright, a little loud, gone quickly.", mix: 28 },
  { key: "heart", title: "After an hour", text: "The real character of the perfume. This is what people around you will notice.", mix: 58 },
  { key: "base", title: "Into the evening", text: "What stays on your skin and your scarf, close and warm, until the next day.", mix: 100 },
];

interface FragranceViewProps {
  p: Perfume;
  next: Perfume;
}

export default function FragranceView({ p, next }: FragranceViewProps) {
  const ready = useReady();
  const { addToBag } = usePageTransition();
  const root = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(0);

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from("[data-frame]", { clipPath: "inset(100% 0% 0% 0% round 2rem)", duration: 1.4 })
          .from("[data-frame] img", { scale: 1.35, duration: 2 }, 0)
          .from("[data-hero-bottle]", { yPercent: 40, opacity: 0, duration: 1.4 }, 0.5)
          .from("[data-name] [data-w]", { yPercent: 105, duration: 1.2, stagger: 0.08 }, 0.25)
          .from("[data-fade]", { opacity: 0, y: 16, duration: 0.9, stagger: 0.06 }, 0.6);

        const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
        cards.forEach((c, i) => {
          if (i === cards.length - 1) return;
          gsap.to(c, { scale: 0.93, ease: "none", scrollTrigger: { trigger: cards[i + 1], start: "top bottom", end: "top 20%", scrub: true } });
        });

        gsap.utils.toArray<HTMLElement>("[data-drift]").forEach((el) => {
          gsap.fromTo(el, { yPercent: -9 }, { yPercent: 9, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <div ref={root} style={{ "--c": p.color, "--k": p.ink }}>
      <section className="grid gap-8 px-gutter pt-20 pb-16 tab:min-h-svh tab:grid-cols-12 tab:items-stretch tab:gap-6 tab:pt-[5.75rem] tab:pb-6 short:grid-cols-12 short:gap-6">
        <div data-frame className="relative h-[64svh] overflow-hidden rounded-[2rem] bg-(--c) tab:col-span-7 tab:h-auto tab:min-h-[34rem] short:col-span-6 short:h-[80svh]">
          <Photo id={p.photos.hero} alt={`${p.season} scene for ${p.name}`} tone={p.color} priority sizes="(min-width: 901px) 58vw, 100vw" className="absolute inset-0" />
          <div data-hero-bottle className="absolute bottom-4 left-4 grid h-[46%] place-items-center rounded-[1.5rem] bg-(--c) px-5 py-4 tab:bottom-6 tab:left-6">
            <Bottle liquid={p.liquid} name={p.name} no={p.no} className="h-full" />
          </div>
        </div>

        <div className="flex flex-col justify-center tab:col-span-5 tab:pl-[2vw] short:col-span-6">
          <p data-fade className="inline-flex w-fit items-center gap-2 rounded-full bg-(--c) px-3.5 py-1.5 text-sm font-medium text-(--k)">
            N°{p.no}, {p.season}, {p.months}
          </p>
          <Words as="h1" data-name text={p.name} className="mt-5 text-[clamp(3.2rem,7.4vw,8rem)] leading-[0.9] font-bold tracking-[-0.045em] [font-stretch:78%] short:text-[3.2rem]" />
          <p data-fade className="mt-5 max-w-[34ch] text-xl leading-snug">
            {p.line}
          </p>

          <fieldset data-fade className="mt-9 grid grid-cols-2 gap-2 border-0 p-0 short:mt-5">
            <legend className="mb-3 text-sm text-moss">Size</legend>
            {sizes.map((z, i) => (
              <label
                key={z.ml}
                className={`relative flex cursor-pointer items-center justify-between rounded-2xl border px-4 py-3.5 transition-colors duration-300 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 ${
                  i === size ? "border-grove bg-grove text-chalk" : "border-line hover:border-grove/50"
                }`}
              >
                <input type="radio" name="size" value={z.ml} checked={i === size} onChange={() => setSize(i)} className="absolute inset-0 cursor-pointer opacity-0" />
                <span className="font-medium">{z.ml} ml</span>
                <span className="tabular-nums">€{z.price}</span>
              </label>
            ))}
          </fieldset>
          <div data-fade className="mt-3 grid">
            <button type="button" onClick={() => addToBag(perfumeItem(p, sizes[size].ml))} className={`${btn} w-full`}>
              Add to bag, €{sizes[size].price}
            </button>
          </div>

          <dl data-fade className="mt-8 grid gap-2 border-t border-line pt-5 text-[0.95rem] short:hidden">
            <div className="grid grid-cols-[7rem_1fr] gap-3">
              <dt className="text-moss">Strength</dt>
              <dd>{p.concentration}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3">
              <dt className="text-moss">Lasts</dt>
              <dd>{p.lasts}</dd>
            </div>
            <div className="grid grid-cols-[7rem_1fr] gap-3">
              <dt className="text-moss">Wear it for</dt>
              <dd>{p.wear}</dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="notes-title" className="px-gutter pt-16 pb-24 tab:pt-28 tab:pb-36">
        <div className="mb-12 grid gap-4 tab:mb-16 tab:grid-cols-12">
          <h2 id="notes-title" className="text-d2 tab:col-span-6">
            How it changes on your skin
          </h2>
          <p className="max-w-[40ch] text-moss tab:col-span-4 tab:col-start-9 tab:self-end">
            A perfume is not one smell. {p.name} moves through three stages over a day.
          </p>
        </div>

        <div className="grid gap-5">
          {stages.map((s, i) => (
            <article
              key={s.key}
              data-card
              className="sticky grid origin-top overflow-hidden rounded-[2rem] tab:min-h-[68svh] tab:grid-cols-2"
              style={{
                top: `calc(5.25rem + ${i * 1.25}rem)`,
                backgroundColor: `color-mix(in srgb, ${p.color} ${s.mix}%, #f3f3ef)`,
                color: s.mix === 100 ? p.ink : "#1f3a2e",
              }}
            >
              <div className="flex flex-col justify-between gap-10 p-7 tab:p-12">
                <div>
                  <p className="text-sm font-medium opacity-75">
                    Stage {i + 1} of 3
                  </p>
                  <h3 className="mt-2 text-d3">{s.title}</h3>
                  <p className="mt-3 max-w-[34ch] opacity-80">{s.text}</p>
                </div>
                <ul className="grid gap-1">
                  {p.notes[s.key].map((n) => (
                    <li key={n} className="text-d2 font-semibold [font-stretch:80%]">
                      {n}
                    </li>
                  ))}
                </ul>
              </div>
              <Photo id={p.notePhotos[s.key]} alt={p.notes[s.key][0]} tone={p.color} sizes="(min-width: 901px) 46vw, 100vw" className="m-3 mt-0 aspect-[4/3] rounded-[1.5rem] tab:m-4 tab:aspect-auto" />
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-12 px-gutter pb-24 tab:grid-cols-12 tab:pb-36">
        <p className="text-d3 tab:col-span-7">{p.story}</p>
        <div className="tab:col-span-4 tab:col-start-9">
          <h2 className="text-sm text-moss">Where it comes from</h2>
          <dl className="mt-4">
            {p.origins.map((o) => (
              <div key={o.note} className="flex items-baseline justify-between gap-4 border-t border-line py-3.5">
                <dt className="text-lg font-semibold [font-stretch:85%]">{o.note}</dt>
                <dd className="text-right text-moss">{o.place}</dd>
              </div>
            ))}
          </dl>
          <Photo id={p.photos.detail} alt="" tone={p.color} sizes="(min-width: 901px) 30vw, 100vw" className="mt-8 aspect-[4/5] rounded-[1.5rem]" />
        </div>
      </section>

      <div className="relative mx-gutter h-[60svh] overflow-hidden rounded-[2rem] bg-(--c) tab:h-[88svh]">
        <div data-drift className="absolute -inset-y-[10%] inset-x-0">
          <Photo id={p.photos.wide} alt="" tone={p.color} sizes="100vw" className="absolute inset-0" />
        </div>
      </div>

      <section className="px-gutter py-24 tab:py-32">
        <TLink
          href={`/fragrance/${next.slug}`}
          text={next.name}
          color={next.color}
          ink={next.ink}
          data-cursor="Next"
          className="group grid items-center gap-8 overflow-hidden rounded-[2rem] p-7 tab:grid-cols-[1fr_auto] tab:p-14"
          style={{ backgroundColor: next.color, color: next.ink }}
        >
          <span>
            <span className="block text-sm font-medium opacity-80">Next season, {next.season.toLowerCase()}</span>
            <span className="mt-2 block text-mega font-bold [font-stretch:78%] transition-transform duration-700 ease-q group-hover:translate-x-3">{next.name}</span>
            <span className="mt-4 block max-w-[38ch] opacity-85">{next.line}</span>
          </span>
          <span className="relative block size-48 overflow-hidden rounded-full tab:size-72">
            <Photo id={next.photos.hero} alt="" tone={next.color} sizes="18rem" className="absolute inset-0" imgClassName="transition-transform duration-[1.2s] ease-q group-hover:scale-110" />
          </span>
        </TLink>
      </section>
    </div>
  );
}
