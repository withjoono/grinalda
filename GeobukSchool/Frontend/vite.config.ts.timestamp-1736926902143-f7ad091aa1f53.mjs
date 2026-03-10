// vite.config.ts
import { defineConfig } from "file:///C:/Users/note3/GITHUB/siung-front/node_modules/vite/dist/node/index.js";
import path from "path";
import react from "file:///C:/Users/note3/GITHUB/siung-front/node_modules/@vitejs/plugin-react-swc/index.mjs";
import { TanStackRouterVite } from "file:///C:/Users/note3/GITHUB/siung-front/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import { visualizer } from "file:///C:/Users/note3/GITHUB/siung-front/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
var __vite_injected_original_dirname = "C:\\Users\\note3\\GITHUB\\siung-front";
var vite_config_default = defineConfig({
  plugins: [TanStackRouterVite(), visualizer(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    port: 3e3
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
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
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxub3RlM1xcXFxHSVRIVUJcXFxcc2l1bmctZnJvbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXFVzZXJzXFxcXG5vdGUzXFxcXEdJVEhVQlxcXFxzaXVuZy1mcm9udFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovVXNlcnMvbm90ZTMvR0lUSFVCL3NpdW5nLWZyb250L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcclxuaW1wb3J0IHsgVGFuU3RhY2tSb3V0ZXJWaXRlIH0gZnJvbSBcIkB0YW5zdGFjay9yb3V0ZXItcGx1Z2luL3ZpdGVcIjtcclxuaW1wb3J0IHsgdmlzdWFsaXplciB9IGZyb20gXCJyb2xsdXAtcGx1Z2luLXZpc3VhbGl6ZXJcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW1RhblN0YWNrUm91dGVyVml0ZSgpLCB2aXN1YWxpemVyKCksIHJlYWN0KCldLFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgcG9ydDogMzAwMCxcclxuICB9LFxyXG4gIGJ1aWxkOiB7XHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIG1hbnVhbENodW5rcyhpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAvLyBcdUM2QTlcdUI3QzlcdUM3NzQgXHVEMDcwIFx1QkFBOFx1QjRDOC9cdUQzMENcdUM3N0NcdUI0RTQgXHVBQzFDXHVCQ0M0IFx1QkM4OFx1QjRFNFx1QjlDMSBcdUNDOThcdUI5QUNcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcyhcImNvbnN0YW50cy9oaWdoLXNjaG9vbFwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJAY29uc3RhbnRzLXZlbmRvclwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKFwiYXhpb3NcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiQG5ldHdvcmtpbmctdmVuZG9yXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJmaXJlYmFzZVwiKSkge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJAZmlyZWJhc2UtdmVuZG9yXCI7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoaWQuaW5jbHVkZXMoXCJyZWFjdC1ob29rLWZvcm1cIikgfHwgaWQuaW5jbHVkZXMoXCJ6b2RcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiQHZhbGlkYXRlLXZlbmRvclwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKGlkLmluY2x1ZGVzKFwidGFuc3RhY2tcIikpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiQHRhbnN0YWNrLXZlbmRvclwiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQStSLFNBQVMsb0JBQW9CO0FBQzVULE9BQU8sVUFBVTtBQUNqQixPQUFPLFdBQVc7QUFDbEIsU0FBUywwQkFBMEI7QUFDbkMsU0FBUyxrQkFBa0I7QUFKM0IsSUFBTSxtQ0FBbUM7QUFPekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLG1CQUFtQixHQUFHLFdBQVcsR0FBRyxNQUFNLENBQUM7QUFBQSxFQUNyRCxTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsSUFDdEM7QUFBQSxFQUNGO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sYUFBYSxJQUFZO0FBRXZCLGNBQUksR0FBRyxTQUFTLHVCQUF1QixHQUFHO0FBQ3hDLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGNBQUksR0FBRyxTQUFTLE9BQU8sR0FBRztBQUN4QixtQkFBTztBQUFBLFVBQ1Q7QUFDQSxjQUFJLEdBQUcsU0FBUyxVQUFVLEdBQUc7QUFDM0IsbUJBQU87QUFBQSxVQUNUO0FBQ0EsY0FBSSxHQUFHLFNBQVMsaUJBQWlCLEtBQUssR0FBRyxTQUFTLEtBQUssR0FBRztBQUN4RCxtQkFBTztBQUFBLFVBQ1Q7QUFDQSxjQUFJLEdBQUcsU0FBUyxVQUFVLEdBQUc7QUFDM0IsbUJBQU87QUFBQSxVQUNUO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
