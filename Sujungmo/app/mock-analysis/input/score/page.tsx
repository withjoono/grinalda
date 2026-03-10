"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ScoreInputPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<"raw" | "standard">("raw")

  const [grade1StandardScores, setGrade1StandardScores] = useState({
    korean: "",
    math: "",
    english: "",
    koreanHistory: "",
    integratedScience: "",
    integratedSocial: "",
    koreanGrade: "",
    koreanPercentile: "",
    mathGrade: "",
    mathPercentile: "",
    englishGrade: "",
    koreanHistoryGrade: "",
    integratedScienceGrade: "",
    integratedSciencePercentile: "",
    integratedSocialGrade: "",
    integratedSocialPercentile: "",
  })

  const [grade2RawScores, setGrade2RawScores] = useState({
    korean: { raw: "", grade: "", percentile: "" },
    math: { raw: "", grade: "", percentile: "" },
    english: { grade: "" },
    koreanHistory: { grade: "" },
    inquiry1: { subject: "", raw: "", grade: "", percentile: "" },
    inquiry2: { subject: "", raw: "", grade: "", percentile: "" },
  })

  const [grade2StandardScores, setGrade2StandardScores] = useState({
    korean: { raw: "" },
    math: { raw: "" },
    english: { raw: "" },
    koreanHistory: { raw: "" },
    inquiry1: { subject: "", raw: "" },
    inquiry2: { subject: "", raw: "" },
  })

  const [grade1Scores, setGrade1Scores] = useState({
    korean: "",
    math: "",
    english: "",
    koreanHistory: "",
    integratedScience: "",
    integratedSocial: "",
  })

  const [rawScores, setRawScores] = useState({
    korean: "",
    math: "",
    english: "",
    koreanHistory: "",
    integratedScience: "",
    integratedSocial: "",
  })

  const [standardScores, setStandardScores] = useState({
    korean: "",
    math: "",
    english: "",
    koreanHistory: "",
    integratedScience: "",
    integratedSocial: "",
  })

  const year = searchParams.get("year") || ""
  const grade = searchParams.get("grade") || ""
  const month = searchParams.get("month") || ""

  const handleGrade1ScoreChange = (subject: string, value: string) => {
    setGrade1Scores((prev) => ({
      ...prev,
      [subject]: value,
    }))
  }

  const handleGrade1StandardScoreChange = (field: string, value: string) => {
    setGrade1StandardScores((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleStandardScoreChange = (subject: string, field: string, value: string) => {
    setStandardScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleRawScoreChange = (subject: string, field: string, value: string) => {
    setRawScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleGrade2RawScoreChange = (subject: string, field: string, value: string) => {
    setGrade2RawScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleGrade2StandardScoreChange = (subject: string, field: string, value: string) => {
    setGrade2StandardScores((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleSubmit = () => {
    if (grade === "고1") {
      if (activeTab === "raw") {
        console.log("고1 원점수 입력:", grade1Scores)
      } else {
        console.log("고1 표준점수 입력:", grade1StandardScores)
      }
    } else if (grade === "고2") {
      if (activeTab === "raw") {
        console.log("고2 표준점수 입력:", grade2StandardScores)
      } else {
        console.log("고2 원점수 입력:", grade2RawScores)
      }
    } else {
      console.log("원점수 입력:", rawScores)
    }
  }

  const Grade2RawScoreInput = () => (
    <div className="space-y-6">
      {/* 국어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-orange-500">📝</span> 국어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-600">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade2RawScores.korean.raw}
                onChange={(e) => handleGrade2RawScoreChange("korean", "raw", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade2RawScores.korean.grade}
                onChange={(e) => handleGrade2RawScoreChange("korean", "grade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-green-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade2RawScores.korean.percentile}
                onChange={(e) => handleGrade2RawScoreChange("korean", "percentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 수학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📊</span> 수학
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade2RawScores.math.raw}
                onChange={(e) => handleGrade2RawScoreChange("math", "raw", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade2RawScores.math.grade}
                onChange={(e) => handleGrade2RawScoreChange("math", "grade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-green-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade2RawScores.math.percentile}
                onChange={(e) => handleGrade2RawScoreChange("math", "percentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 영어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">🌐</span> 영어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
            <Input
              type="number"
              placeholder="0"
              min="1"
              max="9"
              value={grade2RawScores.english.grade}
              onChange={(e) => handleGrade2RawScoreChange("english", "grade", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 한국사 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">📚</span> 한국사
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-32">
            <label className="block text-sm font-medium mb-1 text-green-600">등급 (1~9)</label>
            <Input
              type="number"
              placeholder="0"
              min="1"
              max="9"
              value={grade2RawScores.koreanHistory.grade}
              onChange={(e) => handleGrade2RawScoreChange("koreanHistory", "grade", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 탐구 1 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 탐구 1
          </CardTitle>
          <div className="text-sm text-gray-500">과목선택</div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              과목선택
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={grade2RawScores.inquiry1.subject}
              onValueChange={(value) => handleGrade2RawScoreChange("inquiry1", "subject", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquirySubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-600">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade2RawScores.inquiry1.raw}
                onChange={(e) => handleGrade2RawScoreChange("inquiry1", "raw", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade2RawScores.inquiry1.grade}
                onChange={(e) => handleGrade2RawScoreChange("inquiry1", "grade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-green-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade2RawScores.inquiry1.percentile}
                onChange={(e) => handleGrade2RawScoreChange("inquiry1", "percentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 탐구 2 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 탐구 2
          </CardTitle>
          <div className="text-sm text-gray-500">과목선택</div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              과목선택
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={grade2RawScores.inquiry2.subject}
              onValueChange={(value) => handleGrade2RawScoreChange("inquiry2", "subject", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquirySubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-600">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade2RawScores.inquiry2.raw}
                onChange={(e) => handleGrade2RawScoreChange("inquiry2", "raw", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade2RawScores.inquiry2.grade}
                onChange={(e) => handleGrade2RawScoreChange("inquiry2", "grade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-green-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade2RawScores.inquiry2.percentile}
                onChange={(e) => handleGrade2RawScoreChange("inquiry2", "percentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center mt-8">
        <Button
          onClick={() => {
            console.log("고2 원점수 입력 저장:", grade2RawScores)
            alert("성적이 저장되었습니다.")
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
        >
          저장
        </Button>
        <Button
          onClick={() => {
            console.log("고2 원점수 입력 수정 모드 활성화")
            alert("수정 모드가 활성화되었습니다.")
          }}
          variant="outline"
          className="border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-2"
        >
          수정
        </Button>
      </div>
    </div>
  )

  const Grade2StandardScoreInput = () => (
    <div className="space-y-6">
      {/* 국어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-orange-500">📝</span> 국어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-orange-600">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={grade2StandardScores.korean.raw}
              onChange={(e) => handleGrade2StandardScoreChange("korean", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 수학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📊</span> 수학
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-blue-600">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={grade2StandardScores.math.raw}
              onChange={(e) => handleGrade2StandardScoreChange("math", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 영어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">🌐</span> 영어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-blue-600">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={grade2StandardScores.english.raw}
              onChange={(e) => handleGrade2StandardScoreChange("english", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 한국사 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">📚</span> 한국사
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-green-600">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={grade2StandardScores.koreanHistory.raw}
              onChange={(e) => handleGrade2StandardScoreChange("koreanHistory", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 탐구 1 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 탐구 1
          </CardTitle>
          <div className="text-sm text-gray-500">과목선택</div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              과목선택
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={grade2StandardScores.inquiry1.subject}
              onValueChange={(value) => handleGrade2StandardScoreChange("inquiry1", "subject", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquirySubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-green-600">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={grade2StandardScores.inquiry1.raw}
              onChange={(e) => handleGrade2StandardScoreChange("inquiry1", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 탐구 2 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 탐구 2
          </CardTitle>
          <div className="text-sm text-gray-500">과목선택</div>
          <div className="flex gap-2">
            <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
              과목선택
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select
              value={grade2StandardScores.inquiry2.subject}
              onValueChange={(value) => handleGrade2StandardScoreChange("inquiry2", "subject", value)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="과목을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {inquirySubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-green-600">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={grade2StandardScores.inquiry2.raw}
              onChange={(e) => handleGrade2StandardScoreChange("inquiry2", "raw", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-center mt-8">
        <Button
          onClick={() => {
            console.log("고2 표준점수 입력 저장:", grade2StandardScores)
            alert("성적이 저장되었습니다.")
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
        >
          저장
        </Button>
        <Button
          onClick={() => {
            console.log("고2 표준점수 입력 수정 모드 활성화")
            alert("수정 모드가 활성화되었습니다.")
          }}
          variant="outline"
          className="border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-2"
        >
          수정
        </Button>
      </div>
    </div>
  )

  const Grade1ScoreInput = () => (
    <div className="space-y-6">
      {/* 국어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-orange-500">📝</span> 국어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-orange-600">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={grade1Scores.korean}
              onChange={(e) => handleGrade1ScoreChange("korean", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 수학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📊</span> 수학
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-blue-600">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={grade1Scores.math}
              onChange={(e) => handleGrade1ScoreChange("math", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 영어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">🌐</span> 영어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-blue-600">원점수 (0~100)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="100"
              value={grade1Scores.english}
              onChange={(e) => handleGrade1ScoreChange("english", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 한국사 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">📚</span> 한국사
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-green-600">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={grade1Scores.koreanHistory}
              onChange={(e) => handleGrade1ScoreChange("koreanHistory", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 통합과학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🔬</span> 통합과학
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-green-600">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={grade1Scores.integratedScience}
              onChange={(e) => handleGrade1ScoreChange("integratedScience", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 통합사회 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-purple-500">🏛️</span> 통합사회
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-purple-600">원점수 (0~50)</label>
            <Input
              type="number"
              placeholder="0"
              min="0"
              max="50"
              value={grade1Scores.integratedSocial}
              onChange={(e) => handleGrade1ScoreChange("integratedSocial", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-center pt-6">
        <Button
          onClick={() => {
            console.log("[v0] Saving Grade 1 raw scores:", grade1Scores)
            alert("원점수가 저장되었습니다.")
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8"
        >
          저장
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            console.log("[v0] Editing Grade 1 raw scores")
            alert("점수를 수정할 수 있습니다.")
          }}
          className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8"
        >
          수정
        </Button>
      </div>
    </div>
  )

  const Grade1StandardScoreInput = () => (
    <div className="space-y-6">
      {/* 국어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-orange-500">📝</span> 국어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-600">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade1StandardScores.korean}
                onChange={(e) => handleGrade1StandardScoreChange("korean", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade1StandardScores.koreanGrade}
                onChange={(e) => handleGrade1StandardScoreChange("koreanGrade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-orange-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade1StandardScores.koreanPercentile}
                onChange={(e) => handleGrade1StandardScoreChange("koreanPercentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 수학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">📊</span> 수학
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade1StandardScores.math}
                onChange={(e) => handleGrade1StandardScoreChange("math", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade1StandardScores.mathGrade}
                onChange={(e) => handleGrade1StandardScoreChange("mathGrade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-blue-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade1StandardScores.mathPercentile}
                onChange={(e) => handleGrade1StandardScoreChange("mathPercentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 영어 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-blue-500">🌐</span> 영어
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-blue-600">등급 (1~9)</label>
            <Input
              type="number"
              placeholder="0"
              min="1"
              max="9"
              value={grade1StandardScores.englishGrade}
              onChange={(e) => handleGrade1StandardScoreChange("englishGrade", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 한국사 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-green-500">🏛️</span> 한국사
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-48">
            <label className="block text-sm font-medium mb-1 text-green-600">등급 (1~9)</label>
            <Input
              type="number"
              placeholder="0"
              min="1"
              max="9"
              value={grade1StandardScores.koreanHistoryGrade}
              onChange={(e) => handleGrade1StandardScoreChange("koreanHistoryGrade", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* 통합과학 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-purple-500">🔬</span> 통합과학
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-purple-600">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade1StandardScores.integratedScience}
                onChange={(e) => handleGrade1StandardScoreChange("integratedScience", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-purple-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade1StandardScores.integratedScienceGrade}
                onChange={(e) => handleGrade1StandardScoreChange("integratedScienceGrade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-purple-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade1StandardScores.integratedSciencePercentile}
                onChange={(e) => handleGrade1StandardScoreChange("integratedSciencePercentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 통합사회 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <span className="text-teal-500">🌍</span> 통합사회
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-teal-600">원점수 (0~200)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="200"
                value={grade1StandardScores.integratedSocial}
                onChange={(e) => handleGrade1StandardScoreChange("integratedSocial", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-teal-600">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={grade1StandardScores.integratedSocialGrade}
                onChange={(e) => handleGrade1StandardScoreChange("integratedSocialGrade", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-teal-600">백분위 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={grade1StandardScores.integratedSocialPercentile}
                onChange={(e) => handleGrade1StandardScoreChange("integratedSocialPercentile", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 justify-center pt-6">
        <Button
          onClick={() => {
            console.log("[v0] Saving Grade 1 standard scores:", grade1StandardScores)
            alert("표준점수가 저장되었습니다.")
          }}
          className="bg-orange-500 hover:bg-orange-600 text-white px-8"
        >
          저장
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            console.log("[v0] Editing Grade 1 standard scores")
            alert("점수를 수정할 수 있습니다.")
          }}
          className="border-orange-500 text-orange-500 hover:bg-orange-50 px-8"
        >
          수정
        </Button>
      </div>
    </div>
  )

  const inquirySubjects = [
    "물리학I",
    "화학I",
    "생명과학I",
    "지구과학I",
    "물리학II",
    "화학II",
    "생명과학II",
    "지구과학II",
    "한국지리",
    "세계지리",
    "동아시아사",
    "세계사",
    "경제",
    "정치와법",
    "사회·문화",
  ]

  const secondLanguageSubjects = [
    "독일어I",
    "프랑스어I",
    "스페인어I",
    "중국어I",
    "일본어I",
    "러시아어I",
    "아랍어I",
    "베트남어I",
    "한문I",
  ]

  const Grade3StandardScoreInput = () => {
    const [standardScores, setStandardScores] = useState({
      korean: { standard: "", grade: "", percentile: "" },
      math: { standard: "", grade: "", percentile: "" },
      english: { grade: "" },
      koreanHistory: { grade: "" },
      inquiry1: { subject: "", standard: "", grade: "", percentile: "" },
      inquiry2: { subject: "", standard: "", grade: "", percentile: "" },
      secondLanguage: {
        category: "",
        subject1: "",
      },
    })

    const inquirySubjects = [
      "물리학I",
      "화학I",
      "생명과학I",
      "지구과학I",
      "물리학II",
      "화학II",
      "생명과학II",
      "지구과학II",
      "한국지리",
      "세계지리",
      "동아시아사",
      "세계사",
      "경제",
      "정치와법",
      "사회·문화",
    ]

    const secondLanguageSubjects = [
      "독일어I",
      "프랑스어I",
      "스페인어I",
      "중국어I",
      "일본어I",
      "러시아어I",
      "아랍어I",
      "베트남어I",
      "한문I",
    ]

    const handleStandardScoreChange = (subject: string, field: string, value: string) => {
      setStandardScores((prev) => ({
        ...prev,
        [subject]: {
          ...prev[subject as keyof typeof prev],
          [field]: value,
        },
      }))
    }

    return (
      <div className="space-y-6">
        {/* 국어 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">📝</span> 국어
            </CardTitle>
            <div className="text-sm text-gray-500">선택과목</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-blue-500 text-white border-blue-500">
                화법과 작문
              </Button>
              <Button size="sm" variant="outline">
                언어
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={standardScores.korean.standard}
                  onChange={(e) => handleStandardScoreChange("korean", "standard", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="1"
                  max="9"
                  value={standardScores.korean.grade}
                  onChange={(e) => handleStandardScoreChange("korean", "grade", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={standardScores.korean.percentile}
                  onChange={(e) => handleStandardScoreChange("korean", "percentile", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 수학 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">📊</span> 수학
            </CardTitle>
            <div className="text-sm text-gray-500">선택과목</div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="bg-blue-500 text-white border-blue-500">
                확률과 통계
              </Button>
              <Button size="sm" variant="outline">
                기하
              </Button>
              <Button size="sm" variant="outline">
                미적분
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={standardScores.math.standard}
                  onChange={(e) => handleStandardScoreChange("math", "standard", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="1"
                  max="9"
                  value={standardScores.math.grade}
                  onChange={(e) => handleStandardScoreChange("math", "grade", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={standardScores.math.percentile}
                  onChange={(e) => handleStandardScoreChange("math", "percentile", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 영어 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">🌐</span> 영어
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={standardScores.english.grade}
                onChange={(e) => handleStandardScoreChange("english", "grade", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 한국사 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">📚</span> 한국사
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={standardScores.koreanHistory.grade}
                onChange={(e) => handleStandardScoreChange("koreanHistory", "grade", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 탐구 1 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-green-500">🔬</span> 탐구 1
            </CardTitle>
            <div className="text-sm text-gray-500">과목선택</div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                과목선택
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                value={standardScores.inquiry1.subject}
                onValueChange={(value) => handleStandardScoreChange("inquiry1", "subject", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="과목을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {inquirySubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={standardScores.inquiry1.standard}
                  onChange={(e) => handleStandardScoreChange("inquiry1", "standard", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="1"
                  max="9"
                  value={standardScores.inquiry1.grade}
                  onChange={(e) => handleStandardScoreChange("inquiry1", "grade", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={standardScores.inquiry1.percentile}
                  onChange={(e) => handleStandardScoreChange("inquiry1", "percentile", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 탐구 2 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-green-500">🔬</span> 탐구 2
            </CardTitle>
            <div className="text-sm text-gray-500">과목선택</div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                과목선택
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                value={standardScores.inquiry2.subject}
                onChange={(value) => handleStandardScoreChange("inquiry2", "subject", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="과목을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {inquirySubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">표준점수 (0~200)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={standardScores.inquiry2.standard}
                  onChange={(e) => handleStandardScoreChange("inquiry2", "standard", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="1"
                  max="9"
                  value={standardScores.inquiry2.grade}
                  onChange={(e) => handleStandardScoreChange("inquiry2", "grade", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">백분위 (0~100)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="100"
                  value={standardScores.inquiry2.percentile}
                  onChange={(e) => handleStandardScoreChange("inquiry2", "percentile", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 제2외국어 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">🌍</span> 제2외국어
            </CardTitle>
            <div className="text-sm text-gray-500">선택과목</div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {secondLanguageSubjects.map((subject) => (
                <Button
                  key={subject}
                  size="sm"
                  variant="outline"
                  className={
                    standardScores.secondLanguage.category === subject ? "bg-blue-500 text-white border-blue-500" : ""
                  }
                  onClick={() => handleStandardScoreChange("secondLanguage", "category", subject)}
                >
                  {subject}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                className={
                  standardScores.secondLanguage.category === "기타" ? "bg-blue-500 text-white border-blue-500" : ""
                }
                onClick={() => handleStandardScoreChange("secondLanguage", "category", "기타")}
              >
                기타
              </Button>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">등급 (1~9)</label>
              <Input
                type="number"
                placeholder="0"
                min="1"
                max="9"
                value={standardScores.secondLanguage.subject1}
                onChange={(e) => handleStandardScoreChange("secondLanguage", "subject1", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center mt-8">
          <Button
            onClick={() => {
              console.log("고3 표준점수 입력 저장:", standardScores)
              alert("성적이 저장되었습니다.")
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
          >
            저장
          </Button>
          <Button
            onClick={() => {
              console.log("고3 표준점수 입력 수정 모드 활성화")
              alert("수정 모드가 활성화되었습니다.")
            }}
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-2"
          >
            수정
          </Button>
        </div>
      </div>
    )
  }

  const Grade3RawScoreInput = () => {
    const [rawScores, setRawScores] = useState({
      korean: { raw: "", selectedSubject: "화법과 작문" },
      math: { raw: "", selectedSubject: "확률과 통계" },
      english: { raw: "" },
      koreanHistory: { raw: "" },
      inquiry1: { subject: "", raw: "" },
      inquiry2: { subject: "", raw: "" },
      secondLanguage: {
        category: "",
      },
    })

    const inquirySubjects = [
      "물리학I",
      "화학I",
      "생명과학I",
      "지구과학I",
      "물리학II",
      "화학II",
      "생명과학II",
      "지구과학II",
      "한국지리",
      "세계지리",
      "동아시아사",
      "세계사",
      "경제",
      "정치와법",
      "사회·문화",
    ]

    const secondLanguageSubjects = [
      "독일어I",
      "프랑스어I",
      "스페인어I",
      "중국어I",
      "일본어I",
      "러시아어I",
      "아랍어I",
      "베트남어I",
      "한문I",
    ]

    const handleRawScoreChange = (subject: string, field: string, value: string) => {
      setRawScores((prev) => ({
        ...prev,
        [subject]: {
          ...prev[subject as keyof typeof prev],
          [field]: value,
        },
      }))
    }

    return (
      <div className="space-y-6">
        {/* 국어 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">📝</span> 국어
            </CardTitle>
            <div className="text-sm text-gray-500">선택과목</div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className={rawScores.korean.selectedSubject === "화법" ? "bg-blue-500 text-white border-blue-500" : ""}
                onClick={() => handleRawScoreChange("korean", "selectedSubject", "화법")}
              >
                화법
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={rawScores.korean.selectedSubject === "언어" ? "bg-blue-500 text-white border-blue-500" : ""}
                onClick={() => handleRawScoreChange("korean", "selectedSubject", "언어")}
              >
                언어
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">원점수 (0~76)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="76"
                  value={rawScores.korean.raw}
                  onChange={(e) => handleRawScoreChange("korean", "raw", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">선택과목 (0~24)</label>
                <Input type="number" placeholder="0" min="0" max="24" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 수학 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">📊</span> 수학
            </CardTitle>
            <div className="text-sm text-gray-500">선택과목</div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className={rawScores.math.selectedSubject === "확률" ? "bg-blue-500 text-white border-blue-500" : ""}
                onClick={() => handleRawScoreChange("math", "selectedSubject", "확률")}
              >
                확률
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={rawScores.math.selectedSubject === "기하" ? "bg-blue-500 text-white border-blue-500" : ""}
                onClick={() => handleRawScoreChange("math", "selectedSubject", "기하")}
              >
                기하
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={rawScores.math.selectedSubject === "미분" ? "bg-blue-500 text-white border-blue-500" : ""}
                onClick={() => handleRawScoreChange("math", "selectedSubject", "미분")}
              >
                미분
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">원점수 (0~74)</label>
                <Input
                  type="number"
                  placeholder="0"
                  min="0"
                  max="74"
                  value={rawScores.math.raw}
                  onChange={(e) => handleRawScoreChange("math", "raw", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">선택과목 (0~26)</label>
                <Input type="number" placeholder="0" min="0" max="26" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 영어 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">🌐</span> 영어
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">원점수 (0~100)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="100"
                value={rawScores.english.raw}
                onChange={(e) => handleRawScoreChange("english", "raw", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 한국사 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">📚</span> 한국사
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="50"
                value={rawScores.koreanHistory.raw}
                onChange={(e) => handleRawScoreChange("koreanHistory", "raw", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 탐구 1 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-green-500">🔬</span> 탐구 1
            </CardTitle>
            <div className="text-sm text-gray-500">과목선택</div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                과목선택
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                value={rawScores.inquiry1.subject}
                onChange={(value) => handleRawScoreChange("inquiry1", "subject", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="과목을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {inquirySubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="50"
                value={rawScores.inquiry1.raw}
                onChange={(e) => handleRawScoreChange("inquiry1", "raw", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 탐구 2 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-green-500">🔬</span> 탐구 2
            </CardTitle>
            <div className="text-sm text-gray-500">과목선택</div>
            <div className="flex gap-2">
              <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                과목선택
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Select
                value={rawScores.inquiry2.subject}
                onChange={(value) => handleRawScoreChange("inquiry2", "subject", value)}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="과목을 선택하세요" />
                </SelectTrigger>
                <SelectContent>
                  {inquirySubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-32">
              <label className="block text-sm font-medium mb-1">원점수 (0~50)</label>
              <Input
                type="number"
                placeholder="0"
                min="0"
                max="50"
                value={rawScores.inquiry2.raw}
                onChange={(e) => handleRawScoreChange("inquiry2", "raw", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* 제2외국어 */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-blue-500">🌍</span> 제2외국어
            </CardTitle>
            <div className="text-sm text-gray-500">선택과목</div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {secondLanguageSubjects.map((subject) => (
                <Button
                  key={subject}
                  size="sm"
                  variant="outline"
                  className={
                    rawScores.secondLanguage.category === subject ? "bg-blue-500 text-white border-blue-500" : ""
                  }
                  onClick={() => handleRawScoreChange("secondLanguage", "category", subject)}
                >
                  {subject}
                </Button>
              ))}
              <Button
                size="sm"
                variant="outline"
                className={rawScores.secondLanguage.category === "기타" ? "bg-blue-500 text-white border-blue-500" : ""}
                onClick={() => handleRawScoreChange("secondLanguage", "category", "기타")}
              >
                기타
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center mt-8">
          <Button
            onClick={() => {
              console.log("고3 원점수 입력 저장:", rawScores)
              alert("성적이 저장되었습니다.")
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2"
          >
            저장
          </Button>
          <Button
            onClick={() => {
              console.log("고3 원점수 입력 수정 모드 활성화")
              alert("수정 모드가 활성화되었습니다.")
            }}
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-50 px-6 py-2"
          >
            수정
          </Button>
        </div>
      </div>
    )
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">성적 입력</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Exam Info */}
          <div className="mb-8">
            {year && grade && month ? (
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                {year}년 {grade} {month} 모의고사
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">필수</span>
              </h2>
            ) : (
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                모의고사 정보를 선택해주세요
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">정보 필요</span>
              </h2>
            )}
          </div>

          {grade === "고1" ? (
            <>
              {/* Tab Selection */}
              <div className="mb-8">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={activeTab === "raw" ? "default" : "outline"}
                    className={activeTab === "raw" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                    onClick={() => setActiveTab("raw")}
                  >
                    원점수 입력
                  </Button>
                  <Button
                    size="sm"
                    variant={activeTab === "standard" ? "default" : "outline"}
                    className={activeTab === "standard" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                    onClick={() => setActiveTab("standard")}
                  >
                    표준점수 입력
                  </Button>
                </div>
              </div>

              {activeTab === "raw" ? <Grade1ScoreInput /> : <Grade1StandardScoreInput />}
            </>
          ) : grade === "고2" ? (
            <>
              {/* Grade 2 Tabs */}
              <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("raw")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "raw" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  원점수 입력
                </button>
                <button
                  onClick={() => setActiveTab("standard")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "standard" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  표준점수 입력
                </button>
              </div>

              {activeTab === "raw" ? <Grade2StandardScoreInput /> : <Grade2RawScoreInput />}
            </>
          ) : grade === "고3" ? (
            <div className="min-h-screen bg-gray-50 py-8">
              <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={activeTab === "raw" ? "default" : "outline"}
                      className={activeTab === "raw" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                      onClick={() => setActiveTab("raw")}
                    >
                      원점수 입력
                    </Button>
                    <Button
                      size="sm"
                      variant={activeTab === "standard" ? "default" : "outline"}
                      className={activeTab === "standard" ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                      onClick={() => setActiveTab("standard")}
                    >
                      표준점수 입력
                    </Button>
                  </div>
                </div>

                {activeTab === "standard" ? <Grade3StandardScoreInput /> : <Grade3RawScoreInput />}

                {/* Submit Button */}
                {/* <div className="mt-8 text-center">
                  <Button onClick={handleSubmit} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2">
                    입력완료
                  </Button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-500">학생 성적의 수집 및 활용에 동의합니다.</div> */}
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                  onClick={() => setActiveTab("raw")}
                >
                  원점수 입력
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
