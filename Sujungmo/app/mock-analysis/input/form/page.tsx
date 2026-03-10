"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

export default function MockExamFormPage() {
  const searchParams = useSearchParams()
  const year = searchParams.get("year") || ""
  const grade = searchParams.get("grade") || ""
  const month = searchParams.get("month") || ""

  const getSubjects = () => {
    if (grade === "고1") {
      return ["국어", "수학", "영어", "한국사", "통합사회", "통합과학", "제2외국어"]
    }
    return ["국어", "수학", "영어", "한국사", "탐구1", "탐구2", "제2외국어"]
  }

  const subjects = getSubjects()

  const [selectedSubject, setSelectedSubject] = useState("국어")
  const [answers, setAnswers] = useState<{ [key: string]: number | string }>({})
  const [inquiry1Subject, setInquiry1Subject] = useState("")
  const [inquiry2Subject, setInquiry2Subject] = useState("")
  const [secondForeignLanguage, setSecondForeignLanguage] = useState("")

  const inquirySubjects = {
    사회탐구: ["생활과 윤리", "윤리와 사상", "사회·문화", "한국 지리", "세계 지리", "동아시아사", "세계사"],
    과학탐구: ["물리학Ⅰ", "물리학Ⅱ", "화학Ⅰ", "화학Ⅱ", "생명과학Ⅰ", "생명과학Ⅱ", "지구과학Ⅰ", "지구과학Ⅱ"],
  }

  const secondForeignLanguageSubjects = [
    "독일어",
    "프랑스어",
    "스페인어",
    "중국어",
    "일본어",
    "러시아어",
    "아랍어",
    "베트남어",
    "한문",
  ]

  const getQuestionsForSubject = (subject: string) => {
    if (subject === "국어" || subject === "영어") {
      return Array.from({ length: 45 }, (_, i) => i + 1)
    }
    if (subject === "수학") {
      return Array.from({ length: 30 }, (_, i) => i + 1)
    }
    if (
      subject === "한국사" ||
      subject === "탐구1" ||
      subject === "탐구2" ||
      subject === "통합사회" ||
      subject === "통합과학"
    ) {
      return Array.from({ length: 20 }, (_, i) => i + 1)
    }
    if (subject === "제2외국어") {
      return Array.from({ length: 30 }, (_, i) => i + 1)
    }
    return Array.from({ length: 7 }, (_, i) => i + 1)
  }

  const getMathInputType = (questionNum: number) => {
    if (grade === "고2") {
      // 고2: 1-21번은 5지선다, 22-30번은 3자리 숫자입력
      if (questionNum >= 1 && questionNum <= 21) {
        return "multiple-choice"
      }
      if (questionNum >= 22 && questionNum <= 30) {
        return "number-input"
      }
    } else {
      // 고3 (기존 로직): 1-15번, 23-28번은 5지선다, 16-22번, 29-30번은 3자리 숫자입력
      if ((questionNum >= 1 && questionNum <= 15) || (questionNum >= 23 && questionNum <= 28)) {
        return "multiple-choice"
      }
      if ((questionNum >= 16 && questionNum <= 22) || (questionNum >= 29 && questionNum <= 30)) {
        return "number-input"
      }
    }
    return "multiple-choice"
  }

  const questions = getQuestionsForSubject(selectedSubject)
  const answerOptions = [1, 2, 3, 4, 5]

  const handleAnswerSelect = (questionNum: number, answer: number) => {
    const key = `${selectedSubject}-${questionNum}`
    setAnswers((prev) => ({
      ...prev,
      [key]: answer,
    }))
  }

  const handleNumberInput = (questionNum: number, value: string) => {
    const key = `${selectedSubject}-${questionNum}`
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    console.log("Saving answers:", answers)
    // Handle save logic here
  }

  const renderMathQuestion = (questionNum: number) => {
    const key = `${selectedSubject}-${questionNum}`
    const selectedAnswer = answers[key]
    const inputType = getMathInputType(questionNum)

    if (inputType === "number-input") {
      return (
        <div key={questionNum} className="flex items-center space-x-4 mb-4">
          <div className="w-8 text-center font-medium text-gray-700">{questionNum}.</div>
          <div className="flex space-x-2">
            <input
              type="text"
              maxLength={3}
              value={selectedAnswer || ""}
              onChange={(e) => handleNumberInput(questionNum, e.target.value)}
              className="w-16 h-10 border-2 border-gray-300 rounded text-center font-medium focus:border-orange-500 focus:outline-none"
              placeholder="000"
            />
          </div>
        </div>
      )
    }

    return (
      <div key={questionNum} className="flex items-center space-x-4 mb-4">
        <div className="w-8 text-center font-medium text-gray-700">{questionNum}.</div>
        <div className="flex space-x-2">
          {answerOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(questionNum, option)}
              className={`w-10 h-10 rounded-full border-2 font-medium text-sm transition-colors ${
                selectedAnswer === option
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-orange-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderRegularQuestion = (questionNum: number) => {
    const key = `${selectedSubject}-${questionNum}`
    const selectedAnswer = answers[key]

    return (
      <div key={questionNum} className="flex items-center space-x-4 mb-3">
        <div className="w-8 text-center font-medium text-gray-700">{questionNum}.</div>
        <div className="flex space-x-2">
          {answerOptions.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswerSelect(questionNum, option)}
              className={`w-10 h-10 rounded-full border-2 font-medium text-sm transition-colors ${
                selectedAnswer === option
                  ? "bg-orange-500 border-orange-500 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-orange-300"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderKoreanEnglishQuestions = () => {
    const sections = [
      { start: 1, end: 10, title: "1-10번", color: "blue" },
      { start: 11, end: 20, title: "11-20번", color: "green" },
      { start: 21, end: 30, title: "21-30번", color: "purple" },
      { start: 31, end: 40, title: "31-40번", color: "indigo" },
      { start: 41, end: 45, title: "41-45번", color: "pink" },
    ]

    return (
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`bg-${section.color}-50 border border-${section.color}-200 rounded-lg p-4`}
          >
            <h4 className={`text-sm font-medium text-${section.color}-800 mb-3`}>{section.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {questions.slice(section.start - 1, section.end).map(renderRegularQuestion)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderInquiryDropdown = (inquiryType: "탐구1" | "탐구2") => {
    const selectedSubject = inquiryType === "탐구1" ? inquiry1Subject : inquiry2Subject
    const setSelectedSubject = inquiryType === "탐구1" ? setInquiry1Subject : setInquiry2Subject

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">과목 선택</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">과목을 선택하세요</option>
            <optgroup label="사회탐구">
              {inquirySubjects.사회탐구.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </optgroup>
            <optgroup label="과학탐구">
              {inquirySubjects.과학탐구.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </optgroup>
          </select>
        </div>

        {selectedSubject && (
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">{selectedSubject}</h4>
            {render20QuestionSubject()}
          </div>
        )}
      </div>
    )
  }

  const render20QuestionSubject = () => {
    const sections = [
      { start: 1, end: 10, title: "1-10번", color: "blue" },
      { start: 11, end: 20, title: "11-20번", color: "green" },
    ]

    return (
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`bg-${section.color}-50 border border-${section.color}-200 rounded-lg p-4`}
          >
            <h4 className={`text-sm font-medium text-${section.color}-800 mb-3`}>{section.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {questions.slice(section.start - 1, section.end).map(renderRegularQuestion)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const render30QuestionSubject = () => {
    const sections = [
      { start: 1, end: 10, title: "1-10번", color: "blue" },
      { start: 11, end: 20, title: "11-20번", color: "green" },
      { start: 21, end: 30, title: "21-30번", color: "purple" },
    ]

    return (
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`bg-${section.color}-50 border border-${section.color}-200 rounded-lg p-4`}
          >
            <h4 className={`text-sm font-medium text-${section.color}-800 mb-3`}>{section.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {questions.slice(section.start - 1, section.end).map(renderRegularQuestion)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderSecondForeignLanguageDropdown = () => {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">과목 선택</label>
          <select
            value={secondForeignLanguage}
            onChange={(e) => setSecondForeignLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">과목을 선택하세요</option>
            {secondForeignLanguageSubjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        {secondForeignLanguage && (
          <div className="mt-6">
            <h4 className="text-lg font-medium text-gray-900 mb-4">{secondForeignLanguage}</h4>
            {render30QuestionSubject()}
          </div>
        )}
      </div>
    )
  }

  const renderGrade2MathQuestions = () => {
    const sections = [
      { start: 1, end: 10, title: "1-10번 (5지 선다)", color: "blue" },
      { start: 11, end: 21, title: "11-21번 (5지 선다)", color: "green" },
      { start: 22, end: 30, title: "22-30번 (3자리 숫자 입력)", color: "purple" },
    ]

    return (
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`bg-${section.color}-50 border border-${section.color}-200 rounded-lg p-4`}
          >
            <h4 className={`text-sm font-medium text-${section.color}-800 mb-3`}>{section.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {questions.slice(section.start - 1, section.end).map(renderMathQuestion)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderGrade3MathQuestions = () => {
    const sections = [
      { start: 1, end: 15, title: "1-15번 (5지 선다)", color: "pink" },
      { start: 16, end: 22, title: "16-22번 (3자리 숫자 입력)", color: "blue" },
      { start: 23, end: 28, title: "23-28번 (5지 선다)", color: "green" },
      { start: 29, end: 30, title: "29-30번 (3자리 숫자 입력)", color: "purple" },
    ]

    return (
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section) => (
          <div
            key={section.title}
            className={`bg-${section.color}-50 border border-${section.color}-200 rounded-lg p-4`}
          >
            <h4 className={`text-sm font-medium text-${section.color}-800 mb-3`}>{section.title}</h4>
            <div className="grid grid-cols-2 gap-2">
              {questions.slice(section.start - 1, section.end).map(renderMathQuestion)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderIntegratedSubject = (subjectName: string) => {
    return (
      <div className="mt-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">{subjectName}</h4>
        {render20QuestionSubject()}
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">모의고사 입력</h1>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            {year && grade && month ? (
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                {year}년 {grade} {month} 모의고사
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">필수</span>
              </h2>
            ) : (
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                모의고사 정보를 선택해주세요
                <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">정보 필요</span>
              </h2>
            )}
          </div>

          <div className="flex">
            {/* Subject Sidebar */}
            <div className="w-80 bg-gray-50 border-r border-gray-200">
              <div className="p-4">
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`w-full text-left px-4 py-3 mb-2 rounded-md text-sm font-medium transition-colors ${
                      selectedSubject === subject
                        ? "bg-orange-100 text-orange-700 border border-orange-200"
                        : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8">
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{selectedSubject}</h3>

                <div className="space-y-6">
                  {selectedSubject === "수학" ? (
                    grade === "고2" ? (
                      renderGrade2MathQuestions()
                    ) : (
                      renderGrade3MathQuestions()
                    )
                  ) : selectedSubject === "국어" || selectedSubject === "영어" ? (
                    renderKoreanEnglishQuestions()
                  ) : selectedSubject === "탐구1" ? (
                    renderInquiryDropdown("탐구1")
                  ) : selectedSubject === "탐구2" ? (
                    renderInquiryDropdown("탐구2")
                  ) : selectedSubject === "통합사회" ? (
                    renderIntegratedSubject("통합사회")
                  ) : selectedSubject === "통합과학" ? (
                    renderIntegratedSubject("통합과학")
                  ) : selectedSubject === "한국사" ? (
                    render20QuestionSubject()
                  ) : selectedSubject === "제2외국어" ? (
                    renderSecondForeignLanguageDropdown()
                  ) : (
                    <div className="space-y-3">{questions.map(renderRegularQuestion)}</div>
                  )}
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-8">
                  <button
                    onClick={handleSave}
                    className="bg-gray-400 hover:bg-gray-500 text-white px-8 py-3 rounded-md font-medium transition-colors"
                  >
                    저장하기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
