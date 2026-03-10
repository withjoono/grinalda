import { useState, useCallback } from 'react'
import { Send, MessageSquare, User, UserCircle } from 'lucide-react'

export interface Memo {
  id: number
  content: string
  author: 'mentor' | 'student'
  authorName: string
  createdAt: string
  isRead: boolean
}

interface MemoBoardProps {
  memos?: Memo[]
  currentUserType: 'mentor' | 'student'
  studentName: string
  mentorName?: string
  onSendMemo?: (content: string) => void
  onMarkAsRead?: (memoId: number) => void
}

export function MemoBoard({
  memos = [],
  currentUserType,
  studentName,
  mentorName = '멘토',
  onSendMemo,
  onMarkAsRead,
}: MemoBoardProps) {
  const [newMemo, setNewMemo] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSend = useCallback(async () => {
    if (!newMemo.trim() || isSending) return

    setIsSending(true)
    try {
      await onSendMemo?.(newMemo.trim())
      setNewMemo('')
    } finally {
      setIsSending(false)
    }
  }, [newMemo, isSending, onSendMemo])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }, [handleSend])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 bg-gray-50">
        <MessageSquare className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold">
          {currentUserType === 'mentor'
            ? `${studentName} 학생과의 메모`
            : `${mentorName}님과의 메모`
          }
        </h3>
        {memos.filter(m => !m.isRead && m.author !== currentUserType).length > 0 && (
          <span className="px-2 py-0.5 text-xs font-medium bg-red-500 text-white rounded-full">
            {memos.filter(m => !m.isRead && m.author !== currentUserType).length}
          </span>
        )}
      </div>

      {/* 메모 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[200px] max-h-[400px]">
        {memos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8">
            <MessageSquare className="w-12 h-12 mb-3 opacity-50" />
            <p>아직 메모가 없습니다.</p>
            <p className="text-sm">첫 메모를 남겨보세요!</p>
          </div>
        ) : (
          memos.map((memo) => {
            const isMine = memo.author === currentUserType
            return (
              <div
                key={memo.id}
                className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                onClick={() => !memo.isRead && !isMine && onMarkAsRead?.(memo.id)}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    isMine
                      ? 'bg-blue-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                  }`}
                >
                  {/* 작성자 */}
                  <div className={`flex items-center gap-1.5 mb-1 text-xs ${
                    isMine ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {isMine ? (
                      <User className="w-3 h-3" />
                    ) : (
                      <UserCircle className="w-3 h-3" />
                    )}
                    <span>{memo.authorName}</span>
                  </div>

                  {/* 내용 */}
                  <p className="whitespace-pre-wrap break-words">
                    {memo.content}
                  </p>

                  {/* 시간 및 읽음 표시 */}
                  <div className={`flex items-center justify-end gap-2 mt-1.5 text-xs ${
                    isMine ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    <span>{formatDate(memo.createdAt)}</span>
                    {isMine && (
                      <span className={memo.isRead ? 'text-yellow-300' : ''}>
                        {memo.isRead ? '읽음' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* 입력 영역 */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-end gap-2">
          <textarea
            value={newMemo}
            onChange={(e) => setNewMemo(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="메모를 입력하세요..."
            rows={2}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSend}
            disabled={!newMemo.trim() || isSending}
            className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
              newMemo.trim() && !isSending
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          Enter로 전송, Shift+Enter로 줄바꿈
        </p>
      </div>
    </div>
  )
}
