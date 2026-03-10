'use client'

import { useMemo } from 'react'
import {
  SUBJECT_COLORS,
  ROUTINE_CATEGORY_COLORS,
  type Routine,
  type DailyMission,
  type TimeSlot,
  type TimeSlotType,
} from '../types'

interface DailyTimelineProps {
  date: Date
  routines: Routine[]
  missions: DailyMission[]
  customSlots?: TimeSlot[]
  startHour?: number
  endHour?: number
  onSlotClick?: (slot: TimeSlot | null, time: string) => void
  onMissionClick?: (mission: DailyMission) => void
  currentTime?: Date // 현재 시간 표시용
}

// 시간을 분으로 변환
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

// 분을 시간 문자열로 변환
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60) % 24
  const mins = minutes % 60
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
}

export function DailyTimeline({
  date,
  routines,
  missions,
  customSlots = [],
  startHour = 6,
  endHour = 24,
  onSlotClick,
  onMissionClick,
  currentTime,
}: DailyTimelineProps) {
  const dayIndex = date.getDay() // 0 = 일요일

  // 오늘의 루틴 필터링
  const todayRoutines = useMemo(() => {
    return routines.filter(routine => routine.repeat && routine.days[dayIndex])
  }, [routines, dayIndex])

  // 타임라인 슬롯 생성 (15분 단위)
  const timelineSlots = useMemo(() => {
    const slots: {
      time: string
      type: TimeSlotType
      routine?: Routine
      mission?: DailyMission
      customSlot?: TimeSlot
    }[] = []

    for (let hour = startHour; hour < endHour; hour++) {
      for (let min = 0; min < 60; min += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
        const timeMinutes = hour * 60 + min

        // 루틴 확인
        const routine = todayRoutines.find(r => {
          const start = timeToMinutes(r.startTime)
          const end = timeToMinutes(r.endTime)
          return timeMinutes >= start && timeMinutes < end
        })

        // 미션 확인
        const mission = missions.find(m => {
          if (!m.startTime || !m.endTime) return false
          const start = timeToMinutes(m.startTime)
          const end = timeToMinutes(m.endTime)
          return timeMinutes >= start && timeMinutes < end
        })

        // 커스텀 슬롯 확인
        const customSlot = customSlots.find(s => {
          const start = timeToMinutes(s.startTime)
          const end = timeToMinutes(s.endTime)
          return timeMinutes >= start && timeMinutes < end
        })

        let type: TimeSlotType = 'free'
        if (routine) type = 'routine'
        else if (mission) type = 'mission'
        else if (customSlot) type = customSlot.type

        slots.push({ time, type, routine, mission, customSlot })
      }
    }

    return slots
  }, [todayRoutines, missions, customSlots, startHour, endHour])

  // 현재 시간 위치 계산
  const currentTimePosition = useMemo(() => {
    if (!currentTime) return null
    const now = currentTime.getHours() * 60 + currentTime.getMinutes()
    const startMinutes = startHour * 60
    const endMinutes = endHour * 60
    if (now < startMinutes || now > endMinutes) return null
    return ((now - startMinutes) / (endMinutes - startMinutes)) * 100
  }, [currentTime, startHour, endHour])

  // 슬롯 색상 가져오기
  const getSlotColor = (slot: typeof timelineSlots[0]): string => {
    if (slot.routine) {
      if (slot.routine.category === 'study' && slot.routine.subject) {
        return SUBJECT_COLORS[slot.routine.subject] || ROUTINE_CATEGORY_COLORS.study
      }
      return slot.routine.color || ROUTINE_CATEGORY_COLORS[slot.routine.category]
    }
    if (slot.mission) {
      return SUBJECT_COLORS[slot.mission.subject] || '#f97316'
    }
    return 'transparent'
  }

  // 시간 라벨 표시 여부
  const shouldShowTimeLabel = (time: string): boolean => {
    return time.endsWith(':00')
  }

  // 연속 블록 그룹핑
  const groupedBlocks = useMemo(() => {
    const blocks: {
      startTime: string
      endTime: string
      type: TimeSlotType
      routine?: Routine
      mission?: DailyMission
      color: string
    }[] = []

    let currentBlock: typeof blocks[0] | null = null

    timelineSlots.forEach((slot, index) => {
      const color = getSlotColor(slot)
      const isSameBlock = currentBlock && 
        currentBlock.type === slot.type &&
        currentBlock.color === color &&
        currentBlock.routine?.id === slot.routine?.id &&
        currentBlock.mission?.id === slot.mission?.id

      if (isSameBlock) {
        currentBlock!.endTime = minutesToTime(timeToMinutes(slot.time) + 15)
      } else {
        if (currentBlock && currentBlock.type !== 'free') {
          blocks.push(currentBlock)
        }
        currentBlock = {
          startTime: slot.time,
          endTime: minutesToTime(timeToMinutes(slot.time) + 15),
          type: slot.type,
          routine: slot.routine,
          mission: slot.mission,
          color,
        }
      }
    })

    if (currentBlock && currentBlock.type !== 'free') {
      blocks.push(currentBlock)
    }

    return blocks
  }, [timelineSlots])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-100 bg-gray-50">
        <h2 className="font-semibold text-gray-900">
          {date.toLocaleDateString('ko-KR', { 
            month: 'long', 
            day: 'numeric', 
            weekday: 'long' 
          })}
        </h2>
        <div className="flex gap-4 mt-2 text-sm text-gray-500">
          <span>미션: {missions.length}개</span>
          <span>완료: {missions.filter(m => m.status === 'completed').length}개</span>
        </div>
      </div>

      {/* 타임라인 */}
      <div className="relative p-4">
        {/* 현재 시간 표시 */}
        {currentTimePosition !== null && (
          <div 
            className="absolute left-0 right-0 z-10 pointer-events-none"
            style={{ top: `${currentTimePosition}%` }}
          >
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <div className="flex-1 h-0.5 bg-red-500" />
            </div>
          </div>
        )}

        {/* 시간 그리드 */}
        <div className="flex">
          {/* 시간 라벨 */}
          <div className="w-16 flex-shrink-0">
            {timelineSlots.filter((_, i) => i % 4 === 0).map((slot) => (
              <div 
                key={slot.time}
                className="h-16 flex items-start justify-end pr-3 text-xs text-gray-400"
              >
                {slot.time}
              </div>
            ))}
          </div>

          {/* 타임라인 바 */}
          <div className="flex-1 relative border-l border-gray-200">
            {/* 시간 구분선 */}
            {timelineSlots.filter((_, i) => i % 4 === 0).map((slot, index) => (
              <div 
                key={slot.time}
                className="absolute left-0 right-0 border-t border-gray-100"
                style={{ top: `${(index / (timelineSlots.length / 4)) * 100}%` }}
              />
            ))}

            {/* 블록들 */}
            {groupedBlocks.map((block, index) => {
              const startMinutes = timeToMinutes(block.startTime)
              const endMinutes = timeToMinutes(block.endTime)
              const dayStartMinutes = startHour * 60
              const dayEndMinutes = endHour * 60
              const dayTotalMinutes = dayEndMinutes - dayStartMinutes

              const top = ((startMinutes - dayStartMinutes) / dayTotalMinutes) * 100
              const height = ((endMinutes - startMinutes) / dayTotalMinutes) * 100

              return (
                <div
                  key={`${block.startTime}-${index}`}
                  className="absolute left-1 right-1 rounded-lg p-2 cursor-pointer transition-all hover:opacity-90 hover:shadow-md overflow-hidden"
                  style={{
                    top: `${top}%`,
                    height: `${height}%`,
                    backgroundColor: block.color,
                    minHeight: '24px',
                  }}
                  onClick={() => {
                    if (block.mission) {
                      onMissionClick?.(block.mission)
                    } else {
                      onSlotClick?.(null, block.startTime)
                    }
                  }}
                >
                  <div className="text-xs font-medium text-white truncate">
                    {block.routine?.title || block.mission?.title}
                  </div>
                  {height > 8 && (
                    <div className="text-[10px] text-white/80">
                      {block.startTime} - {block.endTime}
                    </div>
                  )}
                  {block.mission && height > 12 && (
                    <div className="text-[10px] text-white/70 mt-0.5">
                      성취도: {block.mission.achievement}%
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* 범례 */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex flex-wrap gap-3 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: ROUTINE_CATEGORY_COLORS.fixed }} />
            고정 일과
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: ROUTINE_CATEGORY_COLORS.study }} />
            학습
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded" style={{ backgroundColor: ROUTINE_CATEGORY_COLORS.rest }} />
            휴식
          </span>
          {Object.entries(SUBJECT_COLORS).slice(0, 4).map(([subject, color]) => (
            <span key={subject} className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded" style={{ backgroundColor: color }} />
              {subject}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}




