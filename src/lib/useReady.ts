"use client";

import { useEffect, useState } from "react";

export default function useReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.__qReady) {
      setReady(true);
      return;
    }
    const on = () => {
      window.__qReady = true;
      setReady(true);
    };
    window.addEventListener("q:ready", on);
    return () => window.removeEventListener("q:ready", on);
  }, []);

  return ready;
}
