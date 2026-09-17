import React from 'react'
import { Sparkles, ArrowUpRight, Zap, MessageSquare, Code2, Compass } from 'lucide-react'

export const SuggestedPrompts = ({ onSelectPrompt, assistantName = 'Assistant' }) => {
  const suggestions = [
    {
      icon: Zap,
      label: 'What can you help me with?',
      tag: 'Capabilities',
    },
    {
      icon: MessageSquare,
      label: `How do I use voice input to talk to ${assistantName}?`,
      tag: 'Voice Guide',
    },
    {
      icon: Code2,
      label: 'Help me outline a scalable React component architecture',
      tag: 'Development',
    },
    {
      icon: Compass,
      label: 'How does the Memory Vault work?',
      tag: 'Memory',
    },
  ]

  return (
    <div className="w-full max-w-2xl space-y-3 select-none">
      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        <Sparkles className="w-3.5 h-3.5 text-cyan-500 dark:text-cyan-400" />
        <span>Suggested Questions</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
        {suggestions.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={index}
              type="button"
              onClick={() => onSelectPrompt(item.label)}
              className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800/80 hover:border-cyan-300 dark:hover:border-cyan-500/40 text-left transition-all duration-200 group cursor-pointer flex flex-col justify-between gap-1.5 sm:gap-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white shadow-sm dark:shadow-none"
            >
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-cyan-600 dark:text-cyan-400/90 font-medium">
                  <Icon className="w-3 h-3" />
                  {item.tag}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-300 leading-snug group-hover:text-slate-800 dark:group-hover:text-white break-words">
                {item.label}
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default SuggestedPrompts
