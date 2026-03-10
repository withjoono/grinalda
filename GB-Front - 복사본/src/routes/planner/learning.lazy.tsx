/**
 * 학습 현황 페이지
 */

import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useMemo } from 'react'
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  BookOpen,
  Award,
  BarChart3,
} from 'lucide-react'
import {
  useGetPlannerItems,
  useGetWeeklyStudyProgress,
  useGetRank,
} from '@/stores/server/features/planner'
import type { IPlannerItem, IWeeklyProgress } from '@/stores/server/features/planner/interfaces'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createLazyFileRoute('/planner/learning')({
  component: PlannerLearningPage,
})

// ============================================
// 상수
// ============================================

const SUBJECT_COLORS: Record<string, { bg: string; text: string; light: string }> = {
  국어: { bg: 'bg-red-500', text: 'text-red-600', light: 'bg-red-100' },
  수학: { bg: 'bg-yellow-500', text: 'text-yellow-600', light: 'bg-yellow-100' },
  영어: { bg: 'bg-ultrasonic-500', text: 'text-orange-600', light: 'bg-orange-100' },
  사회: { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-100' },
  과학: { bg: 'bg-teal-500', text: 'text-teal-600', light: 'bg-teal-100' },
  한국사: { bg: 'bg-purple-500', text: 'text-purple-600', light: 'bg-purple-100' },
}

const DAY_NAMES = ['월', '화', '수', '목', '금', '토', '일']

// ============================================
// 주간 성취도 차트 컴포넌트
// ============================================

function WeeklyProgressChart({ data }: { data: IWeeklyProgress[] }) {
  const maxProgress = Math.max(...data.map(d => d.avgProgress || 0), 100)
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-500" />
          주간 성취도
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-48">
          {data.map((day, idx) => {
            const height = maxProgress > 0 ? (day.avgProgress / maxProgress) * 100 : 0
            const isToday = idx === new Date().getDay() - 1 || (new Date().getDay() === 0 && idx === 6)
            
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end h-36">
                  <span className="text-xs font-medium text-gray-600 mb-1">
                    {Math.round(day.avgProgress || 0)}%
                  </span>
                  <div 
                    className={`w-full max-w-[40px] rounded-t-lg transition-all ${
                      isToday ? 'bg-ultrasonic-500' : 'bg-blue-400'
                    }`}
                    style={{ height: `${Math.max(height, 4)}%` }}
                  />
                </div>
                <span className={`text-sm font-medium ${
                  isToday ? 'text-ultrasonic-500' : 'text-gray-500'
                }`}>
                  {DAY_NAMES[idx]}
                </span>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// ============================================
// 과목별 성취도 컴포넌트
// ============================================

function SubjectProgress({ subject, items }: { subject: string; items: IPlannerItem[] }) {
  const colors = SUBJECT_COLORS[subject] || { bg: 'bg-gray-500', text: 'text-gray-600', light: 'bg-gray-100' }
  
  const subjectItems = items.filter(i => i.subject === subject)
  const completedCount = subjectItems.filter(i => i.progress >= 100).length
  const avgProgress = subjectItems.length > 0
    ? Math.round(subjectItems.reduce((sum, i) => sum + (i.progress || 0), 0) / subjectItems.length)
    : 0

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50">
      <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${colors.light}`}>
        <BookOpen className={`h-6 w-6 ${colors.text}`} />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="font-medium">{subject}</span>
          <span className={`text-sm font-medium ${colors.text}`}>{avgProgress}%</span>
        </div>
        <Progress value={avgProgress} className="h-2" />
        <div className="flex items-center justify-between mt-1 text-xs text-gray-500">
          <span>완료: {completedCount}/{subjectItems.length}</span>
          <span>총 {subjectItems.length}개 학습</span>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 최근 학습 아이템 컴포넌트
// ============================================

function RecentLearningItem({ item }: { item: IPlannerItem }) {
  const colors = SUBJECT_COLORS[item.subject] || { bg: 'bg-gray-500', text: 'text-gray-600', light: 'bg-gray-100' }
  const isCompleted = item.progress >= 100

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
      <div className={`h-2 w-2 rounded-full ${colors.bg}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-xs font-medium px-2 py-0.5 rounded text-white ${colors.bg}`}>
            {item.subject}
          </span>
          {isCompleted && (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-600">
              완료
            </span>
          )}
        </div>
        <p className="font-medium truncate mt-1">{item.title}</p>
      </div>
      <div className={`text-lg font-bold ${isCompleted ? 'text-green-500' : colors.text}`}>
        {item.progress || 0}%
      </div>
    </div>
  )
}

// ============================================
// 메인 페이지 컴포넌트
// ============================================

function PlannerLearningPage() {
  const { data: allItems, isLoading: isItemsLoading } = useGetPlannerItems()
  const { data: weeklyProgress, isLoading: isProgressLoading } = useGetWeeklyStudyProgress()
  const { data: rank, isLoading: isRankLoading } = useGetRank('W')

  // 학습 아이템만 필터링
  const studyItems = useMemo(() => {
    if (!allItems) return []
    return allItems.filter(item => item.primaryType === '학습')
  }, [allItems])

  // 과목별 그룹화
  const subjects = useMemo(() => {
    const subjectSet = new Set(studyItems.map(i => i.subject).filter(Boolean))
    return Array.from(subjectSet) as string[]
  }, [studyItems])

  // 통계 계산
  const stats = useMemo(() => {
    if (!studyItems.length) return { total: 0, completed: 0, avgProgress: 0 }
    
    const completed = studyItems.filter(i => i.progress >= 100).length
    const avgProgress = Math.round(
      studyItems.reduce((sum, i) => sum + (i.progress || 0), 0) / studyItems.length
    )
    
    return { total: studyItems.length, completed, avgProgress }
  }, [studyItems])

  // 최근 학습 (최신 10개)
  const recentItems = useMemo(() => {
    return [...studyItems]
      .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
      .slice(0, 10)
  }, [studyItems])

  const isLoading = isItemsLoading || isProgressLoading || isRankLoading

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
        <Skeleton className="h-8 w-32 mb-6" />
        <div className="grid gap-4 md:grid-cols-4 mb-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-xl" />
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
          <h1 className="text-2xl font-bold">학습 현황</h1>
          <p className="mt-1 text-gray-500">학습 성취도를 확인하세요</p>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-blue-100 p-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">전체 학습</p>
              <p className="text-xl font-bold">{stats.total}개</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-green-100 p-2">
              <Target className="h-5 w-5 text-green-600" />
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
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">평균 성취도</p>
              <p className="text-xl font-bold">{stats.avgProgress}%</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="rounded-lg bg-purple-100 p-2">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">클래스 순위</p>
              <p className="text-xl font-bold">
                {rank?.myRank ? `${rank.myRank}위` : '-'}
                {rank?.totalStudents ? <span className="text-sm text-gray-400">/{rank.totalStudents}</span> : ''}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 주간 성취도 차트 */}
        <div className="lg:col-span-2">
          <WeeklyProgressChart data={weeklyProgress || []} />
        </div>

        {/* 기간별 성취도 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">기간별 성취도</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
              <span className="text-sm font-medium text-blue-700">일간</span>
              <span className="text-lg font-bold text-blue-600">
                {rank?.dailyAchievement ?? 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
              <span className="text-sm font-medium text-green-700">주간</span>
              <span className="text-lg font-bold text-green-600">
                {rank?.weeklyAchievement ?? 0}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50">
              <span className="text-sm font-medium text-purple-700">월간</span>
              <span className="text-lg font-bold text-purple-600">
                {rank?.monthlyAchievement ?? 0}%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 과목별 성취도 */}
      {subjects.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">과목별 성취도</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {subjects.map((subject) => (
                <SubjectProgress key={subject} subject={subject} items={studyItems} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 최근 학습 */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">최근 학습</CardTitle>
        </CardHeader>
        <CardContent>
          {recentItems.length > 0 ? (
            <div className="space-y-2">
              {recentItems.map((item) => (
                <RecentLearningItem key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-3" />
              <p>학습 기록이 없습니다</p>
              <Link to="/planner/today">
                <Button variant="outline" className="mt-4">학습 추가하기</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
