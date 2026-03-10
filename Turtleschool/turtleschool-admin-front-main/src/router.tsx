import { createBrowserRouter } from 'react-router-dom';
import GeneralError from './pages/errors/general-error';
import NotFoundError from './pages/errors/not-found-error';
import PrivateRoute from './components/private-router';
import AppShell from './components/app-shell';

const router = createBrowserRouter([
  // Auth routes
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },

  // Main routes
  {
    path: '/',
    element: (
      <PrivateRoute>
        <AppShell />
      </PrivateRoute>
    ),
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/dashboard')).default,
        }),
      },
      {
        path: 'user',
        lazy: async () => ({
          Component: (await import('./components/coming-soon')).default,
        }),
      },
      {
        path: 'officer',
        lazy: async () => ({
          Component: (await import('./components/coming-soon')).default,
        }),
      },
      {
        path: 'life-record',
        lazy: async () => ({
          Component: (await import('./components/coming-soon')).default,
        }),
      },
      {
        path: 'essay',
        lazy: async () => ({
          Component: (await import('./pages/essay')).default,
        }),
      },
      {
        path: '/member',
        lazy: async () => ({
          Component: (await import('./pages/member')).default,
        }),
      },
      {
        path: '/susi/subject',
        lazy: async () => ({
          Component: (await import('./pages/susi/subject')).default,
        }),
      },
      {
        path: '/susi/comprehensive',
        lazy: async () => ({
          Component: (await import('./pages/susi/comprehensive')).default,
        }),
      },
      {
        path: '/susi/pass-record',
        lazy: async () => ({
          Component: (await import('./pages/susi/pass-record')).default,
        }),
      },

      {
        path: '/core/compatible',
        lazy: async () => ({
          Component: (await import('./pages/core/compatible')).default,
        }),
      },
      {
        path: '/core/recruitment',
        lazy: async () => ({
          Component: (await import('./pages/core/recruitment')).default,
        }),
      },
      {
        path: '/core/school',
        lazy: async () => ({
          Component: (await import('./pages/core/school')).default,
        }),
      },
      {
        path: '/core/admission',
        lazy: async () => ({
          Component: (await import('./pages/core/admission')).default,
        }),
      },
      {
        path: 'product',
        lazy: async () => ({
          Component: (await import('./pages/product')).default,
        }),
      },
      {
        path: 'pay',
        lazy: async () => ({
          Component: (await import('./pages/pay')).default,
        }),
      },
      {
        path: 'board',
        lazy: async () => ({
          Component: (await import('./pages/board')).default,
        }),
      },
      {
        path: 'board/create',
        lazy: async () => ({
          Component: (await import('./pages/board/create')).default,
        }),
      },
      {
        path: 'board/:boardId/posts/:postId',
        lazy: async () => ({
          Component: (await import('./pages/board/edit')).default,
        }),
      },
      {
        path: 'common-code',
        lazy: async () => ({
          Component: (await import('./pages/common-code')).default,
        }),
      },
    ],
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
]);

export default router;
