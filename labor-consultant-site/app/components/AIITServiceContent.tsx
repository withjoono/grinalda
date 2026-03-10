"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Brain, Database, BarChart3, BookOpen, Heart, ChevronDown } from "lucide-react"
import AIITServiceCTA from "./AIITServiceCTA"

export default function AIITServiceContent() {
  return (
    <div className="bg-[#050816] text-white relative z-10">
      {/* Hero Section - Updated to be full screen */}
      <HeroSection />

      {/* Service Sections */}
      <AutomatedPayrollSection />
      <HRManagementSection />
      <DataAnalysisSection />
      <TrainingSection />
      <EmployeeWelfareSection />

      {/* CTA Section */}
      <AIITServiceCTA />
    </div>
  )
}

function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[#050816]">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#050816] via-[#0a0a2e] to-[#050816] opacity-70"></div>
      </div>

      {/* Neon effects */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#4d5bce] blur-[120px] opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#915eff] blur-[120px] opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-4 text-center relative z-10"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold mb-6 tracking-wide leading-tight"
        >
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#4d5bce] to-[#915eff]">
            AI와 IT를 활용한
          </span>
          <br />
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#915eff] to-[#ff5e8f]">
            노무 서비스
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-sm mb-12 text-gray-400 max-w-2xl mx-auto tracking-wide leading-relaxed"
        >
          노무 분야의 AI·IT 기술 접목은 단순한 업무 자동화 단계를 넘어 전략적 의사결정 지원 시스템으로 진화하고
          있습니다. 2025년 현재, 기업들은 인공지능을 통해 노무 리스크를 사전에 예측하고, 빅데이터 분석을 기반으로 인력
          운영 전략을 수립하며, 노사 관계의 투명성을 제고하는 등 다각적인 기술 활용을 추진 중입니다.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-2 cursor-pointer animate-bounce">
            <p className="text-xs text-gray-400">스크롤하여 더 알아보기</p>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

function AutomatedPayrollSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#4d5bce] blur-[120px] opacity-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start gap-12"
        >
          <div className="md:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#4d5bce]/20 flex items-center justify-center text-[#4d5bce]">
                <Database className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4d5bce] to-[#915eff] tracking-wide">
                1. 자동화된 급여 및 근태 관리
              </h2>
            </div>
          </div>

          <div className="md:w-2/3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#4d5bce]/20 hover:border-[#4d5bce]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">급여 계산 자동화</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                AI와 IT 기술을 활용해 직원의 근무 시간, 초과 근무, 휴가 사용 등을 자동으로 계산하여 급여를 정확히
                산출합니다. 예를 들어, AI가 근무 기록을 분석해 야근이나 휴일 근무 수당을 자동으로 반영합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#4d5bce]/20 hover:border-[#4d5bce]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">근태 관리 시스템</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                IT 기반 시스템으로 출퇴근 기록을 디지털화하고 실시간 모니터링을 통해 지각, 조퇴, 결근 등을 관리합니다.
                AI는 근태 패턴을 분석해 인사 관리에 활용할 수 있습니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#4d5bce]/20 hover:border-[#4d5bce]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">효과</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                수작업 오류를 줄이고, 급여 지급의 정확성을 높이며, HR 담당자의 업무 부담을 줄입니다.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function HRManagementSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 relative overflow-hidden bg-[#080a1e]">
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#915eff] blur-[120px] opacity-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start gap-12"
        >
          <div className="md:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#915eff]/20 flex items-center justify-center text-[#915eff]">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#915eff] to-[#ff5e8f] tracking-wide">
                2. 인사 평가 및 성과 관리
              </h2>
            </div>
          </div>

          <div className="md:w-2/3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#915eff]/20 hover:border-[#915eff]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">AI 기반 인사 평가</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                AI가 직원의 업무 성과, 프로젝트 참여도, 동료 피드백 등을 분석해 객관적인 평가를 제공합니다. 예를 들어,
                자연어 처리 기술로 보고서 품질이나 커뮤니케이션 능력을 평가할 수 있습니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#915eff]/20 hover:border-[#915eff]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">성과 예측</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                과거 데이터를 바탕으로 직원의 미래 성과를 예측하거나 팀 생산성을 분석해 인력 배치를 최적화합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#915eff]/20 hover:border-[#915eff]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">효과</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                주관적인 평가를 줄이고, 데이터 기반의 공정한 의사결정을 지원합니다.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function DataAnalysisSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#ff5e8f] blur-[120px] opacity-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start gap-12"
        >
          <div className="md:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#ff5e8f]/20 flex items-center justify-center text-[#ff5e8f]">
                <Brain className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff5e8f] to-[#ffce5e] tracking-wide">
                3. 노무 관련 데이터 분석 및 예측
              </h2>
            </div>
          </div>

          <div className="md:w-2/3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#ff5e8f]/20 hover:border-[#ff5e8f]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">노무 리스크 예측</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                AI가 근무 패턴, 불만 사항, 이직률 등을 분석해 부당 해고나 임금 체불 같은 노무 분쟁 가능성을 예측합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#ff5e8f]/20 hover:border-[#ff5e8f]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">법적 준수 모니터링</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                IT 시스템이 최신 노동법을 추적하고, 회사의 정책이 법을 준수하는지 점검하며, AI가 위반 사례를 탐지해
                경고합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#ff5e8f]/20 hover:border-[#ff5e8f]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">효과</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                법적 리스크를 줄이고, 직원과의 갈등을 사전에 예방할 수 있습니다.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function TrainingSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 relative overflow-hidden bg-[#080a1e]">
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#5effc0] blur-[120px] opacity-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start gap-12"
        >
          <div className="md:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#5effc0]/20 flex items-center justify-center text-[#5effc0]">
                <BookOpen className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#5effc0] to-[#4d5bce] tracking-wide">
                4. 교육 및 훈련 콘텐츠 제공
              </h2>
            </div>
          </div>

          <div className="md:w-2/3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#5effc0]/20 hover:border-[#5effc0]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">AI 기반 맞춤형 교육</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                AI가 직원의 직무와 경험 수준에 맞춰 개인화된 노무 교육 콘텐츠를 제공합니다. 예를 들어, 신입 직원에게는
                근로기준법 교육을, 관리자에게는 노무 관리 교육을 추천합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#5effc0]/20 hover:border-[#5effc0]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">온라인 교육 플랫폼</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                IT를 활용한 플랫폼으로 언제 어디서나 교육을 받을 수 있으며, 퀴즈나 시뮬레이션을 통해 학습 효과를
                높입니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#5effc0]/20 hover:border-[#5effc0]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">효과</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                직원들의 노무 규정 이해도를 높여 법적 문제 발생 가능성을 줄입니다.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function EmployeeWelfareSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#ffce5e] blur-[120px] opacity-10"></div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-start gap-12"
        >
          <div className="md:w-1/3">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-[#ffce5e]/20 flex items-center justify-center text-[#ffce5e]">
                <Heart className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ffce5e] to-[#ff5e8f] tracking-wide">
                5. 직원 복지 및 만족도 관리
              </h2>
            </div>
          </div>

          <div className="md:w-2/3 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#ffce5e]/20 hover:border-[#ffce5e]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">복지 정책 최적화</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                AI가 출퇴근 기록, 휴가 사용 패턴, 건강 데이터를 분석해 직원의 워크-라이프 밸런스를 평가하고 맞춤형 복지
                프로그램을 제안합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#ffce5e]/20 hover:border-[#ffce5e]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">피드백 분석</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                AI가 설문조사나 피드백 데이터를 분석해 직원 만족도와 불만 사항을 파악합니다.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-[#1a1a3a] rounded-lg p-6 border border-[#ffce5e]/20 hover:border-[#ffce5e]/50 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 tracking-wide">효과</h3>
              <p className="text-xs text-gray-400 tracking-wide leading-relaxed">
                직원 복지와 만족도를 높여 이직률을 줄이고 생산성을 향상시킵니다.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
