import Navigation from "../../components/navigation"
import MobileNavigation from "../../components/MobileNavigation"
import Footer from "../../components/Footer"

export default function DismissalPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">해고 컨설팅 서비스</h1>
            <p className="text-xl text-gray-300">
              합법적 해고 절차 준수를 위한 법률 자문, 문서 관리 및 증거 보존 시스템, 그리고 절차 관리 및 소송 대응 지원
              기능을 제공하여 기업이 법적 분쟁 예방 및 소송 대응에 효과적으로 대비
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="space-y-12">
              {/* 합법적 해고 절차 준수를 위한 법률 자문 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-white mb-6">합법적 해고 절차 준수를 위한 법률 자문</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">법률 자문 서비스</h3>
                    <p className="text-gray-300">
                      해고 사유의 정당성 검토와 함께, 경영상 해고를 위한 긴급한 필요 여부 및 사용자의 해고 회피 노력을
                      평가하는 자문 서비스를 제공합니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">해고 통지서 작성 지원</h3>
                    <p className="text-gray-300">
                      서면 통지 의무(근로기준법 제27조)에 따라 해고 통지서 템플릿 제공, 반드시 포함해야 할 항목(해고
                      사유, 해고 일자, 법적 근거 등)의 자동 점검 기능 제공
                    </p>
                  </div>
                </div>
              </div>

              {/* 문서 관리 및 증거 보존 시스템 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-white mb-6">문서 관리 및 증거 보존 시스템</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">경영상 해고 정당성 입증 문서 관리</h3>
                    <p className="text-gray-300">
                      경영상의 어려움을 입증하는 재무제표, 사업계획서, 인사 평가 기록 등과 같은 문서들을 체계적으로
                      보관·관리할 수 있는 시스템 구축. 이 시스템은 향후 소송 대응이나 노동위원회 심문에서 증거 자료로
                      활용됩니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">전자적 해고 통지 및 기록 보존 기능</h3>
                    <p className="text-gray-300">
                      이메일, 문자 및 기타 전자문서를 통한 해고 통지 기록의 자동 저장 및 수신 확인 기능을 제공하여, 서면
                      통지 요건을 충족하는지 검증하는 도구를 포함합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* 절차 관리 및 소송 대응 지원 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-white mb-6">절차 관리 및 소송 대응 지원</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">절차 관리 모듈</h3>
                    <p className="text-gray-300">
                      해고 전 30일 사전 통지 및 근로자 대표 협의 등 필수 절차를 자동으로 관리하고, 기한 준수 여부를
                      대시보드 형식으로 제공. 사용자가 효율적으로 모든 절차를 기록·관리할 수 있도록 지원합니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">소송 대응 및 분쟁 해결 지원</h3>
                    <p className="text-gray-300">
                      해고 관련 분쟁 발생 시, 사용자에게 필요한 소송 대응 서류 작성 지원, 변호사·노무사 연결, 노동위원회
                      구제 절차 이행 지원 등을 제공합니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 근로기준법 제27조 및 최신 판례 기준 */}
              <div className="bg-gray-800 rounded-lg p-8 transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-white mb-6">근로기준법 제27조 및 최신 판례 기준</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">해고 유효 요건</h3>
                    <ul className="space-y-4 text-gray-300">
                      <li>
                        <strong className="text-white">서면 통지의 필수성:</strong> 근로기준법 제27조에 따라 해고 사유와
                        시기를 서면으로 통지해야 합니다.
                      </li>
                      <li>
                        <strong className="text-white">정당한 해고 사유:</strong> 통상해고, 징계해고, 정리해고 각각에
                        대해 사회통념상 정당한 이유에 해당하는지 객관적으로 평가하는 기능을 포함합니다.
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">최신 판례 및 증거 기준</h3>
                    <ul className="space-y-4 text-gray-300">
                      <li>
                        <strong className="text-white">디지털 증거 활용:</strong> 2024년 판례에서는 이메일, CCTV 영상,
                        전자문서 등이 증거로 채택되었습니다.
                      </li>
                      <li>
                        <strong className="text-white">강화된 서면통지 요건:</strong> 2024년 개정된 근로기준법에 따라
                        통지서가 해고일로부터 7일 이내 전달되어야 함을 반영한 시스템을 제공합니다.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer theme="dark" />
    </div>
  )
}
