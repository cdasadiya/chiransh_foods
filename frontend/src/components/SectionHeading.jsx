import Reveal from "./Reveal";

export default function SectionHeading({
  eyebrow,
  title,
  lede,
  align = "left",
  dark = false,
}) {
  const alignClass = align === "center" ? "items-center text-center" : "";
  return (
    <Reveal className={`flex flex-col ${alignClass}`}>
      {eyebrow && (
        <p
          className={`font-display text-xs font-semibold uppercase tracking-[0.3em] ${
            dark ? "text-gold" : "text-saffron-deep"
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-3 font-serif text-3xl font-semibold leading-[1.15] sm:text-4xl lg:text-[2.75rem] ${
          dark ? "text-cream" : "text-leaf"
        }`}
      >
        {title}
      </h2>
      {lede && (
        <p
          className={`mt-4 max-w-2xl text-base leading-relaxed ${
            dark ? "text-cream/70" : "text-stone-600"
          }`}
        >
          {lede}
        </p>
      )}
    </Reveal>
  );
}
