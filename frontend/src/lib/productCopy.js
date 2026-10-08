function bag(name, description, shortDescription) {
  return {
    name: name || "",
    description: description || shortDescription || "",
    short_description: shortDescription || description || "",
  };
}

/** Localized dish copy. Legacy gujarati_* fields still work. */
export function productCopy(product, lang) {
  if (!product || typeof product !== "object") return bag("", "", "");
  const localized = product.copy?.[lang];
  if (localized && typeof localized.name === "string" && localized.name.trim()) {
    return bag(localized.name, localized.description, localized.short_description);
  }
  if (lang === "gu") {
    return bag(
      product.gujarati_name || product.name,
      product.gujarati_description || product.description,
      product.gujarati_short_description || product.gujarati_description || product.short_description,
    );
  }
  return bag(product.name, product.description, product.short_description);
}

export function productNames(product, lang) {
  const main = productCopy(product, lang);
  const english = productCopy(product, "en");
  const gujarati = productCopy(product, "gu");
  const secondary = lang === "en" ? gujarati.name : english.name;
  return { ...main, secondary: secondary && secondary !== main.name ? secondary : "" };
}

export function productSearchText(product) {
  return ["en", "gu"]
    .map((lang) => {
      const copy = productCopy(product, lang);
      return `${copy.name} ${copy.short_description} ${copy.description}`;
    })
    .join(" ");
}
