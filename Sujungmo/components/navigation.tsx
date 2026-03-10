"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"

export function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const subDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (menuTitle: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current)
    }
    setActiveDropdown(menuTitle)
  }

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
      setActiveSubDropdown(null)
    }, 200) // Increased delay from 150ms to 200ms for better stability
  }

  const handleSubMouseEnter = (itemName: string) => {
    if (subDropdownTimeoutRef.current) {
      clearTimeout(subDropdownTimeoutRef.current)
    }
    setActiveSubDropdown(itemName)
  }

  const handleSubMouseLeave = () => {
    subDropdownTimeoutRef.current = setTimeout(() => {
      setActiveSubDropdown(null)
    }, 300) // Increased delay from 150ms to 300ms for easier submenu navigation
  }

  const handleSubmenuMouseEnter = () => {
    if (subDropdownTimeoutRef.current) {
      clearTimeout(subDropdownTimeoutRef.current)
    }
  }

  const handleSubmenuMouseLeave = () => {
    subDropdownTimeoutRef.current = setTimeout(() => {
      setActiveSubDropdown(null)
    }, 300)
  }

  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
      if (subDropdownTimeoutRef.current) clearTimeout(subDropdownTimeoutRef.current)
    }
  }, [])

  const menuItems = [
    {
      title: "생기부 분석",
      items: [
        { name: "생기부 입력", href: "/analysis/record-input" },
        { name: "1학년 교과분석", href: "/analysis/grade1/subject" },
        { name: "2학년 교과분석", href: "/analysis/grade2/subject" },
        { name: "3학년 교과분석", href: "/analysis/grade3/subject" },
      ],
    },
    {
      title: "모의고사 분석",
      items: [
        { name: "입력", href: "/mock-analysis/input" },
        { name: "성적 분석", href: "/mock-analysis/score-analysis" },
        { name: "대학 예측", href: "/mock-analysis/prediction" },
        { name: "누적 분석", href: "/mock-analysis/statistics" },
        { name: "분석과 오답", href: "/mock-analysis/management" },
        { name: "목표대학", href: "/mock-analysis/target-university" },
      ],
    },
    {
      title: "수시 합격 예측",
      items: [
        { name: "생기부 입력", href: "/susi/record-input" },
        { name: "교과 예측", href: "/prediction/susi/subject" },
      ],
    },
    {
      title: "정시 합격 예측",
      items: [
        { name: "성적 입력", href: "/jungsi/score-input" },
        { name: "수능 분석", href: "/jungsi/csat-analysis" },
        { name: "가군 예측", href: "/jungsi/a" },
        { name: "나군 예측", href: "/jungsi/b" },
        { name: "다군 예측", href: "/jungsi/c" },
        { name: "지방대 예측", href: "/jungsi/outside" },
      ],
    },
    {
      title: "문제은행",
      items: [{ name: "분석 전략", href: "/prediction/analysis/strategy" }],
    },
  ]

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/images/hizen-new-logo.png"
              alt="Hizen Compass"
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="text-xl font-bold text-gray-900">Hizen Compass</span>
          </Link>

          {/* Navigation Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((menu) => (
              <div
                key={menu.title}
                className="relative"
                onMouseEnter={() => handleMouseEnter(menu.title)}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center space-x-1 text-gray-700 hover:text-orange-600 py-2">
                  <span>{menu.title}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {activeDropdown === menu.title && (
                  <div className="absolute top-full left-0 pt-1 w-48 z-50">
                    <div className="bg-white border border-gray-200 rounded-md shadow-lg">
                      <div className="py-1">
                        {menu.items.map((item) => (
                          <div key={item.name} className="relative">
                            {item.subItems ? (
                              <div
                                className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600 cursor-pointer"
                                onMouseEnter={() => handleSubMouseEnter(item.name)}
                                onMouseLeave={handleSubMouseLeave}
                              >
                                <span>{item.name}</span>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            ) : (
                              <Link
                                href={item.href}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600"
                              >
                                {item.name}
                              </Link>
                            )}

                            {/* Submenu support for statistics */}
                            {item.subItems && activeSubDropdown === item.name && (
                              <div
                                className="absolute left-full top-0 pl-2 w-44 z-50" // Increased padding and width for easier access
                                onMouseEnter={handleSubmenuMouseEnter}
                                onMouseLeave={handleSubmenuMouseLeave}
                              >
                                <div className="bg-white border border-gray-200 rounded-md shadow-lg">
                                  <div className="py-1">
                                    {item.subItems.map((subItem) => (
                                      <Link
                                        key={subItem.name}
                                        href={subItem.href}
                                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 hover:text-orange-600" // Increased padding for easier clicking
                                      >
                                        {subItem.name}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium">
              무료체험
            </button>
            <button className="text-gray-700 hover:text-orange-600 text-sm font-medium">회원가입</button>
            <button className="text-gray-700 hover:text-orange-600 text-sm font-medium">로그인</button>
          </div>
        </div>
      </div>
    </nav>
  )
}
