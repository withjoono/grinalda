import { useMemo } from 'react'
import { DAYS, type WeeklyProgress } from './types'

interface WeeklyProgressChartProps {
  data: WeeklyProgress[]
  type: '학습' | '수업'
}

export function WeeklyProgressChart({ data, type }: WeeklyProgressChartProps) {
  // 요일별 평균 성취도 계산
  const chartData = useMemo(() => {
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    return dayOrder.map((dayName, index) => {
      const dayData = data.find((d) => d.comnNm === dayName)
      return {
        day: DAYS[(index + 1) % 7], // 월=1, 화=2, ... 일=0
        value: dayData?.avgProgress || 0,
      }
    })
  }, [data])

  const maxValue = Math.max(...chartData.map((d) => d.value), 100)

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-bold">
        {type === '학습' ? '📚' : '👨‍🏫'} 주간 {type} 성취도
      </h3>

      {/* 차트 */}
      <div className="flex h-48 items-end justify-between gap-2">
        {chartData.map((item) => (
          <div key={item.day} className="flex flex-1 flex-col items-center">
            {/* 막대 */}
            <div className="flex h-40 w-full flex-col items-center justify-end">
              <span className="mb-1 text-xs text-gray-600">
                {Math.round(item.value)}%
              </span>
              <div
                className={`w-full max-w-8 rounded-t transition-all ${
                  type === '학습' ? 'bg-blue-500' : 'bg-orange-500'
                }`}
                style={{
                  height: `${(item.value / maxValue) * 100}%`,
                  minHeight: item.value > 0 ? '4px' : '0px',
                }}
              />
            </div>
            {/* 요일 라벨 */}
            <span className="mt-2 text-sm font-medium text-gray-700">{item.day}</span>
          </div>
        ))}
      </div>

      {/* 평균 표시 */}
      <div className="mt-4 border-t border-gray-200 pt-4 text-center">
        <span className="text-sm text-gray-500">주간 평균: </span>
        <span className="text-lg font-bold">
          {Math.round(chartData.reduce((sum, d) => sum + d.value, 0) / 7)}%
        </span>
      </div>
    </div>
  )
}
