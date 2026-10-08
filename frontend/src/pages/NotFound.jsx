import { Link, useLocation } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import { getRouteSeo } from "@/lib/routeSeo";
import Reveal from "@/components/Reveal";
import { LogoMark } from "@/components/Logo";

export default function NotFound() {
  const { pathname } = useLocation();
  usePageMeta(getRouteSeo(pathname));

  return (
    <section
      className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-4 py-32"
      data-testid="notfound-page"
    >
      <div
        className="pattern-dots absolute inset-0 opacity-40"
        aria-hidden="true"
      />
      <div className="relative max-w-xl text-center">
        <Reveal>
          <LogoMark className="mx-auto h-24 w-24 text-leaf/25" />
          <p
            aria-hidden="true"
            className="text-outline mt-2 select-none font-serif text-[6rem] font-bold leading-none sm:text-[8rem]"
          >
            404
          </p>
          <h1 className="mt-4 font-serif text-3xl font-semibold text-leaf sm:text-4xl">
            Looks like this plate is empty.
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-base leading-relaxed text-stone-600">
            The page you're looking for isn't on the menu — but plenty of good
            food is.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/menu"
              data-testid="notfound-return-menu-btn"
              className="group inline-flex items-center gap-2 rounded-full bg-leaf px-7 py-3.5 font-display text-sm font-semibold text-cream shadow-soft transition-colors hover:bg-forest"
            >
              Return to Menu
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/"
              data-testid="notfound-return-home-btn"
              className="inline-flex items-center gap-2 rounded-full border border-leaf/25 px-7 py-3.5 font-display text-sm font-semibold text-leaf transition-colors hover:border-leaf hover:bg-ivory"
            >
              Back to Home
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
