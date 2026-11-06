"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import GoldDust from "@/components/GoldDust";
import TLink from "@/components/TLink";
import useReady from "@/lib/useReady";
import { btnGold, label, mask } from "@/lib/ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const timeline = [
  { year: "2019", title: "A workshop above a bakery", text: "Inès Varenne leaves a large fragrance house and rents two small rooms in the old town of Grasse. The first still arrives in December." },
  { year: "2020", title: "Aube", text: "The first perfume is blended in April from roses picked three streets away. Four hundred bottles, gone by June." },
  { year: "2022", title: "Midi and Crépuscule", text: "Summer and autumn join the collection. The rule stays the same: each one is made only in its own season." },
  { year: "2024", title: "Minuit completes the year", text: "With a winter perfume built around iris that dried for three years, the four lights are finally complete." },
  { year: "2026", title: "Rue Jean Ossola", text: "The boutique opens downstairs from the atelier. Visitors can smell the next batch while it rests in the cellar." },
];

const principles = [
  { title: "One season, one batch", text: "We never make a perfume outside its season. When the batch is gone, it is gone until next year." },
  { title: "From the source", text: "Every raw material is bought from the people who grow it, and most of them have names we know." },
  { title: "Filled by hand", text: "Each bottle is filled, capped and numbered by one of six people in the atelier." },
];

export default function MaisonView() {
  const ready = useReady();
  const root = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ delay: 0.15, defaults: { ease: "power4.out" } })
          .from("[data-title] > span > span", { yPercent: 115, duration: 1.3, stagger: 0.1 })
          .from("[data-intro]", { opacity: 0, y: 16, duration: 1, stagger: 0.08 }, 0.4);

        gsap.fromTo(
          line.current,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: "[data-timeline]", start: "top 70%", end: "bottom 60%", scrub: true } }
        );

        gsap.utils.toArray<HTMLElement>("[data-entry]").forEach((el) => {
          gsap.from(el, { opacity: 0, x: 40, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 80%" } });
        });

        gsap.utils.toArray<HTMLElement>("[data-rise]").forEach((el) => {
          gsap.from(el, { opacity: 0, y: 50, duration: 1.2, ease: "power3.out", scrollTrigger: { trigger: el, start: "top 88%" } });
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <div ref={root}>
      <section className="relative isolate grid min-h-[92svh] content-end overflow-hidden px-gutter pt-40 pb-20">
        <div aria-hidden="true" className="absolute -top-40 left-1/2 -z-1 size-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,107,0.16),transparent_60%)]" />
        <GoldDust count={60} />
        <p data-intro className={`${label} text-gold`}>
          The maison
        </p>
        <h1 data-title className="mt-6 text-d1">
          <span className={mask}>
            <span className="block">Composed in Grasse,</span>
          </span>
          <span className={mask}>
            <span className="block italic text-gold-soft">one season at a time.</span>
          </span>
        </h1>
        <p data-intro className="mt-8 max-w-[48ch] text-lg text-ash">
          Quatréa is six people, one copper still and a cellar that stays at fourteen degrees all year. We make four perfumes and we have no plans to make a fifth.
        </p>
      </section>

      <section className="grid gap-16 border-t border-gold/15 px-gutter py-28 tab:grid-cols-[1fr_1.6fr] tab:py-40">
        <div className="tab:sticky tab:top-32 tab:self-start">
          <p className={`${label} text-gold`}>Our story</p>
          <h2 className="mt-4 text-d2">
            Seven years, <span className="italic">four lights.</span>
          </h2>
        </div>
        <ol data-timeline className="relative m-0 grid list-none gap-16 p-0 pl-10">
          <span aria-hidden="true" className="absolute top-2 bottom-2 left-0 w-px bg-ivory/10">
            <span ref={line} className="absolute inset-0 origin-top bg-gold" />
          </span>
          {timeline.map((t) => (
            <li key={t.year} data-entry className="relative">
              <span aria-hidden="true" className="absolute top-3 -left-[2.8rem] size-2.5 rounded-full bg-gold" />
              <p className="font-serif text-5xl text-gold-soft tabular-nums">{t.year}</p>
              <h3 className="mt-3 text-3xl italic">{t.title}</h3>
              <p className="mt-3 max-w-[48ch] text-ash">{t.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-gold/15 px-gutter py-28 tab:py-40">
        <p className={`${label} text-gold`}>What we hold on to</p>
        <div className="mt-12 grid gap-px bg-gold/15 tab:grid-cols-3">
          {principles.map((pr) => (
            <div key={pr.title} data-rise className="bg-noir p-8 tab:p-10">
              <h3 className="text-d3 italic">{pr.title}</h3>
              <p className="mt-4 text-ash">{pr.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden border-t border-gold/15 px-gutter py-32 text-center tab:py-48">
        <div aria-hidden="true" className="absolute top-1/2 left-1/2 -z-1 size-[44rem] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(201,169,107,0.12),transparent_62%)]" />
        <figure data-rise className="m-0">
          <blockquote className="mx-auto max-w-[22ch] font-serif text-d2 italic">
            <p>&ldquo;Light changes everything about a smell. I wanted a perfume for each kind of light.&rdquo;</p>
          </blockquote>
          <figcaption className={`${label} mt-10 text-ash`}>Inès Varenne, founder and perfumer</figcaption>
        </figure>
        <TLink href="/contact" text="Contact" className={`${btnGold} mt-14`}>
          Visit the atelier
        </TLink>
      </section>
    </div>
  );
}
