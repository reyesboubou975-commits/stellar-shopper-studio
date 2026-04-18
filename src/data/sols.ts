// Catalog of available "sols" (surfaces) for product photography.
// Each entry includes the texture, a display name, vibe and the prompt used by the AI.
import oak from "@/assets/floor-oak.jpg";
import marble from "@/assets/floor-marble.jpg";
import linen from "@/assets/floor-linen.jpg";
import concrete from "@/assets/floor-concrete.jpg";
import walnut from "@/assets/floor-walnut.jpg";
import plaster from "@/assets/floor-plaster.jpg";

import oakBefore from "@/assets/ba/oak-before.jpg";
import oakAfter from "@/assets/ba/oak-after.jpg";
import marbleBefore from "@/assets/ba/marble-before.jpg";
import marbleAfter from "@/assets/ba/marble-after.jpg";
import linenBefore from "@/assets/ba/linen-before.jpg";
import linenAfter from "@/assets/ba/linen-after.jpg";
import concreteBefore from "@/assets/ba/concrete-before.jpg";
import concreteAfter from "@/assets/ba/concrete-after.jpg";
import walnutBefore from "@/assets/ba/walnut-before.jpg";
import walnutAfter from "@/assets/ba/walnut-after.jpg";
import plasterBefore from "@/assets/ba/plaster-before.jpg";
import plasterAfter from "@/assets/ba/plaster-after.jpg";

export type SolId = "oak" | "marble" | "linen" | "concrete" | "walnut" | "plaster";

export interface Sol {
  id: SolId;
  name: string;
  tagline: string;
  description: string;
  vibe: string;
  bestFor: string[];
  image: string;
  prompt: string;
  example: { before: string; after: string; product: string };
}

export const SOLS: Sol[] = [
  {
    id: "oak",
    name: "Chêne clair",
    tagline: "Naturel & chaleureux",
    description: "Un parquet de chêne clair, doux et lumineux. Le sol favori des vendeurs vintage et boho.",
    vibe: "Boho · Vintage · Naturel",
    bestFor: ["Vêtements", "Sneakers", "Accessoires"],
    image: oak,
    prompt: "natural light oak parquet wood floor with soft warm window daylight from the left, very subtle realistic shadows",
  },
  {
    id: "marble",
    name: "Marbre blanc",
    tagline: "Luxueux & épuré",
    description: "Le marbre Calacatta blanc, parfait pour des pièces premium qui méritent leur mise en valeur.",
    vibe: "Luxe · Premium · Minimal",
    bestFor: ["Bijoux", "Sacs de luxe", "Cosmétiques"],
    image: marble,
    prompt: "polished white Calacatta marble surface with subtle gray veining and soft daylight, premium look",
  },
  {
    id: "linen",
    name: "Lin naturel",
    tagline: "Tactile & poétique",
    description: "Une nappe de lin beige avec des plis doux. Ambiance éditoriale, comme un magazine de mode.",
    vibe: "Éditorial · Doux · Mode",
    bestFor: ["Robes", "Lingerie", "Accessoires délicats"],
    image: linen,
    prompt: "warm beige natural linen fabric backdrop with soft folds and gentle directional daylight",
  },
  {
    id: "concrete",
    name: "Béton brut",
    tagline: "Urbain & moderne",
    description: "Un béton ciré gris pour un style streetwear, contemporain et photogénique.",
    vibe: "Streetwear · Urbain · Moderne",
    bestFor: ["Sneakers", "Streetwear", "Tech"],
    image: concrete,
    prompt: "smooth polished gray concrete floor with even soft daylight, contemporary minimalist surface",
  },
  {
    id: "walnut",
    name: "Noyer foncé",
    tagline: "Riche & dramatique",
    description: "Un parquet de noyer foncé qui fait ressortir les couleurs claires et les pièces d'exception.",
    vibe: "Dramatique · Premium · Vintage",
    bestFor: ["Maroquinerie", "Pièces claires", "Vintage"],
    image: walnut,
    prompt: "rich dark walnut wood floor with visible grain and warm moody directional lighting",
  },
  {
    id: "plaster",
    name: "Papier crème",
    tagline: "Pur & catalogue",
    description: "Un fond papier crème, neutre, parfait pour des photos catalogue qui inspirent confiance.",
    vibe: "Catalogue · Neutre · Pro",
    bestFor: ["Tout type d'article", "E-commerce", "Lookbook"],
    image: plaster,
    prompt: "smooth cream off-white seamless paper photography backdrop with soft even diffused lighting",
  },
];

export const LIGHTS = [
  { id: "soft-window", name: "Fenêtre douce", description: "Lumière naturelle de fenêtre, douce et flatteuse" },
  { id: "golden-hour", name: "Golden hour", description: "Lumière chaude et dorée, fin d'après-midi" },
  { id: "studio", name: "Studio diffusé", description: "Éclairage studio uniforme, sans ombres dures" },
  { id: "moody", name: "Moody / contraste", description: "Ombres marquées, ambiance dramatique" },
] as const;

export const FORMATS = [
  { id: "square", name: "Carré 1:1", w: 1024, h: 1024, hint: "Idéal Vinted feed" },
  { id: "portrait", name: "Portrait 4:5", w: 1024, h: 1280, hint: "Story / mobile" },
  { id: "landscape", name: "Paysage 3:2", w: 1280, h: 854, hint: "Hero / desktop" },
] as const;

export type LightId = typeof LIGHTS[number]["id"];
export type FormatId = typeof FORMATS[number]["id"];
