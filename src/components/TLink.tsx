"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes, MouseEvent, ReactNode } from "react";
import { usePageTransition } from "./Providers";

type TLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "color"> & {
  href: string;
  color?: string;
  ink?: string;
  text?: string;
  children: ReactNode;
  [data: `data-${string}`]: string | boolean | undefined;
};

export default function TLink({ href, color, ink, text, children, onClick, ...rest }: TLinkProps) {
  const { go } = usePageTransition();

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    onClick?.(e);
    const keyboard = e.detail === 0;
    go(href, { color, ink, text, x: keyboard ? undefined : e.clientX, y: keyboard ? undefined : e.clientY });
  };

  return (
    <Link href={href} onClick={handle} {...rest}>
      {children}
    </Link>
  );
}
