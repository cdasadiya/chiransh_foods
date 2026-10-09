import LegalPage from "./Legal";
import usePageMeta from "@/hooks/usePageMeta";
import { useLocalizedSeo } from "@/lib/locale";

export default function Privacy() {
  usePageMeta(useLocalizedSeo("/privacy"));
  return <LegalPage pageKey="privacy" testId="privacy-policy" />;
}
