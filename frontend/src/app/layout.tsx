import '@/app/globals.css';
import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
    title: '그리날다 수시예측',
    description: '수시예측 프로그램',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang='ko'>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
