import { useState } from 'react'
import { DAYS, type Routine } from './types'

interface RoutineFormProps {
  routine?: Routine
  onSubmit: (routine: Partial<Routine>) => void
  onCancel: () => void
}

export function RoutineForm({ routine, onSubmit, onCancel }: RoutineFormProps) {
  const [formData, setFormData] = useState({
    title: routine?.title || '',
    startTime: routine?.startTime || '09:00',
    endTime: routine?.endTime || '10:00',
    repeat: routine?.repeat ?? true,
    days: routine?.days || [false, true, true, true, true, true, false], // 월~금 기본
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...routine,
      title: formData.title,
      startTime: formData.startTime,
      endTime: formData.endTime,
      repeat: formData.repeat,
      days: formData.days,
    })
  }

  const toggleDay = (index: number) => {
    const newDays = [...formData.days]
    newDays[index] = !newDays[index]
    setFormData({ ...formData, days: newDays })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-bold">
        {routine ? '루틴 수정' : '새 루틴 추가'}
      </h2>

      {/* 제목 */}
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">
          루틴명
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="예: 아침 독서, 영단어 암기"
          required
        />
      </div>

      {/* 시간 */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            시작 시간
          </label>
          <input
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            종료 시간
          </label>
          <input
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      {/* 반복 여부 */}
      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.repeat}
            onChange={(e) => setFormData({ ...formData, repeat: e.target.checked })}
            className="mr-2 h-4 w-4 text-orange-500"
          />
          <span className="text-sm font-medium text-gray-700">매주 반복</span>
        </label>
      </div>

      {/* 요일 선택 */}
      {formData.repeat && (
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            반복 요일
          </label>
          <div className="flex gap-2">
            {DAYS.map((day, index) => (
              <button
                key={day}
                type="button"
                onClick={() => toggleDay(index)}
                className={`h-10 w-10 rounded-full text-sm font-medium transition-colors ${
                  formData.days[index]
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      )}

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
          {routine ? '수정' : '추가'}
        </button>
      </div>
    </form>
  )
}
