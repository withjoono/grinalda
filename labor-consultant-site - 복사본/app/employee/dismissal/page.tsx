import Navigation from "../../components/navigation"
import MobileNavigation from "../../components/MobileNavigation"
import Footer from "../../components/Footer"

export default function DismissalPage() {
  return (
    <div className="min-h-screen bg-white relative">
      <Navigation theme="light" />
      <MobileNavigation theme="light" />

      {/* Hero Section - Now full screen height */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 물결 패턴 배경 */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EB%AC%BC%EA%B2%B0-yU5CYtEzoHbQefk5ZRU5YO3mmQ1noE.svg')`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            opacity: 0.8,
            filter: "grayscale(100%) brightness(0.3) contrast(2)",
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">해고 컨설팅 서비스</h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              부당해고 구제·증거 수집 및 법률 지원, 녹취 및 증인 확보 지원, 그리고 해고 대응 관련 교육 및 정보 제공
              기능을 포함하며, 이는 근로기준법 제27조와 관련 판례를 기반
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
              {/* 부당해고 구제 신청 및 법률 지원 */}
              <div className="bg-white rounded-lg p-8 shadow-lg transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">부당해고 구제 신청 및 법률 지원</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">노동위원회 구제신청 안내</h3>
                    <p className="text-gray-600">
                      근로자는 부당해고로 판단될 경우, 해고일로부터 3개월 이내에 노동위원회에 구제신청을 해야 합니다.
                      서비스는 신청 양식 제공, 입증자료 준비 방법, 구제 절차에 대한 교육 콘텐츠 등을 포함할 수 있습니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">무료법률지원 프로그램 연계</h3>
                    <p className="text-gray-600">
                      월평균 임금이 300만원 미만인 근로자는 정부지원 하에 공인노무사 및 변호사의 법률 상담을 무료로 받을
                      수 있습니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">구제소송 및 해고무효확인 소 제기 지원</h3>
                    <p className="text-gray-600">
                      상황에 따라 법원에 해고무효확인 소 또는 부당해고 관련 행정소송을 진행할 수 있도록 하는 법률 자문
                      연결 및 서류 준비 지원 서비스.
                    </p>
                  </div>
                </div>
              </div>

              {/* 증거 수집 및 디지털 자료 관리 */}
              <div className="bg-white rounded-lg p-8 shadow-lg transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">증거 수집 및 디지털 자료 관리</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">AI 기반 증거 수집 솔루션</h3>
                    <p className="text-gray-600">
                      구두해고의 부당성을 입증하기 위해 필수적인 서면 통지의 부재 및 관련 전자 증거(이메일, 메신저 기록,
                      CCTV 영상 등)를 자동 수집하는 시스템. 근로자의 근무기록, 급여 명세서, 해고 통지 이메일 등 디지털
                      자료를 안전하게 아카이빙할 수 있도록 지원합니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">녹취 및 증인 확보 지원</h3>
                    <p className="text-gray-600">
                      구두해고의 경우, 녹취 기록이나 증인의 진술이 중요한 증거 요소로 작용하므로, 이를 저장·관리할 수
                      있는 기능 제공.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* 해고 대응 관련 교육 및 정보 제공 */}
              <div className="bg-white rounded-lg p-8 shadow-lg transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">해고 대응 관련 교육 및 정보 제공</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">부당해고 예방·대응 교육</h3>
                    <p className="text-gray-600">
                      해고 통지서의 필수 기재 항목, 부당해고의 성립 조건 및 대응 방법(예: 해고 통지 확인, 노동위원회
                      구제 신청 절차 등)을 콘텐츠로 제작.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">실시간 법률 업데이트 제공</h3>
                    <p className="text-gray-600">
                      최신 판례, 개정법(예, 2024년 개정 근로기준법 제27조 강화 내용) 등 변화하는 법률 정보를 실시간
                      피드백 할 수 있는 인터페이스 제공.
                    </p>
                  </div>
                </div>
              </div>

              {/* 근로기준법 제27조 및 최신 판례 기준 */}
              <div className="bg-white rounded-lg p-8 shadow-lg transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">근로기준법 제27조 및 최신 판례 기준</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">해고 유효 요건</h3>
                    <p className="text-gray-600">
                      서면 통지의 필수성: 근로기준법 제27조에 따라 해고 사유와 해고 시기를 서면으로 통지해야 합니다.
                    </p>
                    <p className="text-gray-600">
                      정당한 해고 사유: 통상해고, 징계해고, 정리해고 각각에 대해 사회통념상 정당한 이유에 해당하는지
                      객관적으로 평가하는 기능을 포함합니다.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">최신 판례 및 증거 기준</h3>
                    <p className="text-gray-600">
                      디지털 증거 활용: 2024년 부당해고 판결에서는 이메일, CCTV 영상, 전자문서 등이 증거로
                      채택되었습니다.
                    </p>
                    <p className="text-gray-600">
                      강화된 서면통지 요건: 2024년 개정된 근로기준법에서는 통지서가 해고일로부터 7일 이내에 전달되어야
                      한다는 점이 강조되었으므로 이를 반영한 시스템 구축이 필요합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer theme="light" />
    </div>
  )
}
