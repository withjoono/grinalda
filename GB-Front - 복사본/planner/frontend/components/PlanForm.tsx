'use client'

import { useState } from 'react'
import { SUBJECTS, SUBJECT_COLORS, type Plan } from '../types'

interface PlanFormProps {
  plan?: Plan
  onSubmit: (plan: Partial<Plan>) => void
  onCancel: () => void
}

export function PlanForm({ plan, onSubmit, onCancel }: PlanFormProps) {
  const [formData, setFormData] = useState({
    title: plan?.title || '',
    subject: plan?.subject || SUBJECTS[0],
    step: plan?.step || '',
    startDay: plan?.range?.[0] ? new Date(plan.range[0]).toISOString().split('T')[0] : '',
    endDay: plan?.range?.[1] ? new Date(plan.range[1]).toISOString().split('T')[0] : '',
    type: plan?.type || 'textbook' as const,
    material: plan?.material || '',
    total: plan?.total || 0,
    done: plan?.done || 0,
    person: plan?.person || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...plan,
      title: formData.title,
      subject: formData.subject,
      step: formData.step,
      range: [new Date(formData.startDay), new Date(formData.endDay)],
      type: formData.type,
      material: formData.material,
      total: formData.total,
      done: formData.done,
      person: formData.person,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">
        {plan ? '계획 수정' : '새 계획 추가'}
      </h2>

      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          계획명
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="계획명을 입력하세요"
          required
        />
      </div>

      {/* 과목 선택 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          과목
        </label>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => setFormData({ ...formData, subject })}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                formData.subject === subject
                  ? 'text-white'
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

      {/* 기간 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            시작일
          </label>
          <input
            type="date"
            value={formData.startDay}
            onChange={(e) => setFormData({ ...formData, startDay: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            종료일
          </label>
          <input
            type="date"
            value={formData.endDay}
            onChange={(e) => setFormData({ ...formData, endDay: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      {/* 유형 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          유형
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="textbook"
              checked={formData.type === 'textbook'}
              onChange={() => setFormData({ ...formData, type: 'textbook' })}
              className="mr-2"
            />
            교재
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="type"
              value="lecture"
              checked={formData.type === 'lecture'}
              onChange={() => setFormData({ ...formData, type: 'lecture' })}
              className="mr-2"
            />
            강의
          </label>
        </div>
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
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder={formData.type === 'textbook' ? '교재명을 입력하세요' : '강의명을 입력하세요'}
        />
      </div>

      {/* 분량 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            총 {formData.type === 'textbook' ? '페이지' : '강수'}
          </label>
          <input
            type="number"
            value={formData.total}
            onChange={(e) => setFormData({ ...formData, total: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            완료
          </label>
          <input
            type="number"
            value={formData.done}
            onChange={(e) => setFormData({ ...formData, done: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            min={0}
            max={formData.total}
          />
        </div>
      </div>

      {/* 진행률 표시 */}
      {formData.total > 0 && (
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>진행률</span>
            <span>{Math.round((formData.done / formData.total) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${(formData.done / formData.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          {plan ? '수정' : '추가'}
        </button>
      </div>
    </form>
  )
}
