import { useMemo } from 'react'
import { WeeklyProgressChart } from '../WeeklyProgressChart'
import { SUBJECT_COLORS, type PlannerItem, type WeeklyProgress } from '../types'

interface ClassStatusProps {
  items: PlannerItem[]
  weeklyData: WeeklyProgress[]
}

export function ClassStatus({ items, weeklyData }: ClassStatusProps) {
  // 수업 항목만 필터링
  const classItems = useMemo(() => {
    return items.filter((item) => item.primaryType === '수업')
  }, [items])

  // 선생님별 통계
  const teacherStats = useMemo(() => {
    const stats: Record<string, { total: number; late: number; absent: number; avgProgress: number }> = {}

    classItems.forEach((item) => {
      const teacher = item.teacher || '미정'
      if (!stats[teacher]) {
        stats[teacher] = { total: 0, late: 0, absent: 0, avgProgress: 0 }
      }
      stats[teacher].total += 1
      stats[teacher].late += item.late || 0
      stats[teacher].absent += item.absent || 0
      stats[teacher].avgProgress += item.progress || 0
    })

    // 평균 계산
    Object.keys(stats).forEach((teacher) => {
      if (stats[teacher].total > 0) {
        stats[teacher].avgProgress = Math.round(stats[teacher].avgProgress / stats[teacher].total)
      }
    })

    return stats
  }, [classItems])

  // 전체 통계
  const totalStats = useMemo(() => {
    const total = classItems.length
    const totalLate = classItems.reduce((sum, item) => sum + (item.late || 0), 0)
    const totalAbsent = classItems.reduce((sum, item) => sum + (item.absent || 0), 0)
    const avgProgress = total > 0
      ? Math.round(classItems.reduce((sum, item) => sum + (item.progress || 0), 0) / total)
      : 0
    const attendanceRate = total > 0
      ? Math.round(((total - totalAbsent) / total) * 100)
      : 100

    return { total, totalLate, totalAbsent, avgProgress, attendanceRate }
  }, [classItems])

  return (
    <div className="space-y-6">
      {/* 전체 요약 */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm text-gray-500">전체 수업</p>
          <p className="mt-2 text-3xl font-bold text-orange-600">{totalStats.total}회</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm text-gray-500">출석률</p>
          <p className="mt-2 text-3xl font-bold text-green-600">{totalStats.attendanceRate}%</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm text-gray-500">지각</p>
          <p className="mt-2 text-3xl font-bold text-yellow-600">{totalStats.totalLate}회</p>
        </div>
        <div className="rounded-lg bg-white p-6 shadow">
          <p className="text-sm text-gray-500">결석</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{totalStats.totalAbsent}회</p>
        </div>
      </div>

      {/* 주간 성취도 차트 */}
      <WeeklyProgressChart data={weeklyData} type="수업" />

      {/* 선생님별 현황 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-bold">👨‍🏫 선생님별 수업 현황</h3>

        {Object.keys(teacherStats).length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            등록된 수업 일정이 없습니다.
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(teacherStats).map(([teacher, stats]) => (
              <div key={teacher} className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                      👨‍🏫
                    </div>
                    <div>
                      <p className="font-medium">{teacher} 선생님</p>
                      <p className="text-sm text-gray-500">총 {stats.total}회 수업</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-orange-600">{stats.avgProgress}%</p>
                    <p className="text-xs text-gray-500">평균 성취도</p>
                  </div>
                </div>
                <div className="mt-3 flex gap-4 text-sm">
                  <span className="text-yellow-600">지각 {stats.late}회</span>
                  <span className="text-red-600">결석 {stats.absent}회</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 최근 수업 목록 */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-bold">📋 최근 수업 일정</h3>

        {classItems.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            등록된 수업 일정이 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {classItems.slice(0, 5).map((item) => (
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
                      {item.subject} · {item.teacher || '미정'} 선생님 · {new Date(item.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {(item.late || 0) > 0 && (
                    <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs text-yellow-600">
                      지각
                    </span>
                  )}
                  {(item.absent || 0) > 0 && (
                    <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-600">
                      결석
                    </span>
                  )}
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
