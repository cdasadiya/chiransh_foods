const RESPONSIVE = new Set([
  "sev_usal_with_chutney",
  "tuvar_totha_with_chutney",
  "combo_plate_with_chutney",
  "jain_sev_usal",
  "jain_tuvar_totha",
  "masala_chaas",
  "packaged_drinking_water",
  "spiced_usal_simmering",
  "bhaji_pav",
  "khada_pav_bhaji",
  "masala_pav",
  "pulav",
  "kutchi_dabeli",
  "ragda_pattice",
]);

/** Full-file width for photos that are not the standard 1024px masters. */
const FULL_WIDTH = {
  f60e06ce5df687c2b2b455940b778d6a054b268564dceae3fc75de82cc31877d: 1152,
};

/** Build a same-origin src/srcSet pair for converted food photos. */
export function foodImageProps(src) {
  if (!src || typeof src !== "string") return { src: src || "" };
  const clean = src.replace(/\.png$/i, ".webp");
  const match = clean.match(/\/images\/([a-z0-9_]+)\.webp$/i);
  const fullWidth = match
    ? FULL_WIDTH[match[1]] || (RESPONSIVE.has(match[1]) ? 1024 : 0)
    : 0;
  if (!match || !fullWidth) return { src: clean };
  const base = `/images/${match[1]}`;
  return {
    src: `${base}.webp`,
    srcSet: `${base}-480.webp 480w, ${base}-768.webp 768w, ${base}.webp ${fullWidth}w`,
  };
}
