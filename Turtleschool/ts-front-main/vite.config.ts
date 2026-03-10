import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), visualizer(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // 용량이 큰 모듈/파일들 개별 번들링 처리
          if (id.includes("constants/high-school")) {
            return "@constants-vendor";
          }
          if (id.includes("axios")) {
            return "@networking-vendor";
          }
          if (id.includes("firebase")) {
            return "@firebase-vendor";
          }
          if (id.includes("react-hook-form") || id.includes("zod")) {
            return "@validate-vendor";
          }
          if (id.includes("tanstack")) {
            return "@tanstack-vendor";
          }
        },
      },
    },
  },
});
