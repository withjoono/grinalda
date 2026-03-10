import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Image
                src="/images/hizen-new-logo.png"
                alt="Hizen Compass"
                width={32}
                height={32}
                className="rounded-full"
              />
              <span className="text-lg font-bold text-gray-900">(주)하이젠컴퍼스</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>사업자등록번호: 123-45-67890</p>
              <p>대표: 김대표 | 주소: 서울특별시 강남구 테헤란로 127-56-00000</p>
              <p>
                주식회사 하이젠컴퍼스 대표전화: 000-0000-0000 |
                <Link href="mailto:contact@hizencompass.com" className="text-orange-600 hover:underline ml-1">
                  contact@hizencompass.com
                </Link>
              </p>
              <p>통신판매업 신고번호: 제2024-서울강남-0000호 | 개인정보보호책임자: 김대표</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">서비스</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/analysis/record-input" className="hover:text-orange-600">
                  생기부 분석
                </Link>
              </li>
              <li>
                <Link href="/mock-analysis/score-input" className="hover:text-orange-600">
                  모의고사 분석
                </Link>
              </li>
              <li>
                <Link href="/susi/record-input" className="hover:text-orange-600">
                  수시 예측
                </Link>
              </li>
              <li>
                <Link href="/jungsi/score-input" className="hover:text-orange-600">
                  정시 예측
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">고객지원</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="/support/faq" className="hover:text-orange-600">
                  자주묻는질문
                </Link>
              </li>
              <li>
                <Link href="/support/contact" className="hover:text-orange-600">
                  문의하기
                </Link>
              </li>
              <li>
                <Link href="/support/guide" className="hover:text-orange-600">
                  이용가이드
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center text-sm text-gray-500">
          <p>&copy; 2024 하이젠컴퍼스. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
