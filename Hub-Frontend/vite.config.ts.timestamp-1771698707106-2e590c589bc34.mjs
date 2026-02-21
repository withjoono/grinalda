// vite.config.ts
import { defineConfig } from "file:///E:/Dev/github/Hub/Hub-Frontend/node_modules/vite/dist/node/index.js";
import react from "file:///E:/Dev/github/Hub/Hub-Frontend/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
import { TanStackRouterVite } from "file:///E:/Dev/github/Hub/Hub-Frontend/node_modules/@tanstack/router-vite-plugin/dist/esm/index.js";
var __vite_injected_original_dirname = "E:\\Dev\\github\\Hub\\Hub-Frontend";
var vite_config_default = defineConfig(() => {
  return {
    plugins: [
      react(),
      TanStackRouterVite()
    ],
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src"),
        "@shared": path.resolve(__vite_injected_original_dirname, "./fe-shared-packages/packages")
      },
      extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
    },
    server: {
      port: 3e3,
      cors: true,
      // CORS 활성화
      proxy: {
        // OAuth API 엔드포인트만 Hub Backend로 프록시 (authorize, token 등)
        // /oauth/consent는 프론트엔드 페이지이므로 제외
        "/oauth/authorize": {
          target: "http://localhost:4000",
          changeOrigin: true
        },
        "/oauth/token": {
          target: "http://localhost:4000",
          changeOrigin: true
        },
        "/oauth/logout": {
          target: "http://localhost:4000",
          changeOrigin: true
        },
        // Hub 중앙 인증 서버 (GB-Back-Nest)
        // 로그인/회원가입 등 인증 관련 API 호출
        "/api-hub": {
          target: "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api-hub/, "")
        },
        // 인증 관련 API는 Hub로 라우팅 (중요!)
        "/api-nest/auth": {
          target: "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api-nest/, "")
        },
        // OAuth 관련 API도 Hub로 라우팅
        "/api-nest/oauth": {
          target: "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api-nest/, "")
        },
        "/api-nest/static-data": {
          target: "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api-nest/, "")
        },
        // Susi 백엔드 (비즈니스 로직) - 반드시 susi- 접두사 사용
        "/api-susi-nest": {
          target: "http://localhost:4001",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api-susi-nest/, "")
        },
        "/api-susi": {
          target: "http://localhost:4001",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api-susi/, "")
        },
        // Hub 백엔드 (기본 /api-nest는 Hub로)
        "/api-nest": {
          target: "http://localhost:4000",
          changeOrigin: true,
          rewrite: (path2) => path2.replace(/^\/api-nest/, "")
        }
      }
    },
    preview: {
      port: 3e3
    },
    build: {
      chunkSizeWarningLimit: 1600
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJFOlxcXFxEZXZcXFxcZ2l0aHViXFxcXEh1YlxcXFxIdWItRnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXERldlxcXFxnaXRodWJcXFxcSHViXFxcXEh1Yi1Gcm9udGVuZFxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRTovRGV2L2dpdGh1Yi9IdWIvSHViLUZyb250ZW5kL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdFwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBUYW5TdGFja1JvdXRlclZpdGUgfSBmcm9tIFwiQHRhbnN0YWNrL3JvdXRlci12aXRlLXBsdWdpblwiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCgpID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgcGx1Z2luczogW1xyXG4gICAgICByZWFjdCgpLFxyXG4gICAgICBUYW5TdGFja1JvdXRlclZpdGUoKSxcclxuICAgIF0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksXHJcbiAgICAgICAgXCJAc2hhcmVkXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9mZS1zaGFyZWQtcGFja2FnZXMvcGFja2FnZXNcIiksXHJcbiAgICAgIH0sXHJcbiAgICAgIGV4dGVuc2lvbnM6IFsnLnRzJywgJy50c3gnLCAnLmpzJywgJy5qc3gnLCAnLmpzb24nXSxcclxuICAgIH0sXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcG9ydDogMzAwMCxcclxuICAgICAgY29yczogdHJ1ZSwgLy8gQ09SUyBcdUQ2NUNcdUMxMzFcdUQ2NTRcclxuICAgICAgcHJveHk6IHtcclxuICAgICAgICAvLyBPQXV0aCBBUEkgXHVDNUQ0XHVCNERDXHVEM0VDXHVDNzc4XHVEMkI4XHVCOUNDIEh1YiBCYWNrZW5kXHVCODVDIFx1RDUwNFx1Qjg1RFx1QzJEQyAoYXV0aG9yaXplLCB0b2tlbiBcdUI0RjEpXHJcbiAgICAgICAgLy8gL29hdXRoL2NvbnNlbnRcdUIyOTQgXHVENTA0XHVCODYwXHVEMkI4XHVDNUQ0XHVCNERDIFx1RDM5OFx1Qzc3NFx1QzlDMFx1Qzc3NFx1QkJDMFx1Qjg1QyBcdUM4MUNcdUM2NzhcclxuICAgICAgICBcIi9vYXV0aC9hdXRob3JpemVcIjoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMFwiLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCIvb2F1dGgvdG9rZW5cIjoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMFwiLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCIvb2F1dGgvbG9nb3V0XCI6IHtcclxuICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjQwMDBcIixcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIEh1YiBcdUM5MTFcdUM1NTkgXHVDNzc4XHVDOTlEIFx1QzExQ1x1QkM4NCAoR0ItQmFjay1OZXN0KVxyXG4gICAgICAgIC8vIFx1Qjg1Q1x1QURGOFx1Qzc3OC9cdUQ2OENcdUM2RDBcdUFDMDBcdUM3ODUgXHVCNEYxIFx1Qzc3OFx1Qzk5RCBcdUFEMDBcdUI4MjggQVBJIFx1RDYzOFx1Q0Q5Q1xyXG4gICAgICAgIFwiL2FwaS1odWJcIjoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMFwiLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS1odWIvLCBcIlwiKSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIFx1Qzc3OFx1Qzk5RCBcdUFEMDBcdUI4MjggQVBJXHVCMjk0IEh1Ylx1Qjg1QyBcdUI3N0NcdUM2QjBcdUQzMDUgKFx1QzkxMVx1QzY5NCEpXHJcbiAgICAgICAgXCIvYXBpLW5lc3QvYXV0aFwiOiB7XHJcbiAgICAgICAgICB0YXJnZXQ6IFwiaHR0cDovL2xvY2FsaG9zdDo0MDAwXCIsXHJcbiAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgICAgICByZXdyaXRlOiAocGF0aCkgPT4gcGF0aC5yZXBsYWNlKC9eXFwvYXBpLW5lc3QvLCBcIlwiKSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIC8vIE9BdXRoIFx1QUQwMFx1QjgyOCBBUElcdUIzQzQgSHViXHVCODVDIFx1Qjc3Q1x1QzZCMFx1RDMwNVxyXG4gICAgICAgIFwiL2FwaS1uZXN0L29hdXRoXCI6IHtcclxuICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjQwMDBcIixcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGktbmVzdC8sIFwiXCIpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgXCIvYXBpLW5lc3Qvc3RhdGljLWRhdGFcIjoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMFwiLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS1uZXN0LywgXCJcIiksXHJcbiAgICAgICAgfSxcclxuICAgICAgICAvLyBTdXNpIFx1QkMzMVx1QzVENFx1QjREQyAoXHVCRTQ0XHVDOTg4XHVCMkM4XHVDMkE0IFx1Qjg1Q1x1QzlDMSkgLSBcdUJDMThcdUI0RENcdUMyREMgc3VzaS0gXHVDODExXHVCNDUwXHVDMEFDIFx1QzBBQ1x1QzZBOVxyXG4gICAgICAgIFwiL2FwaS1zdXNpLW5lc3RcIjoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMVwiLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS1zdXNpLW5lc3QvLCBcIlwiKSxcclxuICAgICAgICB9LFxyXG4gICAgICAgIFwiL2FwaS1zdXNpXCI6IHtcclxuICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjQwMDFcIixcclxuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PiBwYXRoLnJlcGxhY2UoL15cXC9hcGktc3VzaS8sIFwiXCIpLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgLy8gSHViIFx1QkMzMVx1QzVENFx1QjREQyAoXHVBRTMwXHVCQ0Y4IC9hcGktbmVzdFx1QjI5NCBIdWJcdUI4NUMpXHJcbiAgICAgICAgXCIvYXBpLW5lc3RcIjoge1xyXG4gICAgICAgICAgdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6NDAwMFwiLFxyXG4gICAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS1uZXN0LywgXCJcIiksXHJcbiAgICAgICAgfSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgICBwcmV2aWV3OiB7XHJcbiAgICAgIHBvcnQ6IDMwMDAsXHJcbiAgICB9LFxyXG4gICAgYnVpbGQ6IHtcclxuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAxNjAwLFxyXG4gICAgfSxcclxuICB9O1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFzUixTQUFTLG9CQUFvQjtBQUNuVCxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLFNBQVMsMEJBQTBCO0FBSG5DLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYSxNQUFNO0FBQ2hDLFNBQU87QUFBQSxJQUNMLFNBQVM7QUFBQSxNQUNQLE1BQU07QUFBQSxNQUNOLG1CQUFtQjtBQUFBLElBQ3JCO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxPQUFPO0FBQUEsUUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsUUFDcEMsV0FBVyxLQUFLLFFBQVEsa0NBQVcsK0JBQStCO0FBQUEsTUFDcEU7QUFBQSxNQUNBLFlBQVksQ0FBQyxPQUFPLFFBQVEsT0FBTyxRQUFRLE9BQU87QUFBQSxJQUNwRDtBQUFBLElBQ0EsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBO0FBQUEsTUFDTixPQUFPO0FBQUE7QUFBQTtBQUFBLFFBR0wsb0JBQW9CO0FBQUEsVUFDbEIsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFFBQ2hCO0FBQUEsUUFDQSxnQkFBZ0I7QUFBQSxVQUNkLFFBQVE7QUFBQSxVQUNSLGNBQWM7QUFBQSxRQUNoQjtBQUFBLFFBQ0EsaUJBQWlCO0FBQUEsVUFDZixRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsUUFDaEI7QUFBQTtBQUFBO0FBQUEsUUFHQSxZQUFZO0FBQUEsVUFDVixRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxjQUFjLEVBQUU7QUFBQSxRQUNsRDtBQUFBO0FBQUEsUUFFQSxrQkFBa0I7QUFBQSxVQUNoQixRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxlQUFlLEVBQUU7QUFBQSxRQUNuRDtBQUFBO0FBQUEsUUFFQSxtQkFBbUI7QUFBQSxVQUNqQixRQUFRO0FBQUEsVUFDUixjQUFjO0FBQUEsVUFDZCxTQUFTLENBQUNBLFVBQVNBLE1BQUssUUFBUSxlQUFlLEVBQUU7QUFBQSxRQUNuRDtBQUFBLFFBQ0EseUJBQXlCO0FBQUEsVUFDdkIsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsZUFBZSxFQUFFO0FBQUEsUUFDbkQ7QUFBQTtBQUFBLFFBRUEsa0JBQWtCO0FBQUEsVUFDaEIsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsb0JBQW9CLEVBQUU7QUFBQSxRQUN4RDtBQUFBLFFBQ0EsYUFBYTtBQUFBLFVBQ1gsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsZUFBZSxFQUFFO0FBQUEsUUFDbkQ7QUFBQTtBQUFBLFFBRUEsYUFBYTtBQUFBLFVBQ1gsUUFBUTtBQUFBLFVBQ1IsY0FBYztBQUFBLFVBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsZUFBZSxFQUFFO0FBQUEsUUFDbkQ7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1AsTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLE9BQU87QUFBQSxNQUNMLHVCQUF1QjtBQUFBLElBQ3pCO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbInBhdGgiXQp9Cg==
