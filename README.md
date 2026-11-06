# Quatréa

A concept website for Quatréa, a fictional perfume house in Grasse that makes four perfumes, one for each season, and only while that season lasts.

Built as a frontend assessment for MAKRA.

## Pages

- `/` Home: seasonal hero panels, a pinned "year" story with a rotating month dial, a horizontal ingredient gallery, a month-to-perfume finder and the discovery set
- `/collection` All four perfumes, side-by-side comparison table
- `/fragrance/[slug]` One page per perfume (Cerisier, Citron Salé, Figue Noire, Bois de Neige) with sizes, add to bag, stacked note cards and the next season
- `/atelier` The making process with a sticky image that follows the steps
- `/contact` Validated contact form, boutique details and an FAQ

## Stack

- Next.js 15 (App Router, static export of every page)
- React 19 and TypeScript (strict)
- Tailwind CSS v4, no other stylesheets
- GSAP with ScrollTrigger for scroll-linked motion
- Lenis for smooth scrolling
- Bricolage Grotesque, self-hosted through Fontsource
- Photography from Unsplash, served from their CDN

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build:

```bash
npm run build
npm start
```

## Notes

- Motion respects `prefers-reduced-motion`.
- All scroll effects animate `transform` and `opacity` only, so scrolling stays at 60 fps.
- Every photo sits on a colour block of its season, so the layout still holds if an image is slow to load.
- The bag and forms are front-end only.
