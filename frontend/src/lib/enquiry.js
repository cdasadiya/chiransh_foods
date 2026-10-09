const PHONE = /^[0-9+()\-\s]{7,20}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  return {
    errors,
    honeypot: false,
    value: { name: name.trim(), phone, email, product_interest: product || "General enquiry", message },
  };
}
