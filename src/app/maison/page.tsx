import type { Metadata } from "next";
import MaisonView from "./MaisonView";

export const metadata: Metadata = {
  title: "Maison",
  description: "The story of Maison Quatréa, a small perfume house in Grasse that makes four perfumes, one season at a time.",
};

export default function Page() {
  return <MaisonView />;
}
