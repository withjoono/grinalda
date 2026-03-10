"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Footer from "./Footer"
import DocumentSection from "./DocumentSection"
import { BarChart3, Brain, ChevronDown, Sparkles, Zap, Database, BookOpen, Heart } from "lucide-react"

export default function EmployerContent() {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <div className="text-white relative z-10">
      {/* First Hero Section - WITH WAVE PATTERN */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* 물결 패턴 배경 (전경) */}
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

        {/* 네온 효과 */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#4d5bce] blur-[120px] opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#915eff] blur-[120px] opacity-20"></div>

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
              최고의 노무 전문가
            </span>
            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#915eff] to-[#ff5e8f]">
              와 AI의 결합
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base mb-12 text-gray-400 max-w-2xl mx-auto leading-relaxed tracking-wide"
          >
            혁신적인 기술과 전문 지식으로 기업의 노무 관리를 최적화합니다
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6"
          >
            <Link
              href="#"
              className="group px-6 py-2.5 bg-[#4d5bce] rounded-full hover:bg-[#3a46a0] transition-all duration-300 flex items-center gap-2 relative overflow-hidden text-sm"
            >
              <span className="relative z-10">문의하기</span>
              <Sparkles className="h-5 w-5 relative z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#4d5bce] to-[#915eff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link
              href="#"
              className="group px-6 py-2.5 bg-[#1a1a3a] border border-[#4d5bce]/30 rounded-full hover:border-[#4d5bce] transition-all duration-300 flex items-center gap-2 text-sm"
            >
              <span className="relative z-10">자세히 알아보기</span>
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
              <p className="text-sm text-gray-400">스크롤</p>
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* About Section - NO WAVE PATTERN */}
      <AboutSection />

      {/* 노무사 대면 서비스 - WITH WAVE PATTERN */}
      <ServiceSectionWithWave />

      {/* 문서 체결/예방 관리 서비스 - NO WAVE PATTERN */}
      <DocumentSection theme="dark" />

      {/* AI와 IT를 활용한 노무 예측, 대행 서비스 - WITH WAVE PATTERN */}
      <AIITPredictionSectionWithWave />

      <Footer theme="dark" />
    </div>
  )
}

function AboutSection() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <div ref={ref} className="min-h-screen flex items-center relative overflow-hidden py-20 bg-[#050816]">
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
              <p className="text-sm text-gray-400 mb-6 tracking-wide leading-relaxed">
                AI 시대의 든든한 파트너 24/7 자동화된 서비스 제공
              </p>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ x: 10 }}
                className="p-4 rounded-lg bg-gradient-to-r from-[#1a1a3a] to-[#1a1a3a] border border-[#4d5bce]/20 hover:border-[#4d5bce]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#4d5bce]/20 flex items-center justify-center text-[#4d5bce]">
                    <span className="text-2xl">💡</span>
                  </div>
                  <span className="font-medium text-gray-300 text-sm">근로 문제를 해결한 워킹</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ x: 10 }}
                className="p-4 rounded-lg bg-gradient-to-r from-[#1a1a3a] to-[#1a1a3a] border border-[#915eff]/20 hover:border-[#915eff]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#915eff]/20 flex items-center justify-center text-[#915eff]">
                    <span className="text-2xl">📘</span>
                  </div>
                  <span className="font-medium text-gray-300 text-sm">데이터 기반 인사관리</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ x: 10 }}
                className="p-4 rounded-lg bg-gradient-to-r from-[#1a1a3a] to-[#1a1a3a] border border-[#ff5e8f]/20 hover:border-[#ff5e8f]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#ff5e8f]/20 flex items-center justify-center text-[#ff5e8f]">
                    <span className="text-2xl">💼</span>
                  </div>
                  <span className="font-medium text-gray-300 text-sm">체계적인 노사관리</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ x: 10 }}
                className="p-4 rounded-lg bg-gradient-to-r from-[#1a1a3a] to-[#1a1a3a] border border-[#5effc0]/20 hover:border-[#5effc0]/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#5effc0]/20 flex items-center justify-center text-[#5effc0]">
                    <span className="text-2xl">💰</span>
                  </div>
                  <span className="font-medium text-gray-300 text-sm">급여 체계 정리</span>
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
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%EC%8B%9C%EC%9B%85%ED%98%95%20%EB%8B%A8%EB%8F%85%20%EB%B0%B0%EA%B2%BD%EC%A0%9C%EA%B1%B0-XJlozXEPl7Ec85GMwhhRfQ0IRRrRiH.png"
                alt="대표 노무사"
                fill
                className="object-contain transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-[#4d5bce]/10 to-[#915eff]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="mt-4 py-2 px-6 bg-[#1a1a3a] border border-[#4d5bce]/30 rounded-full">
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

function ServiceSectionWithWave() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const isDark = true

  const services = [
    {
      title: "산업재해 컨설팅",
      description: "산업재해 발생 시 대응 방안 및 보상 관련 컨설팅",
      icon: "🏥",
      color: "#ff5e8f",
      link: "/employer/industrial-accident",
    },
    {
      title: "해고 컨설팅",
      description: "부당해고 대응 및 법적 절차 안내",
      icon: "📝",
      color: "#5effc0",
      link: "/employer/dismissal",
    },
    {
      title: "임금 컨설팅",
      description: "임금체불, 퇴직금 등 임금 관련 문제 해결",
      icon: "💵",
      color: "#ffce5e",
      link: "#",
    },
  ]

  return (
    <div ref={ref} className="min-h-screen flex items-center relative overflow-hidden py-20">
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

      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#915eff] blur-[120px] opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#4d5bce] blur-[120px] opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4d5bce] to-[#915eff] mb-4 tracking-wide leading-relaxed">
            사업주를 위한 노무사 대면 서비스
          </h2>
          <p className="text-sm text-gray-400 mt-4 max-w-2xl mx-auto tracking-wide leading-relaxed">
            전문 노무사가 직접 상담하여 최적의 해결책을 제시합니다
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              viewport={{ once: false }}
              className="group"
            >
              <Link href={service.link}>
                <div className="bg-[#1a1a3a] border-[#4d5bce]/20 hover:border-[#4d5bce]/50 rounded-lg overflow-hidden border group-hover:border-[#4d5bce]/50 transition-all duration-300 h-full">
                  <div
                    className="h-1"
                    style={{ background: `linear-gradient(to right, ${service.color}, ${service.color}CC)` }}
                  ></div>
                  <div className="p-8">
                    <div
                      className="w-16 h-16 rounded-full mb-6 flex items-center justify-center"
                      style={{ backgroundColor: `${service.color}20` }}
                    >
                      <span className="text-3xl">{service.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-[#4d5bce] to-[#915eff] tracking-wide">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-400 mb-5 leading-relaxed tracking-wide">{service.description}</p>
                    <div className="flex items-center text-[#4d5bce] font-medium text-sm">
                      <span>자세히 보기</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform duration-300"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AIITPredictionSectionWithWave() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const services = [
    {
      icon: <Database className="h-6 w-6" />,
      color: "#4d5bce",
      title: "자동화된 급여 및 근태 관리",
      description:
        "AI와 IT 기술을 활용해 직원의 근무 시간, 초과 근무, 휴가 사용 등을 자동으로 계산하여 급여를 정확히 산출합니다.",
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      color: "#915eff",
      title: "인사 평가 및 성과 관리",
      description: "AI가 직원의 업무 성과, 프로젝트 참여도, 동료 피드백 등을 분석해 객관적인 평가를 제공합니다.",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      color: "#ff5e8f",
      title: "노무 관련 데이터 분석 및 예측",
      description:
        "AI가 근무 패턴, 불만 사항, 이직률 등을 분석해 부당 해고나 임금 체불 같은 노무 분쟁 가능성을 예측합니다.",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      color: "#5effc0",
      title: "교육 및 훈련 콘텐츠 제공",
      description: "AI가 직원의 직무와 경험 수준에 맞춰 개인화된 노무 교육 콘텐츠를 제공합니다.",
    },
    {
      icon: <Heart className="h-6 w-6" />,
      color: "#ffce5e",
      title: "직원 복지 및 만족도 관리",
      description:
        "AI가 출퇴근 기록, 휴가 사용 패턴, 건강 데이터를 분석해 직원의 워크-라이프 밸런스를 평가하고 맞춤형 복지 프로그램을 제안합니다.",
    },
  ]

  return (
    <div ref={ref} className="min-h-screen flex items-center relative overflow-hidden py-20">
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

      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#915eff] blur-[120px] opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#4d5bce] blur-[120px] opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#915eff] to-[#ff5e8f] mb-4 tracking-wide">
            AI와 IT를 활용한 노무 예측, 대행 서비스
          </h2>
          <p className="text-sm text-gray-400 mt-4 max-w-2xl mx-auto tracking-wide leading-relaxed">
            노무 분야의 AI·IT 기술 접목은 단순한 업무 자동화 단계를 넘어 전략적 의사결정 지원 시스템으로 진화하고
            있습니다. 인공지능을 통해 노무 리스크를 사전에 예측하고, 빅데이터 분석을 기반으로 인력 운영 전략을
            수립하세요.
          </p>
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-1 bg-[#1a1a3a] border border-[#915eff]/30 rounded-full">
            <span className="animate-pulse">
              <Brain className="h-4 w-4 text-[#915eff]" />
            </span>
            <p className="text-[#915eff] font-medium text-xs">AI 기반 서비스</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-[#1a1a3a] rounded-lg overflow-hidden group p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}20` }}
                >
                  <div style={{ color: item.color }}>{item.icon}</div>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-[#4d5bce] to-[#915eff] tracking-wide">
                  {item.title}
                </h3>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed tracking-wide pl-16">{item.description}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/employer/ai-it-service"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a3a] border border-[#4d5bce]/30 rounded-full hover:border-[#4d5bce] transition-all duration-300 text-sm"
          >
            <span>자세히 알아보기</span>
            <Zap className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}
