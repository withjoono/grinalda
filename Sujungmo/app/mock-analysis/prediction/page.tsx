"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

const regions = [
  "전체",
  "서울",
  "경기",
  "인천",
  "대전",
  "세종",
  "충남",
  "충북",
  "광주",
  "전남",
  "전북",
  "부산",
  "울산",
  "경남",
  "제주",
]

const categories = ["전체", "자연", "인문", "예체능", "융합"]

// 대학별 점수 데이터 (예시)
const universityData = [
  { name: "경희대", minScore: 650, maxScore: 720, selected: false },
  { name: "경희대", minScore: 680, maxScore: 750, selected: false },
  { name: "경희대", minScore: 620, maxScore: 780, selected: false },
  { name: "경희대", minScore: 580, maxScore: 820, selected: false },
  { name: "경희대", minScore: 700, maxScore: 740, selected: false },
  { name: "경희대", minScore: 640, maxScore: 690, selected: false },
  { name: "경희대", minScore: 590, maxScore: 800, selected: false },
  { name: "경희대", minScore: 660, maxScore: 720, selected: false },
  { name: "경희대", minScore: 710, maxScore: 780, selected: false },
  { name: "경희대", minScore: 630, maxScore: 690, selected: false },
  { name: "경희대", minScore: 670, maxScore: 790, selected: false },
  { name: "경희대", minScore: 650, maxScore: 800, selected: false },
]

const myScore = 700 // 내 성적 (파란 선)

export default function MockAnalysisPredictionPage() {
  const [selectedRegion, setSelectedRegion] = useState("전체")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedUniversities, setSelectedUniversities] = useState<number[]>([])

  const toggleUniversity = (index: number) => {
    setSelectedUniversities((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            🌳 모의고사 분석 - 대학 예측
          </h1>
          <p className="text-gray-600 mb-4">
            대학별 계산식에 따른 나의 점수를 확인해 보고 대학이 합격하기 쉬운 대학을 찾아보세요.
          </p>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <Button
              variant="outline"
              size="sm"
              className="bg-orange-500 text-white border-orange-500 hover:bg-orange-600"
            >
              대학별 합격
            </Button>
            <ChevronRight className="w-4 h-4" />
            <span>학과별 합격</span>
            <ChevronRight className="w-4 h-4" />
            <span>위험도 확인</span>
            <ChevronRight className="w-4 h-4" />
            <span>대학 합격 점수별 비교</span>
          </div>
        </div>

        {/* Region Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-blue-500">🗺️</span>
              <span className="font-medium">지역 선택</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {regions.map((region) => (
                <Button
                  key={region}
                  variant={selectedRegion === region ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedRegion(region)}
                  className={selectedRegion === region ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  {region}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-orange-500">🔧</span>
              <span className="font-medium">계열 선택</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "bg-orange-500 hover:bg-orange-600" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chart Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">학교 검색 결과</h3>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                ⭐ 차트에서는
                <span className="text-orange-500 font-medium">합격할 대학 비교를</span>
                위해 총점과 점수가
                <span className="text-orange-500 font-medium">1000점으로 통일</span>
                되어 있습니다.
              </p>
            </div>

            {/* University Comparison Chart */}
            <div className="relative h-80 bg-white border rounded-lg p-4">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 py-4">
                <span>1000</span>
                <span>800</span>
                <span>600</span>
                <span>400</span>
                <span>200</span>
                <span>0</span>
              </div>

              {/* Chart area */}
              <div className="ml-8 h-full relative">
                {/* My Score Line */}
                <div
                  className="absolute w-full border-t-2 border-blue-500 z-10"
                  style={{ top: `${100 - (myScore / 1000) * 100}%` }}
                >
                  <span className="bg-blue-500 text-white px-2 py-1 text-xs rounded absolute -top-6 left-0">
                    내 성적
                  </span>
                </div>

                {/* University Bars */}
                <div className="flex items-end justify-between h-full pt-8 pb-12">
                  {universityData.map((university, index) => {
                    const barHeight = ((university.maxScore - university.minScore) / 1000) * 100
                    const barBottom = (university.minScore / 1000) * 100
                    const isSelected = selectedUniversities.includes(index)

                    return (
                      <div key={index} className="flex flex-col items-center relative h-full">
                        {/* Bar */}
                        <div
                          className="relative w-8 cursor-pointer"
                          style={{ height: "100%" }}
                          onClick={() => toggleUniversity(index)}
                        >
                          <div
                            className={`absolute w-full rounded ${
                              isSelected ? "bg-red-600" : "bg-orange-500"
                            } hover:bg-red-600 transition-colors`}
                            style={{
                              height: `${barHeight}%`,
                              bottom: `${barBottom}%`,
                            }}
                          />
                        </div>

                        {/* University Name and Selector */}
                        <div className="absolute -bottom-8 flex flex-col items-center">
                          <button
                            onClick={() => toggleUniversity(index)}
                            className={`w-4 h-4 rounded-full border-2 mb-1 ${
                              isSelected ? "bg-blue-500 border-blue-500" : "bg-white border-gray-300"
                            }`}
                          />
                          <span className="text-xs text-gray-600 whitespace-nowrap">{university.name}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex justify-center mt-4 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-blue-500"></div>
                <span className="text-sm">내 성적</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-2 bg-orange-500"></div>
                <span className="text-sm">대학 점수 범위</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Info Section */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-500">📊</span>
              <span className="font-medium">수험생 정보</span>
            </div>
            <div className="text-sm text-gray-600">
              <p>수험생 정보를 입력하시면 더 정확한 합격 예측을 제공해드립니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
