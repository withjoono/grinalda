/**
 * 장기 계획 관리 페이지
 */

import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  ArrowLeft, 
  Loader2,
  BookOpen,
  Video,
  Target,
  TrendingUp,
} from 'lucide-react'
import {
  useGetPlans,
  useCreatePlan,
  useUpdatePlan,
  useDeletePlan,
  IPlan,
  ICreatePlanRequest,
} from '@/stores/server/features/planner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createLazyFileRoute('/planner/plans')({
  component: PlannerPlansPage,
})

// ============================================
// 상수
// ============================================

const SUBJECT_COLORS: Record<string, { bg: string; text: string }> = {
  국어: { bg: 'bg-red-500', text: 'text-red-600' },
  수학: { bg: 'bg-yellow-500', text: 'text-yellow-600' },
  영어: { bg: 'bg-ultrasonic-500', text: 'text-orange-600' },
  사회: { bg: 'bg-blue-500', text: 'text-blue-600' },
  과학: { bg: 'bg-teal-500', text: 'text-teal-600' },
  한국사: { bg: 'bg-purple-500', text: 'text-purple-600' },
}

const SUBJECTS = ['국어', '수학', '영어', '사회', '과학', '한국사', '제2외국어', '기타']

// ============================================
// 월간 캘린더 컴포넌트
// ============================================

function MonthlyCalendar({ plans }: { plans: IPlan[] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const DAYS_KR = ['일', '월', '화', '수', '목', '금', '토']

  const navigate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

  const { weeks } = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const weeks: Date[][] = []
    let week: Date[] = []

    const startDay = firstDay.getDay()
    for (let i = 0; i < startDay; i++) {
      week.push(new Date(year, month, 1 - startDay + i))
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      week.push(new Date(year, month, day))
      if (week.length === 7) {
        weeks.push(week)
        week = []
      }
    }

    if (week.length > 0) {
      const remaining = 7 - week.length
      for (let i = 1; i <= remaining; i++) {
        week.push(new Date(year, month + 1, i))
      }
      weeks.push(week)
    }

    return { weeks }
  }, [currentDate])

  const getPlansForDate = (date: Date) => {
    const dateTime = date.getTime()
    return plans.filter(plan => {
      if (!plan.startDate || !plan.endDate) return false
      const startDate = new Date(plan.startDate)
      const endDate = new Date(plan.endDate)
      startDate.setHours(0, 0, 0, 0)
      endDate.setHours(23, 59, 59, 999)
      return dateTime >= startDate.getTime() && dateTime <= endDate.getTime()
    })
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={() => navigate('prev')} className="rounded-full p-1 hover:bg-gray-100">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <h3 className="text-lg font-semibold">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </h3>
          <button onClick={() => navigate('next')} className="rounded-full p-1 hover:bg-gray-100">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-2 grid grid-cols-7 text-center text-sm">
          {DAYS_KR.map((day, i) => (
            <div
              key={day}
              className={`py-1 font-medium ${
                i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {weeks.flat().map((date, idx) => {
            const isToday = date.getTime() === today.getTime()
            const isCurrentMonth = date.getMonth() === currentDate.getMonth()
            const dayIdx = idx % 7
            const datePlans = getPlansForDate(date)

            return (
              <div
                key={idx}
                className={`relative flex min-h-[48px] flex-col items-center rounded p-1 ${
                  isToday ? 'bg-ultrasonic-500 text-white'
                  : !isCurrentMonth ? 'bg-gray-50'
                  : 'bg-white'
                }`}
              >
                <span
                  className={`text-sm ${
                    isToday ? 'font-bold text-white'
                    : !isCurrentMonth ? 'text-gray-300'
                    : dayIdx === 0 ? 'text-red-500'
                    : dayIdx === 6 ? 'text-blue-500'
                    : 'text-gray-700'
                  }`}
                >
                  {date.getDate()}
                </span>
                {datePlans.length > 0 && isCurrentMonth && (
                  <div className="mt-0.5 flex flex-wrap justify-center gap-0.5">
                    {datePlans.slice(0, 3).map((plan) => {
                      const colors = SUBJECT_COLORS[plan.subject || ''] || { bg: 'bg-gray-400' }
                      return (
                        <div
                          key={plan.id}
                          className={`h-1.5 w-1.5 rounded-full ${colors.bg}`}
                          title={plan.title}
                        />
                      )
                    })}
                    {datePlans.length > 3 && (
                      <span className="text-[8px] text-gray-400">+{datePlans.length - 3}</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {plans.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-3 border-t pt-3">
            {plans.map((plan) => {
              const colors = SUBJECT_COLORS[plan.subject || ''] || { bg: 'bg-gray-400' }
              return (
                <div key={plan.id} className="flex items-center gap-1.5 text-xs text-gray-600">
                  <div className={`h-2 w-2 rounded-full ${colors.bg}`} />
                  <span>{plan.title}</span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ============================================
// 계획 폼 다이얼로그
// ============================================

interface PlanFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan?: IPlan
  onSubmit: (data: ICreatePlanRequest) => void
  isLoading?: boolean
}

function PlanFormDialog({ 
  open, 
  onOpenChange, 
  plan, 
  onSubmit,
  isLoading 
}: PlanFormDialogProps) {
  const [formData, setFormData] = useState({
    title: plan?.title || '',
    subject: plan?.subject || '',
    step: plan?.step || '',
    startDay: plan?.startDate?.split('T')[0] || '',
    endDay: plan?.endDate?.split('T')[0] || '',
    type: (plan?.type === 0 ? 'lecture' : 'textbook') as 'textbook' | 'lecture',
    material: plan?.material || '',
    amount: plan?.total || 0,
    finished: plan?.done || 0,
    person: plan?.person || '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{plan ? '계획 수정' : '새 계획 추가'}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">계획 제목</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="예: 수능 국어 1등급 달성"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="subject">과목</Label>
              <select
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ultrasonic-500"
                required
              >
                <option value="">과목 선택</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="type">유형</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'textbook' | 'lecture' })}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-ultrasonic-500"
              >
                <option value="textbook">교재</option>
                <option value="lecture">강의</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="material">교재/강의명</Label>
            <Input
              id="material"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              placeholder="예: 수능특강 국어"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDay">시작일</Label>
              <Input
                id="startDay"
                type="date"
                value={formData.startDay}
                onChange={(e) => setFormData({ ...formData, startDay: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endDay">종료일</Label>
              <Input
                id="endDay"
                type="date"
                value={formData.endDay}
                onChange={(e) => setFormData({ ...formData, endDay: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="amount">총 분량 ({formData.type === 'lecture' ? '강' : '페이지'})</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) || 0 })}
                min={0}
              />
            </div>
            <div>
              <Label htmlFor="finished">완료 분량</Label>
              <Input
                id="finished"
                type="number"
                value={formData.finished}
                onChange={(e) => setFormData({ ...formData, finished: parseInt(e.target.value) || 0 })}
                min={0}
                max={formData.amount}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {plan ? '수정' : '추가'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ============================================
// 계획 카드 컴포넌트
// ============================================

function PlanCard({ 
  plan, 
  onEdit, 
  onDelete 
}: { 
  plan: IPlan
  onEdit: () => void
  onDelete: () => void
}) {
  const colors = SUBJECT_COLORS[plan.subject || ''] || { bg: 'bg-gray-500', text: 'text-gray-600' }
  const progress = plan.total && plan.total > 0 
    ? Math.round((plan.done / plan.total) * 100) 
    : 0

  const startDate = plan.startDate ? new Date(plan.startDate).toLocaleDateString('ko-KR') : '-'
  const endDate = plan.endDate ? new Date(plan.endDate).toLocaleDateString('ko-KR') : '-'

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* 아이콘 */}
          <div className={`flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center ${
            plan.type === 0 ? 'bg-purple-100' : 'bg-blue-100'
          }`}>
            {plan.type === 0 ? (
              <Video className="h-6 w-6 text-purple-600" />
            ) : (
              <BookOpen className="h-6 w-6 text-blue-600" />
            )}
          </div>

          {/* 내용 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-medium px-2 py-0.5 rounded text-white ${colors.bg}`}>
                {plan.subject}
              </span>
              <span className="text-xs text-gray-500">
                {plan.type === 0 ? '강의' : '교재'}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{plan.title}</h3>
            {plan.material && (
              <p className="text-sm text-gray-500 mt-0.5">{plan.material}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {startDate} ~ {endDate}
            </p>

            {/* 진행률 */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-500">진행률</span>
                <span className={`font-medium ${colors.text}`}>
                  {plan.done ?? 0} / {plan.total ?? 0} ({progress}%)
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex flex-col gap-2">
            <Button variant="ghost" size="sm" onClick={onEdit}>
              수정
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-red-600 hover:text-red-700"
              onClick={onDelete}
            >
              삭제
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 메인 페이지 컴포넌트
// ============================================

function PlannerPlansPage() {
  const { data: plans, isLoading } = useGetPlans()
  const createMutation = useCreatePlan()
  const updateMutation = useUpdatePlan()
  const deleteMutation = useDeletePlan()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPlan, setEditingPlan] = useState<IPlan | undefined>()

  const handleCreate = () => {
    setEditingPlan(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (plan: IPlan) => {
    setEditingPlan(plan)
    setIsFormOpen(true)
  }

  const handleSubmit = async (data: ICreatePlanRequest) => {
    if (editingPlan) {
      await updateMutation.mutateAsync({ ...data, id: editingPlan.id })
    } else {
      await createMutation.mutateAsync(data)
    }
    setIsFormOpen(false)
    setEditingPlan(undefined)
  }

  const handleDelete = async (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteMutation.mutateAsync(id)
    }
  }

  // 통계
  const stats = useMemo(() => {
    if (!plans) return { total: 0, completed: 0, inProgress: 0, avgProgress: 0 }
    
    const completed = plans.filter(p => p.total && p.done >= p.total).length
    const inProgress = plans.filter(p => p.total && p.done > 0 && p.done < p.total).length
    const avgProgress = plans.length > 0
      ? Math.round(plans.reduce((sum, p) => {
          if (!p.total) return sum
          return sum + (p.done / p.total) * 100
        }, 0) / plans.length)
      : 0

    return { total: plans.length, completed, inProgress, avgProgress }
  }, [plans])

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
        <Skeleton className="h-8 w-32 mb-6" />
        <Skeleton className="h-[400px] w-full rounded-xl mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
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
            <h1 className="text-2xl font-bold">장기 계획</h1>
            <p className="mt-1 text-gray-500">장기 학습 계획을 세우고 진행상황을 관리하세요</p>
          </div>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus className="h-4 w-4" />
          계획 추가
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <Target className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">전체 계획</p>
              <p className="text-xl font-bold">{stats.total}개</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">진행 중</p>
              <p className="text-xl font-bold">{stats.inProgress}개</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <BookOpen className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">완료</p>
              <p className="text-xl font-bold">{stats.completed}개</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-orange-100 p-2">
              <Target className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 진행률</p>
              <p className="text-xl font-bold">{stats.avgProgress}%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 월간 캘린더 */}
      <MonthlyCalendar plans={plans || []} />

      {/* 계획 목록 */}
      <div className="space-y-4">
        {plans && plans.length > 0 ? (
          plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={() => handleEdit(plan)}
              onDelete={() => handleDelete(plan.id)}
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Target className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-gray-500 mb-4">등록된 장기 계획이 없습니다.</p>
              <Button onClick={handleCreate}>첫 계획 추가하기</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 폼 다이얼로그 */}
      <PlanFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        plan={editingPlan}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  )
}
