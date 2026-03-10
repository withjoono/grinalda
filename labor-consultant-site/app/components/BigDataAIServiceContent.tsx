"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { BarChart3, Brain, Database, FileText, Zap, CheckCircle, AlertTriangle } from "lucide-react"
import Link from "next/link"

export default function BigDataAIServiceContent() {
  return (
    <div className="bg-white text-gray-900 relative z-10 pt-20">
      {/* Hero Section - Updated to be full screen */}
      <HeroSection />

      {/* Core Services Section */}
      <CoreServicesSection />

      {/* Comparison Section */}
      <ComparisonSection />

      {/* Success Cases Section */}
      <SuccessCasesSection />
    </div>
  )
}

function HeroSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4d5bce] to-[#915eff]">
              단순한 노무 상담을 넘어, 데이터가 증명하는 공정한 노동 환경을 만들겠습니다.
            </span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-lg leading-relaxed space-y-4"
          >
            <p>
              저희는{" "}
              <strong className="text-[#4d5bce]">
                빅데이터와 AI 기술을 기반으로 한 혁신적인 노동자 전문 노무사 서비스
              </strong>
              입니다. 기존 노무사와 달리, 단순히 법률 지식이 아닌{" "}
              <strong className="text-[#4d5bce]">수천 건의 판례, 노동 분쟁 데이터, 기업별 패턴을 분석</strong>해
              근로자의 권리 보호를 위한 <strong className="text-[#4d5bce]">과학적이고 정확한 솔루션</strong>을
              제공합니다.
            </p>
            <p>
              사업주 중심의 기존 서비스와 달리, 오직{" "}
              <strong className="text-[#4d5bce]">근로자의 편에서 데이터로 승리를 설계합니다</strong>.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <Link
              href="#"
              className="inline-flex items-center px-6 py-3 bg-[#4d5bce] text-white rounded-full hover:bg-[#3a46a0] transition-colors duration-300"
            >
              <span>무료 상담 신청하기</span>
              <Zap className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function CoreServicesSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const services = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI 예측 분석을 통한 분쟁 해결 전략",
      description: "과거 유사 사례 데이터를 학습한 AI 모델로 분쟁 결과 예측 및 최적의 대응 방안 제시.",
      example: "이 회사와의 임금 체불 소송, 승률은 82%입니다. 3가지 전략을 제안드립니다.",
      color: "#4d5bce",
    },
    {
      icon: <Database className="h-8 w-8" />,
      title: "빅데이터 기반 증거 수집 & 분석",
      description: "노동 시간 기록, 임금 명세, 대화 내역 등 디지털 흔적을 자동 분석해 핵심 증거 도출.",
      example: "채팅 로그 1,200건 중 15건이 법적 효력 있는 증거로 사용 가능합니다.",
      color: "#915eff",
    },
    {
      icon: <AlertTriangle className="h-8 w-8" />,
      title: "개인 맞춤형 리스크 관리 리포트",
      description: "근로계약서, 근무 환경 데이터를 AI로 진단해 잠재적 위험 요소를 사전 경고.",
      example: "계약서 상 퇴직금 조항에 3년 후 삭감 가능 항목이 포함되어 있습니다. 수정이 필요합니다.",
      color: "#ff5e8f",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "실시간 분쟁 시뮬레이션",
      description: "AI가 상대방(사업주)의 반응을 예측해 질문별 답변 시나리오를 사전 연습.",
      example: "면담 시 이 질문에 대해 사업주는 70% 확률로 이렇게 대응할 것입니다.",
      color: "#5effc0",
    },
  ]

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#4d5bce] to-[#915eff]">
            📊 우리의 핵심 서비스
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            데이터와 AI 기술을 활용하여 근로자의 권리를 보호하고 최적의 해결책을 제시합니다.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full" style={{ backgroundColor: `${service.color}15` }}>
                  <div style={{ color: service.color }}>{service.icon}</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-800">{service.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                  <div className="bg-gray-50 p-3 rounded-md border-l-4" style={{ borderColor: service.color }}>
                    <p className="text-gray-700 text-sm italic">"{service.example}"</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ComparisonSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const comparisons = [
    {
      traditional: "경험과 감에 의존한 상담",
      ai: "데이터 기반 확률 제시",
    },
    {
      traditional: "수동적 문서 검토",
      ai: "자동화 증거 분석 & 리포트 생성",
    },
    {
      traditional: "사업주 중심 해결",
      ai: "근로자 권리 최적화 알고리즘",
    },
    {
      traditional: "단순 법률 조언",
      ai: "분쟁 예방부터 소송 전략까지 종합 관리",
    },
  ]

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#915eff] to-[#ff5e8f]">
            🌟 전통적 노무사와 우리의 차이
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            데이터 기반의 접근 방식으로 근로자에게 더 나은 결과를 제공합니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <div className="overflow-hidden rounded-lg shadow-md">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="bg-gray-100 text-gray-800 p-4 text-left">일반 노무사</th>
                  <th className="bg-[#4d5bce] text-white p-4 text-left">AI 노무사</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-4 border-b border-gray-200">{item.traditional}</td>
                    <td className="p-4 border-b border-gray-200 font-medium text-[#4d5bce]">{item.ai}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SuccessCasesSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const cases = [
    {
      title: "임금 체불 7개월",
      result: "AI 분석을 통해 증거 포착, 2주 만에 전액 지급 약정",
      icon: <FileText className="h-6 w-6" />,
      color: "#4d5bce",
    },
    {
      title: "부당 해고 통보",
      result: "유사 판례 92건 분석 후 복직 소송 승소",
      icon: <CheckCircle className="h-6 w-6" />,
      color: "#915eff",
    },
    {
      title: "연장근로 수당 미지급",
      result: "근무 기록 크롤링으로 1,200시간 누적 증거 확보",
      icon: <Database className="h-6 w-6" />,
      color: "#ff5e8f",
    },
  ]

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#4d5bce] to-[#915eff]">
            🛠 근로자 성공 사례
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            실제 데이터 기반 접근으로 해결한 근로자들의 성공 사례입니다.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {cases.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border-t-4"
              style={{ borderColor: item.color }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full" style={{ backgroundColor: `${item.color}15` }}>
                  <div style={{ color: item.color }}>{item.icon}</div>
                </div>
                <h3 className="font-bold text-gray-800">{item.title}</h3>
              </div>
              <p className="text-gray-600 text-sm">→ {item.result}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="#"
            className="inline-flex items-center px-6 py-3 bg-[#4d5bce] text-white rounded-full hover:bg-[#3a46a0] transition-colors duration-300"
          >
            <span>무료 상담 받기</span>
            <Zap className="ml-2 h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
