"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import { Sparkles, Zap } from "lucide-react"

export default function AIITServiceCTA() {
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  return (
    <section ref={ref} className="py-20 relative overflow-hidden bg-[#080a1e]">
      <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#4d5bce] blur-[120px] opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#915eff] blur-[120px] opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-6 tracking-wide leading-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4d5bce] to-[#915eff]">
              AI와 IT 기술로 노무 관리의
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#915eff] to-[#ff5e8f]">
              새로운 패러다임을 경험하세요
            </span>
          </h2>

          <p className="text-sm text-gray-400 mb-10 tracking-wide leading-relaxed">
            노무AI의 AI 기반 서비스로 기업의 노무 관리를 혁신하고 효율성을 높이세요. 맞춤형 컨설팅을 통해 귀사에 가장
            적합한 솔루션을 제안해 드립니다.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="#"
                className="group px-6 py-2.5 bg-[#4d5bce] rounded-full hover:bg-[#3a46a0] transition-all duration-300 flex items-center gap-2 relative overflow-hidden text-sm"
              >
                <span className="relative z-10">무료 상담 신청</span>
                <Sparkles className="h-5 w-5 relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#4d5bce] to-[#915eff] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link
                href="#"
                className="group px-6 py-2.5 bg-[#1a1a3a] border border-[#4d5bce]/30 rounded-full hover:border-[#4d5bce] transition-all duration-300 flex items-center gap-2 text-sm"
              >
                <span className="relative z-10">서비스 소개서 다운로드</span>
                <Zap className="h-5 w-5 relative z-10" />
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
