import { useCallback, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, BarChart3, GraduationCap, Target, FileText, Calendar, Loader2 } from 'lucide-react'
import { MemoBoard, type Memo } from './MemoBoard'
import { useGetMemos, useGetMentoringRelation } from '@/stores/server/features/mentoring/queries'
import { useCreateMemo, useMarkMemoAsRead } from '@/stores/server/features/mentoring/mutations'
import { useGetCurrentUser } from '@/stores/server/features/me/queries'
import type { IMemo } from '@/stores/server/features/mentoring/interfaces'

interface StudentDetailProps {
  id: string
  name: string
  school: string
  grade?: string
  mentorType?: 'teacher' | 'parent'
}

// 서비스 메뉴 정의
const SERVICE_MENUS = [
  {
    key: 'planner',
    label: '플래너',
    description: '학습 계획 및 일정 관리',
    icon: Calendar,
    link: '/planner',
    color: 'bg-purple-500',
  },
  {
    key: 'grade-analysis',
    label: '내신 성적 관리',
    description: '내신 성적 분석 및 추이',
    icon: BarChart3,
    link: '/grade-analysis',
    color: 'bg-blue-500',
  },
  {
    key: 'mock-analysis',
    label: '모의고사 성적 관리',
    description: '모의고사 성적 분석',
    icon: FileText,
    link: '/mock-analysis',
    color: 'bg-green-500',
  },
  {
    key: 'susi',
    label: '수시 컨설팅',
    description: '수시 지원 전략 컨설팅',
    icon: GraduationCap,
    link: '/susi',
    color: 'bg-orange-500',
  },
  {
    key: 'jungsi',
    label: '정시 합격 예측',
    description: '정시 지원 전략 및 예측',
    icon: Target,
    link: '/jungsi',
    color: 'bg-red-500',
  },
  {
    key: 'myclass',
    label: '마이클래스',
    description: '학습 콘텐츠 및 자료',
    icon: BookOpen,
    link: '/myclass',
    color: 'bg-indigo-500',
  },
]

// API 메모를 컴포넌트 메모 형식으로 변환
const convertApiMemoToMemo = (apiMemo: IMemo): Memo => ({
  id: apiMemo.id,
  content: apiMemo.content,
  author: apiMemo.authorType,
  authorName: apiMemo.authorName,
  createdAt: apiMemo.createdAt,
  isRead: apiMemo.isRead,
})

export function StudentDetail({
  id,
  name,
  school,
  grade,
  mentorType = 'teacher',
}: StudentDetailProps) {
  const { data: currentUser } = useGetCurrentUser()

  // 메모 조회
  const { data: apiMemos, isLoading: isMemosLoading } = useGetMemos(id)

  // 멘토링 관계 조회 (허용된 서비스 확인용)
  const { data: relation } = useGetMentoringRelation(id)

  // 메모 생성
  const createMemoMutation = useCreateMemo()

  // 메모 읽음 처리
  const markAsReadMutation = useMarkMemoAsRead(id)

  // 메모 데이터 변환
  const memos: Memo[] = useMemo(() => {
    if (!apiMemos) return []
    return apiMemos.map(convertApiMemoToMemo)
  }, [apiMemos])

  // 허용된 서비스 목록
  const allowedServices = useMemo(() => {
    return relation?.allowedServices || SERVICE_MENUS.map((m) => m.key)
  }, [relation])

  // 필터링된 서비스 메뉴 (허용된 서비스만)
  const filteredServices = useMemo(() => {
    return SERVICE_MENUS.filter((menu) => allowedServices.includes(menu.key))
  }, [allowedServices])

  const handleSendMemo = useCallback(async (content: string) => {
    await createMemoMutation.mutateAsync({
      targetStudentId: id,
      content,
    })
  }, [id, createMemoMutation])

  const handleMarkAsRead = useCallback((memoId: number) => {
    markAsReadMutation.mutate(memoId)
  }, [markAsReadMutation])

  const mentorName = useMemo(() => {
    if (currentUser?.nickname) return currentUser.nickname
    return mentorType === 'teacher' ? '선생님' : '부모님'
  }, [currentUser, mentorType])

  return (
    <div className="space-y-6">
      {/* 뒤로가기 + 학생 정보 */}
      <div className="flex items-center gap-4">
        <Link
          to="/mentoring/admin"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </Link>
        <div>
          <h2 className="text-xl font-bold">{name}</h2>
          <p className="text-sm text-gray-500">
            {school} {grade && `· ${grade}`}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* 왼쪽: 서비스 메뉴 */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-1 h-5 bg-orange-500 rounded-full" />
            학생 관리 서비스
          </h3>

          {filteredServices.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              허용된 서비스가 없습니다.
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredServices.map((menu) => {
                const Icon = menu.icon
                return (
                  <Link
                    key={menu.key}
                    to={menu.link}
                    search={{ studentId: id }}
                    className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 hover:border-orange-400 hover:shadow-md transition-all group"
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${menu.color} text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold group-hover:text-orange-500 transition-colors">
                        {menu.label}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {menu.description}
                      </p>
                    </div>
                    <span className="text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      &gt;
                    </span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* 오른쪽: 메모장 */}
        <div className="lg:col-span-1">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <span className="w-1 h-5 bg-blue-500 rounded-full" />
            메모장
          </h3>

          {isMemosLoading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : (
            <MemoBoard
              memos={memos}
              currentUserType="mentor"
              studentName={name}
              mentorName={mentorName}
              onSendMemo={handleSendMemo}
              onMarkAsRead={handleMarkAsRead}
            />
          )}
        </div>
      </div>
    </div>
  )
}
