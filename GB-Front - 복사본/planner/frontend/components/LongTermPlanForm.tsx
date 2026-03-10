'use client'

import { useState, useMemo } from 'react'
import { 
  SUBJECTS, 
  SUBJECT_COLORS, 
  PERIOD_TYPE_LABELS,
  type LongTermPlan,
  type LongTermPlanInput,
  type PeriodType,
} from '../types'

interface LongTermPlanFormProps {
  plan?: LongTermPlan
  onSubmit: (plan: LongTermPlanInput) => void
  onCancel: () => void
}

// 기간 유형별 기본 날짜 계산
const getDefaultDates = (periodType: PeriodType): { startDate: string; endDate: string } => {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0]
  
  switch (periodType) {
    case 'year':
      return {
        startDate: formatDate(new Date(year, 0, 1)),
        endDate: formatDate(new Date(year, 11, 31)),
      }
    case 'semester':
      // 1학기: 3~7월, 2학기: 9~12월
      if (month < 7) {
        return {
          startDate: formatDate(new Date(year, 2, 1)),
          endDate: formatDate(new Date(year, 6, 31)),
        }
      } else {
        return {
          startDate: formatDate(new Date(year, 8, 1)),
          endDate: formatDate(new Date(year, 11, 31)),
        }
      }
    case 'vacation':
      // 여름방학: 7~8월, 겨울방학: 12~2월
      if (month >= 6 && month <= 8) {
        return {
          startDate: formatDate(new Date(year, 6, 15)),
          endDate: formatDate(new Date(year, 7, 31)),
        }
      } else {
        return {
          startDate: formatDate(new Date(year, 11, 20)),
          endDate: formatDate(new Date(year + 1, 1, 28)),
        }
      }
    case 'month':
      return {
        startDate: formatDate(new Date(year, month, 1)),
        endDate: formatDate(new Date(year, month + 1, 0)),
      }
    default:
      return {
        startDate: formatDate(today),
        endDate: formatDate(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)),
      }
  }
}

export function LongTermPlanForm({ plan, onSubmit, onCancel }: LongTermPlanFormProps) {
  const [formData, setFormData] = useState<LongTermPlanInput>(() => {
    if (plan) {
      return {
        title: plan.title,
        subject: plan.subject,
        periodType: plan.periodType,
        startDate: plan.startDate.toISOString().split('T')[0],
        endDate: plan.endDate.toISOString().split('T')[0],
        type: plan.type,
        material: plan.material,
        totalAmount: plan.totalAmount,
        completedAmount: plan.completedAmount,
        priority: plan.priority,
      }
    }
    const dates = getDefaultDates('month')
    return {
      title: '',
      subject: SUBJECTS[0],
      periodType: 'month' as PeriodType,
      startDate: dates.startDate,
      endDate: dates.endDate,
      type: 'textbook' as const,
      material: '',
      totalAmount: 0,
      completedAmount: 0,
      priority: 3,
    }
  })

  // 기간 일수 계산
  const periodDays = useMemo(() => {
    if (!formData.startDate || !formData.endDate) return 0
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  }, [formData.startDate, formData.endDate])

  // 일일/주간 목표량 자동 계산
  const targets = useMemo(() => {
    if (formData.totalAmount <= 0 || periodDays <= 0) {
      return { daily: 0, weekly: 0 }
    }
    const daily = Math.ceil(formData.totalAmount / periodDays)
    const weekly = Math.ceil(formData.totalAmount / Math.ceil(periodDays / 7))
    return { daily, weekly }
  }, [formData.totalAmount, periodDays])

  const handlePeriodTypeChange = (periodType: PeriodType) => {
    const dates = getDefaultDates(periodType)
    setFormData({ ...formData, periodType, ...dates })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {plan ? '장기 계획 수정' : '새 장기 계획'}
      </h2>

      {/* 과목 선택 */}
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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
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

      {/* 기간 유형 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          기간 유형
        </label>
        <div className="grid grid-cols-5 gap-2">
          {(Object.keys(PERIOD_TYPE_LABELS) as PeriodType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => handlePeriodTypeChange(type)}
              className={`py-2 rounded-lg text-sm font-medium transition-all ${
                formData.periodType === type
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {PERIOD_TYPE_LABELS[type]}
            </button>
          ))}
        </div>
      </div>

      {/* 기간 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            시작일
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            종료일
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      {/* 기간 정보 표시 */}
      {periodDays > 0 && (
        <div className="text-sm text-gray-500 -mt-2">
          총 {periodDays}일 ({Math.ceil(periodDays / 7)}주)
        </div>
      )}

      {/* 유형 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          유형
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="type"
              value="textbook"
              checked={formData.type === 'textbook'}
              onChange={() => setFormData({ ...formData, type: 'textbook' })}
              className="sr-only peer"
            />
            <div className="w-5 h-5 border-2 rounded-full border-gray-300 peer-checked:border-orange-500 peer-checked:border-[6px] mr-2 transition-all" />
            <span className="text-sm">📚 교재</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="type"
              value="lecture"
              checked={formData.type === 'lecture'}
              onChange={() => setFormData({ ...formData, type: 'lecture' })}
              className="sr-only peer"
            />
            <div className="w-5 h-5 border-2 rounded-full border-gray-300 peer-checked:border-orange-500 peer-checked:border-[6px] mr-2 transition-all" />
            <span className="text-sm">🎬 강의</span>
          </label>
        </div>
      </div>

      {/* 계획명 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          계획명
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="예: 수학 개념원리 1회독"
          required
        />
      </div>

      {/* 교재/강의명 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {formData.type === 'textbook' ? '교재명' : '강의명'}
        </label>
        <input
          type="text"
          value={formData.material}
          onChange={(e) => setFormData({ ...formData, material: e.target.value })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder={formData.type === 'textbook' ? '예: 개념원리 수학 상' : '예: 이투스 개념완성'}
          required
        />
      </div>

      {/* 총 분량 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          총 {formData.type === 'textbook' ? '페이지' : '강수'}
        </label>
        <input
          type="number"
          value={formData.totalAmount || ''}
          onChange={(e) => setFormData({ ...formData, totalAmount: parseInt(e.target.value) || 0 })}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          min={1}
          placeholder="0"
          required
        />
      </div>

      {/* 자동 계산된 목표 */}
      {formData.totalAmount > 0 && periodDays > 0 && (
        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
          <h3 className="text-sm font-semibold text-orange-800 mb-2">📊 자동 계산된 목표</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-orange-600">일일 목표:</span>
              <span className="font-bold text-orange-800 ml-2">
                {targets.daily} {formData.type === 'textbook' ? '페이지' : '강'}
              </span>
            </div>
            <div>
              <span className="text-orange-600">주간 목표:</span>
              <span className="font-bold text-orange-800 ml-2">
                {targets.weekly} {formData.type === 'textbook' ? '페이지' : '강'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 우선순위 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          우선순위
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((priority) => (
            <button
              key={priority}
              type="button"
              onClick={() => setFormData({ ...formData, priority })}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                formData.priority === priority
                  ? priority <= 2 ? 'bg-red-500 text-white' : priority <= 3 ? 'bg-yellow-500 text-white' : 'bg-gray-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {priority === 1 ? '최고' : priority === 2 ? '높음' : priority === 3 ? '보통' : priority === 4 ? '낮음' : '최저'}
            </button>
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium shadow-md"
        >
          {plan ? '수정' : '추가'}
        </button>
      </div>
    </form>
  )
}




