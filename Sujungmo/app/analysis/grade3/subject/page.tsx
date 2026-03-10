"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Home, BarChart3, TrendingUp, Target, BookOpen, AlertTriangle } from "lucide-react"

export default function Grade3SubjectAnalysisPage() {
  const [selectedSubject, setSelectedSubject] = useState("국어")

  const subjects = ["국어", "수학", "영어", "한국사", "사회탐구", "과학탐구"]

  const gradeData = {
    국어: { grade: 1, percentile: 92, trend: "상승", improvement: "+0.3", target: 1 },
    수학: { grade: 2, percentile: 87, trend: "유지", improvement: "+0.1", target: 1 },
    영어: { grade: 1, percentile: 95, trend: "유지", improvement: "0.0", target: 1 },
    한국사: { grade: 1, percentile: 98, trend: "유지", improvement: "0.0", target: 1 },
    사회탐구: { grade: 2, percentile: 85, trend: "상승", improvement: "+0.4", target: 2 },
    과학탐구: { grade: 2, percentile: 83, trend: "상승", improvement: "+0.2", target: 2 },
  }

  const analysisData = [
    {
      category: "언어 영역",
      strength: "문학 작품 분석",
      weakness: "비문학 추론",
      recommendation: "기출문제 패턴 분석",
      urgency: "높음",
    },
    {
      category: "수리 영역",
      strength: "미적분",
      weakness: "기하",
      recommendation: "약점 단원 집중 학습",
      urgency: "매우높음",
    },
    { category: "외국어", strength: "어법", weakness: "빈칸추론", recommendation: "유형별 전략 수립", urgency: "보통" },
  ]

  const studyPlan = [
    { period: "3월", focus: "기출문제 분석", hours: 60, materials: "10개년 기출문제", priority: "최우선" },
    { period: "4월", focus: "약점 보완", hours: 65, materials: "EBS 연계교재", priority: "우선" },
    { period: "5월", focus: "실전 모의고사", hours: 70, materials: "사설 모의고사", priority: "우선" },
    { period: "6월", focus: "최종 점검", hours: 55, materials: "오답노트 정리", priority: "보통" },
  ]

  const mockExamResults = [
    { exam: "3월 모의고사", korean: 2, math: 2, english: 1, total: "1.67" },
    { exam: "4월 모의고사", korean: 1, math: 2, english: 1, total: "1.33" },
    { exam: "5월 모의고사", korean: 1, math: 2, english: 1, total: "1.33" },
    { exam: "6월 모의고사", korean: 1, math: 1, english: 1, total: "1.00" },
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
          <span>3학년</span>
          <ChevronRight className="h-4 w-4" />
          <span className="text-gray-900 font-medium">교과분석</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">3학년 수능 성적분석</h1>
          <p className="text-gray-600">수능 최종 대비를 위한 교과목별 심층 분석과 전략을 제시합니다.</p>
        </div>

        {/* Alert */}
        <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
            <div>
              <h3 className="font-medium text-orange-800">수능 D-180</h3>
              <p className="text-sm text-orange-700">목표 등급 달성을 위한 집중 학습이 필요한 시기입니다.</p>
            </div>
          </div>
        </div>

        {/* Subject Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              수능 과목 선택
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
              현재 성적 vs 목표 등급
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(gradeData).map(([subject, data]) => (
                <div key={subject} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{subject}</h3>
                    <div className="flex space-x-1">
                      <Badge variant={data.grade <= 2 ? "default" : data.grade <= 4 ? "secondary" : "destructive"}>
                        현재 {data.grade}등급
                      </Badge>
                      <Badge variant="outline">목표 {data.target}등급</Badge>
                    </div>
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
                    {data.grade > data.target && (
                      <p className="text-xs text-red-600">목표 등급까지 {data.grade - data.target}등급 상승 필요</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Mock Exam Results */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              모의고사 성적 추이
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">시험</th>
                    <th className="text-center py-3 px-4 font-medium">국어</th>
                    <th className="text-center py-3 px-4 font-medium">수학</th>
                    <th className="text-center py-3 px-4 font-medium">영어</th>
                    <th className="text-center py-3 px-4 font-medium">평균</th>
                  </tr>
                </thead>
                <tbody>
                  {mockExamResults.map((result, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{result.exam}</td>
                      <td className="text-center py-3 px-4">
                        <Badge variant={result.korean <= 2 ? "default" : "secondary"}>{result.korean}등급</Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant={result.math <= 2 ? "default" : "secondary"}>{result.math}등급</Badge>
                      </td>
                      <td className="text-center py-3 px-4">
                        <Badge variant={result.english <= 2 ? "default" : "secondary"}>{result.english}등급</Badge>
                      </td>
                      <td className="text-center py-3 px-4 font-medium">{result.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Selected Subject Analysis */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              {selectedSubject} 수능 대비 전략
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Performance Analysis */}
              <div>
                <h4 className="font-medium mb-4">영역별 성취도</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">문학</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={90} className="w-24 h-2" />
                      <span className="text-sm font-medium">90%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">비문학</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={75} className="w-24 h-2" />
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">화법과 작문</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={85} className="w-24 h-2" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">언어와 매체</span>
                    <div className="flex items-center space-x-2">
                      <Progress value={80} className="w-24 h-2" />
                      <span className="text-sm font-medium">80%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Strategy */}
              <div>
                <h4 className="font-medium mb-4">수능 최종 대비 전략</h4>
                <div className="space-y-4">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <h5 className="font-medium text-red-800 mb-1">긴급 보완 필요</h5>
                    <p className="text-sm text-red-700">비문학 추론 문제 정답률이 낮습니다. 집중 학습이 필요합니다.</p>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <h5 className="font-medium text-yellow-800 mb-1">시간 관리</h5>
                    <p className="text-sm text-yellow-700">문제 풀이 시간을 단축하여 검토 시간을 확보해야 합니다.</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <h5 className="font-medium text-green-800 mb-1">강점 유지</h5>
                    <p className="text-sm text-green-700">문학 영역의 우수한 성과를 지속적으로 유지하세요.</p>
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
              <AlertTriangle className="h-5 w-5 mr-2" />
              긴급 보완 영역
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
                    <th className="text-left py-3 px-4 font-medium">수능 전략</th>
                    <th className="text-center py-3 px-4 font-medium">우선순위</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisData.map((item, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{item.category}</td>
                      <td className="py-3 px-4 text-green-600">{item.strength}</td>
                      <td className="py-3 px-4 text-red-600">{item.weakness}</td>
                      <td className="py-3 px-4 text-blue-600">{item.recommendation}</td>
                      <td className="text-center py-3 px-4">
                        <Badge
                          variant={
                            item.urgency === "매우높음"
                              ? "destructive"
                              : item.urgency === "높음"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {item.urgency}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Final Study Plan */}
        <Card>
          <CardHeader>
            <CardTitle>수능 최종 대비 학습 계획</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {studyPlan.map((plan, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{plan.period}</h4>
                    <Badge
                      variant={
                        plan.priority === "최우선" ? "destructive" : plan.priority === "우선" ? "default" : "secondary"
                      }
                    >
                      {plan.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{plan.focus}</p>
                  <p className="text-xs text-gray-500 mb-2">{plan.materials}</p>
                  <p className="text-xs font-medium text-blue-600">{plan.hours}시간/월</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
