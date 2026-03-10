/**
 * 주간 루틴 설정 페이지
 */

import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus, ArrowLeft, Loader2 } from 'lucide-react'
import { 
  useGetRoutines, 
  useCreateRoutine, 
  useUpdateRoutine, 
  useDeleteRoutine,
  IRoutine,
  ICreateRoutineRequest,
  RoutineCategory,
} from '@/stores/server/features/planner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createLazyFileRoute('/planner/routine')({
  component: PlannerRoutinePage,
})

// ============================================
// 상수
// ============================================

const ROUTINE_COLORS: Record<RoutineCategory, { bg: string; border: string; text: string }> = {
  fixed: { bg: 'bg-slate-400', border: 'border-slate-500', text: 'text-slate-600' },
  study: { bg: 'bg-blue-400', border: 'border-blue-500', text: 'text-blue-600' },
  rest: { bg: 'bg-green-400', border: 'border-green-500', text: 'text-green-600' },
  other: { bg: 'bg-purple-400', border: 'border-purple-500', text: 'text-purple-600' },
}

const CATEGORY_LABELS: Record<RoutineCategory, string> = {
  fixed: '고정일과',
  study: '학습',
  rest: '휴식',
  other: '기타',
}

const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토']

const SUBJECTS = ['국어', '수학', '영어', '사회', '과학', '한국사', '제2외국어', '기타']

// ============================================
// 주간 캘린더 컴포넌트
// ============================================

function WeeklyCalendar({ routines }: { routines: IRoutine[] }) {
  const [weekStart, setWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const start = new Date(today)
    start.setDate(today.getDate() - dayOfWeek)
    start.setHours(0, 0, 0, 0)
    return start
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const HOURS = Array.from({ length: 24 }, (_, i) => i)

  const navigate = (direction: 'prev' | 'next') => {
    const newStart = new Date(weekStart)
    newStart.setDate(newStart.getDate() + (direction === 'next' ? 7 : -7))
    setWeekStart(newStart)
  }

  const weekDays = useMemo(() => {
    const days: Date[] = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart)
      day.setDate(weekStart.getDate() + i)
      days.push(day)
    }
    return days
  }, [weekStart])

  const weekEnd = weekDays[6]

  const formatDate = (date: Date) => `${date.getMonth() + 1}월 ${date.getDate()}일`

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  const getRoutinePosition = (routine: IRoutine) => {
    const startMinutes = timeToMinutes(routine.startTime)
    const endMinutes = timeToMinutes(routine.endTime)
    const top = (startMinutes / (24 * 60)) * 100
    const height = ((endMinutes - startMinutes) / (24 * 60)) * 100
    return { top, height: Math.max(height, 2) }
  }

  const getRoutineColor = (routine: IRoutine) => {
    return ROUTINE_COLORS[routine.category || 'other']
  }

  const getRoutinesForDay = (dayIndex: number) => {
    return routines.filter(r => r.days[dayIndex])
  }

  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const currentPosition = (currentMinutes / (24 * 60)) * 100

  // 학습 시간 통계 계산
  const studyStats = useMemo(() => {
    const stats = { total: 0, byDay: Array(7).fill(0) }
    
    routines.forEach(routine => {
      if (routine.category === 'study') {
        const duration = timeToMinutes(routine.endTime) - timeToMinutes(routine.startTime)
        routine.days.forEach((isActive, dayIdx) => {
          if (isActive) {
            stats.byDay[dayIdx] += duration
            stats.total += duration
          }
        })
      }
    })
    
    return stats
  }, [routines])

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        {/* 헤더 */}
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => navigate('prev')}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold">
            {formatDate(weekStart)} ~ {formatDate(weekEnd)}
          </h3>
          <button
            onClick={() => navigate('next')}
            className="rounded-full p-1 hover:bg-gray-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* 주간 타임라인 */}
        <div className="flex">
          {/* 시간 라벨 (왼쪽) */}
          <div className="w-10 flex-shrink-0">
            <div className="h-12" />
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

          {/* 요일 컬럼들 */}
          <div className="flex-1 grid grid-cols-7 gap-0.5">
            {/* 요일 헤더 */}
            {weekDays.map((date, idx) => {
              const isToday = date.getTime() === today.getTime()
              const studyHours = Math.round(studyStats.byDay[idx] / 60 * 10) / 10
              return (
                <div
                  key={`header-${idx}`}
                  className={`h-12 flex flex-col items-center justify-center rounded-t-lg ${
                    isToday ? 'bg-ultrasonic-500 text-white' : 'bg-gray-100'
                  }`}
                >
                  <span
                    className={`text-xs font-medium ${
                      isToday
                        ? 'text-white'
                        : idx === 0
                          ? 'text-red-500'
                          : idx === 6
                            ? 'text-blue-500'
                            : 'text-gray-500'
                    }`}
                  >
                    {DAYS_KR[idx]}
                  </span>
                  <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-gray-900'}`}>
                    {date.getDate()}
                  </span>
                  {studyHours > 0 && (
                    <span className={`text-[10px] ${isToday ? 'text-ultrasonic-200' : 'text-blue-500'}`}>
                      {studyHours}h 학습
                    </span>
                  )}
                </div>
              )
            })}

            {/* 타임라인 그리드 */}
            {weekDays.map((date, dayIdx) => {
              const isToday = date.getTime() === today.getTime()
              const dayRoutines = getRoutinesForDay(dayIdx)

              return (
                <div
                  key={`timeline-${dayIdx}`}
                  className={`relative h-[480px] border-l border-gray-200 ${
                    isToday ? 'bg-ultrasonic-50' : 'bg-gray-50'
                  }`}
                >
                  {HOURS.map((hour) => (
                    <div
                      key={hour}
                      className="absolute left-0 right-0 border-t border-gray-100"
                      style={{ top: `${(hour / 24) * 100}%` }}
                    />
                  ))}

                  {isToday && (
                    <div
                      className="absolute left-0 right-0 h-0.5 bg-ultrasonic-500 z-10"
                      style={{ top: `${currentPosition}%` }}
                    >
                      <div className="absolute -left-1 -top-1 h-2.5 w-2.5 rounded-full bg-ultrasonic-500" />
                    </div>
                  )}

                  {dayRoutines.map((routine) => {
                    const pos = getRoutinePosition(routine)
                    const colors = getRoutineColor(routine)
                    return (
                      <div
                        key={routine.id}
                        className={`absolute left-0.5 right-0.5 rounded border-l-2 px-1 text-white text-xs overflow-hidden ${colors.bg} ${colors.border}`}
                        style={{
                          top: `${pos.top}%`,
                          height: `${pos.height}%`,
                          minHeight: '20px',
                        }}
                        title={`${routine.title} (${routine.startTime}~${routine.endTime})`}
                      >
                        <div className="truncate font-medium">{routine.title}</div>
                        {pos.height > 4 && (
                          <div className="text-[10px] opacity-80">{routine.startTime}</div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>

          {/* 시간 라벨 (오른쪽) */}
          <div className="w-10 flex-shrink-0">
            <div className="h-12" />
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

        {/* 범례 및 통계 */}
        <div className="mt-4 flex flex-wrap items-center justify-between border-t pt-3">
          <div className="flex flex-wrap items-center gap-3">
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <div key={key} className="flex items-center gap-1.5 text-xs text-gray-600">
                <div className={`h-3 w-3 rounded ${ROUTINE_COLORS[key as RoutineCategory].bg}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="text-sm font-medium text-blue-600">
            주간 총 학습시간: {Math.round(studyStats.total / 60 * 10) / 10}시간
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 루틴 폼 다이얼로그
// ============================================

interface RoutineFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  routine?: IRoutine
  onSubmit: (data: ICreateRoutineRequest) => void
  isLoading?: boolean
}

function RoutineFormDialog({ 
  open, 
  onOpenChange, 
  routine, 
  onSubmit,
  isLoading 
}: RoutineFormDialogProps) {
  const [formData, setFormData] = useState({
    title: routine?.title || '',
    category: routine?.category || 'study' as RoutineCategory,
    subject: routine?.subject || '',
    startTime: routine?.startTime || '09:00',
    endTime: routine?.endTime || '10:00',
    repeat: routine?.repeat ?? true,
    days: routine?.days || [false, true, true, true, true, true, false],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      ...formData,
      date: undefined,
      color: undefined,
    })
  }

  const toggleDay = (index: number) => {
    const newDays = [...formData.days]
    newDays[index] = !newDays[index]
    setFormData({ ...formData, days: newDays })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{routine ? '루틴 수정' : '새 루틴 추가'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 제목 */}
          <div>
            <Label htmlFor="title">루틴 이름</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예: 아침 영단어"
              required
            />
          </div>

          {/* 카테고리 */}
          <div>
            <Label>카테고리</Label>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: key as RoutineCategory })}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.category === key
                      ? `${ROUTINE_COLORS[key as RoutineCategory].bg} text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 과목 (학습일 때만) */}
          {formData.category === 'study' && (
            <div>
              <Label htmlFor="subject">과목</Label>
              <select
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ultrasonic-500"
              >
                <option value="">과목 선택</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          )}

          {/* 시간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">시작 시간</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">종료 시간</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          {/* 반복 요일 */}
          <div>
            <Label>반복 요일</Label>
            <div className="mt-2 flex justify-between">
              {DAYS_KR.map((day, idx) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(idx)}
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                    formData.days[idx]
                      ? 'bg-ultrasonic-500 text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {routine ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// 메인 페이지 컴포넌트
// ============================================

function PlannerRoutinePage() {
  const { data: routines, isLoading } = useGetRoutines()
  const createMutation = useCreateRoutine()
  const updateMutation = useUpdateRoutine()
  const deleteMutation = useDeleteRoutine()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<IRoutine | undefined>()

  const handleCreate = () => {
    setEditingRoutine(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (routine: IRoutine) => {
    setEditingRoutine(routine)
    setIsFormOpen(true)
  }

  const handleSubmit = async (data: ICreateRoutineRequest) => {
    if (editingRoutine) {
      await updateMutation.mutateAsync({ ...data, id: editingRoutine.id })
    } else {
      await createMutation.mutateAsync(data)
    }
    setIsFormOpen(false)
    setEditingRoutine(undefined)
  }

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-[600px] w-full rounded-xl" />
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/planner" className="rounded-lg p-2 hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">주간 루틴</h1>
            <p className="mt-1 text-gray-500">반복되는 학습 루틴을 설정하세요</p>
          </div>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          루틴 추가
        </Button>
      </div>

      {/* 주간 캘린더 */}
      <WeeklyCalendar routines={routines || []} />

      {/* 루틴 목록 */}
      <div className="space-y-3">
        {routines && routines.length > 0 ? (
          routines.map((routine) => {
            const colors = ROUTINE_COLORS[routine.category || 'other']
            return (
              <Card key={routine.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-10 w-1 rounded-full ${colors.bg}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${colors.bg} text-white`}>
                          {CATEGORY_LABELS[routine.category || 'other']}
                        </span>
                        {routine.subject && (
                          <span className="text-xs text-gray-500">{routine.subject}</span>
                        )}
                      </div>
                      <h3 className="font-semibold mt-1">{routine.title}</h3>
                      <p className="text-sm text-gray-500">
                        {routine.startTime} ~ {routine.endTime}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex gap-1">
                      {DAYS_KR.map((day, idx) => (
                        <span
                          key={day}
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                            routine.days[idx]
                              ? 'bg-ultrasonic-500 text-white'
                              : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(routine)}
                      >
                        수정
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(routine.id)}
                      >
                        삭제
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">등록된 루틴이 없습니다.</p>
              <Button onClick={handleCreate}>첫 루틴 추가하기</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 폼 다이얼로그 */}
      <RoutineFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        routine={editingRoutine}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
