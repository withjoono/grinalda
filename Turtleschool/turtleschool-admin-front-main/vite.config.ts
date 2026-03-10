import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

// svg 다음과 같이 사용
// vite-plugin-svgr 버전4 이후 다음과 같이 `?react` 접미사를 붙여서 사용

// import HeaderLogo from '@/assets/header-logo.svg?react';
