import React, { useState } from 'react'
import { Bot, User, Copy, Check, AlertCircle, Sparkles, ExternalLink } from 'lucide-react'
import { cn } from '../../utils/cn'

export const MessageBubble = ({
  message,
  assistantName = 'Assistant',
}) => {
  const [copied, setCopied] = useState(false)

  const isUser = message.sender === 'user'
  const isError = Boolean(message.isError)

  const handleCopy = () => {
    if (!message.text) return
    navigator.clipboard.writeText(message.text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Format timestamp (e.g. 3:45 PM)
  const formattedTime = React.useMemo(() => {
    if (!message.timestamp) return ''
    try {
      const date = new Date(message.timestamp)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }, [message.timestamp])

  return (
    <div
      className={cn(
        'w-full flex items-start gap-2 sm:gap-3 transition-all animate-fade-in text-left',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-cyan-500/20 mt-0.5 sm:mt-1">
          <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
      )}

      {/* Main Message Box */}
      <div
        className={cn(
          'max-w-[88%] sm:max-w-2xl relative rounded-2xl p-3 sm:p-5 space-y-1.5 sm:space-y-2',
          isUser
            ? 'bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white rounded-tr-xs shadow-md'
            : isError
            ? 'bg-rose-500/10 border border-rose-500/30 rounded-tl-xs text-rose-700 dark:text-rose-200'
            : 'bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-tl-xs text-slate-900 dark:text-slate-100 shadow-sm dark:shadow-lg'
        )}
      >
        {/* Header with Name & Timestamp */}
        <div className="flex items-center justify-between gap-2 pb-1 border-b border-black/5 dark:border-white/5 text-[10px] sm:text-[11px]">
          <span
            className={cn(
              'font-semibold tracking-wide flex items-center gap-1 sm:gap-1.5 truncate',
              isUser ? 'text-cyan-100' : 'text-slate-600 dark:text-slate-300'
            )}
          >
            {!isUser && <Sparkles className="w-3 h-3 text-cyan-500 dark:text-cyan-400 shrink-0" />}
            <span className="truncate">{isUser ? 'You' : assistantName}</span>
          </span>

          <div
            className={cn(
              'flex items-center gap-1.5 sm:gap-2 font-mono shrink-0',
              isUser ? 'text-cyan-200' : 'text-slate-400 dark:text-slate-500'
            )}
          >
            {formattedTime && <span>{formattedTime}</span>}
            {!isUser && (
              <button
                type="button"
                onClick={handleCopy}
                title={copied ? 'Copied' : 'Copy message text'}
                className="hover:text-slate-700 dark:hover:text-slate-200 focus:outline-none transition-colors p-0.5 cursor-pointer"
                aria-label="Copy message"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div
          className={cn(
            'text-xs sm:text-sm leading-relaxed whitespace-pre-wrap break-words [overflow-wrap:anywhere] font-sans',
            isUser ? 'text-white' : 'text-slate-800 dark:text-slate-200'
          )}
        >
          {message.text}
        </div>

        {/* Optional Action Payload Indicator */}
        {message.actionData && (
          <div className="mt-2 sm:mt-3 p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-cyan-500/30 text-xs text-cyan-700 dark:text-cyan-300 flex items-center justify-between gap-2 overflow-hidden">
            <span className="font-mono flex items-center gap-1.5 truncate">
              <ExternalLink className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              <span className="truncate">
                Action:{' '}
                {typeof message.actionData === 'string'
                  ? message.actionData
                  : message.actionData.type || message.actionData.action || 'Executed Action'}
              </span>
            </span>
          </div>
        )}

        {/* Error icon reminder */}
        {isError && (
          <div className="flex items-center gap-1.5 text-xs text-rose-500 pt-1 font-mono">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Response incomplete</span>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-cyan-600 dark:text-cyan-400 shrink-0 shadow-sm mt-0.5 sm:mt-1">
          <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>
      )}
    </div>
  )
}

export default MessageBubble
