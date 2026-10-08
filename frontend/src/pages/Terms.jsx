import LegalPage from "./Legal";
import usePageMeta from "@/hooks/usePageMeta";
import { useLocalizedSeo } from "@/lib/locale";

export default function Terms() {
  usePageMeta(useLocalizedSeo("/terms"));
  return <LegalPage pageKey="terms" testId="terms-conditions" />;
}
