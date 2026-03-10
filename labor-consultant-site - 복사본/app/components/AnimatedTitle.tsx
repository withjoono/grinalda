"use client"

import { motion } from "framer-motion"

interface AnimatedTitleProps {
  text: string
  colorClass?: string
  borderClass?: string
  delay?: number
  inView?: boolean
}

export default function AnimatedTitle({
  text,
  colorClass = "bg-gradient-to-r from-blue-600 to-purple-600 text-transparent",
  borderClass = "border-blue-500",
  delay = 0,
  inView = true,
}: AnimatedTitleProps) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay: delay / 1000 }}
      className={`text-2xl font-bold inline-block ${colorClass} bg-clip-text relative tracking-wide leading-relaxed`}
    >
      {text}
      <motion.span
        initial={{ width: "0%" }}
        animate={inView ? { width: "100%" } : { width: "0%" }}
        transition={{ duration: 0.8, delay: (delay + 200) / 1000 }}
        className={`absolute -bottom-2 left-0 h-1 ${borderClass}`}
        style={{
          background: "linear-gradient(to right, #4d5bce, #915eff)",
        }}
      />
    </motion.h2>
  )
}
