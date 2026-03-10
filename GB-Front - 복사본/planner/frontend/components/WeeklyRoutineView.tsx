'use client'

import { useMemo } from 'react'
import {
  DAYS,
  SUBJECT_COLORS,
  ROUTINE_CATEGORY_COLORS,
  type Routine,
  type RoutineCategory,
  type AvailableStudyTime,
} from '../types'

interface WeeklyRoutineViewProps {
  routines: Routine[]
  onRoutineClick?: (routine: Routine) => void
  onEmptySlotClick?: (dayIndex: number, startTime: string) => void
  startHour?: number  // 시작 시간 (기본: 6)
  endHour?: number    // 종료 시간 (기본: 24)
  showStats?: boolean // 통계 표시 여부
}

// 30분 단위 시간 슬롯 생성
const generateTimeSlots = (startHour: number, endHour: number): string[] => {
  const slots: string[] = []
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`)
    slots.push(`${hour.toString().padStart(2, '0')}:30`)
  }
  return slots
}

// 시간을 분으로 변환
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// 분을 시간 문자열로 변환
const minutesToTimeString = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (hours === 0) return `${mins}분`
  if (mins === 0) return `${hours}시간`
  return `${hours}시간 ${mins}분`
}

export function WeeklyRoutineView({
  routines,
  onRoutineClick,
  onEmptySlotClick,
  startHour = 6,
  endHour = 24,
  showStats = true,
}: WeeklyRoutineViewProps) {
  const timeSlots = useMemo(() => generateTimeSlots(startHour, endHour), [startHour, endHour])

  // 요일별 루틴 그룹핑
  const routinesByDay = useMemo(() => {
    const byDay: Routine[][] = Array.from({ length: 7 }, () => [])
    
    routines.forEach(routine => {
      if (routine.repeat) {
        routine.days.forEach((active, dayIndex) => {
          if (active) {
            byDay[dayIndex].push(routine)
          }
        })
      }
    })
    
    // 시간순 정렬
    byDay.forEach(dayRoutines => {
      dayRoutines.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime))
    })
    
    return byDay
  }, [routines])

  // 학습 가능 시간 계산
  const availableStudyTime = useMemo((): AvailableStudyTime => {
    const totalDayMinutes = (endHour - startHour) * 60
    let totalFixedMinutes = 0
    const bySubject: Record<string, number> = {}
    const freeSlots: { startTime: string; endTime: string }[] = []

    // 전체 주 기준 계산
    routines.forEach(routine => {
      const duration = timeToMinutes(routine.endTime) - timeToMinutes(routine.startTime)
      const activeDays = routine.days.filter(Boolean).length

      if (routine.category === 'fixed') {
        totalFixedMinutes += duration * activeDays
      } else if (routine.category === 'study' && routine.subject) {
        bySubject[routine.subject] = (bySubject[routine.subject] || 0) + duration * activeDays
      }
    })

    // 총 학습 가능 시간 = 전체 시간 - 고정 일과
    const totalAvailable = (totalDayMinutes * 7) - totalFixedMinutes

    return {
      totalMinutes: totalAvailable,
      bySubject,
      freeSlots,
    }
  }, [routines, startHour, endHour])

  // 루틴이 특정 시간 슬롯에 있는지 확인
  const getRoutineAtSlot = (dayIndex: number, slotTime: string): Routine | null => {
    const slotMinutes = timeToMinutes(slotTime)
    return routinesByDay[dayIndex].find(routine => {
      const routineStart = timeToMinutes(routine.startTime)
      const routineEnd = timeToMinutes(routine.endTime)
      return slotMinutes >= routineStart && slotMinutes < routineEnd
    }) || null
  }

  // 루틴 시작 슬롯인지 확인
  const isRoutineStart = (dayIndex: number, slotTime: string): boolean => {
    return routinesByDay[dayIndex].some(routine => routine.startTime === slotTime)
  }

  // 루틴 높이 계산 (슬롯 개수)
  const getRoutineHeight = (routine: Routine): number => {
    const startMinutes = timeToMinutes(routine.startTime)
    const endMinutes = timeToMinutes(routine.endTime)
    return Math.ceil((endMinutes - startMinutes) / 30)
  }

  // 루틴 색상 가져오기
  const getRoutineColor = (routine: Routine): string => {
    if (routine.category === 'study' && routine.subject) {
      return SUBJECT_COLORS[routine.subject] || ROUTINE_CATEGORY_COLORS.study
    }
    return routine.color || ROUTINE_CATEGORY_COLORS[routine.category]
  }

  // 카테고리별 총 시간 계산
  const categoryStats = useMemo(() => {
    const stats: Record<RoutineCategory, number> = {
      fixed: 0,
      study: 0,
      rest: 0,
      other: 0,
    }

    routines.forEach(routine => {
      const duration = timeToMinutes(routine.endTime) - timeToMinutes(routine.startTime)
      const activeDays = routine.days.filter(Boolean).length
      stats[routine.category] += duration * activeDays
    })

    return stats
  }, [routines])

  return (
    <div className="space-y-4">
      {/* 통계 바 */}
      {showStats && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">주간 시간 배분</h3>
          
          {/* 카테고리별 시간 */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <StatCard 
              label="고정 일과" 
              value={minutesToTimeString(categoryStats.fixed)} 
              color={ROUTINE_CATEGORY_COLORS.fixed}
            />
            <StatCard 
              label="학습 시간" 
              value={minutesToTimeString(categoryStats.study)} 
              color={ROUTINE_CATEGORY_COLORS.study}
            />
            <StatCard 
              label="휴식" 
              value={minutesToTimeString(categoryStats.rest)} 
              color={ROUTINE_CATEGORY_COLORS.rest}
            />
            <StatCard 
              label="기타" 
              value={minutesToTimeString(categoryStats.other)} 
              color={ROUTINE_CATEGORY_COLORS.other}
            />
          </div>

          {/* 과목별 학습 시간 */}
          {Object.keys(availableStudyTime.bySubject).length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">과목별 주간 학습 시간</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(availableStudyTime.bySubject).map(([subject, minutes]) => (
                  <span
                    key={subject}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: SUBJECT_COLORS[subject] }}
                  >
                    {subject}: {minutesToTimeString(minutes)}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 타임테이블 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-gray-50">
                <th className="w-16 px-2 py-3 text-xs font-semibold text-gray-500 border-b border-r border-gray-100">
                  시간
                </th>
                {DAYS.map((day, index) => (
                  <th
                    key={day}
                    className={`px-2 py-3 text-sm font-semibold border-b border-gray-100 ${
                      index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-gray-700'
                    }`}
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((slot, slotIndex) => (
                <tr key={slot} className={slotIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}>
                  {/* 시간 라벨 */}
                  <td className="px-2 py-0 text-xs text-gray-400 border-r border-gray-100 text-center h-8">
                    {slot.endsWith(':00') ? slot : ''}
                  </td>
                  
                  {/* 각 요일 */}
                  {DAYS.map((_, dayIndex) => {
                    const routine = getRoutineAtSlot(dayIndex, slot)
                    const isStart = routine && isRoutineStart(dayIndex, slot)
                    
                    // 루틴 시작이 아닌 경우 (이미 위에서 렌더링됨)
                    if (routine && !isStart) {
                      return null
                    }
                    
                    // 루틴 시작인 경우
                    if (routine && isStart) {
                      const height = getRoutineHeight(routine)
                      const color = getRoutineColor(routine)
                      
                      return (
                        <td
                          key={`${dayIndex}-${slot}`}
                          rowSpan={height}
                          className="p-0.5 border-l border-gray-100"
                        >
                          <button
                            onClick={() => onRoutineClick?.(routine)}
                            className="w-full h-full rounded-lg p-1.5 text-left transition-all hover:opacity-90 hover:shadow-md"
                            style={{ 
                              backgroundColor: color,
                              minHeight: `${height * 32 - 4}px`
                            }}
                          >
                            <div className="text-xs font-medium text-white truncate">
                              {routine.title}
                            </div>
                            <div className="text-[10px] text-white/80">
                              {routine.startTime}-{routine.endTime}
                            </div>
                            {routine.category === 'study' && routine.subject && (
                              <div className="text-[10px] text-white/70 mt-0.5">
                                {routine.subject}
                              </div>
                            )}
                          </button>
                        </td>
                      )
                    }
                    
                    // 빈 슬롯
                    return (
                      <td
                        key={`${dayIndex}-${slot}`}
                        className="p-0.5 border-l border-gray-100 h-8"
                      >
                        <button
                          onClick={() => onEmptySlotClick?.(dayIndex, slot)}
                          className="w-full h-full rounded hover:bg-orange-50 transition-colors"
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 범례 */}
      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded" style={{ backgroundColor: ROUTINE_CATEGORY_COLORS.fixed }} />
          고정 일과
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded" style={{ backgroundColor: ROUTINE_CATEGORY_COLORS.study }} />
          학습 시간
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded" style={{ backgroundColor: ROUTINE_CATEGORY_COLORS.rest }} />
          휴식
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded" style={{ backgroundColor: ROUTINE_CATEGORY_COLORS.other }} />
          기타
        </span>
      </div>
    </div>
  )
}

// 통계 카드 컴포넌트
function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-center p-2 rounded-lg bg-gray-50">
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        <span className="text-xs text-gray-500">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-800">{value}</span>
    </div>
  )
}




