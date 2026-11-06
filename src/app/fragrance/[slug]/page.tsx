import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { perfumes, getPerfume, nextPerfume } from "@/data/perfumes";
import FragranceView from "./FragranceView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return perfumes.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const p = getPerfume(slug);
  if (!p) return {};
  return { title: `${p.name}, ${p.season}`, description: p.line };
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const p = getPerfume(slug);
  if (!p) notFound();
  return <FragranceView key={p.slug} p={p} next={nextPerfume(p.slug)} />;
}
