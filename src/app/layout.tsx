import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@/styles/globals.css";

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Quatréa | A year in four perfumes",
    template: "%s | Quatréa",
  },
  description: "Quatréa makes four eaux de parfum in Grasse, one for each season, bottled once a year when its ingredients are at their best.",
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = {
  themeColor: "#f3f3ef",
};

const seen = `try{if(sessionStorage.getItem("q-seen")==="1")document.documentElement.classList.add("q-seen")}catch(e){}`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: seen }} />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </head>
      <body>
        <Providers>
          <a href="#main" className="fixed top-3 left-3 z-[200] -translate-y-[200%] rounded-full bg-sun px-5 py-2.5 text-grove focus:translate-y-0">
            Skip to content
          </a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
