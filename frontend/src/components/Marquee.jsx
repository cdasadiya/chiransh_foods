export default function Marquee({ items }) {
  return (
    <div
      className="overflow-hidden border-y border-gold/25 bg-leaf py-5"
      data-testid="editorial-marquee"
      aria-label={items.join(", ")}
    >
      <div className="marquee-track items-center">
        {[0, 1].map((dup) => (
          <div key={dup} aria-hidden={dup === 1} className="flex items-center">
            {items.map((item, i) => (
              <span key={`${dup}-${i}`} className="flex items-center">
                <span className="whitespace-nowrap px-5 font-serif text-xl italic text-cream md:text-2xl">
                  {item}
                </span>
                <span className="h-1.5 w-1.5 rotate-45 bg-gold/80" aria-hidden="true" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
