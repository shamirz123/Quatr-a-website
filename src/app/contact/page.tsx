import type { Metadata } from "next";
import ContactView from "./ContactView";

export const metadata: Metadata = {
  title: "Contact",
  description: "Visit the Quatréa boutique in Grasse or book a private fragrance consultation.",
};

export default function Page() {
  return <ContactView />;
}
