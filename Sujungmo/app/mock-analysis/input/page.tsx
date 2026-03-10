"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown } from "lucide-react"

export default function MockExamInputPage() {
  const router = useRouter()
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("")
  const [selectedMonth, setSelectedMonth] = useState("")

  const years = ["2025", "2024", "2023", "2022", "2021"]
  const grades = ["고1", "고2", "고3"]
  const months = ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월"]

  const handleScoreInput = () => {
    const params = new URLSearchParams({
      year: selectedYear,
      grade: selectedGrade,
      month: selectedMonth,
    })

    router.push(`/mock-analysis/input/score?${params.toString()}`)
  }

  const handleAnswerInput = () => {
    const params = new URLSearchParams({
      year: selectedYear,
      grade: selectedGrade,
      month: selectedMonth,
    })

    router.push(`/mock-analysis/input/form?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>홈</span>
            <span>›</span>
            <span>모의고사</span>
            <span>›</span>
            <span className="text-orange-500">모의고사 입력</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">모의고사 입력</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Mock Exam Input Section */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              모의고사 입력
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">필수</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Year Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">연도</label>
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                  >
                    <option value="">연도</option>
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Grade Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">학년</label>
                <div className="relative">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                  >
                    <option value="">학년</option>
                    {grades.map((grade) => (
                      <option key={grade} value={grade}>
                        {grade}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Month Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">시행 월</label>
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white text-gray-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none"
                  >
                    <option value="">시행 월</option>
                    {months.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-200 mb-8" />

          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
              <button
                onClick={handleScoreInput}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
              >
                점수입력
              </button>
              <button
                onClick={handleAnswerInput}
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 rounded-lg font-semibold text-lg transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform"
              >
                정답입력
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
