export type Season = "Spring" | "Summer" | "Autumn" | "Winter";
export type NoteStage = "top" | "heart" | "base";

export interface Perfume {
  slug: string;
  no: string;
  name: string;
  season: Season;
  months: string;
  monthIndex: number[];
  line: string;
  story: string;
  color: string;
  deep: string;
  ink: string;
  liquid: string;
  notes: Record<NoteStage, string[]>;
  origins: { note: string; place: string }[];
  concentration: string;
  lasts: string;
  wear: string;
  photos: { hero: string; detail: string; wide: string };
  notePhotos: Record<NoteStage, string>;
}

export const perfumes: Perfume[] = [
  {
    slug: "cerisier",
    no: "1",
    name: "Cerisier",
    season: "Spring",
    months: "March to May",
    monthIndex: [2, 3, 4],
    line: "Cherry blossom on a wet branch, the morning after the first warm rain.",
    story:
      "We wanted the smell of a city park in April, when every tree goes pink overnight. Cerisier opens with crisp pear and a little pink pepper, settles on cherry blossom and peony, and dries down to a clean, soft musk that feels like a cotton shirt in the sun.",
    color: "#f3b8c3",
    deep: "#c9667a",
    ink: "#1f3a2e",
    liquid: "#f6c9d1",
    notes: {
      top: ["Pear", "Pink pepper", "Bergamot"],
      heart: ["Cherry blossom", "Peony", "Rose de mai"],
      base: ["White musk", "Ambrette", "Light cedar"],
    },
    origins: [
      { note: "Rose de mai", place: "Grasse, France" },
      { note: "Bergamot", place: "Calabria, Italy" },
      { note: "Ambrette", place: "Ecuador" },
    ],
    concentration: "Eau de parfum, 16%",
    lasts: "6 to 7 hours",
    wear: "Daytime, first warm days, light jackets",
    photos: {
      hero: "1522383225653-ed111181a951",
      detail: "1615108395437-df128ad79e80",
      wide: "1462275646964-a0e3386b89fa",
    },
    notePhotos: {
      top: "1774387981914-c5a133e7380b",
      heart: "1575543483595-568b7afb6b9e",
      base: "1771370040156-2818cf6479b4",
    },
  },
  {
    slug: "citron-sale",
    no: "2",
    name: "Citron Salé",
    season: "Summer",
    months: "June to August",
    monthIndex: [5, 6, 7],
    line: "Lemon peel, sea salt and warm skin, at the end of a long day by the water.",
    story:
      "Citron Salé started on a terrace in Amalfi with a cut lemon, a glass of cold water and the smell of the sea drying on our arms. It is bright and salty at first, then neroli and fig leaf come through, and it finishes on driftwood and a little ambergris.",
    color: "#f4c02e",
    deep: "#b8860b",
    ink: "#1f3a2e",
    liquid: "#f7d96a",
    notes: {
      top: ["Amalfi lemon", "Sea salt", "Mint"],
      heart: ["Neroli", "Fig leaf", "Jasmine"],
      base: ["Driftwood", "Ambergris", "Vetiver"],
    },
    origins: [
      { note: "Lemon", place: "Amalfi, Italy" },
      { note: "Neroli", place: "Nabeul, Tunisia" },
      { note: "Vetiver", place: "Haiti" },
    ],
    concentration: "Eau de parfum, 15%",
    lasts: "5 to 6 hours",
    wear: "Heat, holidays, after a swim",
    photos: {
      hero: "1566357081990-3ff4baceec39",
      detail: "1526438281712-35d96b8586e5",
      wide: "1617532770043-3c7d49fe43d4",
    },
    notePhotos: {
      top: "1609639643505-3c158a56de42",
      heart: "1612380635121-411eda9ecbb9",
      base: "1531937363610-c780e5eabe53",
    },
  },
  {
    slug: "figue-noire",
    no: "3",
    name: "Figue Noire",
    season: "Autumn",
    months: "September to November",
    monthIndex: [8, 9, 10],
    line: "Ripe figs, cinnamon bark and leaves turning gold on a cold, bright afternoon.",
    story:
      "Figue Noire is the first sweater of the year. Black fig and plum make it rich and a bit jammy, cinnamon and iris keep it dry, and the base of sandalwood and tonka is warm enough to carry you through to the first frost.",
    color: "#7a2e3a",
    deep: "#5a1f29",
    ink: "#f3f3ef",
    liquid: "#9c3b3f",
    notes: {
      top: ["Black fig", "Plum", "Cardamom"],
      heart: ["Cinnamon bark", "Iris", "Tobacco leaf"],
      base: ["Sandalwood", "Tonka bean", "Patchouli"],
    },
    origins: [
      { note: "Iris", place: "Florence, Italy" },
      { note: "Cinnamon", place: "Sri Lanka" },
      { note: "Sandalwood", place: "Western Australia" },
    ],
    concentration: "Eau de parfum, 18%",
    lasts: "8 to 10 hours",
    wear: "Evenings, wool coats, long walks",
    photos: {
      hero: "1506193503569-d57d2a678510",
      detail: "1508255139162-e1f7b7288ab7",
      wide: "1473343775075-61805b64e5d6",
    },
    notePhotos: {
      top: "1635341814161-d696d538542c",
      heart: "1622798337764-259682f03741",
      base: "1523712999610-f77fbcfc3843",
    },
  },
  {
    slug: "bois-de-neige",
    no: "4",
    name: "Bois de Neige",
    season: "Winter",
    months: "December to February",
    monthIndex: [11, 0, 1],
    line: "A pine forest after snowfall, and a fire somewhere close by.",
    story:
      "Bois de Neige smells like coming in from the cold. Frosted pine and juniper make the opening sharp and clean, cardamom and a thread of incense warm it up, and vanilla and cedar stay on your scarf until the next morning.",
    color: "#b9d3e6",
    deep: "#5b7f9c",
    ink: "#1f3a2e",
    liquid: "#d5e5f0",
    notes: {
      top: ["Frosted pine", "Juniper", "Clementine"],
      heart: ["Cardamom", "Incense", "Clove"],
      base: ["Vanilla", "Cedar", "Benzoin"],
    },
    origins: [
      { note: "Pine", place: "Vosges, France" },
      { note: "Vanilla", place: "Madagascar" },
      { note: "Benzoin", place: "Laos" },
    ],
    concentration: "Extrait de parfum, 20%",
    lasts: "10 hours or more",
    wear: "Cold nights, holidays, a long dinner",
    photos: {
      hero: "1610011722905-a2d4b5fca8c0",
      detail: "1779114690607-57d5b0a2c562",
      wide: "1491002052546-bf38f186af56",
    },
    notePhotos: {
      top: "1500069939889-ab1dbbdb9d19",
      heart: "1770217535698-dd125e5d36c5",
      base: "1592788174877-3f99727fd23d",
    },
  },
];

export const sizes = [
  { ml: 50, price: 145 },
  { ml: 100, price: 210 },
];

export const discoverySet = { name: "The year in four", detail: "4 × 8 ml", price: 48 };

export const ingredients = [
  { name: "Cherry blossom", place: "Picked in Provence", photo: "1462275646964-a0e3386b89fa", in: "cerisier" },
  { name: "Rose de mai", place: "Grasse, May only", photo: "1575543483595-568b7afb6b9e", in: "cerisier" },
  { name: "Amalfi lemon", place: "Hand-zested", photo: "1609639643505-3c158a56de42", in: "citron-sale" },
  { name: "Jasmine", place: "Picked before sunrise", photo: "1612380635121-411eda9ecbb9", in: "citron-sale" },
  { name: "Neroli", place: "Nabeul, Tunisia", photo: "1774915177131-cd087586ff62", in: "citron-sale" },
  { name: "Cinnamon bark", place: "Sri Lanka", photo: "1622798337764-259682f03741", in: "figue-noire" },
  { name: "Black fig", place: "Solliès-Pont", photo: "1635341814161-d696d538542c", in: "figue-noire" },
  { name: "Vanilla", place: "Madagascar", photo: "1592788174877-3f99727fd23d", in: "bois-de-neige" },
  { name: "Pine", place: "Vosges forest", photo: "1500069939889-ab1dbbdb9d19", in: "bois-de-neige" },
  { name: "Incense", place: "Hand-rolled, Laos", photo: "1770217535698-dd125e5d36c5", in: "bois-de-neige" },
];

export const atelierPhotos = {
  field: "1600759487717-62bbb608106e",
  bottles: "1533414765079-4bb015a31395",
  hands: "1627907599569-c52ee42afb1c",
  glass: "1775156196893-2f78299338b4",
  still: "1594125311687-3b1b3eafa9f4",
  shadow: "1526235591527-15084c256bad",
};

export const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export function getPerfume(slug: string): Perfume | undefined {
  return perfumes.find((p) => p.slug === slug);
}

export function nextPerfume(slug: string): Perfume {
  const i = perfumes.findIndex((p) => p.slug === slug);
  return perfumes[(i + 1) % perfumes.length];
}

export function perfumeForMonth(month: number): Perfume {
  return perfumes.find((p) => p.monthIndex.includes(month)) ?? perfumes[0];
}

export function photo(id: string, w = 1200, h?: number): string {
  const size = h ? `&h=${h}` : "";
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&q=72&w=${w}${size}`;
}

export function photoSet(id: string, widths = [480, 800, 1200, 1800, 2400]): string {
  return widths.map((w) => `${photo(id, w)} ${w}w`).join(", ");
}

export interface BagItem {
  id: string;
  name: string;
  detail: string;
  price: number;
  color: string;
  slug?: string;
  qty: number;
}

export function perfumeItem(p: Perfume, ml: number): Omit<BagItem, "qty"> {
  const s = sizes.find((z) => z.ml === ml) ?? sizes[0];
  return { id: `${p.slug}-${s.ml}`, name: p.name, detail: `${s.ml} ml, ${p.season.toLowerCase()}`, price: s.price, color: p.color, slug: p.slug };
}

export const setItem: Omit<BagItem, "qty"> = {
  id: "discovery-set",
  name: discoverySet.name,
  detail: `Discovery set, ${discoverySet.detail}`,
  price: discoverySet.price,
  color: "#f4c02e",
};
