export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M16 16V2a14 14 0 0 1 14 14Z" fill="#f3b8c3" />
      <path d="M16 16h14a14 14 0 0 1-14 14Z" fill="#f4c02e" />
      <path d="M16 16v14A14 14 0 0 1 2 16Z" fill="#7a2e3a" />
      <path d="M16 16H2A14 14 0 0 1 16 2Z" fill="#b9d3e6" />
    </svg>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 leading-none ${className}`}>
      <Mark className="size-[1.35em]" />
      <span className="text-[1.55em] font-bold tracking-[-0.045em] [font-stretch:80%]">quatréa</span>
    </span>
  );
}
