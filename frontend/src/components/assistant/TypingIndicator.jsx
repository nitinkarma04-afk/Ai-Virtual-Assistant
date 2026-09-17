import React from 'react'
import { Bot, Sparkles } from 'lucide-react'

export const TypingIndicator = ({ assistantName = 'Assistant' }) => {
  return (
    <div className="flex items-start gap-2 sm:gap-3 max-w-2xl animate-fade-in text-left">
      {/* Assistant Avatar */}
      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-cyan-500/20 mt-0.5 sm:mt-1">
        <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>

      {/* Typing Bubble */}
      <div className="p-3 sm:p-3.5 rounded-2xl rounded-tl-sm bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-xl shadow-sm dark:shadow-lg space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] sm:text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-medium">
            {assistantName} is thinking
          </span>
          <Sparkles className="w-3 h-3 text-cyan-500 dark:text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        {/* Pulsing Dots */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <div
            className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: '0ms', animationDuration: '1s' }}
          />
          <div
            className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
            style={{ animationDelay: '150ms', animationDuration: '1s' }}
          />
          <div
            className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"
            style={{ animationDelay: '300ms', animationDuration: '1s' }}
          />
        </div>
      </div>
    </div>
  )
}

export default TypingIndicator
