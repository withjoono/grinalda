"use client"

import Link from "next/link"
import Image from "next/image"

export default function Footer({ theme = "light" }) {
  const isDark = theme === "dark"
  const bgColor = isDark ? "bg-[#0f1729]" : "bg-gray-100"
  const textColor = isDark ? "text-gray-300" : "text-gray-700"
  const headingColor = isDark ? "text-white" : "text-gray-900"

  return (
    <footer className={`${bgColor} py-16`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="mb-8 md:mb-0">
            <h3 className={`text-lg font-bold mb-2 ${headingColor}`}>(주)노무AI (구 청사에이아이) 소개</h3>
            <p className={`text-sm mb-4 ${textColor}`}>빅데이터, AI로 더 전문화된 노무사 집단</p>

            <div className="space-y-2">
              <p className={`text-sm ${textColor}`}>대표 : 성시웅</p>
              <p className={`text-sm ${textColor}`}>전화1 : 070-4448-6960</p>
              <p className={`text-sm ${textColor}`}>전화2 : 042-471-1197</p>
              <p className={`text-sm ${textColor}`}>문자 : 010-3438-1194</p>
              <p className={`text-sm ${textColor}`}>사업자등록번호 : 512-88-03060</p>
              <p className={`text-sm ${textColor}`}>대전광역시 서구 청사로 228, 11층 1110호</p>
            </div>
          </div>

          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Minimalist%20Logo%20Design%20For%20Casa%20Grande%20Poudasa%20With%20Charming%20Typography-ObBTZSbhhYsHobXZWuF8bIyWCpXUqJ.png"
              alt="노무AI 로고"
              fill
              className="object-contain"
            />
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className={`text-xs ${textColor}`}>© 2025 노무AI. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="#" className={`text-xs ${textColor} hover:text-[#4d5bce] transition-colors`}>
                개인정보처리방침
              </Link>
              <Link href="#" className={`text-xs ${textColor} hover:text-[#4d5bce] transition-colors`}>
                이용약관
              </Link>
              <Link href="#" className={`text-xs ${textColor} hover:text-[#4d5bce] transition-colors`}>
                사이트맵
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
