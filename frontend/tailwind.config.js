/** Reconstructed from the compiled Tailwind v3.4.17 output of the original app
 *  (shadcn/ui-style CSS variables + custom brand palette). */
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand palette
        leaf: "#142D21",          // deep leaf green (primary / theme-color)
        forest: "#1A3A2A",        // slightly lighter green
        cream: "#FAF7F2",         // page background
        ivory: "#FFFDF9",         // card background
        charcoal: "#1C1917",      // body text
        saffron: { DEFAULT: "#D97706", deep: "#B45309" }, // accent / CTA
        gold: "#D4AF37",          // highlight / italic accents
        chili: "#DC2626",         // non-veg / alert red
        // shadcn/ui tokens (HSL vars in index.css)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        serif: ['"Cormorant Garamond"', '"Noto Serif Gujarati"', "serif"],
        display: ['"Outfit"', '"Plus Jakarta Sans"', "sans-serif"],
        guj: ['"Noto Serif Gujarati"', '"Cormorant Garamond"', "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        soft: "0 4px 20px rgba(20, 45, 33, 0.06)",
        lift: "0 18px 44px rgba(20, 45, 33, 0.14)",
      },
      keyframes: {
        "slow-spin": { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
      },
      animation: {
        "slow-spin": "slow-spin 18s linear infinite",
      },
    },
  },
  plugins: [],
};
