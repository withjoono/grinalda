"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, Home, Upload, Save, Plus, Trash2 } from "lucide-react"

interface AttendanceRecord {
  year: number
  schoolDays: number
  absence: number
  absenceDays: number
  absenceOther: number
  absenceTotal: number
  lateLeave: number
  lateLeaveOther: number
  lateLeaveTotal: number
  earlyLeave: number
  earlyLeaveOther: number
  earlyLeaveTotal: number
  result: number
  resultOther: number
}

interface SubjectRecord {
  id: number
  name: string
  grade: string
  credit: string
  type: string
}

export default function RecordInputPage() {
  const [selectedGrade, setSelectedGrade] = useState("3")
  const [selectedSemester, setSelectedSemester] = useState("1")

  const [subjects, setSubjects] = useState([
    { id: 1, name: "국어", grade: "", credit: "4", type: "필수" },
    { id: 2, name: "수학", grade: "", credit: "4", type: "필수" },
    { id: 3, name: "영어", grade: "", credit: "4", type: "필수" },
    { id: 4, name: "한국사", grade: "", credit: "3", type: "필수" },
  ])

  const addSubject = () => {
    const newId = Math.max(...subjects.map((s) => s.id)) + 1
    setSubjects([...subjects, { id: newId, name: "", grade: "", credit: "", type: "선택" }])
  }

  const removeSubject = (id: number) => {
    setSubjects(subjects.filter((s) => s.id !== id))
  }

  const updateSubject = (id: number, field: string, value: string) => {
    setSubjects(subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const handleSave = () => {
    console.log("Saving records:", { grade: selectedGrade, semester: selectedSemester, subjects })
    alert("생활기록부 정보가 저장되었습니다.")
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      console.log("File uploaded:", file.name)
      alert("파일이 업로드되었습니다. 자동으로 성적이 입력됩니다.")
    }
  }

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
          <span className="text-gray-900 font-medium">생기부 입력</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">생활기록부 입력</h1>
          <p className="text-gray-600">학교생활기록부 성적을 입력하여 정확한 분석을 받아보세요.</p>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="mb-4">
            <Button
              variant="outline"
              className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
              onClick={() => window.open("#", "_blank")}
            >
              <Upload className="h-4 w-4 mr-2" />
              생기부 다운받는 법
            </Button>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="학년 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="고1">고1</SelectItem>
                  <SelectItem value="고2">고2</SelectItem>
                  <SelectItem value="고3/재수">고3/재수</SelectItem>
                </SelectContent>
              </Select>

              <label htmlFor="file-input">
                <Button
                  variant="outline"
                  className="bg-blue-500 text-white hover:bg-blue-600 border-blue-500"
                  onClick={() => document.getElementById("file-input")?.click()}
                  disabled={!selectedGrade}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  파일 선택
                </Button>
              </label>
              <input
                id="file-input"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            <Button
              onClick={handleSave}
              disabled={!selectedGrade}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300"
            >
              업로드
            </Button>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">업로드된 파일 목록</h3>
            {/* Placeholder for uploaded files list */}
          </div>
        </div>

        {/* Manual Input */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          {/* Grade and Semester Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label htmlFor="grade">학년</Label>
              <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                <SelectTrigger>
                  <SelectValue placeholder="학년 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1학년</SelectItem>
                  <SelectItem value="2">2학년</SelectItem>
                  <SelectItem value="3">3학년</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="semester">학기</Label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger>
                  <SelectValue placeholder="학기 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1학기</SelectItem>
                  <SelectItem value="2">2학기</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Subject Input Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium">과목명</th>
                  <th className="text-center py-3 px-4 font-medium">등급</th>
                  <th className="text-center py-3 px-4 font-medium">단위수</th>
                  <th className="text-center py-3 px-4 font-medium">이수구분</th>
                  <th className="text-center py-3 px-4 font-medium">작업</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.id} className="border-b">
                    <td className="py-3 px-4">
                      <Input
                        value={subject.name}
                        onChange={(e) => updateSubject(subject.id, "name", e.target.value)}
                        placeholder="과목명 입력"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Select
                        value={subject.grade}
                        onValueChange={(value) => updateSubject(subject.id, "grade", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="등급" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1등급</SelectItem>
                          <SelectItem value="2">2등급</SelectItem>
                          <SelectItem value="3">3등급</SelectItem>
                          <SelectItem value="4">4등급</SelectItem>
                          <SelectItem value="5">5등급</SelectItem>
                          <SelectItem value="6">6등급</SelectItem>
                          <SelectItem value="7">7등급</SelectItem>
                          <SelectItem value="8">8등급</SelectItem>
                          <SelectItem value="9">9등급</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4">
                      <Input
                        value={subject.credit}
                        onChange={(e) => updateSubject(subject.id, "credit", e.target.value)}
                        placeholder="단위수"
                        type="number"
                        min="1"
                        max="8"
                      />
                    </td>
                    <td className="py-3 px-4">
                      <Select value={subject.type} onValueChange={(value) => updateSubject(subject.id, "type", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="필수">필수</SelectItem>
                          <SelectItem value="선택">선택</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubject(subject.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Subject Button */}
          <div className="mt-4">
            <Button variant="outline" onClick={addSubject} className="flex items-center bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              과목 추가
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-600">{subjects.length}</h3>
              <p className="text-sm text-blue-800">총 과목 수</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="text-2xl font-bold text-green-600">{subjects.filter((s) => s.grade).length}</h3>
              <p className="text-sm text-green-800">입력 완료</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h3 className="text-2xl font-bold text-orange-600">
                {subjects.reduce((sum, s) => sum + (Number.parseInt(s.credit) || 0), 0)}
              </h3>
              <p className="text-sm text-orange-800">총 단위수</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Button variant="outline">임시저장</Button>
          <Button onClick={handleSave} className="flex items-center">
            <Save className="h-4 w-4 mr-2" />
            저장 및 분석하기
          </Button>
        </div>
      </div>
    </div>
  )
}
