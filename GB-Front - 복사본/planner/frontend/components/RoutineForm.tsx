'use client'

import { useState } from 'react'
import { 
  DAYS, 
  SUBJECTS,
  SUBJECT_COLORS,
  ROUTINE_CATEGORY_COLORS,
  type Routine, 
  type RoutineCategory,
  type RoutineInput 
} from '../types'

interface RoutineFormProps {
  routine?: Routine
  onSubmit: (routine: RoutineInput) => void
  onCancel: () => void
}

const CATEGORY_OPTIONS: { value: RoutineCategory; label: string; description: string }[] = [
  { value: 'fixed', label: '고정 일과', description: '수업, 식사, 수면, 등하교 등' },
  { value: 'study', label: '학습 시간', description: '과목별 자기주도 학습' },
  { value: 'rest', label: '휴식', description: '운동, 취미, 휴식 시간' },
  { value: 'other', label: '기타', description: '기타 일정' },
]

export function RoutineForm({ routine, onSubmit, onCancel }: RoutineFormProps) {
  const [formData, setFormData] = useState<RoutineInput>({
    title: routine?.title || '',
    category: routine?.category || 'fixed',
    subject: routine?.subject || '',
    startTime: routine?.startTime || '09:00',
    endTime: routine?.endTime || '10:00',
    repeat: routine?.repeat ?? true,
    days: routine?.days || [false, true, true, true, true, true, false], // 월~금 기본
    color: routine?.color || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const toggleDay = (index: number) => {
    const newDays = [...formData.days]
    newDays[index] = !newDays[index]
    setFormData({ ...formData, days: newDays })
  }

  const selectAllWeekdays = () => {
    setFormData({ ...formData, days: [false, true, true, true, true, true, false] })
  }

  const selectAllDays = () => {
    setFormData({ ...formData, days: [true, true, true, true, true, true, true] })
  }

  const clearAllDays = () => {
    setFormData({ ...formData, days: [false, false, false, false, false, false, false] })
  }

  // 카테고리별 색상 가져오기
  const getCategoryColor = () => {
    if (formData.category === 'study' && formData.subject) {
      return SUBJECT_COLORS[formData.subject] || ROUTINE_CATEGORY_COLORS.study
    }
    return formData.color || ROUTINE_CATEGORY_COLORS[formData.category]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-gray-900">
          {routine ? '루틴 수정' : '새 루틴 추가'}
        </h2>
        <div 
          className="w-4 h-4 rounded-full"
          style={{ backgroundColor: getCategoryColor() }}
        />
      </div>

      {/* 카테고리 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          카테고리
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData({ ...formData, category: option.value, subject: '' })}
              className={`p-3 rounded-lg border-2 text-left transition-all ${
                formData.category === option.value
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: ROUTINE_CATEGORY_COLORS[option.value] }}
                />
                <span className="font-medium text-sm">{option.label}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* 과목 선택 (학습 시간인 경우만) */}
      {formData.category === 'study' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            과목
          </label>
          <div className="flex flex-wrap gap-2">
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() => setFormData({ ...formData, subject })}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  formData.subject === subject
                    ? 'text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: formData.subject === subject ? SUBJECT_COLORS[subject] : undefined,
                }}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          루틴명
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder={
            formData.category === 'fixed' ? '예: 학교 수업, 점심 식사' :
            formData.category === 'study' ? '예: 수학 문제풀이, 영단어 암기' :
            formData.category === 'rest' ? '예: 운동, 독서' : '일정 이름'
          }
          required
        />
      </div>

      {/* 시간 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            시작 시간
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            종료 시간
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* 소요 시간 표시 */}
      {formData.startTime && formData.endTime && (
        <div className="text-sm text-gray-500 -mt-2">
          소요 시간: {calculateDuration(formData.startTime, formData.endTime)}
        </div>
      )}

      {/* 반복 여부 */}
      <div className="flex items-center justify-between py-2">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={formData.repeat}
            onChange={(e) => setFormData({ ...formData, repeat: e.target.checked })}
            className="sr-only peer"
          />
          <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-100 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
          <span className="ms-3 text-sm font-medium text-gray-700">매주 반복</span>
        </label>
      </div>

      {/* 요일 선택 */}
      {formData.repeat && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              반복 요일
            </label>
            <div className="flex gap-2 text-xs">
              <button 
                type="button" 
                onClick={selectAllWeekdays}
                className="text-orange-500 hover:underline"
              >
                평일
              </button>
              <button 
                type="button" 
                onClick={selectAllDays}
                className="text-orange-500 hover:underline"
              >
                매일
              </button>
              <button 
                type="button" 
                onClick={clearAllDays}
                className="text-gray-500 hover:underline"
              >
                초기화
              </button>
            </div>
          </div>
          <div className="flex gap-2">
            {DAYS.map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(index)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  formData.days[index]
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } ${index === 0 ? 'text-red-500' : ''} ${index === 6 ? 'text-blue-500' : ''}`}
                style={{
                  backgroundColor: formData.days[index] ? getCategoryColor() : undefined,
                  color: formData.days[index] ? 'white' : (index === 0 ? '#ef4444' : index === 6 ? '#3b82f6' : undefined)
                }}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors shadow-md"
        >
          {routine ? '수정' : '추가'}
        </button>
      </div>
    </form>
  )
}

// 소요 시간 계산 헬퍼 함수
function calculateDuration(startTime: string, endTime: string): string {
  const [startHour, startMin] = startTime.split(':').map(Number)
  const [endHour, endMin] = endTime.split(':').map(Number)
  
  let totalMinutes = (endHour * 60 + endMin) - (startHour * 60 + startMin)
  if (totalMinutes < 0) totalMinutes += 24 * 60 // 자정 넘어가는 경우
  
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  
  if (hours === 0) return `${minutes}분`
  if (minutes === 0) return `${hours}시간`
  return `${hours}시간 ${minutes}분`
}
