import Navigation from "../../components/navigation"
import MobileNavigation from "../../components/MobileNavigation"
import Footer from "../../components/Footer"

export default function IndustrialAccidentPage() {
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
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">산재 컨설팅 서비스</h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              보상 신청·증거 수집·의료 지원·경제적 부담 해소에 초점
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
              {/* 긴급 사고 대응 및 증거 수집 */}
              <div className="bg-white rounded-lg p-8 shadow-lg transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">긴급 사고 대응 및 증거 수집</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">24시간 긴급출동 시스템</h3>
                    <p className="text-gray-600">
                      사고 발생 시 즉시 현장 출동하여 증거 보존, 의료 기록 확보, 유족 협상 지원
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">72시간 내 초동 대응</h3>
                    <p className="text-gray-600">
                      재해 발생 3일 내 근로복지공단 신청 절차 지원 및 증거 확보율 95% 달성
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">무료 법률 상담</h3>
                    <p className="text-gray-600">사고 접수부터 보상금 지급까지 전 과정 무상 법률 지원</p>
                  </div>
                </div>
              </div>

              {/* 맞춤형 보상 지원 */}
              <div className="bg-white rounded-lg p-8 shadow-lg transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">맞춤형 보상 지원</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">외국인 근로자 특화 서비스</h3>
                    <p className="text-gray-600">11개 언어 상담 지원, 보상금 평균 34% 증액 전략</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">경제적 부담 해소</h3>
                    <p className="text-gray-600">전액 후불제, 치료비 대출(연 2% 금리), 성공 보수만 청구</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">유족 종합 관리</h3>
                    <p className="text-gray-600">장례 지원, 미성년자 교육기금 설계, 유족연금 청구 표준화</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-12">
              {/* 의료·법률 연계 지원 */}
              <div className="bg-white rounded-lg p-8 shadow-lg transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">의료·법률 연계 지원</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">의료자문위원회</h3>
                    <p className="text-gray-600">업무상 질병 인과관계 과학적 입증, 산재불인정 사건 67% 재심 승소</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">AI 증거 분석</h3>
                    <p className="text-gray-600">작업일지 AI 분석으로 평균 3.2배 빠른 증거 수집</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">쟁점 예측 시스템</h3>
                    <p className="text-gray-600">93% 정확도로 보상금 범위·소요기간 사전 예측</p>
                  </div>
                </div>
              </div>

              {/* 투명한 프로세스 */}
              <div className="bg-white rounded-lg p-8 shadow-lg transform transition-transform hover:-translate-y-1">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">투명한 프로세스</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">실시간 진행 현황 공개</h3>
                    <p className="text-gray-600">고객 포털에서 문서 초안·심사관 의견 24시간 확인</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">블록체인 문서 관리</h3>
                    <p className="text-gray-600">모든 절차 검증 기록 공개, SMS 알림 서비스</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry-specific Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            주요 산업 분야별로 근로자를 위한 노무사의 산재 서비스
          </h2>

          {/* Manufacturing */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">1. 제조업 (Manufacturing)</h3>
            <p className="text-gray-600 mb-4">
              제조업은 기계 작동, 화학물질 노출, 반복 작업 등으로 인해 부상 위험이 높은 산업입니다. 노무사는 다음과 같은
              서비스를 통해 근로자를 지원할 수 있습니다:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">산재 신청 지원:</span>
                  <span className="text-gray-600">
                    {" "}
                    사고 발생 시 산재 보험 신청 절차를 안내하고, 필요한 서류 작성을 도와 근로자가 신속히 보상을 받도록
                    돕습니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">보상 청구 대행:</span>
                  <span className="text-gray-600">
                    {" "}
                    복잡한 산재 보상 청구 과정을 대신 처리하여 근로자가 어려움 없이 정당한 보상을 받을 수 있게
                    지원합니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">재활 및 직업 복귀 지원:</span>
                  <span className="text-gray-600">
                    {" "}
                    부상 후 재활 프로그램을 연결해주고, 직업 복귀를 위한 상담과 법적 조언을 제공합니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">법적 권리 교육:</span>
                  <span className="text-gray-600">
                    {" "}
                    근로자가 산재와 관련된 자신의 법적 권리를 이해하고 보호할 수 있도록 교육합니다.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Construction */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">2. 건설업 (Construction)</h3>
            <p className="text-gray-600 mb-4">
              건설업은 낙상, 붕괴, 감전 등 고위험 사고가 빈번한 분야입니다. 노무사는 다음과 같은 방법으로 근로자를
              지원합니다:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">사고 조사 및 증거 수집:</span>
                  <span className="text-gray-600">
                    {" "}
                    사고 발생 시 원인을 조사하고 증거를 수집하여 근로자의 권리를 뒷받침합니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">산재 보상 상담:</span>
                  <span className="text-gray-600">
                    {" "}
                    보상 종류와 신청 절차를 상세히 설명하며, 적절한 보상을 받을 수 있도록 돕습니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">안전 교육 및 예방 상담:</span>
                  <span className="text-gray-600">
                    {" "}
                    건설 현장의 위험 요인을 알리고, 안전 수칙 준수를 위한 교육을 제공합니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">법적 대응 지원:</span>
                  <span className="text-gray-600">
                    {" "}
                    사고로 인해 사업주나 제3자와 법적 분쟁이 생길 경우, 근로자를 대리하여 소송을 지원합니다.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Healthcare */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">3. 의료 및 보건 서비스업 (Healthcare)</h3>
            <p className="text-gray-600 mb-4">
              의료 분야는 감염, 환자 처치 중 부상, 직장 내 폭력 등의 위험이 있습니다. 노무사는 다음과 같은 서비스를
              제공합니다:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">감염 관련 산재 신청 지원:</span>
                  <span className="text-gray-600">
                    {" "}
                    업무 중 감염성 질병에 걸렸을 때 산재 신청을 도와 보상을 받을 수 있게 합니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">직장 내 폭력 피해 지원:</span>
                  <span className="text-gray-600">
                    {" "}
                    폭력 사건 발생 시 산재 신청과 심리적 회복을 위한 상담을 제공합니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">근무 환경 개선 상담:</span>
                  <span className="text-gray-600">
                    {" "}
                    안전한 작업 환경을 만들기 위한 조언을 제공하며, 근로자의 의견을 대변합니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">법적 권리 보호:</span>
                  <span className="text-gray-600">
                    {" "}
                    의료 근로자의 특수한 근무 조건을 고려해 법적 권리를 지켜줍니다.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          {/* Transportation and Logistics */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">4. 운송 및 물류업 (Transportation and Logistics)</h3>
            <p className="text-gray-600 mb-4">
              운송 및 물류업은 교통사고, 장시간 운전 피로, 화물 취급 부상이 주요 위험입니다. 노무사는 다음과 같은 지원을
              합니다:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">교통사고 산재 신청 지원:</span>
                  <span className="text-gray-600">
                    {" "}
                    교통사고 발생 시 산재 신청 절차를 안내하고 보상 청구를 돕습니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">피로 관리 상담:</span>
                  <span className="text-gray-600">
                    {" "}
                    장시간 운전으로 인한 피로를 줄이기 위한 상담과 근무 조건 개선 조언을 제공합니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">화물 취급 안전 교육:</span>
                  <span className="text-gray-600">
                    {" "}
                    무거운 화물 다룰 때 안전 장비 사용법과 부상 예방 방법을 교육합니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">법적 대응 지원:</span>
                  <span className="text-gray-600"> 사고로 인한 법적 분쟁에서 근로자를 대리하여 권리를 보호합니다.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Agriculture */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">5. 농업 (Agriculture)</h3>
            <p className="text-gray-600 mb-4">
              농업은 농기계 사고, 농약 중독, 동물 관련 부상이 흔합니다. 노무사는 다음과 같은 서비스로 근로자를 돕습니다:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">농기계 사고 산재 신청 지원:</span>
                  <span className="text-gray-600"> 농기계 사고 시 산재 신청과 보상 청구를 지원합니다.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">농약 중독 예방 교육:</span>
                  <span className="text-gray-600"> 농약 사용 시 안전 수칙과 중독 대응 방법을 교육합니다.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">동물 취급 안전 상담:</span>
                  <span className="text-gray-600"> 가축 다룰 때 안전 절차를 안내하여 부상을 예방합니다.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">법적 권리 교육:</span>
                  <span className="text-gray-600"> 농업 근로자가 산재 관련 권리를 알 수 있도록 교육합니다.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Common Services */}
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">공통 서비스</h3>
            <p className="text-gray-600 mb-4">
              산업 분야에 상관없이 노무사가 모든 근로자에게 제공할 수 있는 공통 서비스도 있습니다:
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">산재 신청 및 보상 상담:</span>
                  <span className="text-gray-600"> 산재 신청 절차와 보상 내용을 설명하고 서류 작성을 지원합니다.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">법적 권리 보호:</span>
                  <span className="text-gray-600">
                    {" "}
                    사업주와의 분쟁에서 근로자의 권리를 지키기 위한 법적 조언과 대응을 제공합니다.
                  </span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">재활 및 직업 복귀 지원:</span>
                  <span className="text-gray-600"> 부상 후 재활과 직업 복귀를 위한 실질적 도움을 줍니다.</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 font-semibold mr-2">•</span>
                <div>
                  <span className="font-semibold text-blue-600">심리적 지원:</span>
                  <span className="text-gray-600"> 사고로 인한 정신적 충격을 완화하기 위한 상담을 제공합니다.</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer theme="light" />
    </div>
  )
}
