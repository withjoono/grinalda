import { useMemo } from 'react'
import { WeeklyProgressChart } from '../WeeklyProgressChart'
import { SUBJECT_COLORS, type PlannerItem, type WeeklyProgress } from '../types'

interface LearningStatusProps {
  items: PlannerItem[]
  weeklyData: WeeklyProgress[]
}

export function LearningStatus({ items, weeklyData }: LearningStatusProps) {
  // 학습 항목만 필터링
  const learningItems = useMemo(() => {
    return items.filter((item) => item.primaryType === '학습')
  }, [items])

  // 과목별 통계
  const subjectStats = useMemo(() => {
    const stats: Record<string, { total: number; completed: number; avgProgress: number }> = {}

    learningItems.forEach((item) => {
      if (!stats[item.subject]) {
        stats[item.subject] = { total: 0, completed: 0, avgProgress: 0 }
      }
      stats[item.subject].total += 1
      if (item.progress && item.progress >= 100) {
        stats[item.subject].completed += 1
      }
      stats[item.subject].avgProgress += item.progress || 0
    })

    // 평균 계산
    Object.keys(stats).forEach((subject) => {
      if (stats[subject].total > 0) {
        stats[subject].avgProgress = Math.round(stats[subject].avgProgress / stats[subject].total)
      }
    })

    return stats
  }, [learningItems])

  // 전체 통계
  const totalStats = useMemo(() => {
    const total = learningItems.length
    const completed = learningItems.filter((item) => (item.progress || 0) >= 100).length
    const avgProgress = total > 0
      ? Math.round(learningItems.reduce((sum, item) => sum + (item.progress || 0), 0) / total)
      : 0

    return { total, completed, avgProgress }
  }, [learningItems])

  return (
    <div className="space-y-6">
      {/* 전체 요약 */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm text-gray-500">전체 학습</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{totalStats.total}개</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm text-gray-500">완료</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{totalStats.completed}개</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm text-gray-500">평균 성취도</p>
          <p className="mt-2 text-3xl font-bold text-orange-600">{totalStats.avgProgress}%</p>
        </div>
      </div>

      {/* 주간 성취도 차트 */}
      <WeeklyProgressChart data={weeklyData} type="학습" />

      {/* 과목별 현황 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-bold">📚 과목별 학습 현황</h3>

        {Object.keys(subjectStats).length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            등록된 학습 일정이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(subjectStats).map(([subject, stats]) => (
              <div key={subject} className="flex items-center gap-4">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg text-white text-sm font-bold"
                  style={{ backgroundColor: SUBJECT_COLORS[subject] || '#6b7280' }}
                >
                  {subject.slice(0, 2)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{subject}</span>
                    <span className="text-sm text-gray-500">
                      {stats.completed}/{stats.total} 완료
                    </span>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${stats.avgProgress}%`,
                        backgroundColor: SUBJECT_COLORS[subject] || '#6b7280',
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium">{stats.avgProgress}%</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 최근 학습 목록 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-bold">📋 최근 학습 일정</h3>

        {learningItems.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            등록된 학습 일정이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {learningItems.slice(0, 5).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 p-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: SUBJECT_COLORS[item.subject] || '#6b7280' }}
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-sm text-gray-500">
                      {item.subject} · {new Date(item.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-medium ${
                      (item.progress || 0) >= 100
                        ? 'text-green-600'
                        : (item.progress || 0) >= 50
                          ? 'text-orange-600'
                          : 'text-gray-600'
                    }`}
                  >
                    {item.progress || 0}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
