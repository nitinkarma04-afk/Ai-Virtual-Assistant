import React from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Sparkles, SearchX } from 'lucide-react'
import { Button } from '../common/Button'

export const HistoryEmptyState = ({ isSearch = false, onResetSearch }) => {
  if (isSearch) {
    return (
      <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl my-6 shadow-sm dark:shadow-none">
        <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white tracking-tight">No matching conversations</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-6">
          No conversations match your search. Try different keywords.
        </p>
        {onResetSearch && (
          <Button variant="glass" size="sm" onClick={onResetSearch}>
            Clear Search
          </Button>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-3xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl my-6 relative overflow-hidden shadow-sm dark:shadow-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-400/30 dark:border-cyan-500/30 flex items-center justify-center text-cyan-600 dark:text-cyan-300 mb-4 shadow-xl shadow-cyan-500/10 relative z-10">
        <MessageSquare className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight relative z-10">
        No Conversations Yet
      </h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mt-2 mb-6 leading-relaxed relative z-10">
        Start a conversation with your assistant and it will appear here.
      </p>

      <Link to="/dashboard" className="relative z-10">
        <Button variant="glow" icon={Sparkles}>
          Start a Conversation
        </Button>
      </Link>
    </div>
  )
}

export default HistoryEmptyState
