import type React from "react"

interface WavePatternProps {
  theme: "light" | "dark"
}

export const WavePattern: React.FC<WavePatternProps> = ({ theme }) => {
  if (theme === "light") {
    return (
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
    )
  } else {
    return (
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
    )
  }
}
