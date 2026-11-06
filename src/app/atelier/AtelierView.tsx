"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import TLink from "@/components/TLink";
import Photo from "@/components/Photo";
import Words from "@/components/Words";
import { atelierPhotos } from "@/data/perfumes";
import useReady from "@/lib/useReady";
import { btn } from "@/lib/ui";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  {
    title: "Wait for the harvest",
    text: "Nothing starts until the main ingredient is ready. For Cerisier that is two weeks in April. For Bois de Neige it is the first hard frost in the Vosges.",
    photo: atelierPhotos.field,
    alt: "Rows of lavender in flower on the Valensole plateau",
  },
  {
    title: "Extract by hand",
    text: "Flowers are soaked in warm oil or distilled the same day they are picked. Woods and spices are tinctured for weeks. It is slow, and it is the part you can smell most.",
    photo: atelierPhotos.hands,
    alt: "Hands holding a freshly picked yellow flower",
  },
  {
    title: "Write the formula",
    text: "Élise adjusts the formula every year, because no two harvests smell the same. A batch can take thirty versions before it is right.",
    photo: atelierPhotos.bottles,
    alt: "Amber glass bottles lined up on a white shelf",
  },
  {
    title: "Let it rest",
    text: "The finished blend sits in the dark for six weeks. The notes settle into each other, and the alcohol softens.",
    photo: atelierPhotos.glass,
    alt: "Empty glass bottles resting on a white cloth",
  },
  {
    title: "Fill and number",
    text: "Every bottle is filled, capped and numbered in the atelier. When the batch runs out, that perfume waits for next year.",
    photo: atelierPhotos.still,
    alt: "A finished perfume bottle on a stone ledge",
  },
];

const promises = [
  { title: "Refills", text: "Bring back any bottle and we refill it for 30% less. The glass is made to last for years." },
  { title: "Batch numbers", text: "Each bottle carries its harvest year and batch, so you know exactly which season you are wearing." },
  { title: "No shortcuts", text: "No animal testing, no fillers to stretch a batch, and no restock until the next harvest." },
];

export default function AtelierView() {
  const ready = useReady();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from("[data-hero-frame]", { clipPath: "inset(18% 12% 0% 12% round 2rem)", duration: 1.6 })
          .from("[data-hero-frame] img", { scale: 1.3, duration: 2 }, 0)
          .from("[data-title] [data-w]", { yPercent: 105, duration: 1.2, stagger: 0.05 }, 0.5);

        gsap.fromTo(
          "[data-quote] [data-w]",
          { opacity: 0.15 },
          { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: "[data-quote]", start: "top 75%", end: "bottom 55%", scrub: true } }
        );
      });

      mm.add("(min-width: 56.3125rem)", () => {
        const pics = gsap.utils.toArray<HTMLElement>("[data-step-pic]");
        const count = document.querySelector<HTMLElement>("[data-count]");
        gsap.set(pics.slice(1), { autoAlpha: 0 });
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((el, i) => {
          ScrollTrigger.create({
            trigger: el,
            start: "top 55%",
            end: "bottom 55%",
            onToggle: (self) => {
              if (!self.isActive) return;
              pics.forEach((p, j) => gsap.to(p, { autoAlpha: j <= i ? 1 : 0, scale: j === i ? 1 : 1.04, duration: 0.8, ease: "power2.out", overwrite: true }));
              if (count) count.textContent = `${i + 1} / ${steps.length}`;
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] }
  );

  return (
    <div ref={root}>
      <section className="px-gutter pt-20 tab:pt-[5.75rem]">
        <div data-hero-frame className="relative flex h-[calc(100svh-6rem)] min-h-[28rem] items-end overflow-hidden rounded-[2rem] bg-[#8d7fb3] tab:h-[calc(100svh-7rem)]">
          <Photo id={atelierPhotos.field} alt="" tone="#8d7fb3" priority sizes="100vw" className="absolute inset-0" />
          <span className="absolute inset-x-0 bottom-0 h-2/3 bg-linear-to-t from-grove/75 to-transparent" />
          <div className="relative p-6 text-chalk tab:p-12">
            <Words as="h1" data-title text="Made in Grasse, one season at a time." className="max-w-[14ch] text-mega" />
          </div>
        </div>
      </section>

      <section className="grid gap-8 px-gutter py-24 tab:grid-cols-12 tab:py-36">
        <p className="text-d3 tab:col-span-7">
          Quatréa is four people in a stone workshop above the old perfume quarter in Grasse. We started in 2019 with one idea: a perfume should smell like the season it was made in.
        </p>
        <p className="max-w-[44ch] text-lg text-moss tab:col-span-4 tab:col-start-9 tab:self-end">
          That means working with the calendar, not against it. We make four batches a year, and when one sells out we tell you when the next harvest is due.
        </p>
      </section>

      <section aria-labelledby="process-title" className="px-gutter pb-24 tab:pb-36">
        <h2 id="process-title" className="mb-12 text-d2 tab:mb-4">
          From field to bottle
        </h2>
        <div className="grid gap-16 tab:grid-cols-12 tab:gap-6">
          <ol className="grid gap-16 tab:col-span-5 tab:gap-0">
            {steps.map((s, i) => (
              <li key={s.title} data-step className="grid content-center gap-5 tab:min-h-[78svh]">
                <Photo id={s.photo} alt={s.alt} sizes="100vw" className="aspect-[4/3] rounded-[1.5rem] tab:hidden" />
                <span className="grid size-12 place-items-center rounded-full border border-line text-lg font-semibold tabular-nums">{i + 1}</span>
                <h3 className="text-d2">{s.title}</h3>
                <p className="max-w-[38ch] text-lg text-moss">{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="hidden tab:col-span-6 tab:col-start-7 tab:block">
            <div className="sticky top-24 h-[calc(100svh-8rem)] overflow-hidden rounded-[2rem] bg-[#cfcabd]">
              {steps.map((s) => (
                <div key={s.title} data-step-pic className="absolute inset-0">
                  <Photo id={s.photo} alt={s.alt} tone="#cfcabd" sizes="50vw" className="absolute inset-0" />
                </div>
              ))}
              <span data-count className="absolute top-5 left-5 rounded-full bg-chalk px-3.5 py-1.5 text-sm font-medium tabular-nums">
                1 / {steps.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-plum px-gutter py-24 text-chalk tab:py-40">
        <figure className="mx-auto max-w-[62rem]">
          <blockquote>
            <Words as="p" mask={false} data-quote text="We would rather make a little of something good than a lot of something fine." className="text-d1 font-semibold [font-stretch:82%]" />
          </blockquote>
          <figcaption className="mt-10 flex items-center gap-4">
            <span aria-hidden="true" className="grid size-14 place-items-center rounded-full bg-blossom text-lg font-semibold text-grove">ÉM</span>
            <span>
              <span className="block font-semibold">Élise Marchand</span>
              <span className="block text-chalk/70">Founder and perfumer</span>
            </span>
          </figcaption>
        </figure>
      </section>

      <section aria-labelledby="promise-title" className="px-gutter py-24 tab:py-32">
        <h2 id="promise-title" className="max-w-[18ch] text-d2">
          What that means for you
        </h2>
        <dl className="mt-12 grid gap-10 tab:grid-cols-3 tab:gap-6">
          {promises.map((p) => (
            <div key={p.title} className="border-t-2 border-grove pt-5">
              <dt className="text-2xl font-semibold [font-stretch:85%]">{p.title}</dt>
              <dd className="mt-3 max-w-[34ch] text-moss">{p.text}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-16">
          <TLink href="/collection" text="Collection" className={btn}>
            See the four perfumes
          </TLink>
        </div>
      </section>
    </div>
  );
}
