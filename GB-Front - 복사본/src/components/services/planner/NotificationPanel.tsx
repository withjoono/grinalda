/**
 * 플래너 알림 패널 컴포넌트
 */

import { useNavigate } from '@tanstack/react-router'
import { Bell, Check, Trash2, Settings } from 'lucide-react'
import { 
  useNotificationStore, 
  NOTIFICATION_CONFIG,
  type Notification,
} from '@/stores/client/use-notification-store'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

// ============================================
// 알림 아이템 컴포넌트
// ============================================

function NotificationItem({ 
  notification, 
  onMarkAsRead, 
  onRemove,
  onNavigate,
}: { 
  notification: Notification
  onMarkAsRead: () => void
  onRemove: () => void
  onNavigate: () => void
}) {
  const config = NOTIFICATION_CONFIG[notification.type]
  
  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead()
    }
    if (notification.data?.link) {
      onNavigate()
    }
  }

  return (
    <div 
      className={`p-4 border-b last:border-b-0 transition-colors cursor-pointer hover:bg-gray-50 ${
        !notification.read ? 'bg-ultrasonic-50/50' : ''
      }`}
      onClick={handleClick}
    >
      <div className="flex gap-3">
        {/* 아이콘 */}
        <div className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${config.bgColor}`}>
          <span className="text-lg">{config.icon}</span>
        </div>
        
        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${config.bgColor} ${config.color}`}>
              {config.label}
            </span>
            {!notification.read && (
              <span className="h-2 w-2 rounded-full bg-ultrasonic-500" />
            )}
          </div>
          <h4 className="font-medium text-gray-900 mt-1 truncate">{notification.title}</h4>
          <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{notification.message}</p>
          <p className="text-xs text-gray-400 mt-1">
            {formatDistanceToNow(notification.timestamp, { addSuffix: true, locale: ko })}
          </p>
        </div>
        
        {/* 액션 버튼 */}
        <div className="flex-shrink-0 flex flex-col gap-1">
          {!notification.read && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onMarkAsRead()
              }}
              className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600"
              title="읽음 표시"
            >
              <Check className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500"
            title="삭제"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================
// 알림 버튼 (헤더용)
// ============================================

export function NotificationButton() {
  const {
    unreadCount,
    toggleNotificationPanel,
  } = useNotificationStore()

  return (
    <button
      onClick={toggleNotificationPanel}
      className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
      aria-label={`알림 ${unreadCount > 0 ? `(${unreadCount}개 읽지 않음)` : ''}`}
    >
      <Bell className="h-5 w-5 text-gray-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-ultrasonic-500 text-white text-xs font-bold">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}

// ============================================
// 알림 패널 (Sheet)
// ============================================

export function NotificationPanel() {
  const navigate = useNavigate()
  const {
    notifications,
    unreadCount,
    isNotificationPanelOpen,
    closeNotificationPanel,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotificationStore()

  const handleNavigate = (notification: Notification) => {
    if (notification.data?.link) {
      navigate({ to: notification.data.link })
      closeNotificationPanel()
    }
  }

  return (
    <Sheet open={isNotificationPanelOpen} onOpenChange={(open) => !open && closeNotificationPanel()}>
      <SheetContent className="w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              알림
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-ultrasonic-500 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </SheetTitle>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <CheckCheck className="h-4 w-4 mr-1" />
                  모두 읽음
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs text-gray-500"
                >
                  전체 삭제
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-120px)]">
          {notifications.length > 0 ? (
            <div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={() => markAsRead(notification.id)}
                  onRemove={() => removeNotification(notification.id)}
                  onNavigate={() => handleNavigate(notification)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <Bell className="h-12 w-12 text-gray-300 mb-4" />
              <p className="font-medium">알림이 없습니다</p>
              <p className="text-sm mt-1">새로운 알림이 오면 여기에 표시됩니다</p>
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

// ============================================
// 알림 설정 컴포넌트
// ============================================

export function NotificationSettings() {
  const { settings, updateSettings } = useNotificationStore()

  const settingsItems = [
    { key: 'missionReminder' as const, label: '미션 시작 알림', description: '미션 시작 10분 전 알림' },
    { key: 'missionDeadline' as const, label: '미션 마감 알림', description: '미션 마감 30분 전 알림' },
    { key: 'mentorFeedback' as const, label: '멘토 피드백 알림', description: '새 피드백 도착 시 알림' },
    { key: 'achievement' as const, label: '성취 알림', description: '목표 달성 시 알림' },
    { key: 'notice' as const, label: '공지사항 알림', description: '새 공지사항 알림' },
    { key: 'sound' as const, label: '알림음', description: '알림 시 소리 재생' },
    { key: 'vibrate' as const, label: '진동', description: '알림 시 진동 (모바일)' },
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Settings className="h-5 w-5" />
        알림 설정
      </h3>
      
      <div className="space-y-3">
        {settingsItems.map((item) => (
          <div 
            key={item.key}
            className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
          >
            <div>
              <p className="font-medium text-gray-900">{item.label}</p>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings[item.key]}
                onChange={(e) => updateSettings({ [item.key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-ultrasonic-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-ultrasonic-500"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationPanel

