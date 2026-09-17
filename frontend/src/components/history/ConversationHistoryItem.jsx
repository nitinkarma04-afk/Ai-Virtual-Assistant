import React from 'react'
import { Clock, ChevronRight } from 'lucide-react'

export const ConversationHistoryItem = ({ conversation, onClick }) => {
  const rawTimestamp = conversation?.createdAt || conversation?.timestamp
  const formattedTime = rawTimestamp
    ? new Date(rawTimestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <div
      onClick={onClick}
      className="group p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-900/90 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-300 dark:hover:border-cyan-500/40 transition-all duration-200 cursor-pointer shadow-sm dark:shadow-lg hover:shadow-md dark:hover:shadow-cyan-500/5 flex flex-col gap-3 relative overflow-hidden"
    >
      {/* Top Metadata Row */}
      <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-400 dark:text-slate-400">
        <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400/90">
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedTime}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
          <span>View</span>
          <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* User Prompt Snippet */}
      <div className="flex items-start gap-2.5">
        <span className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/20 mt-0.5">
          YOU
        </span>
        <p className="text-sm font-medium text-slate-800 dark:text-slate-100 line-clamp-2 leading-relaxed">
          {conversation.message}
        </p>
      </div>

      {/* Assistant Response Snippet */}
      <div className="flex items-start gap-2.5 pt-1 border-t border-slate-100 dark:border-slate-800/40">
        <span className="shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 mt-0.5">
          AI
        </span>
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans">
          {conversation.response}
        </p>
      </div>
    </div>
  )
}

export default ConversationHistoryItem
