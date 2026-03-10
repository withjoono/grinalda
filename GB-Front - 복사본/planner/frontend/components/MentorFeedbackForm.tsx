'use client'

import { useState } from 'react'
import {
  SUBJECT_COLORS,
  type DailyMission,
  type MentorFeedback,
  type FeedbackType,
} from '../types'

interface MentorFeedbackFormProps {
  mission: DailyMission
  onSubmit: (feedback: Omit<MentorFeedback, 'id' | 'checkedAt'>) => void
  onCancel: () => void
}

const FEEDBACK_TYPES: { value: FeedbackType; label: string; emoji: string; color: string }[] = [
  { value: 'praise', label: '칭찬', emoji: '🎉', color: 'bg-green-500' },
  { value: 'encourage', label: '격려', emoji: '💪', color: 'bg-blue-500' },
  { value: 'warning', label: '분발 요청', emoji: '⚠️', color: 'bg-red-500' },
]

const QUICK_COMMENTS: Record<FeedbackType, string[]> = {
  praise: [
    '오늘 정말 잘했어요! 👏',
    '계획대로 착실히 진행하고 있네요!',
    '성취도가 높아서 기특해요!',
    '이 조자로 계속 가면 목표 달성 확실해요!',
  ],
  encourage: [
    '조금만 더 힘내세요!',
    '내일은 더 잘할 수 있을 거예요!',
    '어려운 부분이 있으면 질문해주세요.',
    '포기하지 말고 꾸준히 해봐요!',
  ],
  warning: [
    '오늘 계획을 다시 점검해보세요.',
    '집중력이 떨어진 것 같아요. 컨디션 관리 필요해요.',
    '목표량에 많이 못 미쳤어요. 내일은 더 노력해주세요.',
    '이유가 있다면 말씀해주세요.',
  ],
}

export function MentorFeedbackForm({ mission, onSubmit, onCancel }: MentorFeedbackFormProps) {
  const [rating, setRating] = useState<1 | 2 | 3 | 4 | 5>(3)
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('encourage')
  const [comment, setComment] = useState('')
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)

  const subjectColor = SUBJECT_COLORS[mission.subject] || SUBJECT_COLORS['기타']

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      missionId: mission.id,
      mentorId: 0, // 실제로는 로그인된 멘토 ID
      rating,
      type: feedbackType,
      comment,
    })
  }

  const handleQuickComment = (text: string) => {
    setComment(prev => prev ? `${prev}\n${text}` : text)
  }

  // 성취도에 따른 자동 추천
  const getRecommendedType = (): FeedbackType => {
    if (mission.achievement >= 80) return 'praise'
    if (mission.achievement >= 50) return 'encourage'
    return 'warning'
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg overflow-hidden max-w-lg mx-auto">
      {/* 헤더: 미션 정보 */}
      <div className="p-4 border-b" style={{ backgroundColor: `${subjectColor}15` }}>
        <div className="flex items-center gap-3">
          <div 
            className="w-2 h-12 rounded-full"
            style={{ backgroundColor: subjectColor }}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span 
                className="text-xs font-medium px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: subjectColor }}
              >
                {mission.subject}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(mission.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{mission.title}</h3>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>완료: {mission.completedAmount}/{mission.targetAmount}</span>
              <span className="font-medium" style={{ color: subjectColor }}>
                성취도: {mission.achievement}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* 평가 점수 (별점) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            평가 점수
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star as 1 | 2 | 3 | 4 | 5)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(null)}
                className="p-1 transition-transform hover:scale-110"
              >
                <svg
                  className={`w-8 h-8 transition-colors ${
                    star <= (hoveredRating ?? rating)
                      ? 'text-yellow-400 fill-yellow-400'
                      : 'text-gray-300'
                  }`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                  />
                </svg>
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500">
              {rating === 1 && '많이 부족해요'}
              {rating === 2 && '노력이 필요해요'}
              {rating === 3 && '보통이에요'}
              {rating === 4 && '잘했어요'}
              {rating === 5 && '최고예요!'}
            </span>
          </div>
        </div>

        {/* 피드백 유형 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              피드백 유형
            </label>
            <button
              type="button"
              onClick={() => setFeedbackType(getRecommendedType())}
              className="text-xs text-orange-500 hover:underline"
            >
              성취도 기반 추천
            </button>
          </div>
          <div className="flex gap-2">
            {FEEDBACK_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setFeedbackType(type.value)}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                  feedbackType === type.value
                    ? `${type.color} text-white shadow-md`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span className="mr-1">{type.emoji}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* 빠른 코멘트 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            빠른 코멘트
          </label>
          <div className="flex flex-wrap gap-2">
            {QUICK_COMMENTS[feedbackType].map((text, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleQuickComment(text)}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                {text}
              </button>
            ))}
          </div>
        </div>

        {/* 코멘트 입력 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            코멘트
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="학생에게 전할 피드백을 작성해주세요..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none h-28 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>

        {/* 미리보기 */}
        {comment && (
          <div className={`p-3 rounded-lg border ${
            feedbackType === 'praise' ? 'bg-green-50 border-green-200' :
            feedbackType === 'encourage' ? 'bg-blue-50 border-blue-200' :
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium">
                {FEEDBACK_TYPES.find(t => t.value === feedbackType)?.emoji}
                {' '}미리보기
              </span>
              <div className="flex ml-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment}</p>
          </div>
        )}
      </div>

      {/* 버튼 */}
      <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-white font-medium transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          className="px-6 py-2.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-medium transition-colors shadow-md"
        >
          피드백 저장
        </button>
      </div>
    </form>
  )
}




