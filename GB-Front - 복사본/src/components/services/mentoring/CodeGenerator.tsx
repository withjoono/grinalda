import { useState, useEffect, useCallback } from 'react'
import { authClient } from '@/lib/api'

interface CodeGeneratorProps {
  onCodeGenerated?: (code: string) => void
}

interface GenerateCodeResponse {
  success: boolean
  data?: {
    code: string
    time: string
  }
  msg?: string
}

export function CodeGenerator({ onCodeGenerated }: CodeGeneratorProps) {
  const [code, setCode] = useState<string>('')
  const [expireTime, setExpireTime] = useState<string>('')
  const [timeLeft, setTimeLeft] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const calculateTimeLeft = useCallback(() => {
    if (!expireTime) return ''

    const difference = new Date(expireTime).getTime() - new Date().getTime()
    if (difference > 0) {
      const minutes = Math.floor((difference / 1000 / 60) % 60)
      const seconds = Math.floor((difference / 1000) % 60)
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
    return '00:00'
  }, [expireTime])

  useEffect(() => {
    if (!expireTime) return

    setTimeLeft(calculateTimeLeft())
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [expireTime, calculateTimeLeft])

  const handleGenerateCode = async () => {
    setIsLoading(true)
    try {
      const response = await authClient.post<GenerateCodeResponse>('/mentoring/generate-code')
      const data = response.data

      if (data.success && data.data) {
        setCode(data.data.code)
        setExpireTime(data.data.time)
        onCodeGenerated?.(data.data.code)
      } else {
        alert(data.msg || '코드 생성에 실패했습니다.')
      }
    } catch (error) {
      console.error('코드 생성 오류:', error)
      alert('코드 생성 중 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyCode = async () => {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      alert('코드가 복사되었습니다.')
    } catch (error) {
      console.error('복사 실패:', error)
    }
  }

  return (
    <div className="rounded border border-gray-300 shadow-md p-6">
      <h2 className="text-xl font-bold mb-5">연계 코드 생성</h2>

      <div className="relative mb-5">
        <input
          type="text"
          value={code}
          readOnly
          placeholder="연계 코드 생성"
          className="w-full h-12 px-5 bg-gray-100 border border-gray-300 rounded"
        />
        {code && (
          <button
            onClick={handleCopyCode}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-cyan-500 hover:text-cyan-600"
          >
            복사
          </button>
        )}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handleGenerateCode}
          disabled={isLoading}
          className="px-6 py-2 border-2 border-orange-500 text-orange-500 rounded font-bold text-sm hover:bg-orange-500 hover:text-white transition-colors disabled:opacity-50"
        >
          {isLoading ? '생성 중...' : '코드 생성'}
        </button>

        <div className="text-sm">
          <span className="text-gray-500 mr-2">제한시간</span>
          <span className={timeLeft === '00:00' ? 'text-red-500' : ''}>{timeLeft || '--:--'}</span>
        </div>
      </div>
    </div>
  )
}
