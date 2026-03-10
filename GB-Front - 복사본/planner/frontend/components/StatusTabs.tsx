'use client'

import { useState, ReactNode } from 'react'

interface Tab {
  id: string
  label: string
  content: ReactNode
}

interface StatusTabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export function StatusTabs({ tabs, defaultTab }: StatusTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id || '')

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content

  return (
    <div>
      {/* 탭 버튼 */}
      <div className="flex mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-center font-bold text-lg border transition-colors ${
              activeTab === tab.id
                ? 'text-orange-500 border-orange-500'
                : 'text-gray-400 border-gray-300 hover:text-gray-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 컨텐츠 */}
      <div>{activeContent}</div>
    </div>
  )
}
