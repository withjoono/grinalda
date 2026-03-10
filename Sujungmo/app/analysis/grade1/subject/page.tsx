"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Home, BarChart3, TrendingUp, Target, BookOpen } from "lucide-react"

export default function Grade1SubjectAnalysisPage() {
  const [selectedSubject, setSelectedSubject] = useState("국어")

  const subjects = ["국어", "수학", "영어", "한국사", "통합사회", "통합과학", "과학탐구실험"]

  const gradeData = {
    국어: { grade: 2, percentile: 85, trend: "상승", improvement: "+0.3" },
    수학: { grade: 3, percentile: 72, trend: "하락", improvement: "-0.2" },
    영어: { grade: 1, percentile: 95, trend: "유지", improvement: "0.0" },
    한국사: { grade: 1, percentile: 98, trend: "상승", improvement: "+0.1" },
    통합사회: { grade: 2, percentile: 88, trend: "상승", improvement: "+0.4" },
    통합과학: { grade: 2, percentile: 82, trend: "유지", improvement: "+0.1" },
    과학탐구실험: { grade: 1, percentile: 92, trend: "상승", improvement: "+0.2" },
  }

  const analysisData = [
    {
      category: "언어 영역",
      strength: "문학 작품 분석",
      weakness: "비문학 독해",
      recommendation: "독해 속도 향상 훈련",
    },
    { category: "수리 영역", strength: "기본 연산", weakness: "응용 문제", recommendation: "문제 유형별 반복 학습" },
    { category: "외국어", strength: "어휘력", weakness: "듣기 영역", recommendation: "영어 듣기 연습 강화" },
  ]

  const studyPlan = [
    { week: "1주차", focus: "국어 비문학 독해", hours: 8, materials: "EBS 수능특강" },
    { week: "2주차", focus: "수학 응용 문제", hours: 10, materials: "개념원리 RPM" },
    { week: "3주차", focus: "영어 듣기 연습", hours: 6, materials: "CNN Student News" },
    { week: "4주차", focus: "종합 복습", hours: 12, materials: "모의고사 3회분" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
          <Home className="h-4 w-4" />
          <span>홈</span>
          <ChevronRight className="h-4 w-4" />
          <span>성적분석</span>
          <ChevronRight className="h-4 w-4" />
          <span>1학년</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">교과분석</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">1학년 교과 성적분석</h1>
          <p className="text-gray-600">1학년 교과목별 성적을 분석하고 학습 방향을 제시합니다.</p>
        </div>

        {/* Subject Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              교과목 선택
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {subjects.map((subject) => (
                <Button
                  key={subject}
                  variant={selectedSubject === subject ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSubject(subject)}
                  className="mb-2"
                >
                  {subject}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grade Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              전체 성적 현황
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(gradeData).map(([subject, data]) => (
                <div key={subject} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{subject}</h3>
                    <Badge variant={data.grade <= 2 ? "default" : data.grade <= 4 ? "secondary" : "destructive"}>
                      {data.grade}등급
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">백분위</span>
                      <span className="font-medium">{data.percentile}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">추세</span>
                      <span
                        className={`font-medium ${
                          data.trend === "상승"
                            ? "text-green-600"
                            : data.trend === "하락"
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {data.trend} ({data.improvement})
                      </span>
                    </div>
                    <Progress value={data.percentile} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Selected Subject Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              {selectedSubject} 상세 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Chart */}
              <div>
                <h4 className="font-medium mb-4">성적 추이</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">1학기 중간</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={75} className="w-24 h-2" />
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">1학기 기말</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={80} className="w-24 h-2" />
                      <span className="text-sm font-medium">80%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">2학기 중간</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={gradeData[selectedSubject]?.percentile || 85} className="w-24 h-2" />
                      <span className="text-sm font-medium">{gradeData[selectedSubject]?.percentile || 85}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Details */}
              <div>
                <h4 className="font-medium mb-4">분석 결과</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-1">강점</h5>
                    <p className="text-sm text-green-700">
                      기본 개념 이해도가 우수하며, 정기 평가에서 안정적인 성과를 보입니다.
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h5 className="font-medium text-yellow-800 mb-1">개선점</h5>
                    <p className="text-sm text-yellow-700">
                      응용 문제 해결 능력과 시간 관리 능력을 향상시킬 필요가 있습니다.
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">학습 전략</h5>
                    <p className="text-sm text-blue-700">
                      기본기를 바탕으로 다양한 유형의 문제를 풀어보며 응용력을 기르는 것이 중요합니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              영역별 학습 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">영역</th>
                    <th className="text-left py-3 px-4 font-medium">강점</th>
                    <th className="text-left py-3 px-4 font-medium">약점</th>
                    <th className="text-left py-3 px-4 font-medium">학습 권장사항</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{item.category}</td>
                      <td className="py-3 px-4 text-green-600">{item.strength}</td>
                      <td className="py-3 px-4 text-red-600">{item.weakness}</td>
                      <td className="py-3 px-4 text-blue-600">{item.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Study Plan */}
        <Card>
          <CardHeader>
            <CardTitle>맞춤형 학습 계획</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {studyPlan.map((plan, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{plan.week}</h4>
                    <Badge variant="outline">{plan.hours}시간</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{plan.focus}</p>
                  <p className="text-xs text-gray-500">{plan.materials}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
