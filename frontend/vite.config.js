import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// The original app was Create React App (craco) with an "@" -> src alias.
// JSX lives in .js files too (App.js, usePageMeta.js), so treat .js as JSX.
export default defineConfig({
  plugins: [react({ include: /\.(js|jsx)$/ }), tailwindcss()],
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  server: {
    port: 3000,
    fs: { allow: [path.resolve(import.meta.dirname, "..")] },
    proxy: {
      "/api": { target: process.env.API_PROXY_TARGET || "http://127.0.0.1:8001", changeOrigin: true },
    },
  },
  css: {
    postcss: {},
  },
  build: {
    // Split long-lived vendor code so page chunks stay small and cache well.
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (/node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|cookie|set-cookie-parser)\//.test(id)) return "react";
          if (/node_modules\/(framer-motion|motion-dom|motion-utils|lenis)\//.test(id)) return "motion";
          if (/node_modules\/lucide-react\//.test(id)) return "icons";
          return "vendor";
        },
      },
    },
  },
});
