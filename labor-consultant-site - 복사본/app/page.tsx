"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  const [selectedSection, setSelectedSection] = useState<"employee" | "employer" | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (selectedSection) {
      const timer = setTimeout(() => {
        router.push(`/${selectedSection}`)
      }, 1000) // 애니메이션 시간과 일치
      return () => clearTimeout(timer)
    }
  }, [selectedSection, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between overflow-hidden relative">
      {/* 배경 요소들 */}
      <div className="absolute inset-0 w-full h-full">
        {/* 근로자 섹션 배경 */}
        <div
          className={`absolute inset-y-0 left-0 bg-white transition-all duration-1000 ease-in-out
            ${selectedSection === "employee" ? "w-full" : selectedSection === "employer" ? "w-0" : "w-1/2"}`}
        >
          {/* 근로자 섹션 물결 패턴 (전경) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%AC%BC%EA%B2%B0-yU5CYtEzoHbQefk5ZRU5YO3mmQ1noE.svg')`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              opacity: 0.8,
              filter: "grayscale(100%) brightness(0.3) contrast(2)",
            }}
          />
        </div>

        {/* 사용자 섹션 배경 - 변경하지 않음 */}
        <div
          className={`absolute inset-y-0 right-0 w-full bg-black transition-all duration-1000 ease-in-out
            ${selectedSection === "employer" ? "left-0" : selectedSection === "employee" ? "left-full" : "left-1/2"}`}
        >
          {/* 사용자 섹션 물결 패턴 (전경) */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%AC%BC%EA%B2%B0-yU5CYtEzoHbQefk5ZRU5YO3mmQ1noE.svg')`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              opacity: 0.4,
              filter: "grayscale(100%) brightness(0.7) contrast(0.8)",
            }}
          />
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-20 flex w-full h-[200vh]">
        {/* 로고 */}
        <div className="absolute left-1/2 top-[15%] -translate-x-1/2 -translate-y-1/2 z-30">
          <div className="bg-gradient-to-r from-black via-black to-white rounded-lg p-2 shadow-xl transform scale-[1.02] transition-transform duration-300 hover:scale-[1.05]">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Minimalist%20Logo%20Design%20For%20Casa%20Grande%20Poudasa%20With%20Charming%20Typography-uaD2GNi4K9vanMDQyIRFAFXcFH8dOi.png"
              alt="노무AI 로고"
              width={140}
              height={140}
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* 근로자 섹션 */}
        <div
          className="w-1/2 flex items-center justify-center transition-all duration-500 ease-in-out"
          style={{ paddingTop: "10vh" }}
        >
          <Link
            href="/employee"
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition transform hover:-translate-y-1 hover:rotate-1 duration-300 ease-in-out shadow-xl"
          >
            근로자 노무 서비스
          </Link>
        </div>

        {/* 사용자 섹션 */}
        <div
          className="w-1/2 flex items-center justify-center transition-all duration-500 ease-in-out relative"
          style={{ paddingTop: "10vh" }}
        >
          <Link
            href="/employer"
            className="inline-block px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700 transition transform hover:-translate-y-1 hover:rotate-1 duration-300 ease-in-out shadow-xl"
          >
            사업주 노무 서비스
          </Link>
        </div>
      </div>

      {/* Add Footer */}
      <div className="relative z-20 w-full">
        <div className="flex flex-col md:flex-row">
          {/* Left side footer (Employee - Light) */}
          <div
            className={`w-1/2 py-12 px-6 transition-all duration-1000 ease-in-out ${
              selectedSection === "employee"
                ? "w-full"
                : selectedSection === "employer"
                  ? "w-0 overflow-hidden"
                  : "w-1/2"
            }`}
          >
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold mb-2 text-gray-900">(주)노무AI (구 청사에이아이) 소개</h3>
              <p className="text-sm mb-4 text-gray-700">빅데이터, AI로 더 전문화된 노무사 집단</p>

              <div className="space-y-1 text-sm text-gray-700">
                <p>대표 : 성시웅</p>
                <p>전화1 : 070-4448-6960</p>
                <p>전화2 : 042-471-1197</p>
                <p>문자 : 010-3438-1194</p>
                <p>사업자등록번호 : 512-88-03060</p>
                <p>대전광역시 서구 청사로 228, 11층 1110호</p>
              </div>

              <div className="mt-8 pt-4 border-t border-gray-300">
                <p className="text-xs text-gray-600">© 2025 노무AI. All rights reserved.</p>
                <div className="flex space-x-4 mt-2">
                  <Link href="#" className="text-xs text-gray-600 hover:text-[#4d5bce]">
                    개인정보처리방침
                  </Link>
                  <Link href="#" className="text-xs text-gray-600 hover:text-[#4d5bce]">
                    이용약관
                  </Link>
                  <Link href="#" className="text-xs text-gray-600 hover:text-[#4d5bce]">
                    사이트맵
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right side footer (Employer - Dark) */}
          <div
            className={`w-1/2 py-12 px-6 transition-all duration-1000 ease-in-out ${
              selectedSection === "employer"
                ? "w-full"
                : selectedSection === "employee"
                  ? "w-0 overflow-hidden"
                  : "w-1/2"
            }`}
          >
            <div className="flex justify-center items-center h-full">
              <div className="relative w-40 h-40">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Minimalist%20Logo%20Design%20For%20Casa%20Grande%20Poudasa%20With%20Charming%20Typography-ObBTZSbhhYsHobXZWuF8bIyWCpXUqJ.png"
                  alt="노무AI 로고"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
