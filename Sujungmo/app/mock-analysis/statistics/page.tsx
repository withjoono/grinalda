"use client"

import { useState } from "react"

export default function CumulativeAnalysis() {
  const [selectedExam, setSelectedExam] = useState("입학원 모의고사")
  const [selectedSubject, setSelectedSubject] = useState("전과목")
  const [selectedYear, setSelectedYear] = useState("2023")
  const [viewMode, setViewMode] = useState<"all" | "by-subject">("all")

  const [selectedSubjectForAnalysis, setSelectedSubjectForAnalysis] = useState("국어")
  const [selectedGrade, setSelectedGrade] = useState("고1")
  const [selectedAnalysisYear, setSelectedAnalysisYear] = useState("2022")
  const [selectedGraphType, setSelectedGraphType] = useState<"등급" | "백분위" | "표준점수" | "원점수">("등급")

  const [selectedAllGrade, setSelectedAllGrade] = useState("고1")
  const [selectedAllYear, setSelectedAllYear] = useState("2023")
  const [selectedAllGraphType, setSelectedAllGraphType] = useState<"등급" | "백분위" | "표준점수" | "원점수">("등급")

  const getSubjectsForGrade = (grade: string) => {
    if (grade === "고1") {
      return ["국어", "수학", "영어", "통합사회", "통합과학"]
    } else {
      return ["국어", "수학", "영어", "탐구1", "탐구2"]
    }
  }

  const handleGradeChange = (newGrade: string) => {
    setSelectedGrade(newGrade)
    const availableSubjects = getSubjectsForGrade(newGrade)
    if (!availableSubjects.includes(selectedSubjectForAnalysis)) {
      setSelectedSubjectForAnalysis(availableSubjects[0])
    }
  }

  // Sample data for target university grade cuts
  const gradeData = [
    { grade: "1등급", percentage: 93.2, height: "h-32" },
    { grade: "2등급", percentage: 85.4, height: "h-28" },
    { grade: "3등급", percentage: 78.9, height: "h-24" },
    { grade: "4등급", percentage: 72.1, height: "h-20" },
    { grade: "5등급", percentage: 65.8, height: "h-16" },
    { grade: "6등급", percentage: 58.3, height: "h-12" },
    { grade: "7등급", percentage: 50.7, height: "h-8" },
  ]

  // Sample data for subject average grades
  const subjectData = [
    { subject: "국어", grade: "1.8", height: "h-24" },
    { subject: "수학", grade: "2.1", height: "h-20" },
    { subject: "영어", grade: "1.9", height: "h-22" },
    { subject: "한국사", grade: "2.3", height: "h-18" },
    { subject: "탐구1", grade: "2.0", height: "h-21" },
    { subject: "탐구2", grade: "2.2", height: "h-19" },
    { subject: "제2외국어", grade: "1.7", height: "h-26" },
  ]

  const subjectAnalysisData = {
    "3월": { 등급: 8, 나의점수: 23.0, 표준점수: 66, 백분위: 4 },
    "6월": { 등급: 8, 나의점수: 20.0, 표준점수: 67, 백분위: 4 },
    "9월": { 등급: 8, 나의점수: 20.0, 표준점수: 71, 백분위: 7 },
    "11월": { 등급: 9, 나의점수: 16.0, 표준점수: 66, 백분위: 3 },
  }

  const allSubjectsData = {
    "3월": {
      원점수: { 국어: 23.0, 수학: 17.0, 과목합: 40.0 },
      등급: { 국어: 8, 수학: 8, 과목합: 8 },
      표준점수: { 국어: 66, 수학: 70, 과목합: 136 },
      백분위: { 국어: 4, 수학: 7, 과목합: 11 },
    },
    "6월": {
      원점수: { 국어: 20.0, 수학: 8.0, 과목합: 28.0 },
      등급: { 국어: 8, 수학: 9, 과목합: 8.5 },
      표준점수: { 국어: 67, 수학: 69, 과목합: 136 },
      백분위: { 국어: 4, 수학: 2, 과목합: 6 },
    },
    "9월": {
      원점수: { 국어: 20.0, 수학: 16.0, 과목합: 36.0 },
      등급: { 국어: 8, 수학: 7, 과목합: 7.5 },
      표준점수: { 국어: 71, 수학: 75, 과목합: 146 },
      백분위: { 국어: 7, 수학: 11, 과목합: 18 },
    },
    "11월": {
      원점수: { 국어: 16.0, 수학: 12.0, 과목합: 28.0 },
      등급: { 국어: 9, 수학: 8, 과목합: 8.5 },
      표준점수: { 국어: 66, 수학: 74, 과목합: 140 },
      백분위: { 국어: 3, 수학: 5, 과목합: 8 },
    },
  }

  const 실업누적률 = {
    "3월": 96.23,
    "6월": 96.58,
    "9월": 94.36,
    "11월": 97.51,
  }

  // Sample data for grade distribution (by-subject view)
  const gradeDistribution = [
    { grade: "1등급", count: 45, percentage: 4.2, height: "h-16" },
    { grade: "2등급", count: 89, percentage: 8.3, height: "h-20" },
    { grade: "3등급", count: 134, percentage: 12.5, height: "h-24" },
    { grade: "4등급", count: 178, percentage: 16.6, height: "h-28" },
    { grade: "5등급", count: 201, percentage: 18.8, height: "h-32" },
    { grade: "6등급", count: 189, percentage: 17.7, height: "h-30" },
    { grade: "7등급", count: 156, percentage: 14.6, height: "h-26" },
    { grade: "8등급", count: 98, percentage: 9.2, height: "h-22" },
    { grade: "9등급", count: 67, percentage: 6.3, height: "h-18" },
  ]

  // Sample statistics data
  const statistics = [
    { label: "응시원 모의고사", value: "7", unit: "회" },
    { label: "전체 응시자수", value: "37", unit: "만명" },
    {
      label: "백분위 오차 예측",
      value: "17",
      unit: "점",
      subValue: "2회 연속",
      subUnit: "20",
      color: "text-orange-600",
    },
    { label: "그룹별 점검", value: "700", unit: "문항" },
    { label: "", value: "94", unit: "문항", color: "text-orange-600" },
  ]

  // Sample performance data
  const performanceData = [
    { label: "학교 평균수", value: 81.4, maxValue: 100 },
    { label: "학교 백분위", value: 81.4, maxValue: 100 },
    { label: "학교 등급", value: 2.1, maxValue: 9 },
  ]

  // Sample weakness analysis data
  const weaknessData = [
    { rank: 1, category: "화법의 기능", percentage: 43, description: "화법의 기능에 대한 이해 부족" },
    { rank: 2, category: "화법의 기능", percentage: 43, description: "화법의 기능에 대한 이해 부족" },
    { rank: 3, category: "화법의 기능", percentage: 43, description: "화법의 기능에 대한 이해 부족" },
    { rank: 4, category: "화법의 기능", percentage: 43, description: "화법의 기능에 대한 이해 부족" },
    { rank: 5, category: "화법의 기능", percentage: 43, description: "화법의 기능에 대한 이해 부족" },
    { rank: 6, category: "화법의 기능", percentage: 43, description: "화법의 기능에 대한 이해 부족" },
    { rank: 7, category: "화법의 기능", percentage: 43, description: "화법의 기능에 대한 이해 부족" },
    { rank: 8, category: "화법의 기능", percentage: 43, description: "화법의 기능에 대한 이해 부족" },
    { rank: 9, category: "화법의 기능", percentage: 43, description: "화법의 기능에 대한 이해 부족" },
    { rank: 10, category: "화법의 기능", percentage: 43, description: "화법의 기능에 대한 이해 부족" },
  ]

  // Sample detailed statistics table
  const detailedStats = [
    {
      rank: 1,
      exam: "2023 3월1차 6월",
      percentile: "93.2%",
      difference: "+3.2%",
      subject: "국어 (화법과 작문)",
      grade: "93.2%",
      gradeNum: "1.2등급",
      finalGrade: "93점",
    },
    {
      rank: 2,
      exam: "2023 3월1차 6월",
      percentile: "93.2%",
      difference: "+3.2%",
      subject: "수학 (확률과 통계)",
      grade: "93.2%",
      gradeNum: "1.2등급",
      finalGrade: "93점",
    },
    {
      rank: 3,
      exam: "2023 3월1차 6월",
      percentile: "93.2%",
      difference: "+3.2%",
      subject: "영어",
      grade: "93.2%",
      gradeNum: "1.2등급",
      finalGrade: "93점",
    },
    {
      rank: 4,
      exam: "2023 3월1차 6월",
      percentile: "93.2%",
      difference: "+3.2%",
      subject: "한국사",
      grade: "93.2%",
      gradeNum: "1.2등급",
      finalGrade: "93점",
    },
    {
      rank: 5,
      exam: "2023 3월1차 6월",
      percentile: "93.2%",
      difference: "+3.2%",
      subject: "탐구 1 (생활과 윤리)",
      grade: "93.2%",
      gradeNum: "1.2등급",
      finalGrade: "93점",
    },
    {
      rank: 6,
      exam: "2023 3월1차 6월",
      percentile: "93.2%",
      difference: "+3.2%",
      subject: "탐구 2 (윤리와 사상)",
      grade: "93.2%",
      gradeNum: "1.2등급",
      finalGrade: "93점",
    },
  ]

  const renderSubjectChart = () => {
    const months = ["3월", "6월", "9월", "11월"]

    if (selectedGraphType === "등급") {
      return (
        <div className="h-64 flex items-end justify-center space-x-8 px-8">
          <div className="flex items-center space-x-2 mb-4 absolute top-4 right-4">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">등급</span>
          </div>
          {months.map((month, index) => (
            <div key={month} className="flex flex-col items-center">
              <div className="relative">
                <div className="w-2 h-32 bg-gray-200 rounded"></div>
                <div
                  className="absolute bottom-0 w-2 bg-blue-500 rounded"
                  style={{ height: `${(10 - subjectAnalysisData[month].등급) * 12}px` }}
                ></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                {index < months.length - 1 && <div className="absolute -top-5 left-2 w-8 h-0.5 bg-blue-500"></div>}
              </div>
              <span className="text-sm text-gray-600 mt-2">{month}</span>
            </div>
          ))}
        </div>
      )
    }

    if (selectedGraphType === "백분위") {
      return (
        <div className="h-64 flex items-end justify-center space-x-8 px-8">
          <div className="flex items-center space-x-4 mb-4 absolute top-4 right-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded"></div>
              <span className="text-sm text-gray-600">나의점수</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span className="text-sm text-gray-600">백분위</span>
            </div>
          </div>
          {months.map((month, index) => (
            <div key={month} className="flex flex-col items-center">
              <div className="relative">
                <div className="w-2 h-32 bg-gray-200 rounded"></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                {index < months.length - 1 && <div className="absolute -top-5 left-2 w-8 h-0.5 bg-orange-400"></div>}
              </div>
              <span className="text-sm text-gray-600 mt-2">{month}</span>
            </div>
          ))}
        </div>
      )
    }

    if (selectedGraphType === "표준점수") {
      return (
        <div className="h-64 flex items-end justify-center space-x-8 px-8">
          <div className="flex items-center space-x-4 mb-4 absolute top-4 right-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded"></div>
              <span className="text-sm text-gray-600">나의점수</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span className="text-sm text-gray-600">백분위</span>
            </div>
          </div>
          {months.map((month, index) => (
            <div key={month} className="flex flex-col items-center">
              <div className="relative">
                <div
                  className="w-12 bg-blue-400 rounded"
                  style={{ height: `${subjectAnalysisData[month].표준점수 * 2}px` }}
                ></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                {index < months.length - 1 && <div className="absolute -top-5 left-6 w-8 h-0.5 bg-orange-400"></div>}
              </div>
              <span className="text-sm text-gray-600 mt-2">{month}</span>
            </div>
          ))}
        </div>
      )
    }

    if (selectedGraphType === "원점수") {
      return (
        <div className="h-64 flex items-end justify-center space-x-8 px-8">
          <div className="flex items-center space-x-4 mb-4 absolute top-4 right-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded"></div>
              <span className="text-sm text-gray-600">나의점수</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span className="text-sm text-gray-600">표준점수</span>
            </div>
          </div>
          {months.map((month, index) => (
            <div key={month} className="flex flex-col items-center">
              <div className="relative flex space-x-1">
                <div
                  className="w-8 bg-blue-400 rounded"
                  style={{ height: `${subjectAnalysisData[month].나의점수 * 4}px` }}
                ></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                {index < months.length - 1 && <div className="absolute -top-5 left-8 w-8 h-0.5 bg-orange-400"></div>}
              </div>
              <span className="text-sm text-gray-600 mt-2">{month}</span>
            </div>
          ))}
        </div>
      )
    }
  }

  const renderAllSubjectsChart = () => {
    const months = ["3월", "6월", "9월", "11월"]

    if (selectedAllGraphType === "등급") {
      return (
        <div className="h-64 flex items-end justify-center space-x-8 px-8">
          <div className="flex items-center space-x-2 mb-4 absolute top-4 right-4">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">등급</span>
          </div>
          {months.map((month, index) => (
            <div key={month} className="flex flex-col items-center">
              <div className="relative">
                <div className="w-2 h-32 bg-gray-200 rounded"></div>
                <div
                  className="absolute bottom-0 w-2 bg-blue-500 rounded"
                  style={{ height: `${(10 - allSubjectsData[month].등급.과목합) * 12}px` }}
                ></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                {index < months.length - 1 && <div className="absolute -top-5 left-2 w-8 h-0.5 bg-blue-500"></div>}
              </div>
              <span className="text-sm text-gray-600 mt-2">{month}</span>
            </div>
          ))}
        </div>
      )
    }

    if (selectedAllGraphType === "백분위") {
      return (
        <div className="h-64 flex items-end justify-center space-x-8 px-8">
          <div className="flex items-center space-x-4 mb-4 absolute top-4 right-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded"></div>
              <span className="text-sm text-gray-600">나의점수</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span className="text-sm text-gray-600">백분위</span>
            </div>
          </div>
          {months.map((month, index) => (
            <div key={month} className="flex flex-col items-center">
              <div className="relative">
                <div className="w-2 h-32 bg-gray-200 rounded"></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                {index < months.length - 1 && <div className="absolute -top-5 left-2 w-8 h-0.5 bg-orange-400"></div>}
              </div>
              <span className="text-sm text-gray-600 mt-2">{month}</span>
            </div>
          ))}
        </div>
      )
    }

    if (selectedAllGraphType === "표준점수") {
      return (
        <div className="h-64 flex items-end justify-center space-x-8 px-8">
          <div className="flex items-center space-x-4 mb-4 absolute top-4 right-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded"></div>
              <span className="text-sm text-gray-600">나의점수</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span className="text-sm text-gray-600">표준점수</span>
            </div>
          </div>
          {months.map((month, index) => (
            <div key={month} className="flex flex-col items-center">
              <div className="relative">
                <div
                  className="w-12 bg-blue-400 rounded"
                  style={{ height: `${allSubjectsData[month].표준점수.과목합 * 1.2}px` }}
                ></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                {index < months.length - 1 && <div className="absolute -top-5 left-6 w-8 h-0.5 bg-orange-400"></div>}
              </div>
              <span className="text-sm text-gray-600 mt-2">{month}</span>
            </div>
          ))}
        </div>
      )
    }

    if (selectedAllGraphType === "원점수") {
      return (
        <div className="h-64 flex items-end justify-center space-x-8 px-8">
          <div className="flex items-center space-x-4 mb-4 absolute top-4 right-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-400 rounded"></div>
              <span className="text-sm text-gray-600">나의점수</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-400 rounded"></div>
              <span className="text-sm text-gray-600">표준점수</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-400 rounded"></div>
              <span className="text-sm text-gray-600">EBS연계</span>
            </div>
          </div>
          {months.map((month, index) => (
            <div key={month} className="flex flex-col items-center">
              <div className="relative flex space-x-1">
                <div
                  className="w-6 bg-blue-400 rounded"
                  style={{ height: `${allSubjectsData[month].원점수.나의점수 * 3}px` }}
                ></div>
                <div
                  className="w-6 bg-pink-400 rounded"
                  style={{ height: `${allSubjectsData[month].원점수.표준점수 * 2}px` }}
                ></div>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                {index < months.length - 1 && <div className="absolute -top-5 left-6 w-8 h-0.5 bg-orange-400"></div>}
              </div>
              <span className="text-sm text-gray-600 mt-2">{month}</span>
            </div>
          ))}
        </div>
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>홈</span>
            <span>&gt;</span>
            <span>모의고사 분석</span>
            <span>&gt;</span>
            <span className="text-orange-600 font-medium">누적 분석</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">누적 분석</h1>

        {/* View Mode Toggle */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <button
              onClick={() => setViewMode("all")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                viewMode === "all" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              전과목 분석
            </button>
            <button
              onClick={() => setViewMode("by-subject")}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                viewMode === "by-subject" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              과목별 분석
            </button>
          </div>

          {viewMode === "all" ? (
            <>
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">학년 선택</label>
                  <select
                    value={selectedAllGrade}
                    onChange={(e) => setSelectedAllGrade(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="고1">고1</option>
                    <option value="고2">고2</option>
                    <option value="고3">고3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연도 선택</label>
                  <select
                    value={selectedAllYear}
                    onChange={(e) => setSelectedAllYear(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
              </div>

              {/* Graph Type Tabs */}
              <div className="flex border-b border-gray-200 mb-6">
                {["원점수 그래프", "등급 그래프", "표준점수 그래프", "백분위 그래프"].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      setSelectedAllGraphType(type.split(" ")[0] as "등급" | "백분위" | "표준점수" | "원점수")
                    }
                    className={`px-6 py-3 text-sm font-medium border-b-2 ${
                      selectedAllGraphType === type.split(" ")[0]
                        ? "border-gray-900 text-gray-900"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Chart Area */}
              <div className="relative bg-gray-50 rounded-lg p-6 mb-6">{renderAllSubjectsChart()}</div>

              {/* Data Table */}
              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">
                        지표
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200">
                        3월
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200">
                        6월
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200">
                        9월
                      </th>
                      <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">11월</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className={`${selectedAllGraphType === "원점수" ? "bg-blue-100" : ""}`}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 bg-blue-500 text-white">
                        원점수
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700"></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">국어</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].원점수.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].원점수.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].원점수.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].원점수.국어}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">수학</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].원점수.수학}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].원점수.수학}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].원점수.수학}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].원점수.수학}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">과목합</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].원점수.과목합}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].원점수.과목합}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].원점수.과목합}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].원점수.과목합}
                      </td>
                    </tr>
                    <tr className={`${selectedAllGraphType === "등급" ? "bg-blue-100" : ""}`}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 bg-blue-500 text-white">
                        등급
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700"></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">국어</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].등급.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].등급.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].등급.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].등급.국어}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">수학</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].등급.수학}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].등급.수학}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].등급.수학}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].등급.수학}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">과목합</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].등급.과목합}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].등급.과목합}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].등급.과목합}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].등급.과목합}
                      </td>
                    </tr>
                    <tr className={`${selectedAllGraphType === "표준점수" ? "bg-blue-100" : ""}`}>
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">표준점수</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].표준점수.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].표준점수.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].표준점수.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].표준점수.국어}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">국어</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].표준점수.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].표준점수.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].표준점수.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].표준점수.국어}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">수학</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].표준점수.수학}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].표준점수.수학}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].표준점수.수학}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].표준점수.수학}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">과목합</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].표준점수.과목합}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].표준점수.과목합}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].표준점수.과목합}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].표준점수.과목합}
                      </td>
                    </tr>
                    <tr className={`${selectedAllGraphType === "백분위" ? "bg-blue-100" : ""}`}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 bg-blue-500 text-white">
                        백분위
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700"></td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">국어</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].백분위.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].백분위.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].백분위.국어}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].백분위.국어}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">수학</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].백분위.수학}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].백분위.수학}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].백분위.수학}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].백분위.수학}
                      </td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">과목합</td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["3월"].백분위.과목합}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["6월"].백분위.과목합}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                        {allSubjectsData["9월"].백분위.과목합}
                      </td>
                      <td className="px-4 py-3 text-center text-sm text-gray-700">
                        {allSubjectsData["11월"].백분위.과목합}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">학년 선택</label>
                  <select
                    value={selectedGrade}
                    onChange={(e) => handleGradeChange(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="고1">고1</option>
                    <option value="고2">고2</option>
                    <option value="고3">고3</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">연도 선택</label>
                  <select
                    value={selectedAnalysisYear}
                    onChange={(e) => setSelectedAnalysisYear(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                  </select>
                </div>
              </div>

              {/* Subject Selection Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">과목 선택</label>
                <div className="flex flex-wrap gap-2">
                  {getSubjectsForGrade(selectedGrade).map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubjectForAnalysis(subject)}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        selectedSubjectForAnalysis === subject
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Charts Section */}
        {viewMode === "all" ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            {/* Chart Area */}
            <div className="relative bg-gray-50 rounded-lg p-6 mb-6">{renderAllSubjectsChart()}</div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">
                      지표
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200">
                      3월
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200">
                      6월
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200">
                      9월
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">11월</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`${selectedAllGraphType === "원점수" ? "bg-blue-100" : ""}`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 bg-blue-500 text-white">
                      원점수
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700"></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">국어</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].원점수.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].원점수.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].원점수.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {allSubjectsData["11월"].원점수.국어}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">수학</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].원점수.수학}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].원점수.수학}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].원점수.수학}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {allSubjectsData["11월"].원점수.수학}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">과목합</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].원점수.과목합}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].원점수.과목합}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].원점수.과목합}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {allSubjectsData["11월"].원점수.과목합}
                    </td>
                  </tr>
                  <tr className={`${selectedAllGraphType === "등급" ? "bg-blue-100" : ""}`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 bg-blue-500 text-white">
                      등급
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700"></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">국어</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].등급.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].등급.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].등급.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">{allSubjectsData["11월"].등급.국어}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">수학</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].등급.수학}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].등급.수학}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].등급.수학}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">{allSubjectsData["11월"].등급.수학}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">과목합</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].등급.과목합}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].등급.과목합}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].등급.과목합}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {allSubjectsData["11월"].등급.과목합}
                    </td>
                  </tr>
                  <tr className={`${selectedAllGraphType === "표준점수" ? "bg-blue-100" : ""}`}>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">표준점수</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].표준점수.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].표준점수.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].표준점수.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {allSubjectsData["11월"].표준점수.국어}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">국어</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].표준점수.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].표준점수.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].표준점수.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {allSubjectsData["11월"].표준점수.국어}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">수학</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].표준점수.수학}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].표준점수.수학}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].표준점수.수학}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {allSubjectsData["11월"].표준점수.수학}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">과목합</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].표준점수.과목합}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].표준점수.과목합}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].표준점수.과목합}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {allSubjectsData["11월"].표준점수.과목합}
                    </td>
                  </tr>
                  <tr className={`${selectedAllGraphType === "백분위" ? "bg-blue-100" : ""}`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 bg-blue-500 text-white">
                      백분위
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200"></td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700"></td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">국어</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].백분위.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].백분위.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].백분위.국어}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {allSubjectsData["11월"].백분위.국어}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">수학</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].백분위.수학}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].백분위.수학}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].백분위.수학}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {allSubjectsData["11월"].백분위.수학}
                    </td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">과목합</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["3월"].백분위.과목합}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["6월"].백분위.과목합}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {allSubjectsData["9월"].백분위.과목합}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {allSubjectsData["11월"].백분위.과목합}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            {/* Graph Type Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              {["등급 그래프", "원점수 그래프", "표준점수 그래프", "백분위 그래프"].map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedGraphType(type.split(" ")[0] as "등급" | "백분위" | "표준점수" | "원점수")}
                  className={`px-6 py-3 text-sm font-medium border-b-2 ${
                    selectedGraphType === type.split(" ")[0]
                      ? "border-gray-900 text-gray-900"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Chart Area */}
            <div className="relative bg-gray-50 rounded-lg p-6 mb-6">{renderSubjectChart()}</div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200">
                      지표
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200">
                      3월
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200">
                      6월
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r border-gray-200">
                      9월
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">11월</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={`${selectedGraphType === "등급" ? "bg-blue-100" : ""}`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 bg-blue-500 text-white">
                      등급
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {subjectAnalysisData["3월"].등급}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {subjectAnalysisData["6월"].등급}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {subjectAnalysisData["9월"].등급}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">{subjectAnalysisData["11월"].등급}</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 pl-8">나의점수</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {subjectAnalysisData["3월"].나의점수}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {subjectAnalysisData["6월"].나의점수}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {subjectAnalysisData["9월"].나의점수}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {subjectAnalysisData["11월"].나의점수}
                    </td>
                  </tr>
                  <tr className={`${selectedGraphType === "표준점수" ? "bg-blue-100" : ""}`}>
                    <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">표준점수</td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {subjectAnalysisData["3월"].표준점수}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {subjectAnalysisData["6월"].표준점수}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {subjectAnalysisData["9월"].표준점수}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {subjectAnalysisData["11월"].표준점수}
                    </td>
                  </tr>
                  <tr className={`${selectedGraphType === "백분위" ? "bg-blue-100" : ""}`}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200 bg-blue-500 text-white">
                      백분위
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {subjectAnalysisData["3월"].백분위}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {subjectAnalysisData["6월"].백분위}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700 border-r border-gray-200">
                      {subjectAnalysisData["9월"].백분위}
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-gray-700">
                      {subjectAnalysisData["11월"].백분위}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
