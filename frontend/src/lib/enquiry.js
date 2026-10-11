const PHONE = /^[0-9+()\-\s]{7,20}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Published privacy-notice version. Keep this aligned with SECURITY.md and both locale files. */
export const POLICY_VERSION = "2026-10-11";
export const RETENTION_DAYS = 90;
export const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

/** Drop enquiry records older than the retention window. Undated records are dropped too. */
export function retainedEnquiries(items, nowMs = Date.now()) {
  const cutoff = nowMs - RETENTION_MS;
  if (!Array.isArray(items)) return [];
  return items.filter((item) => {
    const created = Date.parse(item?.created_at ?? "");
    return Number.isFinite(created) && created >= cutoff;
  });
}

export function fieldError(field, message) {
  return { loc: ["body", field], msg: `Value error, ${message}`, type: "value_error" };
}

/**
 * Shared enquiry rules for the production server and tests.
 * A filled honeypot is rejected without saying which field tripped it.
 */
export function validateEnquiry(body) {
  const website = typeof body?.website === "string" ? body.website.trim() : "";
  const company = typeof body?.company === "string" ? body.company.trim() : "";
  if (website || company) {
    return { errors: [fieldError("body", "Unable to accept this enquiry.")], honeypot: true, value: null };
  }

  const errors = [];
  const name = typeof body?.name === "string" ? body.name : "";
  if (name.trim().length < 2 || name.length > 120) {
    errors.push(fieldError("name", "Please enter your name."));
  }
  const phone = typeof body?.phone === "string" ? body.phone.trim() : "";
  const digits = phone.replace(/\D/g, "");
  if (!PHONE.test(phone) || digits.length < 7) {
    errors.push(fieldError("phone", "Please enter a valid phone number."));
  }
  let email = body?.email;
  if (email == null || email === "") email = null;
  else if (typeof email !== "string" || email.length > 200 || !EMAIL.test(email.trim())) {
    errors.push(fieldError("email", "Please enter a valid email address."));
  } else {
    email = email.trim();
  }
  let product = body?.product_interest;
  if (product == null || product === "") product = "General enquiry";
  else if (typeof product !== "string") product = "";
  else product = product.trim();
  if (!product || product.length > 120) {
    errors.push(fieldError("product_interest", "Please choose a shorter product interest."));
  }
  const message = body?.message == null ? "" : typeof body.message === "string" ? body.message : "";
  if (body?.message != null && typeof body.message !== "string") {
    errors.push(fieldError("message", "Please shorten your message."));
  } else if (message.length > 2000) {
    errors.push(fieldError("message", "Please shorten your message."));
  }
  if (body?.consent !== true) {
    errors.push(fieldError("consent", "Please agree to the privacy notice before sending."));
  }
  const locale = body?.locale === "gu" ? "gu" : "en";
  return {
    errors,
    honeypot: false,
    value: {
      name: name.trim(),
      phone,
      email,
      product_interest: product || "General enquiry",
      message,
      consent: body?.consent === true,
      locale,
    },
  };
}
