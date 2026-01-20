import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(() => {
  return {
    plugins: [react(), TanStackRouterVite()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3000,
      cors: true, // CORS 활성화
      proxy: {
        // Hub 중앙 인증 서버 (GB-Back-Nest)
        // 로그인/회원가입 등 인증 관련 API 호출
        "/api-hub": {
          target: "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-hub/, ""),
        },
        // 인증 관련 API는 Hub로 라우팅 (중요!)
        "/api-nest/auth": {
          target: "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-nest/, ""),
        },
        // OAuth 관련 API도 Hub로 라우팅
        "/api-nest/oauth": {
          target: "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-nest/, ""),
        },
        "/api-nest/static-data": {
          target: "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-nest/, ""),
        },
        // Susi 백엔드 (비즈니스 로직) - 반드시 susi- 접두사 사용
        "/api-susi-nest": {
          target: "http://localhost:4001",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-susi-nest/, ""),
        },
        "/api-susi": {
          target: "http://localhost:4001",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-susi/, ""),
        },
        // Hub 백엔드 (기본 /api-nest는 Hub로)
        "/api-nest": {
          target: "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api-nest/, ""),
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1600,
    },
  };
});
