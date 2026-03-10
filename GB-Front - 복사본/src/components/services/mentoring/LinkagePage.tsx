import { useState, useEffect, useCallback } from 'react'
import { authClient } from '@/lib/api'
import type { StudentInfo, GenerateCodeResponse, VerifyCodeResponse } from './types'

interface LinkagePageProps {
  gradeCodeMap?: Record<string, string>
}

export function LinkagePage({ gradeCodeMap = {} }: LinkagePageProps) {
  // 코드 생성 상태
  const [generatedCode, setGeneratedCode] = useState('')
  const [expireTime, setExpireTime] = useState('')
  const [timeLeft, setTimeLeft] = useState<[number, number]>([0, 0])

  // 코드 입력 상태
  const [inputCode, setInputCode] = useState('')
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null)

  const calculateTimeLeft = useCallback((): [number, number] => {
    if (!expireTime) return [0, 0]
    const difference = new Date(expireTime).getTime() - new Date().getTime()
    if (difference > 0) {
      return [
        Math.floor((difference / 1000 / 60) % 60),
        Math.floor((difference / 1000) % 60),
      ]
    }
    return [0, 0]
  }, [expireTime])

  useEffect(() => {
    if (!expireTime) return

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [expireTime, calculateTimeLeft])

  // 코드 생성
  const handleGenerateCode = async () => {
    try {
      const { data } = await authClient.post<GenerateCodeResponse>('/mentoring/generate-code')

      if (!data.success) {
        alert('로그인 하거나 개인정보 수정해주세요')
        return
      }

      if (data.data) {
        setGeneratedCode(data.data.code)
        setExpireTime(data.data.time)
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 코드 확인
  const handleVerifyCode = async () => {
    try {
      const { data } = await authClient.get<VerifyCodeResponse>(`/mentoring/verify-code?code=${inputCode}`)

      if (data.success === 'over') {
        alert('이미 연동된 계정입니다.')
        return
      }
      if (data.success === 'self') {
        alert('자신과 연동하실 수 없습니다')
        return
      }
      if (data.success === 'overlap') {
        alert('잘못된 연동입니다')
        return
      }
      if (data.success === 'par') {
        alert('자녀만 연동 가능합니다')
        return
      }
      if (data.success === 'teach') {
        alert('학생만 연동 가능합니다')
        return
      }

      if (data.data) {
        setStudentInfo({
          name: data.data.info.user_name || '미등록',
          grade: gradeCodeMap[data.data.info.gradeCode] || '미등록',
          school: data.data.info.school || '미등록',
          hagwon: data.data.info.hagwon || '미등록',
          mentorAccount: data.data.mento_account,
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  // 계정 등록
  const handleSubmitAccount = async () => {
    if (!studentInfo) {
      alert('코드를 입력해주세요')
      return
    }

    try {
      await authClient.get(`/mentoring/add-link?id=${studentInfo.mentorAccount}`)
      alert('연동되었습니다')
      setStudentInfo(null)
      setInputCode('')
    } catch (error) {
      console.error(error)
    }
  }

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
      alert('코드가 복사되었습니다.')
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* 안내 박스 */}
      <div className="mb-8 rounded-3xl border border-gray-400 p-5">
        <div className="space-y-1 text-sm">
          <p>1. 멘토가 관리를 원하는 멘티(학생)에게 연계코드를 생성해서 보냅니다.</p>
          <p>2. 코드를 받은 멘티(학생)는 거북스쿨에 접속해서, 타계정연계란에 받은 코드를 입력합니다.</p>
          <p>3. 멘토의 경우, 관리자페이지에, 코드 연계한 멘티들의 계정 리스트가 보여집니다.</p>
          <p>4. 계정 연계한 멘티 역시 관리자 페이지에, 본인 계정에 접속 가능한, 멘토 계정리스트가 보여집니다.</p>
          <p>5. 멘토는 언제든 멘티계정으로 접속해서, 멘티의 학습계획 성취정도, 수업계획, 모의 성적, 내신 성적 등을 체크하고 관리할 수 있습니다.</p>
        </div>
      </div>

      {/* 연계 코드 생성 */}
      <h1 className="mb-4 text-2xl font-bold">연계 코드 생성</h1>
      <div className="mb-8 flex items-center rounded-2xl border border-gray-400 p-6">
        <div className="mr-4 flex-1 rounded-2xl border border-gray-400 bg-gray-100 p-3">
          <div className="flex items-center">
            <span>연계코드 : {generatedCode}</span>
            {generatedCode && (
              <button
                onClick={copyToClipboard}
                className="ml-5 cursor-pointer underline underline-offset-4"
              >
                복사하기
              </button>
            )}
          </div>
          <div className="mt-1 text-red-500">
            제한시간 : {timeLeft[0]}:{String(timeLeft[1]).padStart(2, '0')}
          </div>
        </div>
        <button
          onClick={handleGenerateCode}
          className="rounded-lg border-2 border-orange-500 px-8 py-3 font-bold text-orange-500 transition-colors hover:bg-orange-500 hover:text-white"
        >
          코드생성
        </button>
      </div>

      {/* 타 계정 연계 */}
      <h1 className="mb-4 text-2xl font-bold">타 계정 연계</h1>
      <div className="rounded-2xl border border-gray-400 p-6">
        <div className="mb-4 flex">
          <input
            type="text"
            placeholder="코드를 입력하세요."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="mr-4 flex-1 rounded-lg border border-gray-400 bg-gray-100 p-3"
          />
          <button
            onClick={handleVerifyCode}
            className="rounded-lg border-2 border-orange-500 px-8 py-3 font-bold text-orange-500 transition-colors hover:bg-orange-500 hover:text-white"
          >
            코드 입력
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-1 gap-4">
            <div className="flex flex-1 items-center justify-between rounded-3xl border border-gray-400 bg-gray-100 p-3">
              <span>이름:</span>
              <span>{studentInfo?.name || ''}</span>
            </div>
            <div className="flex flex-1 items-center justify-between rounded-3xl border border-gray-400 bg-gray-100 p-3">
              <span>학년:</span>
              <span>{studentInfo?.grade || ''}</span>
            </div>
            <div className="flex flex-1 items-center justify-between rounded-3xl border border-gray-400 bg-gray-100 p-3">
              <span>학교:</span>
              <span>{studentInfo?.school || ''}</span>
            </div>
          </div>
          <button
            onClick={handleSubmitAccount}
            className="ml-4 rounded-lg bg-orange-500 px-8 py-3 font-bold text-white transition-colors hover:bg-orange-600"
          >
            이 계정을 등록하기
          </button>
        </div>
      </div>
    </div>
  )
}
