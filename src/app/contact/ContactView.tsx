"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Photo from "@/components/Photo";
import Words from "@/components/Words";
import { atelierPhotos, perfumes } from "@/data/perfumes";
import useReady from "@/lib/useReady";
import { btn } from "@/lib/ui";

gsap.registerPlugin(useGSAP);

const topics = ["A question about an order", "Help choosing a perfume", "Book a visit to the atelier", "Press or wholesale"];

const faqs = [
  { q: "How long does delivery take?", a: "Two to four working days in the EU, and five to eight to the UK, US and Canada. Every order is tracked." },
  { q: "Can I try before I buy a full bottle?", a: "Yes. The discovery set has all four perfumes in 8 ml bottles, and its price comes off your first full bottle if you order within 60 days." },
  { q: "What happens when a perfume sells out?", a: "It comes back with its season next year. Join the letter and we will tell you the week the new batch is ready." },
  { q: "How do refills work?", a: "Send back or bring in any Quatréa bottle and we refill it for 30% less than a new one. We cover return postage in the EU." },
];

interface Form {
  name: string;
  email: string;
  topic: string;
  perfume: string;
  message: string;
}

type Field = keyof Form;
type Errors = Partial<Record<Field, string>>;

const empty: Form = { name: "", email: "", topic: topics[0], perfume: "", message: "" };

const field =
  "w-full rounded-2xl border border-line bg-white/60 px-4 py-3.5 outline-none transition-colors duration-300 placeholder:text-moss/70 focus:border-grove aria-invalid:border-plum";
const err = "mt-1.5 text-sm text-plum";

function validate(f: Form): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Enter your name";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter an email like name@example.com";
  if (f.message.trim().length < 10) e.message = "Write at least a sentence so we know how to help";
  return e;
}

export default function ContactView() {
  const ready = useReady();
  const root = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<Form>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  useGSAP(
    () => {
      if (!ready) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .from("[data-title] [data-w]", { yPercent: 105, duration: 1.2, stagger: 0.06 })
          .from("[data-fade]", { opacity: 0, y: 18, duration: 0.9, stagger: 0.08 }, 0.35);
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [ready] }
  );

  const set = (k: Field) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const v = e.target.value;
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      document.getElementById(`c-${first}`)?.focus();
      return;
    }
    setSent(true);
  };

  return (
    <div ref={root}>
      <section className="px-gutter pt-32 pb-24 tab:pt-44 tab:pb-32">
        <Words as="h1" data-title text="Write to us" className="text-mega" />

        <div className="mt-14 grid gap-14 tab:grid-cols-12 tab:gap-6">
          <div data-fade className="tab:col-span-6">
            {sent ? (
              <div role="status" className="animate-rise rounded-[2rem] bg-blossom p-8 tab:p-12">
                <span className="grid size-12 place-items-center rounded-full bg-grove text-chalk">✓</span>
                <h2 className="mt-6 text-d2">Thank you, {form.name.trim().split(" ")[0]}.</h2>
                <p className="mt-3 max-w-[40ch] text-lg">
                  We reply within two working days, usually sooner. A copy of your message is on its way to {form.email}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForm(empty);
                    setSent(false);
                  }}
                  className="mt-8 font-medium underline decoration-1 underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-5">
                <div className="grid gap-5 tab:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="mb-2 block text-sm font-medium">
                      Your name
                    </label>
                    <input
                      id="c-name"
                      autoComplete="name"
                      value={form.name}
                      onChange={set("name")}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "e-name" : undefined}
                      className={field}
                    />
                    {errors.name && (
                      <p id="e-name" className={err}>
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="c-email" className="mb-2 block text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="c-email"
                      type="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={set("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "e-email" : undefined}
                      className={field}
                    />
                    {errors.email && (
                      <p id="e-email" className={err}>
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <fieldset className="m-0 border-0 p-0">
                  <legend className="mb-2 text-sm font-medium">What is it about?</legend>
                  <div className="flex flex-wrap gap-2">
                    {topics.map((t) => (
                      <label
                        key={t}
                        className={`relative cursor-pointer rounded-full border px-4 py-2.5 text-[0.95rem] transition-colors duration-300 has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 ${
                          form.topic === t ? "border-grove bg-grove text-chalk" : "border-line hover:border-grove/50"
                        }`}
                      >
                        <input type="radio" name="topic" value={t} checked={form.topic === t} onChange={set("topic")} className="absolute inset-0 cursor-pointer opacity-0" />
                        {t}
                      </label>
                    ))}
                  </div>
                </fieldset>

                <div>
                  <label htmlFor="c-perfume" className="mb-2 block text-sm font-medium">
                    Perfume, if it is about one <span className="font-normal text-moss">(optional)</span>
                  </label>
                  <select id="c-perfume" value={form.perfume} onChange={set("perfume")} className={`${field} appearance-none`}>
                    <option value="">None in particular</option>
                    {perfumes.map((p) => (
                      <option key={p.slug} value={p.name}>
                        {p.name}, {p.season.toLowerCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="c-message" className="mb-2 block text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="c-message"
                    rows={5}
                    value={form.message}
                    onChange={set("message")}
                    aria-invalid={!!errors.message}
                    aria-describedby={errors.message ? "e-message" : undefined}
                    className={`${field} resize-y`}
                  />
                  {errors.message && (
                    <p id="e-message" className={err}>
                      {errors.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-5 pt-2">
                  <button type="submit" className={btn}>
                    Send message
                  </button>
                  <p className="text-sm text-moss">We reply within two working days.</p>
                </div>
              </form>
            )}
          </div>

          <aside data-fade aria-label="Boutique details" className="tab:col-span-5 tab:col-start-8">
            <Photo id={atelierPhotos.bottles} alt="Amber glass bottles on a shelf in the atelier" tone="#d8cbb4" sizes="(min-width: 901px) 40vw, 100vw" className="aspect-[4/3] rounded-[2rem]" />
            <div className="mt-8 grid gap-6 tab:grid-cols-2">
              <div>
                <h2 className="text-sm text-moss">Boutique and atelier</h2>
                <address className="mt-2 text-lg not-italic">
                  14 rue de l&apos;Oratoire
                  <br />
                  06130 Grasse, France
                </address>
              </div>
              <div>
                <h2 className="text-sm text-moss">Opening hours</h2>
                <p className="mt-2 text-lg">
                  Tuesday to Saturday
                  <br />
                  10:00 to 18:30
                </p>
              </div>
              <div>
                <h2 className="text-sm text-moss">Email</h2>
                <a href="mailto:bonjour@quatrea.fr" className="mt-2 inline-block text-lg underline decoration-1 underline-offset-4">
                  bonjour@quatrea.fr
                </a>
              </div>
              <div>
                <h2 className="text-sm text-moss">Phone</h2>
                <a href="tel:+33493000000" className="mt-2 inline-block text-lg underline decoration-1 underline-offset-4">
                  +33 4 93 00 00 00
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="border-t border-line px-gutter py-24 tab:py-32">
        <div className="grid gap-10 tab:grid-cols-12">
          <h2 id="faq-title" className="text-d2 tab:col-span-4">
            Questions we get a lot
          </h2>
          <div className="tab:col-span-7 tab:col-start-6">
            {faqs.map((f, i) => {
              const on = open === i;
              return (
                <div key={f.q} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(on ? null : i)}
                      className="flex w-full items-center justify-between gap-6 py-5 text-left text-xl font-semibold [font-stretch:88%]"
                    >
                      {f.q}
                      <span aria-hidden="true" className={`grid size-9 shrink-0 place-items-center rounded-full border border-line transition-transform duration-500 ease-q ${on ? "rotate-45 bg-sun" : ""}`}>
                        +
                      </span>
                    </button>
                  </h3>
                  <div id={`faq-${i}`} className={`grid transition-[grid-template-rows] duration-500 ease-q ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden" inert={!on}>
                      <p className="max-w-[56ch] pb-6 text-lg text-moss">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
