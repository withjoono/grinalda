import { createLazyFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ClassStatus,
  type PlannerItem,
  type WeeklyProgress,
} from '@/components/services/planner'

export const Route = createLazyFileRoute('/planner/class')({
  component: PlannerClassPage,
})

function PlannerClassPage() {
  // 더미 데이터
  const [items] = useState<PlannerItem[]>([
    {
      id: 1,
      memberId: 1,
      primaryType: '수업',
      subject: '수학',
      teacher: '김수학',
      title: '수학 정규 수업',
      startDate: new Date(),
      endDate: new Date(),
      progress: 100,
      late: 0,
      absent: 0,
    },
    {
      id: 2,
      memberId: 1,
      primaryType: '수업',
      subject: '영어',
      teacher: '이영어',
      title: '영어 독해 수업',
      startDate: new Date(),
      endDate: new Date(),
      progress: 90,
      late: 1,
      absent: 0,
    },
    {
      id: 3,
      memberId: 1,
      primaryType: '수업',
      subject: '국어',
      teacher: '박국어',
      title: '국어 문학 수업',
      startDate: new Date(),
      endDate: new Date(),
      progress: 80,
      late: 0,
      absent: 1,
    },
    {
      id: 4,
      memberId: 1,
      primaryType: '수업',
      subject: '과학',
      teacher: '최과학',
      title: '물리 심화 수업',
      startDate: new Date(),
      endDate: new Date(),
      progress: 95,
      late: 0,
      absent: 0,
    },
    {
      id: 5,
      memberId: 1,
      primaryType: '수업',
      subject: '사회',
      teacher: '정사회',
      title: '한국사 특강',
      startDate: new Date(),
      endDate: new Date(),
      progress: 100,
      late: 2,
      absent: 0,
    },
  ])

  const weeklyData: WeeklyProgress[] = [
    { primaryType: '수업', memberId: 1, startDateDay: '2024-01', comnCd: 1, comnNm: 'Monday', avgProgress: 100 },
    { primaryType: '수업', memberId: 1, startDateDay: '2024-01', comnCd: 2, comnNm: 'Tuesday', avgProgress: 90 },
    { primaryType: '수업', memberId: 1, startDateDay: '2024-01', comnCd: 3, comnNm: 'Wednesday', avgProgress: 100 },
    { primaryType: '수업', memberId: 1, startDateDay: '2024-01', comnCd: 4, comnNm: 'Thursday', avgProgress: 85 },
    { primaryType: '수업', memberId: 1, startDateDay: '2024-01', comnCd: 5, comnNm: 'Friday', avgProgress: 95 },
    { primaryType: '수업', memberId: 1, startDateDay: '2024-01', comnCd: 6, comnNm: 'Saturday', avgProgress: 0 },
    { primaryType: '수업', memberId: 1, startDateDay: '2024-01', comnCd: 7, comnNm: 'Sunday', avgProgress: 0 },
  ]

  return (
    <div className="mx-auto w-full max-w-screen-xl px-4 py-10">
      {/* 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">수업 현황</h1>
        <p className="mt-2 text-gray-600">수업 출석 및 성취도를 확인하세요.</p>
      </div>

      {/* 수업 현황 컴포넌트 */}
      <ClassStatus items={items} weeklyData={weeklyData} />
    </div>
  )
}
