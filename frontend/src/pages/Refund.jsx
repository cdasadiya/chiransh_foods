import LegalPage from "./Legal";
import usePageMeta from "@/hooks/usePageMeta";
import { useLocalizedSeo } from "@/lib/locale";

export default function Refund() {
  usePageMeta(useLocalizedSeo("/refund"));
  return <LegalPage pageKey="refund" testId="refund-cancellation-policy" />;
}
