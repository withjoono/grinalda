import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OO 학원',
  description: '최고의 교육을 제공하는 OO 학원입니다.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <nav className="bg-white shadow-lg">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex justify-between">
              <div className="flex space-x-7">
                <Link href="/" className="flex items-center py-4">
                  <span className="font-semibold text-gray-500 text-lg">OO 학원</span>
                </Link>
                <div className="flex items-center space-x-4">
                  <Link href="/about" className="py-4 px-2 hover:text-blue-500">
                    학원소개
                  </Link>
                  <Link href="/courses" className="py-4 px-2 hover:text-blue-500">
                    수업안내
                  </Link>
                  <Link href="/teachers" className="py-4 px-2 hover:text-blue-500">
                    강사진
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
} 