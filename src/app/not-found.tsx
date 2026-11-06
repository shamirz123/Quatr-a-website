import Link from "next/link";
import { perfumes } from "@/data/perfumes";
import { btn } from "@/lib/ui";

export default function NotFound() {
  return (
    <section className="grid min-h-svh place-content-center justify-items-center gap-6 px-gutter pt-20 text-center">
      <div aria-hidden="true" className="flex gap-2">
        {perfumes.map((p) => (
          <span key={p.slug} className="size-4 rounded-full" style={{ backgroundColor: p.color }} />
        ))}
      </div>
      <h1 className="text-d1">This page is out of season</h1>
      <p className="max-w-[36ch] text-lg text-moss">We could not find what you were looking for. The four perfumes are still where you left them.</p>
      <Link href="/collection" className={`${btn} mt-2`}>
        See the collection
      </Link>
    </section>
  );
}
