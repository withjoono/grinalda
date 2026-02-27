import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    error?: 'RefreshTokenError';
    user: {
      accessToken?: string;
      role: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_TEACHER';
    } & DefaultSession['user'];
  }

  interface User {
    accessToken: string;
    expiresIn: number;
    role: 'ROLE_USER' | 'ROLE_ADMIN' | 'ROLE_TEACHER';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    expiresIn?: number;
    error?: 'RefreshTokenError';
  }
}
