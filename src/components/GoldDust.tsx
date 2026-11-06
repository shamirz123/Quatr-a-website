"use client";

import { useEffect, useRef } from "react";

interface Mote {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  phase: number;
  speed: number;
}

interface GoldDustProps {
  color?: string;
  count?: number;
  className?: string;
}

export default function GoldDust({ color = "#c9a96b", count = 70, className = "" }: GoldDustProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const tint = useRef(color);

  useEffect(() => {
    tint.current = color;
  }, [color]);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let motes: Mote[] = [];

    const spawn = (anywhere: boolean): Mote => ({
      x: Math.random() * w,
      y: anywhere ? Math.random() * h : h + 10,
      r: 0.6 + Math.random() * 1.8,
      vy: 0.12 + Math.random() * 0.35,
      vx: (Math.random() - 0.5) * 0.15,
      phase: Math.random() * Math.PI * 2,
      speed: 0.01 + Math.random() * 0.03,
    });

    const resize = () => {
      const dpr = 1;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(count * Math.min(1, w / 1400 + 0.35));
      motes = Array.from({ length: n }, () => spawn(true));
    };

    const paint = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = tint.current;
      for (const m of motes) {
        const a = 0.25 + 0.75 * Math.abs(Math.sin(m.phase));
        ctx.globalAlpha = a * 0.8;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        m.y -= m.vy;
        m.x += m.vx + Math.sin(m.phase) * 0.12;
        m.phase += m.speed;
        if (m.y < -10) motes[i] = spawn(false);
      }
      paint();
    };

    resize();
    if (reduce) paint();
    else tick();

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [count]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}
