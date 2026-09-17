import React from 'react'
import { Calendar } from 'lucide-react'
import { ConversationHistoryItem } from './ConversationHistoryItem'

/**
 * Group conversations by formatted date label ("Today", "Yesterday", or Date String)
 */
const groupConversationsByDate = (conversations) => {
  const groups = {}

  const todayStr = new Date().toDateString()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toDateString()

  conversations.forEach((item) => {
    const itemDate = new Date(item.createdAt || item.timestamp || Date.now())
    const itemDateStr = itemDate.toDateString()

    let groupLabel = itemDate.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })

    if (itemDateStr === todayStr) {
      groupLabel = 'Today'
    } else if (itemDateStr === yesterdayStr) {
      groupLabel = 'Yesterday'
    }

    if (!groups[groupLabel]) {
      groups[groupLabel] = []
    }
    groups[groupLabel].push(item)
  })

  return groups
}

export const ConversationHistoryList = ({ conversations, onItemClick }) => {
  const grouped = groupConversationsByDate(conversations)

  return (
    <div className="w-full space-y-8">
      {Object.entries(grouped).map(([dateLabel, items]) => (
        <div key={dateLabel} className="space-y-3">
          {/* Section Date Header */}
          <div className="flex items-center gap-2 px-1 text-xs font-mono font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
            <span>{dateLabel}</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-normal">
              {items.length} {items.length === 1 ? 'conversation' : 'conversations'}
            </span>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {items.map((item, idx) => (
              <ConversationHistoryItem
                key={item._id || item.id || `hist-item-${idx}`}
                conversation={item}
                onClick={() => onItemClick(item)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ConversationHistoryList
