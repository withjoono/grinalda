import { useState } from 'react'
import { SUBJECTS, SUBJECT_COLORS, DAYS, type PlannerItem } from './types'

interface ScheduleFormProps {
  item?: PlannerItem
  onSubmit: (item: Partial<PlannerItem>) => void
  onCancel: () => void
}

export function ScheduleForm({ item, onSubmit, onCancel }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    primaryType: item?.primaryType || '학습' as const,
    subject: item?.subject || SUBJECTS[0],
    title: item?.title || '',
    teacher: item?.teacher || '',
    startDate: item?.startDate ? new Date(item.startDate).toISOString().slice(0, 16) : '',
    endDate: item?.endDate ? new Date(item.endDate).toISOString().slice(0, 16) : '',
    description: item?.description || '',
    progress: item?.progress || 0,
    // 반복 설정
    isRecurring: !!item?.rRule,
    repeatDays: [false, false, false, false, false, false, false] as boolean[],
    // 페이지/강의 범위
    startPage: item?.startPage || 0,
    endPage: item?.endPage || 0,
    startSession: item?.startSession || 0,
    endSession: item?.endSession || 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // RRule 생성 (간단한 주간 반복)
    let rRule: string | undefined
    if (formData.isRecurring && formData.repeatDays.some(Boolean)) {
      const dayMap = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA']
      const selectedDays = formData.repeatDays
        .map((selected, i) => (selected ? dayMap[i] : null))
        .filter(Boolean)
        .join(',')
      rRule = `FREQ=WEEKLY;BYDAY=${selectedDays}`
    }

    onSubmit({
      ...item,
      primaryType: formData.primaryType,
      subject: formData.subject,
      title: formData.title,
      teacher: formData.teacher,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      description: formData.description,
      progress: formData.progress,
      rRule,
      startPage: formData.startPage,
      endPage: formData.endPage,
      startSession: formData.startSession,
      endSession: formData.endSession,
    })
  }

  const toggleDay = (index: number) => {
    const newDays = [...formData.repeatDays]
    newDays[index] = !newDays[index]
    setFormData({ ...formData, repeatDays: newDays })
  }

  return (
    <form onSubmit={handleSubmit} className="max-h-[80vh] space-y-4 overflow-y-auto rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">
        {item ? '일정 수정' : '새 일정 추가'}
      </h2>

      {/* 유형 선택 (학습/수업) */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          유형
        </label>
        <div className="flex gap-4">
          {(['학습', '수업'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData({ ...formData, primaryType: type })}
              className={`flex-1 rounded-lg border-2 py-3 font-medium transition-colors ${
                formData.primaryType === type
                  ? 'border-orange-500 bg-orange-50 text-orange-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {type === '학습' ? '📚 학습' : '👨‍🏫 수업'}
            </button>
          ))}
        </div>
      </div>

      {/* 과목 선택 */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          과목
        </label>
        <div className="flex flex-wrap gap-2">
          {SUBJECTS.map((subject) => (
            <button
              key={subject}
              type="button"
              onClick={() => setFormData({ ...formData, subject })}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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

      {/* 제목 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {formData.primaryType === '수업' ? '수업명' : '학습 내용'}
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder={formData.primaryType === '수업' ? '수업명을 입력하세요' : '학습 내용을 입력하세요'}
          required
        />
      </div>

      {/* 선생님 (수업인 경우) */}
      {formData.primaryType === '수업' && (
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            선생님
          </label>
          <input
            type="text"
            value={formData.teacher}
            onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="선생님 이름"
          />
        </div>
      )}

      {/* 시간 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            시작
          </label>
          <input
            type="datetime-local"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            종료
          </label>
          <input
            type="datetime-local"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      {/* 반복 설정 */}
      <div>
        <label className="mb-2 flex items-center">
          <input
            type="checkbox"
            checked={formData.isRecurring}
            onChange={(e) => setFormData({ ...formData, isRecurring: e.target.checked })}
            className="mr-2 h-4 w-4 text-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">매주 반복</span>
        </label>

        {formData.isRecurring && (
          <div className="ml-6 flex gap-2">
            {DAYS.map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(index)}
                className={`h-9 w-9 rounded-full text-xs font-medium transition-colors ${
                  formData.repeatDays[index]
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 성취도 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          성취도: {formData.progress}%
        </label>
        <input
          type="range"
          value={formData.progress}
          onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
          min={0}
          max={100}
          step={10}
        />
      </div>

      {/* 메모 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          메모
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={3}
          placeholder="추가 메모를 입력하세요"
        />
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-300 px-6 py-2 hover:bg-gray-50"
        >
          취소
        </button>
        <button
          type="submit"
          className="rounded-lg bg-orange-500 px-6 py-2 text-white hover:bg-orange-600"
        >
          {item ? '수정' : '추가'}
        </button>
      </div>
    </form>
  )
}
