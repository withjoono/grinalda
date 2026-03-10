import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-8">OO 학원에 오신 것을 환영합니다</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/about" 
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">학원 소개</h2>
          <p>OO 학원의 비전과 특징을 소개합니다.</p>
        </Link>
        <Link href="/courses" 
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">수업 안내</h2>
          <p>다양한 교육 프로그램을 확인하세요.</p>
        </Link>
        <Link href="/teachers" 
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-4">강사진 소개</h2>
          <p>전문적인 강사진을 소개합니다.</p>
        </Link>
      </div>
    </main>
  )
} 