import { useMemo } from 'react'
import { SUBJECT_COLORS, SUBJECT_ORDER, type Plan } from './types'

interface PlanListProps {
  plans: Plan[]
  onEdit?: (plan: Plan) => void
  onDelete?: (planId: number) => void
  onToggleComplete?: (planId: number, itemId: number, amount: number) => void
}

export function PlanList({ plans, onEdit, onDelete }: PlanListProps) {
  // 과목별로 그룹화 및 정렬
  const groupedPlans = useMemo(() => {
    const grouped: Record<string, Plan[]> = {}

    plans.forEach((plan) => {
      if (!grouped[plan.subject]) {
        grouped[plan.subject] = []
      }
      grouped[plan.subject].push(plan)
    })

    // 과목 순서대로 정렬
    return Object.entries(grouped).sort(
      ([a], [b]) => (SUBJECT_ORDER[a] || 99) - (SUBJECT_ORDER[b] || 99)
    )
  }, [plans])

  if (plans.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        등록된 계획이 없습니다.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {groupedPlans.map(([subject, subjectPlans]) => (
        <div key={subject} className="overflow-hidden rounded-lg bg-white shadow">
          {/* 과목 헤더 */}
          <div
            className="px-4 py-3 font-bold text-white"
            style={{ backgroundColor: SUBJECT_COLORS[subject] || '#6b7280' }}
          >
            {subject} ({subjectPlans.length}개)
          </div>

          {/* 계획 목록 */}
          <div className="divide-y divide-gray-100">
            {subjectPlans.map((plan) => {
              const progress = plan.total ? Math.round((plan.done / plan.total) * 100) : 0
              const range = Array.isArray(plan.range)
                ? plan.range
                : typeof plan.range === 'string'
                  ? plan.range.replace(/[[\]]/g, '').split(',').map((d) => new Date(d.trim()))
                  : [new Date(), new Date()]

              return (
                <div
                  key={plan.id}
                  className="p-4 transition-colors hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    {/* 계획 정보 */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{plan.title}</h3>
                      {plan.material && (
                        <p className="mt-1 text-sm text-gray-600">
                          {plan.type === 'textbook' ? '📚' : '🎬'} {plan.material}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-gray-400">
                        {range[0].toLocaleDateString()} ~ {range[1].toLocaleDateString()}
                      </p>
                    </div>

                    {/* 진행률 */}
                    <div className="ml-4 flex flex-col items-end">
                      {plan.total && plan.total > 0 && (
                        <>
                          <span className="text-sm font-medium">
                            {plan.done}/{plan.total}
                            <span className="ml-1 text-gray-400">
                              {plan.type === 'textbook' ? 'p' : '강'}
                            </span>
                          </span>
                          <div className="mt-1 h-2 w-24 rounded-full bg-gray-200">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${progress}%`,
                                backgroundColor: SUBJECT_COLORS[subject] || '#6b7280',
                              }}
                            />
                          </div>
                          <span className="mt-1 text-xs text-gray-400">{progress}%</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  {(onEdit || onDelete) && (
                    <div className="mt-3 flex justify-end gap-2 border-t border-gray-100 pt-3">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(plan)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          수정
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(plan.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
