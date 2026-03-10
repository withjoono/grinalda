"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, ChevronDown } from "lucide-react"

interface MobileNavigationProps {
  theme: "light" | "dark"
}

export default function MobileNavigation({ theme }: MobileNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null)
  const [currentPath, setCurrentPath] = useState("")

  // Colors based on theme
  const textColor = theme === "light" ? "text-gray-900" : "text-white"
  const hoverColor = theme === "light" ? "hover:text-[#4d5bce]" : "hover:text-[#915eff]"
  const mobileBgColor = theme === "light" ? "bg-white" : "bg-[#050816]"
  const mobileOverlayColor = theme === "light" ? "bg-black/5" : "bg-black/50"
  const buttonBgColor = theme === "light" ? "bg-white/90" : "bg-[#1a1a3a]/90"

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [mobileMenuOpen])

  const isEmployer = currentPath.includes("/employer")

  // For employer section, we'll link to sections on the employer page
  // For employee section, we'll link to separate pages
  const getServiceLinks = () => {
    if (isEmployer) {
      return [
        { name: "산재", link: "/employer/industrial-accident" },
        { name: "해고", link: "/employer/dismissal" },
        { name: "임금", link: "#" },
      ]
    } else {
      return [
        { name: "산재", link: "/employee/industrial-accident" },
        { name: "해고", link: "/employee/dismissal" },
        { name: "임금", link: "#" },
      ]
    }
  }

  const menuItems = [
    { name: "회사소개", link: "#", hasDropdown: false },
    {
      name: "노무사 (비)대면 서비스",
      link: "#",
      hasDropdown: true,
      dropdownItems: getServiceLinks(),
    },
    {
      name: isEmployer ? "AI와 IT 서비스" : "빅데이터, AI 활용 서비스",
      link: isEmployer ? "/employer/ai-it-service" : "/employee/big-data-ai-service",
      hasDropdown: false,
    },
    { name: "사시자료", link: "#", hasDropdown: false },
    { name: "문의하기", link: "#", hasDropdown: false },
    { name: "문서 관리", link: "#", hasDropdown: false },
  ]

  const toggleMobileDropdown = (name: string) => {
    if (mobileActiveDropdown === name) {
      setMobileActiveDropdown(null)
    } else {
      setMobileActiveDropdown(name)
    }
  }

  return (
    <>
      {/* Fixed Mobile Menu Button */}
      <div className="fixed top-4 right-4 z-50 md:hidden">
        <button
          className={`p-3 rounded-full shadow-lg ${buttonBgColor} backdrop-blur-md`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className={`h-6 w-6 ${textColor}`} /> : <Menu className={`h-6 w-6 ${textColor}`} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={`fixed inset-0 z-40 ${mobileOverlayColor}`}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className={`fixed top-0 right-0 z-50 w-4/5 max-w-sm h-full ${mobileBgColor} shadow-xl overflow-y-auto`}
            >
              <div className="p-5">
                <div className="flex justify-between items-center mb-8">
                  <Link
                    href="/"
                    className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#4d5bce] to-[#915eff]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    (주)노무AI
                  </Link>
                  <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
                    <X className={`h-6 w-6 ${textColor}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <div
                      key={item.name}
                      className={`border-b ${theme === "light" ? "border-gray-200" : "border-gray-800"} pb-4`}
                    >
                      {item.hasDropdown ? (
                        <div>
                          <button
                            onClick={() => toggleMobileDropdown(item.name)}
                            className={`flex items-center justify-between w-full ${textColor} font-medium text-sm`}
                          >
                            {item.name}
                            <ChevronDown
                              className={`h-4 w-4 transition-transform duration-200 ${
                                mobileActiveDropdown === item.name ? "rotate-180" : ""
                              }`}
                            />
                          </button>

                          <AnimatePresence>
                            {mobileActiveDropdown === item.name && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="mt-2 ml-4 overflow-hidden"
                              >
                                {item.dropdownItems?.map((dropdownItem) => (
                                  <Link
                                    key={dropdownItem.name}
                                    href={dropdownItem.link}
                                    className={`block py-2 text-sm ${textColor} ${hoverColor}`}
                                    onClick={() => setMobileMenuOpen(false)}
                                  >
                                    {dropdownItem.name}
                                  </Link>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        <Link
                          href={item.link}
                          className={`block ${textColor} ${hoverColor} font-medium text-sm`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <Link
                    href="#"
                    className="inline-flex items-center justify-center w-full px-4 py-2 bg-[#4d5bce] text-white rounded-full text-sm font-medium hover:bg-[#3a46a0] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    문의하기
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
