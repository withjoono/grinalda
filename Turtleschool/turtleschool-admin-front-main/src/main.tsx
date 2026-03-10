import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import { ThemeProvider } from './components/theme-provider.tsx';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from './components/ui/sonner.tsx';
import router from './router.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster duration={2000} position="top-right" />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
