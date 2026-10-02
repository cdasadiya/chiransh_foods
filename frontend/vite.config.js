import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// The original app was Create React App (craco) with an "@" -> src alias.
// JSX lives in .js files too (App.js, usePageMeta.js), so treat .js as JSX.
export default defineConfig({
  plugins: [react({ include: /\.(js|jsx)$/ })],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  esbuild: { loader: "jsx", include: /src\/.*\.jsx?$/, exclude: [] },
  optimizeDeps: { esbuildOptions: { loader: { ".js": "jsx" } } },
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
  server: {
    port: 3000,
    proxy: {
      // Mock FastAPI backend (see ../backend). Change target if you run it elsewhere.
      "/api": { target: process.env.API_PROXY_TARGET || "http://127.0.0.1:8001", changeOrigin: true },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      "/api": { target: process.env.API_PROXY_TARGET || "http://127.0.0.1:8001", changeOrigin: true },
    },
  },
});
