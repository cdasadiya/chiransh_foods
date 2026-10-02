import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

export default function LegalPage({ eyebrow, title, intro, sections, testId }) {
  return (
    <>
      <header className="relative overflow-hidden bg-leaf" data-testid={`${testId}-header`}>
        <div
          className="pattern-dots-light absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-40">
          <SectionHeading dark eyebrow={eyebrow} title={title} />
        </div>
      </header>
      <section
        className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-20"
        data-testid={testId}
      >
        {intro && (
          <Reveal>
            <p className="text-base leading-relaxed text-stone-600">{intro}</p>
          </Reveal>
        )}
        <div className="mt-10 space-y-9">
          {sections.map((s, i) => (
            <Reveal key={s.h} delay={Math.min(i * 0.04, 0.2)}>
              <h2 className="font-serif text-xl font-semibold text-leaf">{s.h}</h2>
              {s.p.map((para, j) => (
                <p
                  key={j}
                  className="mt-3 text-sm leading-relaxed text-stone-600"
                >
                  {para}
                </p>
              ))}
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.1}>
          <p className="mt-12 rounded-2xl border border-leaf/10 bg-ivory p-5 text-xs italic leading-relaxed text-stone-500">
            This policy is kept simple and honest for now. As Chiransh Foods
            grows — online ordering, payments and analytics — this page will be
            updated to reflect exactly how your information and orders are
            handled.
          </p>
        </Reveal>
      </section>
    </>
  );
}
