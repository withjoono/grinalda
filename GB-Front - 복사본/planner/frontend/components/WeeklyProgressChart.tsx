'use client'

import { useMemo } from 'react'
import { DAYS, type WeeklyProgress } from '../types'

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
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-bold mb-4">
        {type === '학습' ? '📚' : '👨‍🏫'} 주간 {type} 성취도
      </h3>

      {/* 차트 */}
      <div className="flex items-end justify-between h-48 gap-2">
        {chartData.map((item, index) => (
          <div key={item.day} className="flex-1 flex flex-col items-center">
            {/* 막대 */}
            <div className="w-full flex flex-col items-center justify-end h-40">
              <span className="text-xs text-gray-600 mb-1">
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
            <span className="text-sm font-medium text-gray-700 mt-2">{item.day}</span>
          </div>
        ))}
      </div>

      {/* 평균 표시 */}
      <div className="mt-4 pt-4 border-t border-gray-200 text-center">
        <span className="text-sm text-gray-500">주간 평균: </span>
        <span className="text-lg font-bold">
          {Math.round(chartData.reduce((sum, d) => sum + d.value, 0) / 7)}%
        </span>
      </div>
    </div>
  )
}
