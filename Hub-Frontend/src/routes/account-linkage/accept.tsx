import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { authClient } from '@/lib/api'
import { Users, Check, X, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/account-linkage/accept')({
  component: AcceptInvitePage,
})

interface InviteInfo {
  code: string
  inviter: {
    id: number
    name: string
    memberType: string
  }
  returnUrl: string | null
  expireAt: string
}

function AcceptInvitePage() {
  const navigate = useNavigate()
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(false)
  const [error, setError] = useState('')

  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')

  useEffect(() => {
    if (!code) {
      setError('초대 코드가 없습니다.')
      setLoading(false)
      return
    }

    const fetchInvite = async () => {
      try {
        const { data } = await authClient.get(`/mentoring/invite/${code}`)
        setInviteInfo(data)
      } catch (err: any) {
        const message = err?.response?.data?.message || '초대 링크가 유효하지 않습니다.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchInvite()
  }, [code])

  const handleAccept = async () => {
    if (!code) return
    setAccepting(true)
    try {
      const { data } = await authClient.post(`/mentoring/invite/${code}/accept`)
      toast.success('계정 연동이 완료되었습니다!')

      if (data.returnUrl) {
        window.location.href = data.returnUrl
      } else {
        navigate({ to: '/account-linkage' })
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || '연동 수락에 실패했습니다.'
      toast.error(message)
    } finally {
      setAccepting(false)
    }
  }

  const handleDecline = () => {
    navigate({ to: '/' })
  }

  const memberTypeLabel = (type: string) => {
    switch (type) {
      case 'student': return '학생'
      case 'parent': return '학부모'
      case 'teacher': return '선생님'
      default: return type
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-orange-500" />
          <p className="mt-4 text-gray-500">초대 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-red-400" />
          <h2 className="mt-4 text-xl font-bold text-red-600">초대 오류</h2>
          <p className="mt-2 text-sm text-red-500">{error}</p>
          <button
            onClick={() => navigate({ to: '/' })}
            className="mt-6 rounded-xl bg-gray-200 px-6 py-2 font-medium text-gray-700 hover:bg-gray-300 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-lg text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100">
          <Users className="h-10 w-10 text-orange-500" />
        </div>

        <h2 className="text-xl font-bold text-gray-800">계정 연동 초대</h2>

        <div className="my-6 rounded-xl bg-gray-50 p-4">
          <p className="text-lg font-bold text-gray-800">
            {inviteInfo?.inviter.name}
          </p>
          <p className="text-sm text-gray-500">
            {memberTypeLabel(inviteInfo?.inviter.memberType || '')}
          </p>
        </div>

        <p className="mb-6 text-sm text-gray-500">
          위 사용자가 계정 연동을 요청했습니다.<br />
          수락하면 서로의 정보를 공유할 수 있습니다.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            className="flex-1 rounded-xl border-2 border-gray-300 px-4 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-100 flex items-center justify-center gap-2"
          >
            <X className="h-5 w-5" />
            거절
          </button>
          <button
            onClick={handleAccept}
            disabled={accepting}
            className="flex-1 rounded-xl bg-orange-500 px-4 py-3 font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {accepting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                처리 중...
              </>
            ) : (
              <>
                <Check className="h-5 w-5" />
                수락
              </>
            )}
          </button>
        </div>

        {inviteInfo?.expireAt && (
          <p className="mt-4 text-xs text-gray-400">
            만료: {new Date(inviteInfo.expireAt).toLocaleString('ko-KR')}
          </p>
        )}
      </div>
    </div>
  )
}
