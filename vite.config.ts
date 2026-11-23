import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // GitHub Pages serves this as a project site at /countable-design-system/, not at the
  // domain root — only the production build (GitHub Actions) needs the repo-name base path;
  // the dev server must stay at "/" or local routes like /engagements/:id break.
  base: mode === "production" ? "/countable-design-system/" : "/",
  server: {
    host: "127.0.0.1",
    port: process.env.PORT ? parseInt(process.env.PORT) : undefined,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
}));
