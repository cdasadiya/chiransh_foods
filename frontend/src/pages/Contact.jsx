import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from "lucide-react";
import usePageMeta from "@/hooks/usePageMeta";
import { useLocalizedSeo } from "@/lib/locale";
import { fetchProducts, submitEnquiry } from "@/lib/api";
import { FALLBACK_PRODUCTS, whatsappUrl } from "@/lib/site";
import { useTranslation } from "react-i18next";
import { useSettings } from "@/context/SettingsContext";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const inputCls =
  "w-full rounded-xl border border-leaf/15 bg-ivory px-4 py-3 text-sm text-charcoal placeholder:text-stone-400 transition focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/30";

export default function Contact() {
  usePageMeta(useLocalizedSeo("/contact"));

  const { t } = useTranslation();
  const { settings } = useSettings();
  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });
  const products = productsData?.length ? productsData : FALLBACK_PRODUCTS;

  const waContact = whatsappUrl(settings);
  const contactRows = [
    {
      Icon: Phone,
      label: t("contact.lbl_phone_val", "Phone"),
      value: settings?.contact?.phone || null,
      href: settings?.contact?.phone ? `tel:${settings.contact.phone}` : null,
    },
    {
      Icon: MessageCircle,
      label: t("contact.lbl_whatsapp_val", "WhatsApp"),
      value: waContact ? t("contact.val_chat", "Chat with us") : null,
      href: waContact,
    },
    {
      Icon: Mail,
      label: t("contact.lbl_email_val", "Email"),
      value: settings?.contact?.email || null,
      href: settings?.contact?.email
        ? `mailto:${settings.contact.email}`
        : null,
    },
  ];
  const contactEmpty = !contactRows.some((r) => r.value);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    productInterest: t("contact.opt_general", "General enquiry"),
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (form.name.trim().length < 2) errs.name = t("contact.err_name", "Please enter your name.");
    const digits = form.phone.replace(/\D/g, "");
    if (
      !/^[0-9+()\-\s]{7,20}$/.test(form.phone.trim()) ||
      digits.length < 7
    )
      errs.phone = t("contact.err_phone", "Please enter a valid phone number.");
    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    )
      errs.email = t("contact.err_email", "Please enter a valid email address.");
    return errs;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setSubmitting(true);
    try {
      await submitEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim() || undefined,
        product_interest: form.productInterest,
        message: form.message.trim(),
      });
      setSubmitted(true);
      setForm({
        name: "",
        phone: "",
        email: "",
        productInterest: t("contact.opt_general", "General enquiry"),
        message: "",
      });
      toast.success(
        t("contact.toast_success", "Thank you! We've received your enquiry and will get back to you soon.")
      );
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail
            .map((d) => d.msg?.replace("Value error, ", "") || d)
            .join(", ")
        : t("contact.toast_error", "Something went wrong while sending your enquiry. Please try again in a moment.");
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header
        className="relative overflow-hidden bg-leaf"
        data-testid="contact-header"
      >
        <div
          className="pattern-dots-light absolute inset-0 opacity-60"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pb-24 lg:pt-40">
          <SectionHeading
            dark
            eyebrow={t("contact.eyebrow_header", "Contact & Order")}
            title={
              <>
                {t("contact.title_header_1", "Let's get you ")}
                <em className="italic text-gold">{t("contact.title_header_2", "served")}</em>
              </>
            }
            lede={t("contact.lede", "Order directly on WhatsApp or send us an enquiry — we'll confirm your order personally. Online ordering is on the way.")}
          />
        </div>
      </header>

      <section
        className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:gap-14 lg:px-8 lg:py-24"
        data-testid="contact-section"
      >
        <div className="lg:col-span-7">
          <Reveal>
            {submitted ? (
              <div
                className="rounded-3xl border border-green-600/20 bg-green-50 p-10 text-center"
                data-testid="contact-form-success"
                role="status"
              >
                <CheckCircle2 className="mx-auto h-12 w-12 text-green-600" />
                <h2 className="mt-4 font-serif text-2xl font-semibold text-leaf">
                  {t("contact.form_success", "Enquiry received!")}
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-stone-600">
                  {t("contact.form_success_msg")}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  data-testid="contact-form-send-another-btn"
                  className="mt-6 rounded-full border border-leaf/20 bg-ivory px-6 py-3 font-display text-sm font-semibold text-leaf transition-colors hover:border-leaf"
                >
                  {t("contact.btn_another", "Send another enquiry")}
                </button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                data-testid="contact-order-form"
                className="rounded-3xl border border-leaf/10 bg-ivory p-6 shadow-soft sm:p-9"
              >
                <h2 className="font-serif text-2xl font-semibold text-leaf">
                  {t("contact.form_title", "Send an order enquiry")}
                </h2>
                <p className="mt-1.5 text-sm text-stone-500">
                  {t("contact.form_req", "Fields marked * are required.")}
                </p>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="font-display text-sm font-semibold text-leaf"
                    >
                      {t("contact.lbl_name", "Name *")}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={form.name}
                      onChange={set("name")}
                      data-testid="contact-name-input"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={
                        errors.name ? "contact-name-error" : undefined
                      }
                      placeholder={t("contact.plh_name", "Your full name")}
                      className={`mt-2 ${inputCls}`}
                      maxLength={80}
                    />
                    {errors.name && (
                      <p
                        id="contact-name-error"
                        className="mt-1.5 text-xs text-chili"
                        data-testid="contact-name-error"
                        role="alert"
                      >
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="contact-phone"
                      className="font-display text-sm font-semibold text-leaf"
                    >
                      {t("contact.lbl_phone", "Phone *")}
                    </label>
                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      data-testid="contact-phone-input"
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={
                        errors.phone ? "contact-phone-error" : undefined
                      }
                      placeholder={t("contact.plh_phone", "Your phone number")}
                      className={`mt-2 ${inputCls}`}
                      maxLength={20}
                    />
                    {errors.phone && (
                      <p
                        id="contact-phone-error"
                        className="mt-1.5 text-xs text-chili"
                        data-testid="contact-phone-error"
                        role="alert"
                      >
                        {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="font-display text-sm font-semibold text-leaf"
                    >
                      {t("contact.lbl_email", "Email ")}
                      <span className="font-normal text-stone-400">
                        {t("contact.lbl_email_opt", "(optional)")}
                      </span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      data-testid="contact-email-input"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? "contact-email-error" : undefined
                      }
                      placeholder={t("contact.plh_email", "you@example.com")}
                      className={`mt-2 ${inputCls}`}
                    />
                    {errors.email && (
                      <p
                        id="contact-email-error"
                        className="mt-1.5 text-xs text-chili"
                        data-testid="contact-email-error"
                        role="alert"
                      >
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="contact-product"
                      className="font-display text-sm font-semibold text-leaf"
                    >
                      {t("contact.lbl_product", "Product interest")}
                    </label>
                    <select
                      id="contact-product"
                      value={form.productInterest}
                      onChange={set("productInterest")}
                      data-testid="contact-product-select"
                      className={`mt-2 ${inputCls}`}
                    >
                      <option>{t("contact.opt_general", "General enquiry")}</option>
                      {products.map((p) => (
                        <option key={p.slug} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor="contact-message"
                      className="font-display text-sm font-semibold text-leaf"
                    >
                      {t("contact.lbl_message", "Message")}
                    </label>
                    <textarea
                      id="contact-message"
                      value={form.message}
                      onChange={set("message")}
                      data-testid="contact-message-input"
                      placeholder={t("contact.plh_message", "Quantity, preferred date, anything else we should know…")}
                      rows={4}
                      className={`mt-2 ${inputCls}`}
                      maxLength={2000}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  data-testid="contact-form-submit"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-leaf px-8 py-4 font-display text-sm font-semibold text-cream shadow-soft transition-all duration-300 hover:bg-forest disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {submitting ? (
                    <>
                      <span
                        className="h-4 w-4 animate-spin rounded-full border-2 border-cream/40 border-t-cream"
                        aria-hidden="true"
                      />
                      {t("contact.btn_sending", "Sending…")}
                    </>
                  ) : (
                    <>
                      {t("contact.btn_send", "Send enquiry")} <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </Reveal>
        </div>

        <aside
          className="space-y-6 lg:col-span-5"
          data-testid="contact-info-panel"
        >
          <Reveal>
            <div
              data-testid="contact-info-card-contact"
              className="rounded-3xl border border-leaf/10 bg-ivory p-7 shadow-soft"
            >
              <h2 className="font-serif text-xl font-semibold text-leaf">
                {t("contact.info_contact", "Contact")}
              </h2>
              <ul className="mt-4 space-y-3">
                {contactRows.map(({ Icon, label, value, href }) => (
                  <li key={label} className="flex items-center gap-3 text-sm">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf/5 text-saffron-deep">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.15em] text-stone-400">
                        {label}
                      </span>
                      {value ? (
                        <a
                          href={href}
                          target={href?.startsWith("http") ? "_blank" : undefined}
                          rel={
                            href?.startsWith("http")
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="font-medium text-charcoal transition-colors hover:text-saffron-deep"
                          data-testid={`contact-info-${label.toLowerCase()}`}
                        >
                          {value}
                        </a>
                      ) : (
                        <span className="italic text-stone-400">
                          {t("contact.val_tba", "To be announced")}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
              {contactEmpty && (
                <p className="mt-4 border-t border-leaf/10 pt-4 text-xs italic leading-relaxed text-stone-500">
                  {t("contact.empty_contact", "Phone, WhatsApp and email details will be published soon.")}
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div
              data-testid="contact-info-card-location"
              className="rounded-3xl border border-leaf/10 bg-ivory p-7 shadow-soft"
            >
              <h2 className="font-serif text-xl font-semibold text-leaf">
                {t("contact.info_location", "Location & Service Area")}
              </h2>
              <ul className="mt-4 space-y-3">
                <li className="flex items-center gap-3 text-sm">
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-leaf/5 text-saffron-deep">
                    <MapPin className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-xs uppercase tracking-[0.15em] text-stone-400">
                      {t("contact.lbl_service_area", "Service area")}
                    </span>
                    <span
                      className="font-medium text-charcoal"
                      data-testid="contact-info-service-area"
                    >
                      {settings?.location?.service_area || "Gujarat, India"}
                    </span>
                  </span>
                </li>
              </ul>
              <p className="mt-4 border-t border-leaf/10 pt-4 text-xs italic leading-relaxed text-stone-500">
                {t("contact.empty_location", "Exact location and map details will be published soon.")}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div
              data-testid="contact-info-card-hours"
              className="rounded-3xl border border-leaf/10 bg-ivory p-7 shadow-soft"
            >
              <h2 className="font-serif text-xl font-semibold text-leaf">
                {t("contact.info_hours", "Business Hours")}
              </h2>
              <ul className="mt-4 space-y-2">
                {DAYS.map((day) => (
                  <li
                    key={day}
                    className="flex items-center justify-between border-b border-leaf/5 pb-2 text-sm last:border-0"
                  >
                    <span className="capitalize text-stone-600">{t(`contact.days.${day}`, day)}</span>
                    <span
                      className="italic text-stone-400"
                      data-testid={`contact-hours-${day}`}
                    >
                      {settings?.business_hours?.[day] || t("contact.val_tba", "To be announced")}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-start gap-2 text-xs italic leading-relaxed text-stone-500">
                <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                {t("contact.hours_note")}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.22}>
            <div
              data-testid="contact-info-card-map"
              className="pattern-dots flex flex-col items-center justify-center rounded-3xl border border-dashed border-leaf/20 bg-cream p-10 text-center"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-leaf/5 text-saffron-deep">
                <MapPin className="h-6 w-6" />
              </span>
              <p className="mt-4 font-serif text-lg font-semibold text-leaf">
                {t("contact.map_title", "Location details coming soon")}
              </p>
              <p className="mt-1 max-w-xs text-xs leading-relaxed text-stone-500">
                {t("contact.map_text")}
              </p>
            </div>
          </Reveal>
        </aside>
      </section>
    </>
  );
}
