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
        'w-full flex items-start gap-3 transition-all animate-fade-in text-left',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {/* Assistant Avatar */}
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md shadow-cyan-500/20 mt-1">
          <Bot className="w-4 h-4" />
        </div>
      )}

      {/* Main Message Box */}
      <div
        className={cn(
          'max-w-[85%] sm:max-w-2xl relative rounded-2xl p-4 sm:p-5 shadow-lg space-y-2',
          isUser
            ? 'bg-gradient-to-tr from-cyan-600/30 via-blue-600/20 to-slate-900/80 border border-cyan-500/40 rounded-tr-sm text-slate-100 shadow-cyan-500/5'
            : isError
            ? 'bg-rose-500/10 border border-rose-500/30 rounded-tl-sm text-rose-200'
            : 'bg-slate-900/75 backdrop-blur-xl border border-slate-800/80 rounded-tl-sm text-slate-100'
        )}
      >
        {/* Header with Name & Timestamp */}
        <div className="flex items-center justify-between gap-4 pb-1 border-b border-white/5 text-[11px]">
          <span
            className={cn(
              'font-semibold tracking-wide flex items-center gap-1.5',
              isUser ? 'text-cyan-300' : 'text-slate-300'
            )}
          >
            {!isUser && <Sparkles className="w-3 h-3 text-cyan-400" />}
            {isUser ? 'You' : assistantName}
          </span>

          <div className="flex items-center gap-2 text-slate-500 font-mono">
            {formattedTime && <span>{formattedTime}</span>}
            {!isUser && (
              <button
                type="button"
                onClick={handleCopy}
                title={copied ? 'Copied' : 'Copy message text'}
                className="hover:text-slate-200 focus:outline-none transition-colors p-0.5"
                aria-label="Copy message"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Message Content */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words font-sans text-slate-200">
          {message.text}
        </div>

        {/* Optional Action Payload Indicator (Prepared for Phase 5 action engine) */}
        {message.actionData && (
          <div className="mt-3 p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between gap-2">
            <span className="font-mono flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
              Action:{' '}
              {typeof message.actionData === 'string'
                ? message.actionData
                : message.actionData.type || message.actionData.action || 'Executed Action'}
            </span>
          </div>
        )}

        {/* Error icon reminder */}
        {isError && (
          <div className="flex items-center gap-1.5 text-xs text-rose-400 pt-1 font-mono">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Server response incomplete</span>
          </div>
        )}
      </div>

      {/* User Avatar */}
      {isUser && (
        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0 shadow-md mt-1">
          <User className="w-4 h-4" />
        </div>
      )}
    </div>
  )
}

export default MessageBubble
