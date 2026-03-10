"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ServiceSection({ theme = "light" }) {
  const isDark = theme === "dark"

  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.1,
  })

  const services = [
    {
      title: "산업재해 컨설팅",
      description: "산업재해 발생 시 대응 방안 및 보상 관련 컨설팅",
      icon: "🏥",
      color: "#ff5e8f",
      link: "/employee/industrial-accident",
    },
    {
      title: "해고 컨설팅",
      description: "부당해고 대응 및 법적 절차 안내",
      icon: "📝",
      color: "#5effc0",
      link: "/employee/dismissal",
    },
    {
      title: "임금 컨설팅",
      description: "임금체불, 퇴직금 등 임금 관련 문제 해결",
      icon: "💵",
      color: "#ffce5e",
      link: "/employee/wage",
    },
  ]

  // Determine background color based on theme
  const bgColor = isDark ? "bg-[#050816]" : "bg-white"

  return (
    <div ref={ref} className={`min-h-screen flex items-center relative overflow-hidden py-20 ${bgColor}`}>
      {/* Only add wave pattern for light theme */}
      {!isDark && (
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
      )}
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
            {isDark ? "사용자를 위한 노무사 대면 서비스" : "근로자를 위한 노무사 대면 서비스"}
          </h2>
          <p
            className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"} mt-4 max-w-2xl mx-auto tracking-wide leading-relaxed`}
          >
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
                <div
                  className={`${isDark ? "bg-[#1a1a3a] border-[#4d5bce]/20 hover:border-[#4d5bce]/50" : "bg-white shadow-md border-gray-200 hover:border-[#4d5bce]/50"} rounded-lg overflow-hidden border group-hover:border-[#4d5bce]/50 transition-all duration-300 h-full`}
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
                      className={`text-xl font-bold mb-3 ${isDark ? "text-white" : "text-gray-800"} group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-[#4d5bce] to-[#915eff] tracking-wide`}
                    >
                      {service.title}
                    </h3>
                    <p
                      className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"} mb-5 leading-relaxed tracking-wide`}
                    >
                      {service.description}
                    </p>
                    <div className="flex items-center text-[#4d5bce] font-medium text-sm">
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
