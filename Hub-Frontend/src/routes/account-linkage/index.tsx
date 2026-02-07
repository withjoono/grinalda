import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useMemo } from 'react'
import { authClient } from '@/lib/api'
import { Copy, Check, Link2, UserPlus, Users, Trash2, Loader2, GraduationCap, Heart, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/account-linkage/')({
    component: AccountLinkagePage,
})

interface LinkedAccount {
    linkId: number
    partnerId: number
    partnerName: string
    partnerType: string
    linkedAt: string
}

const ACCOUNT_GROUPS = [
    { key: 'student', label: '학생', icon: GraduationCap, color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-500' },
    { key: 'parent', label: '학부모', icon: Heart, color: 'pink', bgColor: 'bg-pink-100', textColor: 'text-pink-500' },
    { key: 'teacher', label: '선생님', icon: BookOpen, color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-500' },
] as const

function AccountLinkagePage() {
    const [inviteCode, setInviteCode] = useState('')
    const [inviteLoading, setInviteLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([])
    const [linksLoading, setLinksLoading] = useState(true)
    const [unlinkingId, setUnlinkingId] = useState<number | null>(null)

    const hubUrl = window.location.origin

    // 연동 목록 불러오기
    const fetchLinkedAccounts = async () => {
        try {
            setLinksLoading(true)
            const { data } = await authClient.get('/mentoring/links')
            setLinkedAccounts(Array.isArray(data) ? data : [])
        } catch {
            console.error('연동 목록 조회 실패')
        } finally {
            setLinksLoading(false)
        }
    }

    useEffect(() => {
        fetchLinkedAccounts()
    }, [])

    // 타입별로 그룹화
    const groupedAccounts = useMemo(() => {
        const groups: Record<string, LinkedAccount[]> = {
            student: [],
            parent: [],
            teacher: [],
        }
        linkedAccounts.forEach((account) => {
            const type = account.partnerType || 'student'
            if (groups[type]) {
                groups[type].push(account)
            } else {
                groups.student.push(account) // fallback
            }
        })
        return groups
    }, [linkedAccounts])

    // 초대 링크 생성
    const handleCreateInvite = async () => {
        setInviteLoading(true)
        try {
            const { data } = await authClient.post('/mentoring/invite')
            setInviteCode(data.code)
            setCopied(false)
        } catch {
            toast.error('초대 링크 생성에 실패했습니다.')
        } finally {
            setInviteLoading(false)
        }
    }

    // 링크 복사
    const handleCopy = () => {
        const link = `${hubUrl}/account-linkage/accept?code=${inviteCode}`
        navigator.clipboard.writeText(link)
        setCopied(true)
        toast.success('초대 링크가 복사되었습니다.')
        setTimeout(() => setCopied(false), 3000)
    }

    // 연동 해제
    const handleUnlink = async (linkId: number) => {
        if (!confirm('정말 연동을 해제하시겠습니까?')) return
        setUnlinkingId(linkId)
        try {
            await authClient.delete(`/mentoring/links/${linkId}`)
            toast.success('연동이 해제되었습니다.')
            fetchLinkedAccounts()
        } catch {
            toast.error('연동 해제에 실패했습니다.')
        } finally {
            setUnlinkingId(null)
        }
    }

    const inviteLink = inviteCode
        ? `${hubUrl}/account-linkage/accept?code=${inviteCode}`
        : ''

    return (
        <div className="mx-auto max-w-3xl px-4 py-8">
            {/* 헤더 */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Users className="h-7 w-7 text-orange-500" />
                    계정 연동
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    초대 링크를 생성하여 멘토/멘티 계정을 연동할 수 있습니다.
                </p>
            </div>

            {/* 초대 링크 생성 */}
            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-lg font-bold flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-blue-500" />
                    초대 링크 생성
                </h2>

                <div className="mb-4 rounded-xl bg-gray-50 p-4 text-sm text-gray-600 space-y-1">
                    <p>1. 아래 버튼을 눌러 초대 링크를 생성합니다.</p>
                    <p>2. 생성된 링크를 카톡이나 문자로 상대에게 보냅니다.</p>
                    <p>3. 상대가 링크를 클릭하면 계정이 연동됩니다.</p>
                    <p className="text-orange-500 font-medium">※ 링크는 24시간 동안 유효합니다.</p>
                </div>

                {!inviteCode ? (
                    <button
                        onClick={handleCreateInvite}
                        disabled={inviteLoading}
                        className="w-full rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition-colors hover:bg-orange-600 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {inviteLoading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                생성 중...
                            </>
                        ) : (
                            <>
                                <Link2 className="h-5 w-5" />
                                초대 링크 생성하기
                            </>
                        )}
                    </button>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-100 px-4 py-3">
                            <Link2 className="h-4 w-4 flex-shrink-0 text-gray-400" />
                            <span className="flex-1 truncate text-sm font-mono text-gray-700">
                                {inviteLink}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleCopy}
                                className="flex-1 rounded-xl border-2 border-orange-500 px-6 py-3 font-bold text-orange-500 transition-colors hover:bg-orange-500 hover:text-white flex items-center justify-center gap-2"
                            >
                                {copied ? (
                                    <>
                                        <Check className="h-5 w-5" />
                                        복사됨!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="h-5 w-5" />
                                        링크 복사
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleCreateInvite}
                                disabled={inviteLoading}
                                className="rounded-xl border-2 border-gray-300 px-6 py-3 font-bold text-gray-600 transition-colors hover:bg-gray-100 flex items-center justify-center gap-2"
                            >
                                새 링크
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 연동된 계정 목록 - 타입별 그룹 */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-green-500" />
                    연동된 계정
                </h2>

                {linksLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                ) : linkedAccounts.length > 0 ? (
                    <div className="space-y-6">
                        {ACCOUNT_GROUPS.map((group) => {
                            const accounts = groupedAccounts[group.key] || []
                            if (accounts.length === 0) return null

                            const Icon = group.icon
                            return (
                                <div key={group.key}>
                                    {/* 그룹 헤더 */}
                                    <div className="mb-3 flex items-center gap-2">
                                        <div className={`flex h-7 w-7 items-center justify-center rounded-full ${group.bgColor}`}>
                                            <Icon className={`h-4 w-4 ${group.textColor}`} />
                                        </div>
                                        <h3 className="font-bold text-gray-700">{group.label}</h3>
                                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                                            {accounts.length}명
                                        </span>
                                    </div>

                                    {/* 계정 리스트 */}
                                    <div className="space-y-2 pl-2">
                                        {accounts.map((account) => (
                                            <div
                                                key={account.linkId}
                                                className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`flex h-9 w-9 items-center justify-center rounded-full ${group.bgColor}`}>
                                                        <Icon className={`h-4 w-4 ${group.textColor}`} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm">{account.partnerName}</p>
                                                        <p className="text-xs text-gray-400">
                                                            {new Date(account.linkedAt).toLocaleDateString('ko-KR')} 연동
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleUnlink(account.linkId)}
                                                    disabled={unlinkingId === account.linkId}
                                                    className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                                                    title="연동 해제"
                                                >
                                                    {unlinkingId === account.linkId ? (
                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-400">
                        <Users className="mx-auto mb-2 h-10 w-10" />
                        <p>연동된 계정이 없습니다.</p>
                        <p className="text-xs mt-1">위에서 초대 링크를 생성하여 계정을 연동해보세요.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
