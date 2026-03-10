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
      <div className="mb-6 flex">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 border py-3 text-center text-lg font-bold transition-colors ${
              activeTab === tab.id
                ? 'border-orange-500 text-orange-500'
                : 'border-gray-300 text-gray-400 hover:text-gray-600'
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
