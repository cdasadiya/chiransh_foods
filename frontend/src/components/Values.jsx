import { Flame, HeartHandshake, Leaf } from "lucide-react";
import Reveal from "./Reveal";

export const BRAND_VALUES = [
  {
    slug: "vegetarian",
    Icon: Leaf,
    title: "100% Vegetarian",
    text: "Every dish we make is fully vegetarian — no exceptions, no shortcuts.",
  },
  {
    slug: "authenticity",
    Icon: Flame,
    title: "Baroda-style Authenticity",
    text: "Street-food recipes that stay true to the flavours of Gujarat.",
  },
  {
    slug: "care",
    Icon: HeartHandshake,
    title: "Home-style Care",
    text: "Prepared at home with clean, careful and consistent quality.",
  },
];

export function ValuesGrid() {
  return BRAND_VALUES.map((v, i) => (
    <Reveal key={v.slug} delay={0.1 + i * 0.08} className="md:col-span-4">
      <div
        data-testid={`value-card-${v.slug}`}
        className="flex h-full items-start gap-4 rounded-2xl border border-leaf/10 bg-ivory p-6 shadow-soft"
      >
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-leaf/5 text-saffron-deep">
          <v.Icon className="h-5 w-5" />
        </span>
        <div>
          <h3 className="font-serif text-lg font-semibold text-leaf">{v.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-stone-600">{v.text}</p>
        </div>
      </div>
    </Reveal>
  ));
}
