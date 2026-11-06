"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Bottle from "../Bottle";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

interface Bottle3DProps {
  light: string;
  liquid: string;
  no: string;
  name: string;
  angle?: number;
  angleRef?: { current: number };
  spin?: number;
  className?: string;
}

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Bottle3D({ light, liquid, no, name, angle = 0.5, angleRef, spin = 0, className = "" }: Bottle3DProps) {
  const fixed = useMemo(() => ({ current: angle }), [angle]);
  const box = useRef<HTMLDivElement>(null);
  const [gl, setGl] = useState<boolean | null>(null);
  const [active, setActive] = useState(false);
  const [quality, setQuality] = useState<"high" | "low">("high");
  const [still, setStill] = useState(false);
  const lost = useCallback(() => setGl(false), []);

  useEffect(() => {
    setGl(canUseWebGL());
    setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setQuality(window.matchMedia("(max-width: 900px)").matches ? "low" : "high");

    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: "120px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={box} className={`relative ${className}`}>
      {gl ? (
        <Scene
          light={light}
          liquid={liquid}
          no={no}
          name={name}
          angle={angleRef ?? fixed}
          spin={spin}
          active={active}
          quality={quality}
          still={still}
          onLost={lost}
        />
      ) : (
        <div className="grid h-full place-items-center">
          <Bottle light={light} liquid={liquid} no={no} name={name} className="h-[78%]" />
        </div>
      )}
    </div>
  );
}
