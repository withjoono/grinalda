"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ChevronDown, Menu, X } from "lucide-react"

interface NavigationProps {
  theme: "light" | "dark"
}

export default function Navigation({ theme }: NavigationProps) {
  // Update the textColor and hoverColor variables to ensure visibility
  const textColor = theme === "light" ? "text-gray-900" : "text-white"
  const hoverColor = theme === "light" ? "hover:text-[#4d5bce]" : "hover:text-[#915eff]"
  const bgColor = theme === "light" ? "bg-white/80" : "bg-black/10" // Increased opacity for better visibility
  const borderColor = theme === "light" ? "border-gray-200/20" : "border-gray-800/20"
  const dropdownBgColor = theme === "light" ? "bg-white" : "bg-[#0f1729]"
  const dropdownBorderColor = theme === "light" ? "border-gray-200" : "border-gray-800"
  const dropdownHoverBgColor = theme === "light" ? "hover:bg-gray-100" : "hover:bg-[#1a1a3a]"
  const mobileBgColor = theme === "light" ? "bg-white" : "bg-[#050816]"
  const mobileOverlayColor = theme === "light" ? "bg-black/5" : "bg-black/50"
  const mobileButtonColor = theme === "light" ? "text-gray-900" : "text-white"

  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [scrolled])

  // Get the current path to determine if we're in employee or employer section
  const [currentPath, setCurrentPath] = useState("")

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
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? `${bgColor} backdrop-blur-md border-b ${borderColor}` : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className={`text-lg font-bold ${textColor} hover:opacity-90 transition-opacity`}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4d5bce] to-[#915eff]">
                (주)노무AI
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8">
              {menuItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.hasDropdown && setActiveDropdown(item.name)}
                  onMouseLeave={() => item.hasDropdown && setActiveDropdown(null)}
                >
                  <Link
                    href={item.link}
                    className={`${textColor} ${hoverColor} transition-colors text-xs font-medium tracking-wide flex items-center gap-1 py-4`}
                    onClick={(e) => item.hasDropdown && e.preventDefault()}
                  >
                    {item.name}
                    {item.hasDropdown && <ChevronDown className="h-3 w-3" />}
                  </Link>

                  {item.hasDropdown && (
                    <div
                      className={`absolute left-0 mt-0 w-48 rounded-md shadow-lg ${dropdownBgColor} border ${dropdownBorderColor} overflow-hidden transition-all duration-200 origin-top-right z-50 ${
                        activeDropdown === item.name
                          ? "opacity-100 scale-100"
                          : "opacity-0 scale-95 pointer-events-none"
                      }`}
                    >
                      <div className="py-1">
                        {item.dropdownItems?.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.name}
                            href={dropdownItem.link}
                            className={`block px-4 py-2 text-xs ${textColor} ${hoverColor} ${dropdownHoverBgColor}`}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="block md:hidden p-2 rounded-md"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              style={{
                background: theme === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.3)",
                boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              }}
            >
              {mobileMenuOpen ? (
                <X className={`h-6 w-6 ${mobileButtonColor}`} />
              ) : (
                <Menu className={`h-6 w-6 ${mobileButtonColor}`} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

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
              className={`fixed inset-0 z-45 ${mobileOverlayColor}`}
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
                    <div key={item.name} className="border-b border-gray-200 dark:border-gray-800 pb-4">
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
