import Navigation from "../../components/navigation"
import MobileNavigation from "../../components/MobileNavigation"
import Footer from "../../components/Footer"

export default function WagePage() {
  return (
    <div className="min-h-screen bg-white relative">
      <Navigation theme="light" />
      <MobileNavigation theme="light" />

      {/* Hero Section - Full screen height */}
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
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">임금 컨설팅 서비스</h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto">
              "당신의 노동, 정당한 대가를 받아야 합니다!"
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Introduction */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            <p className="text-lg text-gray-700 mb-8">
              임금 체불, 미지급 수당, 부당한 임금 삭감… 이런 문제로 고민하고 계신가요?
              <br />
              전문 노무사가 당신의 권리를 지키기 위해 여기에 있습니다.
            </p>
          </div>

          {/* Why Choose Us */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">왜 저희를 선택해야 할까요?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-8 shadow-lg transform transition-transform hover:-translate-y-1">
                <div className="bg-blue-100 text-blue-600 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-4">전문성</h3>
                <p className="text-gray-600 text-center">
                  노동법에 정통한 노무사가 당신의 상황을 면밀히 분석하고, 최적의 해결책을 제시합니다.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg transform transition-transform hover:-translate-y-1">
                <div className="bg-green-100 text-green-600 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-4">신속한 대응</h3>
                <p className="text-gray-600 text-center">
                  24시간 비상대응 체계로 체불 신고 접수 후 72시간 내 긴급 대응, 더 이상의 피해를 막습니다.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg transform transition-transform hover:-translate-y-1">
                <div className="bg-purple-100 text-purple-600 w-14 h-14 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <span className="text-2xl">⚖️</span>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-4">공정한 해결</h3>
                <p className="text-gray-600 text-center">
                  근로기준법 제36조에 근거해 정당한 임금을 되찾을 수 있도록 지원합니다.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center max-w-4xl mx-auto mb-16 bg-blue-50 py-10 px-6 rounded-xl">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">임금 분쟁, 더 이상 혼자 고민하지 마세요!</h2>
          </div>

          {/* Services */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                체불임금·미지급수당 회수
              </h3>
              <p className="text-gray-600">AI 기반 임금 계산 모듈로 정확한 청구 금액 산정.</p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                부당 해고 및 근로 조건 불만
              </h3>
              <p className="text-gray-600">판례 기반 법률 검증으로 맞춤형 권리 구제.</p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                노동법 상담 및 소송 지원
              </h3>
              <p className="text-gray-600">형사·민사 병행 전략으로 최대 회수율 달성.</p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gray-100 rounded-lg p-8 shadow-md mb-16">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">지금 바로 연락하세요!</h2>
            <div className="flex flex-wrap justify-center gap-10">
              <div className="text-center">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <span className="text-xl">📞</span>
                </div>
                <p className="text-gray-700 font-medium">연락처</p>
                <p className="text-gray-600">전화1 : 070-4448-6960</p>
                <p className="text-gray-600">전화2 : 042-471-1197</p>
                <p className="text-gray-600">문자 : 010-3438-1194</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <span className="text-xl">✉️</span>
                </div>
                <p className="text-gray-700 font-medium">이메일</p>
                <p className="text-gray-600">sws12q@naver.com</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mb-3 mx-auto">
                  <span className="text-xl">🏢</span>
                </div>
                <p className="text-gray-700 font-medium">방문상담</p>
                <p className="text-gray-600">대전광역시 서구 청사로 228, 11층 1110호</p>
              </div>
            </div>
          </div>

          {/* Professional Services */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">저희의 전문 서비스</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">긴급임금압류 시스템</h3>
                <p className="text-gray-600">
                  체불 사업주 재산 은닉 우려 시, 48시간 내 은행계좌 가압류 및 부동산 처분금지가처분 신청.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">디지털 증거관리 플랫폼</h3>
                <p className="text-gray-600">
                  카카오톡 대화, 출퇴근 기록, 급여 입금 내역을 블록체인 타임스탬프로 확보.
                </p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">성공 사례</h3>
                <p className="text-gray-600">
                  2024년 기준 체불임금 회수율 89% 달성, 평균 7.2일 단축 처리, 체불액 50% 선지급 제도(최대 1천만 원).
                </p>
              </div>
            </div>
          </div>

          {/* Foreign Workers */}
          <div className="mb-16 bg-gray-50 py-10 px-6 rounded-xl">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">외국인 노동자를 위한 특별 지원</h2>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-3">11개 언어 실시간 통역</h3>
                <p className="text-gray-600">
                  베트남, 우즈베키스탄, 네팔 근로자 등 다국어 지원으로 노동위원회 심문 대리.
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-bold text-gray-800 mb-3">체류 연장 및 취업 연계</h3>
                <p className="text-gray-600">사업장 폐업 시 신속한 취업처 연결.</p>
              </div>
            </div>
          </div>

          {/* Technology Based Services */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">투명하고 첨단 기술 기반 서비스</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">성공보수제</h3>
                <p className="text-gray-600">체불액의 10% 고정 수수료, 추가 비용 없음.</p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">AI 기술 활용</h3>
                <p className="text-gray-600">최저임금 역산 알고리즘으로 통상임금 추가 청구 성공률 향상.</p>
              </div>

              <div className="bg-white rounded-lg p-8 shadow-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">실시간 사건 관리</h3>
                <p className="text-gray-600">고객 전용 포털에서 증거 제출 현황 및 심문 일정 24시간 확인 가능.</p>
              </div>
            </div>
          </div>

          {/* Quote */}
          <div className="bg-blue-50 p-10 rounded-xl text-center max-w-4xl mx-auto">
            <blockquote className="text-xl italic text-gray-700 mb-4">
              "임금은 노동자의 생명선입니다. 첫 체불 신고 접수 72시간이 권리 회복의 관건입니다."
            </blockquote>
            <cite className="text-gray-600 font-medium">- 대표 노무사 성시웅</cite>
          </div>
        </div>
      </section>

      <Footer theme="light" />
    </div>
  )
}
