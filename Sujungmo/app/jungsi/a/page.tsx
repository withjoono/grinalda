"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Home, Target, TrendingUp, AlertCircle, Star } from "lucide-react"

export default function JungsiAPage() {
  const [selectedFilter, setSelectedFilter] = useState("전체")

  const filters = ["전체", "서울권", "수도권", "지방거점", "교육대", "의대"]

  const universityData = [
    {
      university: "서울대학교",
      department: "경영학과",
      competition: "15.2:1",
      cutoff: "1.33",
      myScore: "1.45",
      probability: 85,
      status: "안전",
      region: "서울권",
      type: "일반",
    },
    {
      university: "연세대학교",
      department: "경제학과",
      competition: "12.8:1",
      cutoff: "1.67",
      myScore: "1.45",
      probability: 95,
      status: "안전",
      region: "서울권",
      type: "일반",
    },
    {
      university: "고려대학교",
      department: "경영학과",
      competition: "18.5:1",
      cutoff: "1.89",
      myScore: "1.45",
      probability: 98,
      status: "안전",
      region: "서울권",
      type: "일반",
    },
    {
      university: "성균관대학교",
      department: "글로벌경영학과",
      competition: "11.2:1",
      cutoff: "2.11",
      myScore: "1.45",
      probability: 99,
      status: "안전",
      region: "서울권",
      type: "일반",
    },
    {
      university: "한양대학교",
      department: "경영학과",
      competition: "9.8:1",
      cutoff: "2.33",
      myScore: "1.45",
      probability: 99,
      status: "안전",
      region: "서울권",
      type: "일반",
    },
    {
      university: "중앙대학교",
      department: "경영학과",
      competition: "14.5:1",
      cutoff: "2.67",
      myScore: "1.45",
      probability: 99,
      status: "안전",
      region: "서울권",
      type: "일반",
    },
  ]

  const filteredData =
    selectedFilter === "전체" ? universityData : universityData.filter((item) => item.region === selectedFilter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "안전":
        return "text-green-600 bg-green-50"
      case "적정":
        return "text-blue-600 bg-blue-50"
      case "소신":
        return "text-orange-600 bg-orange-50"
      case "도전":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const myStats = {
    korean: { score: 130, grade: 1, percentile: 92 },
    math: { score: 125, grade: 2, percentile: 87 },
    english: { grade: 1, percentile: 95 },
    inquiry: { score: 128, grade: 1, percentile: 90 },
    total: "1.45",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Home className="h-4 w-4" />
          <span>홈</span>
          <ChevronRight className="h-4 w-4" />
          <span>정시</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">가군 예측</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">정시 가군 합격 예측</h1>
          <p className="text-gray-600">내 성적을 바탕으로 정시 가군 지원 가능한 대학을 분석합니다.</p>
        </div>

        {/* My Score Summary */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />내 성적 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold text-blue-600">{myStats.korean.score}</h3>
                <p className="text-sm text-blue-800">국어 표준점수</p>
                <Badge variant="default" className="mt-1">
                  {myStats.korean.grade}등급
                </Badge>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <h3 className="text-lg font-bold text-green-600">{myStats.math.score}</h3>
                <p className="text-sm text-green-800">수학 표준점수</p>
                <Badge variant="secondary" className="mt-1">
                  {myStats.math.grade}등급
                </Badge>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-bold text-purple-600">{myStats.english.grade}등급</h3>
                <p className="text-sm text-purple-800">영어</p>
                <Badge variant="default" className="mt-1">
                  {myStats.english.percentile}%
                </Badge>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <h3 className="text-lg font-bold text-orange-600">{myStats.inquiry.score}</h3>
                <p className="text-sm text-orange-800">탐구 표준점수</p>
                <Badge variant="default" className="mt-1">
                  {myStats.inquiry.grade}등급
                </Badge>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-bold text-gray-900">{myStats.total}</h3>
                <p className="text-sm text-gray-800">종합 등급</p>
                <Badge variant="default" className="mt-1">
                  상위 5%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Buttons */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              대학 필터
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant={selectedFilter === filter ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedFilter(filter)}
                >
                  {filter}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* University Predictions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                합격 예측 결과
              </span>
              <Badge variant="outline">{filteredData.length}개 대학</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">대학/학과</th>
                    <th className="text-center py-3 px-4 font-medium">경쟁률</th>
                    <th className="text-center py-3 px-4 font-medium">작년 컷</th>
                    <th className="text-center py-3 px-4 font-medium">내 점수</th>
                    <th className="text-center py-3 px-4 font-medium">합격 확률</th>
                    <th className="text-center py-3 px-4 font-medium">지원 전략</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.university}</div>
                          <div className="text-sm text-gray-600">{item.department}</div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4 font-medium">{item.competition}</td>
                      <td className="text-center py-3 px-4">{item.cutoff}</td>
                      <td className="text-center py-3 px-4 font-medium text-blue-600">{item.myScore}</td>
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Progress value={item.probability} className="w-16 h-2" />
                          <span className="text-sm font-medium">{item.probability}%</span>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge className={getStatusColor(item.status)}>{item.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Strategy Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              지원 전략 권장사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">안전권 (2-3개)</h4>
                <p className="text-sm text-green-700 mb-3">합격 확률 90% 이상인 대학들로 구성</p>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>• 성균관대 글로벌경영</li>
                  <li>• 한양대 경영학과</li>
                  <li>• 중앙대 경영학과</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">적정권 (1-2개)</h4>
                <p className="text-sm text-blue-700 mb-3">합격 확률 70-90%인 대학들로 구성</p>
                <ul className="text-sm text-blue-600 space-y-1">
                  <li>• 고려대 경영학과</li>
                  <li>• 연세대 경제학과</li>
                </ul>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2">소신권 (1개)</h4>
                <p className="text-sm text-orange-700 mb-3">합격 확률 50-70%인 최상위 대학</p>
                <ul className="text-sm text-orange-600 space-y-1">
                  <li>• 서울대 경영학과</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ 주의사항</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• 실제 경쟁률과 지원자 성적 분포에 따라 결과가 달라질 수 있습니다</li>
                <li>• 나군, 다군과의 조합을 고려하여 전략적으로 지원하세요</li>
                <li>• 최종 지원 전 입시 전문가와 상담을 권장합니다</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
