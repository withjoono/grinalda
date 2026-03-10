import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SUBJECT_COLORS, type PlannerItem } from './types'

type ViewType = 'month' | 'week' | 'day'

interface CalendarViewProps {
  events?: PlannerItem[]
  onDateClick?: (date: Date) => void
  onEventClick?: (event: PlannerItem) => void
  onAddEvent?: (date: Date, hour?: number) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토']

export function CalendarView({ events = [], onDateClick, onEventClick, onAddEvent }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewType, setViewType] = useState<ViewType>('week')

  // 오늘로 이동
  const goToToday = () => setCurrentDate(new Date())

  // 이전/다음 이동
  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    } else if (viewType === 'week') {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7))
    } else {
      newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1))
    }
    setCurrentDate(newDate)
  }

  // 헤더 날짜 포맷
  const headerTitle = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth() + 1
    const day = currentDate.getDate()

    if (viewType === 'month') {
      return `${year}년 ${month}월`
    } else if (viewType === 'week') {
      const weekStart = getWeekStart(currentDate)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)

      if (weekStart.getMonth() === weekEnd.getMonth()) {
        return `${year}년 ${month}월 ${weekStart.getDate()}일 - ${weekEnd.getDate()}일`
      } else {
        return `${year}년 ${weekStart.getMonth() + 1}월 ${weekStart.getDate()}일 - ${weekEnd.getMonth() + 1}월 ${weekEnd.getDate()}일`
      }
    } else {
      return `${year}년 ${month}월 ${day}일`
    }
  }, [currentDate, viewType])

  return (
    <div className="flex h-[700px] flex-col rounded-lg bg-white shadow">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-4">
          <button
            onClick={goToToday}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            오늘
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigate('prev')}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigate('next')}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <h2 className="text-xl font-semibold">{headerTitle}</h2>
        </div>

        <div className="flex items-center gap-2">
          {/* 뷰 선택 드롭다운 */}
          <select
            value={viewType}
            onChange={(e) => setViewType(e.target.value as ViewType)}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="month">월</option>
            <option value="week">주</option>
            <option value="day">일</option>
          </select>
        </div>
      </div>

      {/* 캘린더 본문 */}
      <div className="flex-1 overflow-auto">
        {viewType === 'month' && (
          <MonthView
            currentDate={currentDate}
            events={events}
            onDateClick={onDateClick}
            onEventClick={onEventClick}
          />
        )}
        {viewType === 'week' && (
          <WeekView
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
            onAddEvent={onAddEvent}
          />
        )}
        {viewType === 'day' && (
          <DayView
            currentDate={currentDate}
            events={events}
            onEventClick={onEventClick}
            onAddEvent={onAddEvent}
          />
        )}
      </div>
    </div>
  )
}

// 주의 시작일 (일요일) 구하기
function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  return d
}

// 월 뷰
function MonthView({
  currentDate,
  events,
  onDateClick,
  onEventClick,
}: {
  currentDate: Date
  events: PlannerItem[]
  onDateClick?: (date: Date) => void
  onEventClick?: (event: PlannerItem) => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const { weeks } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    const weeks: Date[][] = []
    let week: Date[] = []

    // 첫 주 시작 전 빈 날짜 채우기
    const startDay = firstDay.getDay()
    for (let i = 0; i < startDay; i++) {
      const d = new Date(year, month, 1 - startDay + i)
      week.push(d)
    }

    // 날짜 채우기
    for (let day = 1; day <= lastDay.getDate(); day++) {
      week.push(new Date(year, month, day))
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }

    // 마지막 주 빈 날짜 채우기
    if (week.length > 0) {
      const remaining = 7 - week.length
      for (let i = 1; i <= remaining; i++) {
        week.push(new Date(year, month + 1, i))
      }
      weeks.push(week)
    }

    return { weeks }
  }, [currentDate])

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate)
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      )
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b bg-gray-50">
        {DAYS_KR.map((day, i) => (
          <div
            key={day}
            className={`py-2 text-center text-sm font-medium ${
              i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-700'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="flex-1">
        {weeks.map((week, weekIdx) => (
          <div key={weekIdx} className="grid h-[calc(100%/6)] grid-cols-7 border-b last:border-b-0">
            {week.map((date, dayIdx) => {
              const isToday = date.getTime() === today.getTime()
              const isCurrentMonth = date.getMonth() === currentDate.getMonth()
              const dayEvents = getEventsForDate(date)

              return (
                <div
                  key={dayIdx}
                  onClick={() => onDateClick?.(date)}
                  className={`cursor-pointer border-r p-1 last:border-r-0 hover:bg-gray-50 ${
                    !isCurrentMonth ? 'bg-gray-50' : ''
                  }`}
                >
                  <div
                    className={`mb-1 flex h-7 w-7 items-center justify-center text-sm ${
                      isToday
                        ? 'rounded-full bg-orange-500 font-bold text-white'
                        : !isCurrentMonth
                          ? 'text-gray-400'
                          : dayIdx === 0
                            ? 'text-red-500'
                            : dayIdx === 6
                              ? 'text-blue-500'
                              : ''
                    }`}
                  >
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEventClick?.(event)
                        }}
                        className="truncate rounded px-1 text-xs text-white"
                        style={{ backgroundColor: SUBJECT_COLORS[event.subject] || '#6b7280' }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-xs text-gray-500">+{dayEvents.length - 3}개</div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// 주 뷰
function WeekView({
  currentDate,
  events,
  onEventClick,
  onAddEvent,
}: {
  currentDate: Date
  events: PlannerItem[]
  onEventClick?: (event: PlannerItem) => void
  onAddEvent?: (date: Date, hour?: number) => void
}) {
  const today = new Date()
  const weekStart = getWeekStart(currentDate)

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      return d
    })
  }, [weekStart])

  const getEventsForDateAndHour = (date: Date, hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate)
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate() &&
        eventDate.getHours() === hour
      )
    })
  }

  const isToday = (date: Date) => {
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    )
  }

  return (
    <div className="flex h-full flex-col">
      {/* 요일 헤더 */}
      <div className="flex border-b bg-gray-50">
        <div className="w-16 shrink-0 border-r py-2 text-center text-xs text-gray-500">
          GMT+09
        </div>
        {weekDays.map((date, i) => (
          <div
            key={i}
            className={`flex-1 border-r py-2 text-center last:border-r-0 ${
              isToday(date) ? 'bg-orange-50' : ''
            }`}
          >
            <div className={`text-xs ${i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-500'}`}>
              {DAYS_KR[i]}
            </div>
            <div
              className={`mx-auto mt-1 flex h-10 w-10 items-center justify-center text-xl font-medium ${
                isToday(date) ? 'rounded-full bg-orange-500 text-white' : ''
              }`}
            >
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* 시간 그리드 */}
      <div className="flex-1 overflow-y-auto">
        {HOURS.map((hour) => (
          <div key={hour} className="flex border-b">
            <div className="w-16 shrink-0 border-r py-2 pr-2 text-right text-xs text-gray-500">
              {hour < 12 ? `AM ${hour || 12}시` : `PM ${hour === 12 ? 12 : hour - 12}시`}
            </div>
            {weekDays.map((date, dayIdx) => {
              const hourEvents = getEventsForDateAndHour(date, hour)
              return (
                <div
                  key={dayIdx}
                  onClick={() => onAddEvent?.(date, hour)}
                  className={`h-12 flex-1 cursor-pointer border-r last:border-r-0 hover:bg-gray-50 ${
                    isToday(date) ? 'bg-orange-50/30' : ''
                  }`}
                >
                  {hourEvents.map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick?.(event)
                      }}
                      className="m-0.5 cursor-pointer truncate rounded px-1 py-0.5 text-xs text-white"
                      style={{ backgroundColor: SUBJECT_COLORS[event.subject] || '#6b7280' }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

// 일 뷰
function DayView({
  currentDate,
  events,
  onEventClick,
  onAddEvent,
}: {
  currentDate: Date
  events: PlannerItem[]
  onEventClick?: (event: PlannerItem) => void
  onAddEvent?: (date: Date, hour?: number) => void
}) {
  const today = new Date()
  const isToday =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getDate() === today.getDate()

  const getEventsForHour = (hour: number) => {
    return events.filter((event) => {
      const eventDate = new Date(event.startDate)
      return (
        eventDate.getFullYear() === currentDate.getFullYear() &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getDate() === currentDate.getDate() &&
        eventDate.getHours() === hour
      )
    })
  }

  return (
    <div className="flex h-full flex-col">
      {/* 요일 헤더 */}
      <div className="flex border-b bg-gray-50">
        <div className="w-16 shrink-0 border-r py-2 text-center text-xs text-gray-500">
          GMT+09
        </div>
        <div className={`flex-1 py-2 text-center ${isToday ? 'bg-orange-50' : ''}`}>
          <div className={`text-xs ${currentDate.getDay() === 0 ? 'text-red-500' : currentDate.getDay() === 6 ? 'text-blue-500' : 'text-gray-500'}`}>
            {DAYS_KR[currentDate.getDay()]}
          </div>
          <div
            className={`mx-auto mt-1 flex h-10 w-10 items-center justify-center text-xl font-medium ${
              isToday ? 'rounded-full bg-orange-500 text-white' : ''
            }`}
          >
            {currentDate.getDate()}
          </div>
        </div>
      </div>

      {/* 시간 그리드 */}
      <div className="flex-1 overflow-y-auto">
        {HOURS.map((hour) => {
          const hourEvents = getEventsForHour(hour)
          return (
            <div key={hour} className="flex border-b">
              <div className="w-16 shrink-0 border-r py-2 pr-2 text-right text-xs text-gray-500">
                {hour < 12 ? `AM ${hour || 12}시` : `PM ${hour === 12 ? 12 : hour - 12}시`}
              </div>
              <div
                onClick={() => onAddEvent?.(currentDate, hour)}
                className={`h-12 flex-1 cursor-pointer hover:bg-gray-50 ${
                  isToday ? 'bg-orange-50/30' : ''
                }`}
              >
                {hourEvents.map((event) => (
                  <div
                    key={event.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      onEventClick?.(event)
                    }}
                    className="m-0.5 cursor-pointer truncate rounded px-2 py-1 text-sm text-white"
                    style={{ backgroundColor: SUBJECT_COLORS[event.subject] || '#6b7280' }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
