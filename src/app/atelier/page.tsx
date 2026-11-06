import type { Metadata } from "next";
import AtelierView from "./AtelierView";

export const metadata: Metadata = {
  title: "Atelier",
  description: "How Quatréa makes four seasonal perfumes in Grasse, one small batch at a time.",
};

export default function Page() {
  return <AtelierView />;
}
