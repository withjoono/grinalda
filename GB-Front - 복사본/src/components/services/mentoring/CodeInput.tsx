import { useState } from 'react'
import { authClient } from '@/lib/api'
import type { StudentInfo, VerifyCodeResponse, LinkResponse } from './types'

interface CodeInputProps {
  gradeCodeMap?: Record<string, string>
  onLinkSuccess?: () => void
}

export function CodeInput({ gradeCodeMap = {}, onLinkSuccess }: CodeInputProps) {
  const [inputCode, setInputCode] = useState('')
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerifyCode = async () => {
    if (!inputCode.trim()) {
      alert('코드를 입력해주세요.')
      return
    }

    setIsLoading(true)
    try {
      const { data } = await authClient.get<VerifyCodeResponse>(`/mentoring/verify-code?code=${inputCode}`)

      // 에러 케이스 처리
      if (data.success === 'over') {
        alert('이미 연동된 계정입니다.')
        return
      }
      if (data.success === 'self') {
        alert('자신과 연동하실 수 없습니다.')
        return
      }
      if (data.success === 'overlap') {
        alert('같은 직종끼리 연동할 수 없습니다.')
        return
      }
      if (data.success === 'par') {
        alert('자녀만 연동 가능합니다.')
        return
      }
      if (data.success === 'teach') {
        alert('학생만 연동 가능합니다.')
        return
      }

      if (data.success === true && data.data) {
        setStudentInfo({
          name: data.data.info.user_name || '미등록',
          grade: gradeCodeMap[data.data.info.gradeCode] || '미등록',
          school: data.data.info.school || '미등록',
          mentorAccount: data.data.mento_account,
        })
      }
    } catch (error) {
      console.error('코드 확인 오류:', error)
      alert('코드 확인 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegisterAccount = async () => {
    if (!studentInfo) {
      alert('먼저 코드를 조회해주세요.')
      return
    }

    try {
      const { data } = await authClient.get<LinkResponse>(`/mentoring/add-link?id=${studentInfo.mentorAccount}`)

      if (data.success) {
        alert('연동되었습니다.')
        setStudentInfo(null)
        setInputCode('')
        onLinkSuccess?.()
      } else {
        alert('연동에 실패했습니다.')
      }
    } catch (error) {
      console.error('계정 등록 오류:', error)
      alert('계정 등록 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="rounded border border-gray-300 p-6 shadow-md">
      <h2 className="mb-5 text-xl font-bold">타 계정 연계</h2>

      {/* 코드 입력 */}
      <div className="mb-5 flex gap-4">
        <input
          type="text"
          value={inputCode}
          onChange={(e) => setInputCode(e.target.value)}
          placeholder="코드를 입력해 주세요"
          className="h-12 flex-1 rounded border border-gray-300 bg-gray-100 px-5"
        />
        <button
          onClick={handleVerifyCode}
          disabled={isLoading}
          className="rounded border-2 border-orange-500 px-6 py-2 text-sm font-bold text-orange-500 transition-colors hover:bg-orange-500 hover:text-white disabled:opacity-50"
        >
          {isLoading ? '조회 중...' : '코드 조회하기'}
        </button>
      </div>

      {/* 구분선 */}
      <div className="my-6 h-px bg-gray-400" />

      {/* 학생 정보 */}
      <h3 className="mb-4 font-bold">코드 학생 정보</h3>
      <div className="mb-4 flex gap-4">
        <div className="flex flex-1 items-center justify-between rounded border border-gray-300 bg-gray-100 px-4 py-3 text-sm">
          <span className="text-gray-500">이름</span>
          <span className="font-bold">{studentInfo?.name || '-'}</span>
        </div>
        <div className="flex flex-1 items-center justify-between rounded border border-gray-300 bg-gray-100 px-4 py-3 text-sm">
          <span className="text-gray-500">학년</span>
          <span className="font-bold">{studentInfo?.grade || '-'}</span>
        </div>
        <div className="flex flex-1 items-center justify-between rounded border border-gray-300 bg-gray-100 px-4 py-3 text-sm">
          <span className="text-gray-500">학교</span>
          <span className="font-bold">{studentInfo?.school || '-'}</span>
        </div>
      </div>

      {/* 등록 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleRegisterAccount}
          disabled={!studentInfo}
          className="rounded bg-orange-500 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          계정 등록하기
        </button>
      </div>
    </div>
  )
}
