"use client";

import { useState, type FormEvent } from "react";
import TLink from "./TLink";
import { Mark } from "./Logo";
import { perfumes } from "@/data/perfumes";

const head = "mb-4 text-sm text-chalk/55";
const item = "inline-block py-1 transition-colors duration-300 hover:text-sun";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErr("Enter an email like name@example.com");
      return;
    }
    setErr("");
    setDone(true);
  };

  return (
    <footer className="relative overflow-hidden bg-grove text-chalk">
      <div className="grid gap-14 px-gutter pt-20 pb-12 tab:grid-cols-12 tab:pt-28">
        <div className="tab:col-span-5">
          <h2 className="max-w-[14ch] text-d2">Four letters a year, one for each season.</h2>
          <p className="mt-5 max-w-[40ch] text-chalk/70">We write when a new batch is ready. Subscribers get first access, usually a week before everyone else.</p>

          {done ? (
            <p className="mt-8 flex items-center gap-3 text-xl" role="status">
              <span className="grid size-8 place-items-center rounded-full bg-sun text-sm text-grove">✓</span>
              You are on the list. See you next season.
            </p>
          ) : (
            <form onSubmit={submit} noValidate className="mt-8 max-w-md">
              <label htmlFor="ft-email" className="sr-only">
                Email address
              </label>
              <div className="flex rounded-full bg-chalk/10 p-1.5 ring-1 ring-chalk/15 focus-within:ring-sun">
                <input
                  id="ft-email"
                  type="email"
                  autoComplete="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!err}
                  aria-describedby={err ? "ft-err" : undefined}
                  className="min-w-0 flex-1 bg-transparent px-4 outline-none placeholder:text-chalk/50"
                />
                <button type="submit" className="rounded-full bg-sun px-5 py-2.5 font-medium text-grove transition-transform duration-300 hover:scale-[1.03]">
                  Subscribe
                </button>
              </div>
              {err && (
                <p id="ft-err" className="mt-3 pl-4 text-sm text-blossom">
                  {err}
                </p>
              )}
            </form>
          )}
        </div>

        <div className="grid grid-cols-2 gap-10 tab:col-span-6 tab:col-start-7 tab:grid-cols-3">
          <div>
            <p className={head}>Perfumes</p>
            <ul className="grid">
              {perfumes.map((p) => (
                <li key={p.slug}>
                  <TLink href={`/fragrance/${p.slug}`} text={p.name} color={p.color} ink={p.ink} className={`${item} flex items-center gap-2`}>
                    <span aria-hidden="true" className="size-2 rounded-full" style={{ backgroundColor: p.color }} />
                    {p.name}
                  </TLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className={head}>House</p>
            <ul className="grid">
              <li>
                <TLink href="/collection" text="Collection" className={item}>
                  Collection
                </TLink>
              </li>
              <li>
                <TLink href="/atelier" text="Atelier" className={item}>
                  Atelier
                </TLink>
              </li>
              <li>
                <TLink href="/contact" text="Contact" className={item}>
                  Contact
                </TLink>
              </li>
            </ul>
          </div>
          <div className="col-span-2 tab:col-span-1">
            <p className={head}>Boutique</p>
            <address className="text-chalk/85 not-italic">
              14 rue de l&apos;Oratoire
              <br />
              06130 Grasse, France
              <br />
              <a href="mailto:bonjour@quatrea.fr" className={item}>
                bonjour@quatrea.fr
              </a>
            </address>
          </div>
        </div>
      </div>

      <div aria-hidden="true" className="flex items-end justify-between gap-[3vw] overflow-hidden px-gutter pt-6 select-none">
        <span className="pb-[0.06em] text-[min(28vw,30rem)] leading-[0.86] font-bold tracking-[-0.035em] [font-stretch:80%]">quatréa</span>
        <Mark className="mb-[2.4vw] size-[min(12vw,13rem)] shrink-0 animate-spin-slow" />
      </div>

      <div className="flex flex-col gap-2 border-t border-chalk/15 px-gutter py-6 text-sm text-chalk/60 tab:flex-row tab:justify-between">
        <p>© 2026 Quatréa, Grasse. A concept brand.</p>
        <p>Concept, design and development by Shahmeer Zubair</p>
      </div>
    </footer>
  );
}
