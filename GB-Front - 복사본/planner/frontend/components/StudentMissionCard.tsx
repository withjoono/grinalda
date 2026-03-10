'use client'

import { useState } from 'react'
import { SUBJECT_COLORS, type DailyMission, type MissionStatus } from '../types'

interface Student {
  id: number
  name: string
  school?: string
  grade?: string
  profileImage?: string
}

interface StudentMissionCardProps {
  student: Student
  missions: DailyMission[]
  date: Date
  onMissionClick?: (mission: DailyMission) => void
  onFeedbackClick?: (mission: DailyMission) => void
}

const STATUS_CONFIG: Record<MissionStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: '대기', color: 'text-gray-600', bgColor: 'bg-gray-100' },
  in_progress: { label: '진행중', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  completed: { label: '완료', color: 'text-green-600', bgColor: 'bg-green-100' },
  skipped: { label: '건너뜀', color: 'text-red-600', bgColor: 'bg-red-100' },
}

export function StudentMissionCard({
  student,
  missions,
  date,
  onMissionClick,
  onFeedbackClick,
}: StudentMissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // 통계 계산
  const stats = {
    total: missions.length,
    completed: missions.filter(m => m.status === 'completed').length,
    avgAchievement: missions.length > 0 
      ? Math.round(missions.reduce((sum, m) => sum + m.achievement, 0) / missions.length)
      : 0,
    needsFeedback: missions.filter(m => m.status === 'completed' && !m.mentorFeedback).length,
  }

  // 진행률 색상
  const getProgressColor = (achievement: number) => {
    if (achievement >= 80) return 'text-green-600'
    if (achievement >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 헤더: 학생 정보 */}
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4">
          {/* 프로필 이미지 */}
          <div className="relative">
            {student.profileImage ? (
              <img 
                src={student.profileImage} 
                alt={student.name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-lg">
                {student.name.charAt(0)}
              </div>
            )}
            {/* 피드백 필요 뱃지 */}
            {stats.needsFeedback > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {stats.needsFeedback}
              </span>
            )}
          </div>

          {/* 학생 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{student.name}</h3>
              {student.grade && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {student.grade}
                </span>
              )}
            </div>
            {student.school && (
              <p className="text-sm text-gray-500">{student.school}</p>
            )}
          </div>

          {/* 요약 통계 */}
          <div className="flex items-center gap-4 text-sm">
            <div className="text-center">
              <div className="text-gray-500">완료</div>
              <div className="font-semibold">{stats.completed}/{stats.total}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-500">성취도</div>
              <div className={`font-semibold ${getProgressColor(stats.avgAchievement)}`}>
                {stats.avgAchievement}%
              </div>
            </div>
          </div>

          {/* 확장 아이콘 */}
          <svg 
            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {/* 진행 바 */}
        <div className="mt-3">
          <div className="flex gap-1 h-2">
            {missions.map((mission, index) => (
              <div
                key={mission.id}
                className="flex-1 rounded-full transition-all"
                style={{
                  backgroundColor: mission.status === 'completed' 
                    ? SUBJECT_COLORS[mission.subject] || '#6b7280'
                    : mission.status === 'in_progress'
                    ? `${SUBJECT_COLORS[mission.subject] || '#6b7280'}50`
                    : '#e5e7eb',
                }}
                title={`${mission.subject}: ${mission.title}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 확장: 미션 목록 */}
      {isExpanded && (
        <div className="border-t border-gray-100">
          {missions.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              오늘 배정된 미션이 없습니다.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {missions.map((mission) => {
                const statusConfig = STATUS_CONFIG[mission.status]
                const subjectColor = SUBJECT_COLORS[mission.subject] || SUBJECT_COLORS['기타']
                
                return (
                  <div
                    key={mission.id}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* 과목 색상 */}
                      <div 
                        className="w-1 h-full min-h-[40px] rounded-full flex-shrink-0"
                        style={{ backgroundColor: subjectColor }}
                      />

                      {/* 미션 정보 */}
                      <div 
                        className="flex-1 min-w-0 cursor-pointer"
                        onClick={() => onMissionClick?.(mission)}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span 
                            className="text-xs font-medium px-2 py-0.5 rounded text-white"
                            style={{ backgroundColor: subjectColor }}
                          >
                            {mission.subject}
                          </span>
                          <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusConfig.bgColor} ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-900 truncate">
                          {mission.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span>목표: {mission.targetAmount}</span>
                          <span>완료: {mission.completedAmount}</span>
                          <span className={`font-medium ${getProgressColor(mission.achievement)}`}>
                            성취도: {mission.achievement}%
                          </span>
                        </div>

                        {/* 학생 메모 */}
                        {mission.studentMemo && (
                          <p className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                            💬 {mission.studentMemo}
                          </p>
                        )}

                        {/* 멘토 피드백 */}
                        {mission.mentorFeedback && (
                          <div className="mt-2 text-xs p-2 bg-yellow-50 rounded border border-yellow-100">
                            <div className="flex items-center gap-1 mb-1">
                              <span>
                                {mission.mentorFeedback.type === 'praise' && '🎉'}
                                {mission.mentorFeedback.type === 'encourage' && '💪'}
                                {mission.mentorFeedback.type === 'warning' && '⚠️'}
                              </span>
                              <span className="flex">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span key={i} className={i < mission.mentorFeedback!.rating ? 'text-yellow-400' : 'text-gray-300'}>
                                    ★
                                  </span>
                                ))}
                              </span>
                            </div>
                            <p className="text-gray-700">{mission.mentorFeedback.comment}</p>
                          </div>
                        )}
                      </div>

                      {/* 피드백 버튼 */}
                      {mission.status === 'completed' && !mission.mentorFeedback && (
                        <button
                          onClick={() => onFeedbackClick?.(mission)}
                          className="px-3 py-1.5 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 transition-colors flex-shrink-0"
                        >
                          피드백
                        </button>
                      )}
                      {mission.mentorFeedback && (
                        <button
                          onClick={() => onFeedbackClick?.(mission)}
                          className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
                        >
                          수정
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}




