import React, { useState } from 'react'
import { X, User, Bot, Copy, Check, Clock } from 'lucide-react'
import { Badge } from '../common/Badge'

export const ConversationDetailModal = ({ conversation, onClose }) => {
  const [copied, setCopied] = useState(false)

  if (!conversation) return null

  const rawTimestamp = conversation.createdAt || conversation.timestamp
  const formattedTime = rawTimestamp
    ? new Date(rawTimestamp).toLocaleString([], {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : ''

  const handleCopyResponse = async () => {
    try {
      await navigator.clipboard.writeText(conversation.response || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore clipboard fallback
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Conversation Log</h3>
              <p className="text-[11px] text-slate-400 font-mono">{formattedTime}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {/* User Input Block */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <User className="w-3.5 h-3.5" />
              <span>USER PROMPT</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-sm text-slate-100 whitespace-pre-wrap leading-relaxed">
              {conversation.message}
            </div>
          </div>

          {/* Assistant Response Block */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
                <Bot className="w-3.5 h-3.5" />
                <span>ASSISTANT RESPONSE</span>
              </div>
              <button
                onClick={handleCopyResponse}
                className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 font-mono transition-colors focus:outline-none"
                title="Copy assistant response"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/40 border border-slate-800/90 text-sm text-slate-200 whitespace-pre-wrap leading-relaxed">
              {conversation.response}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800/80 bg-slate-950/50 flex justify-between items-center text-xs text-slate-500 font-mono">
          <Badge variant="cyan" className="text-[10px]">
            ID: {conversation._id ? conversation._id.slice(-8) : 'LOG'}
          </Badge>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConversationDetailModal

