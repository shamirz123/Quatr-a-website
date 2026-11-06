import { useId, type HTMLAttributes } from "react";

type BottleProps = HTMLAttributes<HTMLDivElement> & {
  liquid: string;
  name: string;
  no: string;
  shadow?: boolean;
};

function lines(name: string): string[] {
  const w = name.split(" ");
  if (w.length < 3) return w;
  return [w.slice(0, -1).join(" "), w[w.length - 1]];
}

export default function Bottle({ liquid, name, no, shadow = true, className = "", ...rest }: BottleProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const rows = lines(name);
  const fs = rows.some((r) => r.length > 7) ? 15 : 18;

  return (
    <div className={className} {...rest}>
      <svg viewBox="0 0 160 300" className="h-full w-auto max-w-full overflow-visible" aria-hidden="true">
        <defs>
          <linearGradient id={`g${uid}`} x1="0" x2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="0.12" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="0.8" stopColor="#fff" stopOpacity="0" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id={`l${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={liquid} stopOpacity="0.85" />
            <stop offset="1" stopColor={liquid} />
          </linearGradient>
          <linearGradient id={`c${uid}`} x1="0" x2="1">
            <stop offset="0" stopColor="#2c4f40" />
            <stop offset="0.35" stopColor="#1f3a2e" />
            <stop offset="1" stopColor="#15291f" />
          </linearGradient>
        </defs>

        {shadow && <ellipse cx="80" cy="296" rx="70" ry="6" fill="#1f3a2e" opacity="0.22" />}

        <rect x="56" y="4" width="48" height="62" rx="6" fill={`url(#c${uid})`} />
        <rect x="62" y="10" width="4" height="50" rx="2" fill="#fff" opacity="0.18" />
        <rect x="64" y="64" width="32" height="14" fill="#cfd3cc" />
        <rect x="64" y="64" width="32" height="3" fill="#fff" opacity="0.6" />

        <rect x="12" y="76" width="136" height="216" rx="26" fill="#fff" fillOpacity="0.5" />
        <rect x="22" y="100" width="116" height="168" rx="16" fill={`url(#l${uid})`} />
        <rect x="12" y="76" width="136" height="216" rx="26" fill={`url(#g${uid})`} />
        <rect x="12.75" y="76.75" width="134.5" height="214.5" rx="25.25" fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.5" />
        <path d="M24 112c0-10 4-18 12-22" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.8" />

        <rect x="38" y="146" width="84" height="92" rx="3" fill="#f3f3ef" />
        <text x="80" y="166" textAnchor="middle" fill="#1f3a2e" fontSize="9.5" fontWeight="700" letterSpacing="0.02em" style={{ fontStretch: "80%" }}>
          quatréa
        </text>
        <line x1="50" y1="174" x2="110" y2="174" stroke="#1f3a2e" strokeOpacity="0.25" />
        {rows.map((r, i) => (
          <text
            key={r}
            x="80"
            y={rows.length > 1 ? 198 + i * (fs + 1) - (fs + 1) / 2 : 204}
            textAnchor="middle"
            fill="#1f3a2e"
            fontSize={fs}
            fontWeight="600"
            letterSpacing="-0.03em"
            style={{ fontStretch: "78%" }}
          >
            {r}
          </text>
        ))}
        <text x="80" y="230" textAnchor="middle" fill="#1f3a2e" fillOpacity="0.6" fontSize="8">
          N°{no}
        </text>
      </svg>
    </div>
  );
}
