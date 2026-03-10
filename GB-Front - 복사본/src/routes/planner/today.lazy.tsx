/**
 * 오늘의 플래너 페이지
 */

import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { 
  CheckCircle, 
  Circle, 
  Clock, 
  BookOpen, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight,
  ArrowLeft,
  Star,
  MessageSquare,
} from 'lucide-react'
import { 
  useGetPlannerItems, 
  useUpdateAchievement,
  useCompleteMission,
  IPlannerItem,
} from '@/stores/server/features/planner'
import { 
  usePlannerStore, 
  useSelectedDateAsDate,
  useSelectedDateString,
  useIsToday,
} from '@/stores/client/use-planner-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { toast } from 'sonner'

export const Route = createLazyFileRoute('/planner/today')({
  component: PlannerTodayPage,
})

// ============================================
// 상수
// ============================================

const SUBJECT_COLORS: Record<string, string> = {
  국어: '#ef4444',
  수학: '#eab308',
  영어: '#f97316',
  사회: '#3b82f6',
  과학: '#14b8a6',
  한국사: '#a855f7',
}

// ============================================
// 일간 캘린더 컴포넌트
// ============================================

function DailyCalendar({ items }: { items: IPlannerItem[] }) {
  const { selectedDate, goToPrevDay, goToNextDay, goToToday } = usePlannerStore()
  const isToday = useIsToday()
  
  const date = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day)
  const DAYS_KR = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  const HOURS = Array.from({ length: 24 }, (_, i) => i)
  const dayOfWeek = date.getDay()

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const currentPosition = (currentMinutes / (24 * 60)) * 100

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
  }, [items])

  const getItemPosition = (item: IPlannerItem) => {
    const startDate = new Date(item.startDate)
    const endDate = new Date(item.endDate)
    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes()
    const endMinutes = endDate.getHours() * 60 + endDate.getMinutes()
    const top = (startMinutes / (24 * 60)) * 100
    const height = ((endMinutes - startMinutes) / (24 * 60)) * 100
    return { top, height: Math.max(height, 2) }
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <button onClick={goToPrevDay} className="rounded-full p-2 hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <span
                className={`text-4xl font-bold ${
                  isToday ? 'text-ultrasonic-500'
                    : dayOfWeek === 0 ? 'text-red-500'
                    : dayOfWeek === 6 ? 'text-blue-500'
                    : 'text-gray-900'
                }`}
              >
                {date.getDate()}
              </span>
              <div className="flex flex-col">
                <span className="text-sm text-gray-500">
                  {date.getFullYear()}년 {date.getMonth() + 1}월
                </span>
                <span
                  className={`text-sm font-medium ${
                    dayOfWeek === 0 ? 'text-red-500'
                    : dayOfWeek === 6 ? 'text-blue-500'
                    : 'text-gray-700'
                  }`}
                >
                  {DAYS_KR[dayOfWeek]}
                </span>
              </div>
            </div>
            {!isToday && (
              <button
                onClick={goToToday}
                className="mt-2 rounded-full bg-ultrasonic-100 px-3 py-1 text-xs font-medium text-ultrasonic-600 hover:bg-ultrasonic-200"
              >
                오늘로 이동
              </button>
            )}
            {isToday && (
              <span className="mt-2 rounded-full bg-ultrasonic-500 px-3 py-1 text-xs font-medium text-white">
                오늘
              </span>
            )}
          </div>

          <button onClick={goToNextDay} className="rounded-full p-2 hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* 24시간 타임라인 */}
        <div className="flex">
          <div className="w-10 flex-shrink-0">
            <div className="relative h-[480px]">
              {HOURS.filter(h => h % 2 === 0).map((hour) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 text-right pr-2 text-xs text-gray-400"
                  style={{ top: `${(hour / 24) * 100}%`, transform: 'translateY(-50%)' }}
                >
                  {hour.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative h-[480px] bg-gray-50 rounded-lg border border-gray-200">
            {HOURS.map((hour) => (
              <div
                key={hour}
                className={`absolute left-0 right-0 border-t ${hour % 2 === 0 ? 'border-gray-200' : 'border-gray-100'}`}
                style={{ top: `${(hour / 24) * 100}%` }}
              />
            ))}

            {isToday && (
              <div
                className="absolute left-0 right-0 h-0.5 bg-ultrasonic-500 z-20"
                style={{ top: `${currentPosition}%` }}
              >
                <div className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-ultrasonic-500" />
              </div>
            )}

            {sortedItems.map((item) => {
              const pos = getItemPosition(item)
              const isCompleted = item.progress >= 100
              const color = SUBJECT_COLORS[item.subject || ''] || '#6b7280'
              
              return (
                <div
                  key={item.id}
                  className={`absolute left-1 right-1 rounded border-l-2 px-2 py-0.5 text-xs shadow-sm overflow-hidden z-10 ${
                    isCompleted
                      ? 'bg-gray-200 border-gray-400 text-gray-500'
                      : item.primaryType === '학습'
                        ? 'bg-blue-100 border-blue-500 text-blue-800'
                        : 'bg-green-100 border-green-500 text-green-800'
                  }`}
                  style={{
                    top: `${pos.top}%`,
                    height: `${pos.height}%`,
                    minHeight: '24px',
                    borderLeftColor: color,
                  }}
                  title={`${item.title} (${formatTime(item.startDate)}-${formatTime(item.endDate)})`}
                >
                  <div className="truncate font-medium">{item.title}</div>
                  {pos.height > 3 && (
                    <div className="text-[10px] opacity-70">
                      {formatTime(item.startDate)} - {formatTime(item.endDate)}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="w-10 flex-shrink-0">
            <div className="relative h-[480px]">
              {HOURS.filter(h => h % 2 === 0).map((hour) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 pl-2 text-xs text-gray-400"
                  style={{ top: `${(hour / 24) * 100}%`, transform: 'translateY(-50%)' }}
                >
                  {hour.toString().padStart(2, '0')}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 미션 아이템 컴포넌트
// ============================================

function MissionItem({ item }: { item: IPlannerItem }) {
  const updateMutation = useUpdateAchievement()
  const completeMutation = useCompleteMission()
  
  const isCompleted = item.progress >= 100
  const color = SUBJECT_COLORS[item.subject || ''] || '#6b7280'

  const handleProgressChange = async (value: number[]) => {
    try {
      await updateMutation.mutateAsync({
        itemId: item.id,
        progress: value[0],
      })
    } catch {
      toast.error('성취도 저장에 실패했습니다')
    }
  }

  const handleComplete = async () => {
    if (isCompleted) return
    try {
      await completeMutation.mutateAsync(item.id)
    } catch {
      toast.error('완료 처리에 실패했습니다')
    }
  }

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })
  }

  return (
    <Card className={`transition-all ${isCompleted ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* 완료 체크 */}
          <button onClick={handleComplete} className="flex-shrink-0 mt-1">
            {isCompleted ? (
              <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
              <Circle className="h-6 w-6 text-gray-300 hover:text-ultrasonic-500" />
            )}
          </button>

          {/* 아이콘 */}
          <div className="flex-shrink-0">
            {item.primaryType === '학습' ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <GraduationCap className="h-5 w-5 text-green-600" />
              </div>
            )}
          </div>

          {/* 내용 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span 
                className="text-xs font-medium px-2 py-0.5 rounded text-white"
                style={{ backgroundColor: color }}
              >
                {item.subject}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded ${
                item.primaryType === '학습'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-green-100 text-green-600'
              }`}>
                {item.primaryType}
              </span>
            </div>
            <h3 className={`font-medium mt-1 ${isCompleted ? 'line-through text-gray-400' : 'text-gray-900'}`}>
              {item.title}
            </h3>
            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span>{formatTime(item.startDate)} - {formatTime(item.endDate)}</span>
              {item.teacher && <span>· {item.teacher} 선생님</span>}
            </div>

            {/* 성취도 슬라이더 */}
            {!isCompleted && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-500">성취도</span>
                  <span className="font-medium" style={{ color }}>{item.progress ?? 0}%</span>
                </div>
                <Slider
                  value={[item.progress ?? 0]}
                  onValueCommit={handleProgressChange}
                  max={100}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between mt-1 gap-1">
                  {[0, 25, 50, 75, 100].map((v) => (
                    <button
                      key={v}
                      onClick={() => handleProgressChange([v])}
                      className={`text-xs px-2 py-1 rounded ${
                        item.progress === v
                          ? 'bg-ultrasonic-500 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {v}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 멘토 피드백 */}
            {item.mentorRank && (
              <div className="mt-3 p-3 rounded-lg bg-ultrasonic-50 border border-ultrasonic-100">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-ultrasonic-500" />
                  <span className="text-sm font-medium text-ultrasonic-700">멘토 피드백</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-3.5 w-3.5 ${
                          star <= item.mentorRank! ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                {item.mentorDesc && (
                  <p className="mt-1 text-sm text-ultrasonic-600">{item.mentorDesc}</p>
                )}
              </div>
            )}
          </div>

          {/* 성취도 표시 */}
          <div className="text-right">
            <div className="text-2xl font-bold" style={{ color: isCompleted ? '#22c55e' : color }}>
              {item.progress ?? 0}%
            </div>
            {isCompleted && (
              <span className="text-xs text-green-500 font-medium">완료!</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 메인 페이지 컴포넌트
// ============================================

function PlannerTodayPage() {
  const { data: allItems, isLoading } = useGetPlannerItems()
  const dateString = useSelectedDateString()
  const selectedDate = useSelectedDateAsDate()

  // 선택된 날짜의 아이템만 필터링
  const items = useMemo(() => {
    if (!allItems) return []
    return allItems.filter(item => {
      const itemDate = new Date(item.startDate).toISOString().split('T')[0]
      return itemDate === dateString
    })
  }, [allItems, dateString])

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => 
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    )
  }, [items])

  // 통계
  const completedCount = items.filter(i => i.progress >= 100).length
  const totalCount = items.length
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0
  const avgProgress = totalCount > 0 
    ? Math.round(items.reduce((sum, i) => sum + (i.progress || 0), 0) / totalCount)
    : 0

  const formattedDate = selectedDate.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-[550px] w-full rounded-xl mb-6" />
        <Skeleton className="h-32 w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center gap-4">
        <Link to="/planner" className="rounded-lg p-2 hover:bg-gray-100">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold">금일 할일</h1>
          <p className="mt-1 text-gray-500">{formattedDate}</p>
        </div>
      </div>

      {/* 일간 캘린더 */}
      <DailyCalendar items={items} />

      {/* 진행률 카드 */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">오늘의 진행률</p>
              <p className="mt-1 text-3xl font-bold text-ultrasonic-600">{avgProgress}%</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">완료</p>
              <p className="mt-1 text-2xl font-semibold">
                <span className="text-green-600">{completedCount}</span>
                <span className="text-gray-400"> / {totalCount}</span>
              </p>
            </div>
          </div>
          <Progress value={progressPercent} className="mt-4 h-3" />
        </CardContent>
      </Card>

      {/* 할일 목록 */}
      <div className="space-y-3">
        {sortedItems.map((item) => (
          <MissionItem key={item.id} item={item} />
        ))}
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">이 날에 등록된 할일이 없습니다.</p>
            <Link to="/planner">
              <Button variant="outline">플래너로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
