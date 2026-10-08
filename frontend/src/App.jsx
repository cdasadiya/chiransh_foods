import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LocaleSync } from "@/lib/locale";
import { LOCALES } from "@/lib/seo";
import { Toaster } from "@/components/ui/sonner";
import ErrorBoundary from "@/components/ErrorBoundary";
import SmoothScroll from "@/components/SmoothScroll";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SettingsProvider } from "@/context/SettingsContext";
// Home is eager (landing page); other routes are code-split into their own chunks.
import Home from "@/pages/Home";
const Menu = lazy(() => import("@/pages/Menu"));
const ProductDetail = lazy(() => import("@/pages/ProductDetail"));
const About = lazy(() => import("@/pages/About"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const Contact = lazy(() => import("@/pages/Contact"));
const FAQ = lazy(() => import("@/pages/FAQ"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));
const Refund = lazy(() => import("@/pages/Refund"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function siteRoutes() {
  return [
    <Route key="home" index element={<Home />} />,
    <Route key="menu" path="menu" element={<Menu />} />,
    <Route key="dish" path="menu/:slug" element={<ProductDetail />} />,
    <Route key="about" path="about" element={<About />} />,
    <Route key="gallery" path="gallery" element={<Gallery />} />,
    <Route key="contact" path="contact" element={<Contact />} />,
    <Route key="faq" path="faq" element={<FAQ />} />,
    <Route key="privacy" path="privacy" element={<Privacy />} />,
    <Route key="terms" path="terms" element={<Terms />} />,
    <Route key="refund" path="refund" element={<Refund />} />,
    <Route key="missing" path="*" element={<NotFound />} />,
  ];
}

function App() {
  const { t } = useTranslation();
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <BrowserRouter>
          <SmoothScroll>
            <div className="texture-grain flex min-h-screen flex-col bg-cream font-sans text-charcoal">
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-leaf focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
              >
                {t("a11y.skip")}
              </a>
              <LocaleSync />
              <Navbar />
              <main id="main-content" className="flex-1 pt-[env(safe-area-inset-top)]">
                <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true"><span className="sr-only">{t("a11y.loading")}</span></div>}>
                <Routes>
                  {LOCALES.filter((locale) => locale.prefix).map((locale) => (
                    <Route key={locale.code} path={locale.prefix} element={<Outlet />}>
                      {siteRoutes()}
                    </Route>
                  ))}
                  <Route path="/" element={<Outlet />}>
                    {siteRoutes()}
                  </Route>
                </Routes>
                </Suspense>
              </main>
              <Footer />
              <Toaster position="top-center" richColors />
            </div>
          </SmoothScroll>
        </BrowserRouter>
      </SettingsProvider>
    </ErrorBoundary>
  );
}

export default App;
