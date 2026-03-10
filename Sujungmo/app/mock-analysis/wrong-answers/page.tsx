"use client"

import { useState } from "react"

export default function WrongAnswersPage() {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null)

  // Mock data for wrong answers analysis
  const stats = {
    totalWrong: 7,
    totalPoints: -17,
    twoPointWrong: 4,
    threePointWrong: 3,
  }

  const wrongAnswers = [1, 7, 16, 28, 29, 37, 43]
  const correctAnswers = [
    { question: 1, answer: 1 },
    { question: 7, answer: 3 },
    { question: 16, answer: 3 },
    { question: 28, answer: 3 },
    { question: 29, answer: 3 },
    { question: 37, answer: 3 },
    { question: 43, answer: 3 },
  ]

  const wrongQuestionTypes = [
    { question: 1, type: "화법과 작문" },
    { question: 7, type: "화법과 작문" },
    { question: 16, type: "문학, 고전시가" },
    { question: 28, type: "비문학, 기술" },
    { question: 29, type: "비문학, 기술" },
    { question: 37, type: "비문학, 철학예술" },
    { question: 43, type: "문학, 현대소설" },
  ]

  const renderQuestionGrid = () => {
    const questions = []
    for (let i = 1; i <= 45; i++) {
      const isWrong = wrongAnswers.includes(i)
      questions.push(
        <button
          key={i}
          onClick={() => setSelectedQuestion(i)}
          className={`w-8 h-8 rounded-full text-sm font-medium border-2 transition-colors ${
            isWrong
              ? "bg-red-500 text-white border-red-500"
              : "bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200"
          } ${selectedQuestion === i ? "ring-2 ring-orange-400" : ""}`}
        >
          {i}
        </button>,
      )
    }
    return questions
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500 mb-2">
            <span>홈</span> &gt; <span>모의고사</span> &gt; <span className="text-gray-900">오답노트</span>
          </nav>
          <h1 className="text-2xl font-bold text-gray-900">오답노트</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Statistics Header */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">총 오답문항</div>
                <div className="text-2xl font-bold text-orange-600">{stats.totalWrong}</div>
                <div className="text-sm text-gray-500">문항</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">총 정답</div>
                <div className="text-2xl font-bold text-orange-600">{stats.totalPoints}</div>
                <div className="text-sm text-gray-500">점</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">백분위 오답 개수</div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg font-bold text-orange-600">2점 문항 {stats.twoPointWrong}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1"></div>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-lg font-bold text-orange-600">3점 문항 {stats.threePointWrong}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Wrong Answers Grid */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">취약과 작은</h3>
              <div className="grid grid-cols-5 gap-2">{renderQuestionGrid()}</div>
            </div>

            {/* Correct Answers */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">정답</h3>
              <div className="space-y-3">
                {correctAnswers.map((item) => (
                  <div key={item.question} className="flex items-center space-x-4">
                    <span className="text-sm font-medium text-gray-700 w-6">{item.question}.</span>
                    <div className="flex space-x-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <div
                          key={num}
                          className={`w-6 h-6 rounded-full text-xs font-medium flex items-center justify-center ${
                            num === item.answer ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wrong Question Types */}
            <div className="col-span-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">틀린 문항 유형</h3>
              <div className="space-y-3">
                {wrongQuestionTypes.map((item) => (
                  <div key={item.question} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-700">{item.question}.</span>
                    <span className="text-sm text-gray-600">{item.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-center">
            <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              입력페이지로
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
