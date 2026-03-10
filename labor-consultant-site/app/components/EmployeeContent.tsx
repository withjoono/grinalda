"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Footer from "./Footer"
import AnimatedTitle from "./AnimatedTitle"
import { ChevronDown, Sparkles, Zap, Shield, FileText, Clock } from "lucide-react"

export default function EmployeeContent() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="bg-white text-gray-900 relative z-10">
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 배경 효과 */}
        <div className="absolute inset-0 bg-white">
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
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white via-gray-50 to-white opacity-70"></div>
        </div>

        {/* 네온 효과 - adjust colors for light theme */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#4d5bce] blur-[120px] opacity-10"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#915eff] blur-[120px] opacity-10"></div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6 tracking-normal leading-tight"
          >
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#4d5bce] to-[#915eff]">
              근로자를 위한
            </span>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#915eff] to-[#ff5e8f]">
              전문 노무 서비스
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base mb-12 text-gray-600 max-w-2xl mx-auto leading-relaxed tracking-wide"
          >
            산업재해, 부당해고, 임금체불 등 근로자의 권리를 보호하는 전문 노무 서비스를 제공합니다
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              href="#contact"
              className="group px-6 py-2.5 bg-[#4d5bce] rounded-full hover:bg-[#3a46a0] transition-all duration-300 flex items-center gap-2 relative overflow-hidden text-sm text-white"
            >
              <span className="relative z-10">무료 상담 신청</span>
              <Sparkles className="h-5 w-5 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#4d5bce] to-[#915eff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="#services"
              className="group px-6 py-2.5 bg-[#1a1a3a] border border-[#4d5bce]/30 rounded-full hover:border-[#4d5bce] transition-all duration-300 flex items-center gap-2 text-sm text-white"
            >
              <span className="relative z-10">서비스 알아보기</span>
              <Zap className="h-5 w-5 relative z-10" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <div className="flex flex-col items-center gap-2 cursor-pointer animate-bounce">
              <p className="text-sm text-gray-500">스크롤</p>
              <ChevronDown className="h-5 w-5 text-gray-500" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* 소개 섹션 */}
      <AboutSection />

      {/* 주요 서비스 소개 */}
      <MainServicesSection />

      {/* 산업재해 컨설팅 */}
      <IndustrialAccidentSection />

      {/* 해고 컨설팅 */}
      <DismissalSection />

      {/* 임금 컨설팅 */}
      <WageSection />

      {/* 연락처 섹션 */}
      <ContactSection />

      <Footer theme="light" />
    </div>
  )
}

function MainServicesSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section id="services" ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <AnimatedTitle
            text="근로자를 위한 전문 노무 서비스"
            colorClass="bg-gradient-to-r from-[#4d5bce] to-[#915eff] text-transparent"
            borderClass="border-[#4d5bce]"
            inView={inView}
          />
          <p className="text-gray-600 mt-6 max-w-3xl mx-auto">
            노무AI는 근로자의 권리 보호를 위한 다양한 전문 서비스를 제공합니다. 산업재해, 부당해고, 임금체불 등 노동
            관련 문제에 대해 전문적인 상담과 해결책을 제시합니다.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-lg overflow-hidden shadow-lg group"
          >
            <div className="h-2 bg-gradient-to-r from-[#ff5e8f] to-[#ff5e8f]/70"></div>
            <div className="p-8">
              <div className="w-16 h-16 rounded-full bg-[#ff5e8f]/10 flex items-center justify-center mb-6">
                <Shield className="h-8 w-8 text-[#ff5e8f]" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-[#ff5e8f] transition-colors">
                산업재해 컨설팅
              </h3>
              <p className="text-gray-600 mb-6 text-sm">
                산업재해 발생 시 신속한 대응과 보상 청구를 지원합니다. 24시간 긴급출동 시스템과 맞춤형 보상 지원으로
                근로자의 권리를 보호합니다.
              </p>
              <Link
                href="/employee/industrial-accident"
                className="inline-flex items-center text-[#ff5e8f] font-medium text-sm"
              >
                자세히 보기
                <ChevronDown className="ml-1 h-4 w-4 rotate-270 transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg overflow-hidden shadow-lg group"
          >
            <div className="h-2 bg-gradient-to-r from-[#5effc0] to-[#5effc0]/70"></div>
            <div className="p-8">
              <div className="w-16 h-16 rounded-full bg-[#5effc0]/10 flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-[#5effc0]" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-[#5effc0] transition-colors">
                해고 컨설팅
              </h3>
              <p className="text-gray-600 mb-6 text-sm">
                부당해고 구제 신청 및 법률 지원을 제공합니다. 증거 수집, 노동위원회 구제 신청, 소송 지원 등 해고 관련
                문제를 전문적으로 해결합니다.
              </p>
              <Link href="/employee/dismissal" className="inline-flex items-center text-[#5effc0] font-medium text-sm">
                자세히 보기
                <ChevronDown className="ml-1 h-4 w-4 rotate-270 transform" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-lg overflow-hidden shadow-lg group"
          >
            <div className="h-2 bg-gradient-to-r from-[#ffce5e] to-[#ffce5e]/70"></div>
            <div className="p-8">
              <div className="w-16 h-16 rounded-full bg-[#ffce5e]/10 flex items-center justify-center mb-6">
                <Clock className="h-8 w-8 text-[#ffce5e]" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-800 group-hover:text-[#ffce5e] transition-colors">
                임금 컨설팅
              </h3>
              <p className="text-gray-600 mb-6 text-sm">
                체불임금, 미지급수당 회수를 지원합니다. AI 기반 임금 계산 모듈과 긴급임금압류 시스템으로 정당한 임금을
                받을 수 있도록 도와드립니다.
              </p>
              <Link href="/employee/wage" className="inline-flex items-center text-[#ffce5e] font-medium text-sm">
                자세히 보기
                <ChevronDown className="ml-1 h-4 w-4 rotate-270 transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function IndustrialAccidentSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <AnimatedTitle
              text="산업재해 컨설팅 서비스"
              colorClass="bg-gradient-to-r from-[#ff5e8f] to-[#915eff] text-transparent"
              borderClass="border-[#ff5e8f]"
              inView={inView}
            />
            <p className="text-gray-600 mt-6 mb-8">
              산업재해 발생 시 보상 신청·증거 수집·의료 지원·경제적 부담 해소에 초점을 맞춘 전문 서비스를 제공합니다.
            </p>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#ff5e8f]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#ff5e8f]">🏥</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">24시간 긴급출동 시스템</h4>
                  <p className="text-sm text-gray-600">
                    사고 발생 시 즉시 현장 출동하여 증거 보존, 의료 기록 확보, 유족 협상 지원
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#ff5e8f]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#ff5e8f]">⚡</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">72시간 내 초동 대응</h4>
                  <p className="text-sm text-gray-600">
                    재해 발생 3일 내 근로복지공단 신청 절차 지원 및 증거 확보율 95% 달성
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#ff5e8f]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#ff5e8f]">💼</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">맞춤형 보상 지원</h4>
                  <p className="text-sm text-gray-600">
                    외국인 근로자 특화 서비스, 경제적 부담 해소, 유족 종합 관리 등 맞춤형 지원
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Link
                href="/employee/industrial-accident"
                className="px-6 py-3 bg-[#ff5e8f] text-white rounded-full hover:bg-[#ff5e8f]/90 transition-colors inline-flex items-center gap-2"
              >
                <span>자세히 알아보기</span>
                <Zap className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/industrial-accident.jpg"
                alt="산업재해 컨설팅 서비스"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">산업재해 전문 컨설팅</h3>
                <p className="text-white/80 text-sm">전문 노무사와 함께 산업재해로부터 근로자의 권리를 보호하세요</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function DismissalSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <AnimatedTitle
              text="해고 컨설팅 서비스"
              colorClass="bg-gradient-to-r from-[#5effc0] to-[#4d5bce] text-transparent"
              borderClass="border-[#5effc0]"
              inView={inView}
            />
            <p className="text-gray-600 mt-6 mb-8">
              부당해고 구제·증거 수집 및 법률 지원, 녹취 및 증인 확보 지원, 그리고 해고 대응 관련 교육 및 정보 제공
              서비스를 제공합니다.
            </p>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#5effc0]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#5effc0]">📝</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">노동위원회 구제신청 안내</h4>
                  <p className="text-sm text-gray-600">
                    해고일로부터 3개월 이내 노동위원회 구제신청 지원, 입증자료 준비 방법 교육
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#5effc0]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#5effc0]">⚖️</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">AI 기반 증거 수집 솔루션</h4>
                  <p className="text-sm text-gray-600">
                    구두해고의 부당성 입증을 위한 전자 증거 자동 수집 및 디지털 자료 안전 아카이빙
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#5effc0]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#5effc0]">📚</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">해고 대응 교육 및 정보 제공</h4>
                  <p className="text-sm text-gray-600">부당해고 예방·대응 교육, 최신 판례 및 개정법 정보 실시간 제공</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Link
                href="/employee/dismissal"
                className="px-6 py-3 bg-[#5effc0] text-white rounded-full hover:bg-[#5effc0]/90 transition-colors inline-flex items-center gap-2"
              >
                <span>자세히 알아보기</span>
                <Zap className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/dismissal-consulting.jpg"
                alt="해고 컨설팅 서비스"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">부당해고 구제 서비스</h3>
                <p className="text-white/80 text-sm">
                  부당한 해고로부터 근로자의 권리를 지키고 정당한 보상을 받을 수 있도록 지원합니다
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function WageSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <AnimatedTitle
              text="임금 컨설팅 서비스"
              colorClass="bg-gradient-to-r from-[#ffce5e] to-[#ff5e8f] text-transparent"
              borderClass="border-[#ffce5e]"
              inView={inView}
            />
            <p className="text-gray-600 mt-6 mb-8">
              "당신의 노동, 정당한 대가를 받아야 합니다!" 임금 체불, 미지급 수당, 부당한 임금 삭감 등의 문제를
              전문적으로 해결해 드립니다.
            </p>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#ffce5e]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#ffce5e]">💵</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">체불임금·미지급수당 회수</h4>
                  <p className="text-sm text-gray-600">
                    AI 기반 임금 계산 모듈로 정확한 청구 금액 산정, 체불임금 회수율 89% 달성
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#ffce5e]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#ffce5e]">⚡</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">긴급임금압류 시스템</h4>
                  <p className="text-sm text-gray-600">
                    체불 사업주 재산 은닉 우려 시, 48시간 내 은행계좌 가압류 및 부동산 처분금지가처분 신청
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-start gap-4"
              >
                <div className="w-10 h-10 rounded-full bg-[#ffce5e]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-[#ffce5e]">🌐</span>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">디지털 증거관리 플랫폼</h4>
                  <p className="text-sm text-gray-600">
                    카카오톡 대화, 출퇴근 기록, 급여 입금 내역을 블록체인 타임스탬프로 확보
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Link
                href="/employee/wage"
                className="px-6 py-3 bg-[#ffce5e] text-white rounded-full hover:bg-[#ffce5e]/90 transition-colors inline-flex items-center gap-2"
              >
                <span>자세히 알아보기</span>
                <Zap className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/wage-consulting.jpg"
                alt="임금 컨설팅 서비스"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8">
                <h3 className="text-2xl font-bold text-white mb-2">임금 체불 해결 서비스</h3>
                <p className="text-white/80 text-sm">
                  체불임금, 미지급수당 등 임금 관련 문제를 신속하고 효과적으로 해결해 드립니다
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ContactSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section id="contact" ref={ref} className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <AnimatedTitle
            text="지금 바로 연락하세요"
            colorClass="bg-gradient-to-r from-[#4d5bce] to-[#915eff] text-transparent"
            borderClass="border-[#4d5bce]"
            inView={inView}
          />
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto">
            노무 관련 문제로 고민하고 계신가요? 전문 노무사가 무료로 상담해 드립니다. 지금 바로 연락주세요.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg p-8 shadow-lg max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">📞</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">연락처</h3>
              <p className="text-gray-600">전화1 : 070-4448-6960</p>
              <p className="text-gray-600">전화2 : 042-471-1197</p>
              <p className="text-gray-600">문자 : 010-3438-1194</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">✉️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">이메일</h3>
              <p className="text-gray-600">sws12q@naver.com</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🏢</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">방문상담</h3>
              <p className="text-gray-600">대전광역시 서구 청사로 228, 11층 1110호</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <div ref={ref} className="min-h-screen flex items-center relative overflow-hidden py-20 bg-white">
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#915eff] blur-[120px] opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#4d5bce] blur-[120px] opacity-10"></div>

      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#4d5bce] to-[#915eff] tracking-wide">
                (주)노무AI (구 청사에이아이) 소개
              </h2>
              <p className="text-sm text-gray-600 mb-6 tracking-wide leading-relaxed">
                근로자의 권리를 위한 든든한 파트너, 24/7 전문 노무 서비스 제공
              </p>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ x: 10 }}
                className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-50 border border-[#4d5bce]/20 hover:border-[#4d5bce]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#4d5bce]/20 flex items-center justify-center text-[#4d5bce]">
                    <span className="text-2xl">💡</span>
                  </div>
                  <span className="font-medium text-gray-700 text-sm">근로자의 권리 보호</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ x: 10 }}
                className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-50 border border-[#915eff]/20 hover:border-[#915eff]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#915eff]/20 flex items-center justify-center text-[#915eff]">
                    <span className="text-2xl">📘</span>
                  </div>
                  <span className="font-medium text-gray-700 text-sm">데이터 기반 노무 상담</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ x: 10 }}
                className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-50 border border-[#ff5e8f]/20 hover:border-[#ff5e8f]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#ff5e8f]/20 flex items-center justify-center text-[#ff5e8f]">
                    <span className="text-2xl">💼</span>
                  </div>
                  <span className="font-medium text-gray-700 text-sm">공정한 노사관계 지원</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ x: 10 }}
                className="p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-50 border border-[#5effc0]/20 hover:border-[#5effc0]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#5effc0]/20 flex items-center justify-center text-[#5effc0]">
                    <span className="text-2xl">💰</span>
                  </div>
                  <span className="font-medium text-gray-700 text-sm">임금 체불 해결</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden border border-[#4d5bce]/30 group">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/KakaoTalk_20250307_094044361-removebg-preview-WeZcuvm4b0nERv9APaA8Pm5Ok8bc5L.png"
                alt="대표 노무사 성시웅"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#4d5bce]/10 to-[#915eff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="mt-4 py-2 px-6 bg-gray-50 border border-[#4d5bce]/30 rounded-full">
              <p className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#4d5bce] to-[#915eff]">
                대표 노무사 : 성시웅
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
