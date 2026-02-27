import type { Metadata } from 'next';
import { Geist_Mono } from 'next/font/google';
import { Noto_Sans_KR } from 'next/font/google';

import { QueryProvider } from '@/components/providers/query-provider';
import { Toaster } from '@/components/ui/sonner';
import AuthProvider from '@/components/providers/auth-provider';
import './globals.css';
import { authOptions } from '@/lib/auth-options';
import { getServerSession } from 'next-auth';
import Script from 'next/script';
import { ScrollTop } from '@/components/layouts/scroll-top';
import { TooltipProvider } from '@/components/ui/tooltip';

const fontSans = Noto_Sans_KR({
  subsets: ['latin'],
  variable: '--font-sans',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '그리날다 | 미대입시 컨설팅',
  description:
    '그리날다, 미대입시 정보, 미대입시 컨설팅, 미대입시 설명회, 미대입시요강, 미대정시 수능환산, 미대 배치표',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  return (
    <html lang='en'>
      <body
        className={`${fontSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryProvider session={session}>
            <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
          </QueryProvider>
        </AuthProvider>
        <Toaster richColors duration={3000} />
      </body>

      <Script src='https://pay.nicepay.co.kr/v1/js/'></Script>
      <ScrollTop />
    </html>
  );
}
