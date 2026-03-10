"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function DocumentSection({ theme = "light" }) {
  const isDark = theme === "dark"

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const services = [
    {
      title: "근로계약서 작성",
      description: "법적 효력이 있는 근로계약서 작성 및 검토",
      icon: "📄",
      color: "#4d5bce",
      link: "#",
    },
    {
      title: "임금명세서 자동화",
      description: "법정 요건을 충족하는 임금명세서 자동 생성",
      icon: "💼",
      color: "#915eff",
      link: "#",
    },
    {
      title: "노무 관련 서류 관리",
      description: "근로자 관련 서류의 체계적인 관리 및 보관",
      icon: "📊",
      color: "#ff5e8f",
      link: "#",
    },
  ]

  // Determine background color based on theme
  const bgColor = isDark ? "bg-[#050816]" : "bg-white"

  return (
    <div ref={ref} className={`min-h-screen flex items-center relative overflow-hidden py-20 ${bgColor}`}>
      {/* No wave pattern for this section */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#915eff] blur-[120px] opacity-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#4d5bce] blur-[120px] opacity-10"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#915eff] to-[#ff5e8f] mb-4 tracking-wide leading-relaxed">
            문서 체결/예방 관리 서비스
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mt-4 max-w-2xl mx-auto tracking-wide leading-relaxed`}
          >
            AI 기반 자동화 시스템으로 노무 관련 문서를 효율적으로 관리합니다
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
                <div
                  className={`${isDark ? "bg-[#1a1a3a] border-[#915eff]/20 hover:border-[#915eff]/50" : "bg-white shadow-md border-gray-200 hover:border-[#915eff]/50"} rounded-lg overflow-hidden border group-hover:border-[#915eff]/50 transition-all duration-300 h-full`}
                >
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
                    <h3
                      className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-800"} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-[#915eff] to-[#ff5e8f] tracking-wide`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-5 leading-relaxed tracking-wide`}
                    >
                      {service.description}
                    </p>
                    <div className="flex items-center text-[#915eff] font-medium text-sm">
                      <span>자세히 보기</span>
                      <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-2 transition-transform duration-300" />
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
