"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Home, BarChart3, TrendingUp, Target, BookOpen } from "lucide-react"

export default function Grade2SubjectAnalysisPage() {
  const [selectedSubject, setSelectedSubject] = useState("국어")

  const subjects = ["국어", "수학", "영어", "한국사", "사회탐구", "과학탐구"]

  const gradeData = {
    국어: { grade: 2, percentile: 88, trend: "상승", improvement: "+0.5" },
    수학: { grade: 2, percentile: 85, trend: "상승", improvement: "+0.8" },
    영어: { grade: 1, percentile: 93, trend: "유지", improvement: "-0.1" },
    한국사: { grade: 1, percentile: 96, trend: "유지", improvement: "0.0" },
    사회탐구: { grade: 2, percentile: 82, trend: "상승", improvement: "+0.3" },
    과학탐구: { grade: 3, percentile: 75, trend: "하락", improvement: "-0.2" },
  }

  const analysisData = [
    { category: "언어 영역", strength: "문학 감상", weakness: "화법과 작문", recommendation: "실전 문제 풀이 강화" },
    {
      category: "수리 영역",
      strength: "함수와 그래프",
      weakness: "확률과 통계",
      recommendation: "개념 정리 후 문제 적용",
    },
    { category: "외국어", strength: "문법", weakness: "장문 독해", recommendation: "독해 전략 학습" },
  ]

  const studyPlan = [
    { week: "1주차", focus: "국어 화법과 작문", hours: 10, materials: "수능완성 국어" },
    { week: "2주차", focus: "수학 확률과 통계", hours: 12, materials: "개념원리 확통" },
    { week: "3주차", focus: "영어 장문 독해", hours: 8, materials: "EBS 수능특강" },
    { week: "4주차", focus: "과학탐구 보완", hours: 10, materials: "완자 물리/화학" },
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
          <span>2학년</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">교과분석</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">2학년 교과 성적분석</h1>
          <p className="text-gray-600">2학년 교과목별 성적을 분석하고 수능 대비 전략을 제시합니다.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <h4 className="font-medium mb-4">성적 추이 (최근 4회)</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">1학기 중간</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={78} className="w-24 h-2" />
                      <span className="text-sm font-medium">78%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">1학기 기말</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={82} className="w-24 h-2" />
                      <span className="text-sm font-medium">82%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">2학기 중간</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-24 h-2" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">2학기 기말</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={gradeData[selectedSubject]?.percentile || 88} className="w-24 h-2" />
                      <span className="text-sm font-medium">{gradeData[selectedSubject]?.percentile || 88}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Details */}
              <div>
                <h4 className="font-medium mb-4">수능 대비 분석</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-1">수능 준비도</h5>
                    <p className="text-sm text-green-700">현재 수준으로 목표 등급 달성 가능성이 높습니다.</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h5 className="font-medium text-yellow-800 mb-1">보완 필요 영역</h5>
                    <p className="text-sm text-yellow-700">실전 문제 해결 속도와 정확도를 높여야 합니다.</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <h5 className="font-medium text-blue-800 mb-1">3학년 대비 전략</h5>
                    <p className="text-sm text-blue-700">기본기 완성 후 실전 모의고사 중심의 학습이 필요합니다.</p>
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
                    <th className="text-left py-3 px-4 font-medium">수능 대비 전략</th>
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
            <CardTitle>겨울방학 집중 학습 계획</CardTitle>
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
