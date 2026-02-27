import { loginApi } from '@/apis/hooks/use-auth';
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('아이디 또는 비밀번호를 입력해주세요.');
          }

          const response = await loginApi({
            email: credentials.email,
            password: credentials.password,
          });

          if (response) {
            return {
              id: response.user.id.toString(),
              email: response.user.email,
              name: response.user.name,
              image: response.user.profileImage || '',
              accessToken: response.accessToken,
              expiresIn: response.expiresIn,
              role: response.user.role,
            };
          }
          return null;
        } catch (error) {
          if (error instanceof Error) {
            throw new Error(error.message);
          }
          throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 세션 업데이트 시
      if (trigger === 'update' && session?.user) {
        return {
          ...token,
          picture: session.user.image,
          name: session.user.name,
        };
      }
      // 최초 로그인 시
      if (user) {
        return {
          ...token,
          role: user.role,
          accessToken: user.accessToken,
          expiresIn: Date.now() + user.expiresIn,
        };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        accessToken: token.accessToken,
        name: token.name,
        email: token.email,
        image: token.picture,
        role: token.role as 'ROLE_USER' | 'ROLE_ADMIN',
      };
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30, // 30일
  },
};
