import Navigation from "../../components/navigation"
import MobileNavigation from "../../components/MobileNavigation"
import Footer from "../../components/Footer"

export default function IndustrialAccidentPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <Navigation theme="dark" />
      <MobileNavigation theme="dark" />

      {/* Hero Section - Make it full screen */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 물결 패턴 배경 */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%AC%BC%EA%B2%B0-yU5CYtEzoHbQefk5ZRU5YO3mmQ1noE.svg')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.4,
            filter: "grayscale(100%) brightness(0.7) contrast(0.8)",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">산재 컨설팅 서비스</h1>
            <p className="text-xl text-gray-300">중대재해 예방·법적 리스크 관리·기업 이미지 보호에 초점</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column - Content */}
            <div className="space-y-12">
              {/* Section 1 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-white mb-6">중대재해 리스크 관리</h2>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong className="text-white">산업별 안전관리 체크리스트:</strong> 47개 업종별 200페이지 분량
                      표준 대응 매뉴얼 제공
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong className="text-white">법적 책임 한계 설정:</strong> 형사처벌 위험 최소화 전략, 2023년
                      기소유예 22건 달성
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong className="text-white">모의 답변 훈련:</strong> 사고조사단 면담 전 법률 검토 및 대응
                      시나리오 연습
                    </span>
                  </li>
                </ul>
              </div>

              {/* Section 2 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-white mb-6">사고 예방 및 대응 시스템</h2>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong className="text-white">안전보건관리계획서 샘플:</strong> 노동부 검증 120종 제공, 월별 판례
                      반영 업데이트
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong className="text-white">실시간 화상 상담:</strong> 노동청·근로복지공단과 3시간 내 현장 확인
                      협의
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong className="text-white">작업환경 개선 컨설팅:</strong> 소음·분진 노출 감소를 위한 공학적
                      솔루션 제안
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="space-y-12">
              {/* Section 3 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-white mb-6">법률 절차 지원</h2>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong className="text-white">행정소송 대응:</strong> 89% 승소율, 소송 기간 평균 2.3개월 단축
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong className="text-white">노동감독관 대응 전략:</strong> 현장 검증 시 증거 제출 가이드라인
                      제공
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong className="text-white">산재브로커 감사 시스템:</strong> 내부 감사를 통한 법적 리스크 사전
                      차단
                    </span>
                  </li>
                </ul>
              </div>

              {/* Section 4 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-white mb-6">기업 이미지 관리</h2>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong className="text-white">유족 협상 지원:</strong> 장례 절차 주관, 미디어 대응 매뉴얼 제공
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong className="text-white">청렴 인증 시스템:</strong> 금융감독원 협력 자금 관리, 사전계약서
                      공증 의무화
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span>
                      <strong className="text-white">ESG 보고서 작성:</strong> 산재 예방 활동을 ESG 성과로 연계 지원
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer theme="dark" />
    </div>
  )
}
