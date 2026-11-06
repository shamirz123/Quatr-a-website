import type { Metadata } from "next";
import CollectionView from "./CollectionView";

export const metadata: Metadata = {
  title: "Collection",
  description: "Cerisier, Citron Salé, Figue Noire and Bois de Neige. Four eaux de parfum, one for each season.",
};

export default function Page() {
  return <CollectionView />;
}
