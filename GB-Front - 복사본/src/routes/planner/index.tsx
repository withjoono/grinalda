/**
 * 플래너 대시보드 페이지
 * 
 * 오늘의 미션, 성취도, 주간 진행률을 한눈에 보여줍니다.
 */

import { createFileRoute, Link } from '@tanstack/react-router'
import { 
  useGetTodayDashboard,
  useGetNotices,
  useGetPlannerMentors,
} from '@/stores/server/features/planner'
import { usePlannerStore, useIsToday } from '@/stores/client/use-planner-store'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { 
  CalendarDays, 
  Target, 
  TrendingUp, 
  Award,
  Bell,
  ChevronRight,
  ChevronLeft,
  Plus,
} from 'lucide-react'

export const Route = createFileRoute('/planner/')({
  component: PlannerDashboard,
})

function PlannerDashboard() {
  const { data: dashboard, isLoading } = useGetTodayDashboard()
  const { data: notices } = useGetNotices()
  const { data: mentors } = useGetPlannerMentors()
  
  const { 
    selectedDate, 
    goToToday, 
    goToPrevDay, 
    goToNextDay,
    openItemForm,
  } = usePlannerStore()
  
  const isToday = useIsToday()
  
  const dateString = new Date(
    selectedDate.year, 
    selectedDate.month - 1, 
    selectedDate.day
  ).toLocaleDateString('ko-KR', { 
    year: 'numeric',
    month: 'long', 
    day: 'numeric', 
    weekday: 'long' 
  })

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">플래너</h1>
          <p className="mt-1 text-gray-500">학습 계획을 세우고 성취도를 관리하세요</p>
        </div>
        <Button onClick={() => openItemForm()} className="gap-2">
          <Plus className="h-4 w-4" />
          새 일정
        </Button>
      </div>

      {/* 날짜 네비게이션 */}
      <div className="mb-6 flex items-center justify-between rounded-xl bg-gradient-to-r from-ultrasonic-500 to-ultrasonic-600 p-4 text-white">
        <button 
          onClick={goToPrevDay}
          className="rounded-lg p-2 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <div className="text-lg font-semibold">{dateString}</div>
          {!isToday && (
            <button 
              onClick={goToToday}
              className="mt-1 text-sm text-ultrasonic-200 hover:text-white underline"
            >
              오늘로 이동
            </button>
          )}
        </div>
        
        <button 
          onClick={goToNextDay}
          className="rounded-lg p-2 hover:bg-white/20 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* 통계 카드 */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <StatCard
          icon={<Target className="h-5 w-5 text-ultrasonic-500" />}
          label="오늘 미션"
          value={`${dashboard?.completedMissions ?? 0}/${dashboard?.totalMissions ?? 0}`}
          subtext="완료"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5 text-green-500" />}
          label="오늘 성취도"
          value={`${dashboard?.avgAchievement ?? 0}%`}
          progress={dashboard?.avgAchievement}
        />
        <StatCard
          icon={<Award className="h-5 w-5 text-yellow-500" />}
          label="클래스 순위"
          value={dashboard?.rank ? `${dashboard.rank.myRank}위` : '-'}
          subtext={dashboard?.rank ? `/ ${dashboard.rank.totalStudents}명` : ''}
        />
        <StatCard
          icon={<CalendarDays className="h-5 w-5 text-blue-500" />}
          label="주간 성취도"
          value={`${dashboard?.rank?.weeklyAchievement ?? 0}%`}
          progress={dashboard?.rank?.weeklyAchievement}
        />
      </div>

      {/* 메인 컨텐츠 */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 오늘의 미션 */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">오늘의 미션</CardTitle>
              <Link to="/planner/today" className="text-sm text-ultrasonic-500 hover:underline">
                전체 보기
              </Link>
            </CardHeader>
            <CardContent>
              {dashboard?.todayMissions && dashboard.todayMissions.length > 0 ? (
                <div className="space-y-3">
                  {dashboard.todayMissions.slice(0, 5).map((mission) => (
                    <MissionItem key={mission.id} mission={mission} />
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  <CalendarDays className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                  <p>오늘 예정된 미션이 없습니다</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => openItemForm()}
                  >
                    미션 추가하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 사이드바 */}
        <div className="space-y-6">
          {/* 담당 멘토 */}
          {mentors && mentors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">담당 선생님</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mentors.map((mentor) => (
                    <div key={mentor.id} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-ultrasonic-400 to-ultrasonic-600 flex items-center justify-center text-white font-bold">
                        {mentor.name?.charAt(0) ?? '?'}
                      </div>
                      <div>
                        <div className="font-medium">{mentor.name}</div>
                        {mentor.subject && (
                          <div className="text-sm text-gray-500">{mentor.subject}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* 공지사항 */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-4 w-4" />
                공지사항
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notices && notices.length > 0 ? (
                <div className="space-y-2">
                  {notices.slice(0, 3).map((notice) => (
                    <div key={notice.id} className="flex items-start gap-2">
                      {notice.isImportant && (
                        <span className="mt-0.5 h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{notice.title}</p>
                        <p className="text-xs text-gray-500">{notice.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  공지사항이 없습니다
                </p>
              )}
            </CardContent>
          </Card>

          {/* 빠른 링크 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">빠른 이동</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <QuickLink to="/planner/today" label="오늘의 플래너" />
                <QuickLink to="/planner/routine" label="주간 루틴 설정" />
                <QuickLink to="/planner/plans" label="장기 계획 관리" />
                <QuickLink to="/planner/learning" label="학습 현황" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 서브 컴포넌트
// ============================================

function StatCard({ 
  icon, 
  label, 
  value, 
  subtext, 
  progress 
}: { 
  icon: React.ReactNode
  label: string
  value: string
  subtext?: string
  progress?: number
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-gray-100 p-2">
            {icon}
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">{value}</span>
              {subtext && <span className="text-sm text-gray-400">{subtext}</span>}
            </div>
          </div>
        </div>
        {progress !== undefined && (
          <Progress value={progress} className="mt-3 h-1.5" />
        )}
      </CardContent>
    </Card>
  )
}

interface Mission {
  subject: string;
  title: string;
  progress: number;
}

function MissionItem({ mission }: { mission: Mission }) {
  const SUBJECT_COLORS: Record<string, string> = {
    국어: '#ef4444',
    수학: '#eab308',
    영어: '#f97316',
    사회: '#3b82f6',
    과학: '#14b8a6',
    한국사: '#a855f7',
  }
  
  const color = SUBJECT_COLORS[mission.subject] ?? '#6b7280'
  const isCompleted = mission.progress >= 100
  
  return (
    <div className="flex items-center gap-3 rounded-lg border p-3 hover:bg-gray-50 transition-colors">
      <div 
        className="h-10 w-1 rounded-full" 
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span 
            className="text-xs font-medium px-2 py-0.5 rounded text-white"
            style={{ backgroundColor: color }}
          >
            {mission.subject}
          </span>
          {isCompleted && (
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-green-100 text-green-600">
              완료
            </span>
          )}
        </div>
        <p className="mt-1 font-medium truncate">{mission.title}</p>
      </div>
      <div className="text-right">
        <div className="text-lg font-bold" style={{ color }}>
          {mission.progress ?? 0}%
        </div>
        <div className="text-xs text-gray-500">성취도</div>
      </div>
    </div>
  )
}

function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link 
      to={to}
      className="flex items-center justify-between rounded-lg border p-3 hover:bg-gray-50 transition-colors"
    >
      <span className="text-sm font-medium">{label}</span>
      <ChevronRight className="h-4 w-4 text-gray-400" />
    </Link>
  )
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="mt-2 h-5 w-64" />
      </div>
      <Skeleton className="mb-6 h-20 w-full rounded-xl" />
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-96 rounded-xl lg:col-span-2" />
        <div className="space-y-6">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
