'use client'

import { useState } from 'react'
import {
  SUBJECT_COLORS,
  type DailyMission,
  type MissionStatus,
  type AchievementInput,
} from '../types'

interface DailyMissionCardProps {
  mission: DailyMission
  onStatusChange?: (missionId: number, status: MissionStatus) => void
  onAchievementSubmit?: (input: AchievementInput) => void
  showMentorFeedback?: boolean
}

const STATUS_LABELS: Record<MissionStatus, string> = {
  pending: '대기',
  in_progress: '진행중',
  completed: '완료',
  skipped: '건너뜀',
}

const STATUS_COLORS: Record<MissionStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-600',
  completed: 'bg-green-100 text-green-600',
  skipped: 'bg-red-100 text-red-600',
}

export function DailyMissionCard({
  mission,
  onStatusChange,
  onAchievementSubmit,
  showMentorFeedback = true,
}: DailyMissionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [achievement, setAchievement] = useState(mission.achievement)
  const [completedAmount, setCompletedAmount] = useState(mission.completedAmount)
  const [memo, setMemo] = useState(mission.studentMemo || '')
  const [isEditing, setIsEditing] = useState(false)

  const subjectColor = SUBJECT_COLORS[mission.subject] || SUBJECT_COLORS['기타']
  const progressPercent = mission.targetAmount > 0 
    ? Math.round((completedAmount / mission.targetAmount) * 100) 
    : 0

  const handleQuickAchievement = (value: number) => {
    setAchievement(value)
    if (!isEditing) {
      onAchievementSubmit?.({
        missionId: mission.id,
        completedAmount,
        achievement: value,
        studentMemo: memo,
      })
    }
  }

  const handleSubmit = () => {
    onAchievementSubmit?.({
      missionId: mission.id,
      completedAmount,
      achievement,
      studentMemo: memo,
    })
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          {/* 과목 색상 바 */}
          <div 
            className="w-1 h-12 rounded-full flex-shrink-0"
            style={{ backgroundColor: subjectColor }}
          />
          
          <div className="flex-1 min-w-0">
            {/* 상단: 과목 & 상태 */}
            <div className="flex items-center justify-between mb-1">
              <span 
                className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: subjectColor }}
              >
                {mission.subject}
              </span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_COLORS[mission.status]}`}>
                {STATUS_LABELS[mission.status]}
              </span>
            </div>

            {/* 제목 */}
            <h3 className="font-medium text-gray-900 truncate">{mission.title}</h3>

            {/* 시간 & 목표량 */}
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
              {mission.startTime && mission.endTime && (
                <span>⏰ {mission.startTime}-{mission.endTime}</span>
              )}
              <span>📖 {mission.completedAmount}/{mission.targetAmount}</span>
            </div>

            {/* 진행률 바 */}
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>성취도</span>
                <span className="font-medium">{achievement}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${achievement}%`,
                    backgroundColor: subjectColor,
                  }}
                />
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
      </div>

      {/* 확장 영역 */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-4 space-y-4">
          {/* 퀵 성취도 버튼 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성취도 빠른 입력
            </label>
            <div className="flex gap-2">
              {[0, 25, 50, 75, 100].map((value) => (
                <button
                  key={value}
                  onClick={() => handleQuickAchievement(value)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    achievement === value
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {value}%
                </button>
              ))}
            </div>
          </div>

          {/* 상세 입력 (편집 모드) */}
          {isEditing ? (
            <>
              {/* 슬라이더 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  성취도 세부 조정: {achievement}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={achievement}
                  onChange={(e) => setAchievement(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* 완료량 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  완료량
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max={mission.targetAmount}
                    value={completedAmount}
                    onChange={(e) => setCompletedAmount(Number(e.target.value))}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center"
                  />
                  <span className="text-gray-500">/ {mission.targetAmount}</span>
                </div>
              </div>

              {/* 메모 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  메모 (선택)
                </label>
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="오늘 학습에 대한 메모를 남겨보세요..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none h-20"
                />
              </div>

              {/* 저장 버튼 */}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  저장
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="w-full py-2 text-sm text-orange-500 hover:bg-orange-50 rounded-lg border border-orange-200"
            >
              상세 입력하기
            </button>
          )}

          {/* 상태 변경 버튼 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상태 변경
            </label>
            <div className="flex gap-2">
              {(['pending', 'in_progress', 'completed', 'skipped'] as MissionStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange?.(mission.id, status)}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                    mission.status === status
                      ? STATUS_COLORS[status]
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {STATUS_LABELS[status]}
                </button>
              ))}
            </div>
          </div>

          {/* 멘토 피드백 표시 */}
          {showMentorFeedback && mission.mentorFeedback && (
            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-600 font-medium text-sm">
                  👩‍🏫 멘토 피드백
                </span>
                <span className="text-xs text-yellow-500">
                  {mission.mentorFeedback.type === 'praise' && '칭찬'}
                  {mission.mentorFeedback.type === 'encourage' && '격려'}
                  {mission.mentorFeedback.type === 'warning' && '분발 요청'}
                </span>
                <div className="flex ml-auto">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span 
                      key={i} 
                      className={i < mission.mentorFeedback!.rating ? 'text-yellow-400' : 'text-gray-300'}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-yellow-800">{mission.mentorFeedback.comment}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}




