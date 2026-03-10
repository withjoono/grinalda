import type { LucideIcon } from "lucide-react"

interface ServiceCardProps {
  icon?: LucideIcon
  title: string
  description: string
  isMain?: boolean
  theme: "light" | "dark"
}

export default function ServiceCard({ icon: Icon, title, description, isMain = false, theme }: ServiceCardProps) {
  const bgColor = theme === "light" ? (isMain ? "bg-blue-600" : "bg-white") : isMain ? "bg-blue-900" : "bg-gray-800"
  const textColor = theme === "light" ? (isMain ? "text-white" : "text-gray-900") : "text-white"
  const descriptionColor =
    theme === "light" ? (isMain ? "text-blue-100" : "text-gray-600") : isMain ? "text-blue-200" : "text-gray-300"
  const hoverEffect =
    theme === "light"
      ? isMain
        ? "hover:bg-blue-700 hover:scale-105 hover:rotate-2"
        : "hover:bg-gray-50"
      : isMain
        ? "hover:bg-blue-800 hover:scale-105 hover:rotate-2"
        : "hover:bg-gray-750"

  return (
    <div className={`${bgColor} ${hoverEffect} rounded-lg p-6 transition-all duration-300 transform`}>
      {Icon && isMain && (
        <div className="mb-4">
          <Icon className={`h-12 w-12 ${textColor}`} />
        </div>
      )}
      <h3 className={`text-xl font-bold mb-2 ${textColor}`}>{title}</h3>
      <p className={`text-sm ${descriptionColor}`}>{description}</p>
    </div>
  )
}
