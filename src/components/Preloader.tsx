"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { monthNames } from "@/data/perfumes";
import { Mark } from "./Logo";

const tones = ["#b9d3e6", "#b9d3e6", "#f3b8c3", "#f3b8c3", "#f3b8c3", "#f4c02e", "#f4c02e", "#f4c02e", "#7a2e3a", "#7a2e3a", "#7a2e3a", "#b9d3e6"];

function release() {
  window.__qReady = true;
  window.dispatchEvent(new Event("q:ready"));
}

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);
  const word = useRef<HTMLSpanElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const el = root.current;
    const w = word.current;
    let seen = false;
    try {
      seen = sessionStorage.getItem("q-seen") === "1";
      sessionStorage.setItem("q-seen", "1");
    } catch {}

    if (!el || !w || seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShow(false);
      release();
      return;
    }

    document.documentElement.style.overflow = "hidden";
    const state = { i: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.style.overflow = "";
        setShow(false);
      },
    });

    tl.from("[data-pre-mark]", { scale: 0, rotate: -90, duration: 0.6, ease: "back.out(1.6)" })
      .to(
        state,
        {
          i: 11,
          duration: 1.5,
          ease: "power1.inOut",
          onUpdate: () => {
            const n = Math.round(state.i);
            if (w.dataset.n === String(n)) return;
            w.dataset.n = String(n);
            w.textContent = monthNames[n];
            el.style.backgroundColor = tones[n];
            el.style.color = n >= 8 && n <= 10 ? "#f3f3ef" : "#1f3a2e";
          },
        },
        0.2
      )
      .add(release, "+=0.1")
      .to(el, { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "<");

    return () => {
      tl.kill();
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div ref={root} aria-hidden="true" className="fixed inset-0 z-[100] grid place-items-center bg-chalk text-grove [.q-seen_&]:hidden">
      <div className="grid justify-items-center gap-6">
        <span data-pre-mark className="block">
          <Mark className="size-14" />
        </span>
        <span ref={word} className="block text-d1 font-semibold tabular-nums [font-stretch:80%]">
          January
        </span>
        <span className="text-sm opacity-70">A year in four perfumes</span>
      </div>
    </div>
  );
}
