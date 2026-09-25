import React, { useState, useRef, useEffect } from 'react'
import { ArrowUp, Loader2, Sparkles, X } from 'lucide-react'
import { VoiceButton } from './VoiceButton'
import { cn } from '../../utils/cn'
import {
  detectAssistantAction,
} from '../../utils/assistantActions'

export const MessageComposer = ({
  onSendMessage,
  onAction,
  isLoading = false,
  assistantName = 'Assistant',
  onListeningChange,
  placeholder,
}) => {
  const [input, setInput] = useState('')
  const [isVoiceActive, setIsVoiceActive] = useState(false)
  const textareaRef = useRef(null)

  // Auto-resize textarea height as user types
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`
    }
  }, [input])

  const handleSubmit = (e) => {
  if (e) e.preventDefault()

  const trimmed = input.trim()

  if (!trimmed || isLoading) return

  // Check for direct assistant action
  const action = detectAssistantAction(trimmed)

  if (action) {
  if (onAction) {
    onAction(action)
  }

  setInput('')

  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto'
  }

  return
}

  // Normal AI message
  onSendMessage(trimmed)

  setInput('')

  if (textareaRef.current) {
    textareaRef.current.style.height = 'auto'
  }
}
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const [interimSpeech, setInterimSpeech] = useState('')

  const handleVoiceTranscript = React.useCallback((finalSegment, interimSegment) => {
    if (finalSegment) {
      setInput((prev) => {
        const trimmedPrev = (prev || '').trim()
        const trimmedSegment = finalSegment.trim()
        if (!trimmedPrev) return trimmedSegment
        if (trimmedPrev.endsWith(trimmedSegment)) return trimmedPrev
        return `${trimmedPrev} ${trimmedSegment}`
      })
      setInterimSpeech('')
    } else if (interimSegment !== undefined) {
      setInterimSpeech(interimSegment)
    }
  }, [])

  const handleVoiceState = React.useCallback(
    (listening) => {
      setIsVoiceActive(listening)
      if (!listening) {
        setInterimSpeech('')
      }
      if (onListeningChange) {
        onListeningChange(listening)
      }
    },
    [onListeningChange]
  )

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 pb-2.5 sm:pb-6 relative z-20 shrink-0">
      <form
        onSubmit={handleSubmit}
        className={cn(
          'relative rounded-2xl border transition-all duration-300 p-2 sm:p-3 bg-white/90 dark:bg-slate-900/85 backdrop-blur-2xl shadow-lg dark:shadow-2xl flex flex-col gap-1.5 sm:gap-2',
          isVoiceActive
            ? 'border-emerald-500/60 ring-1 ring-emerald-500/40'
            : 'border-slate-200 dark:border-slate-800/90 focus-within:border-cyan-500/60 focus-within:ring-1 focus-within:ring-cyan-500/40'
        )}
      >
        {/* Voice Active Status Banner */}
        {isVoiceActive && (
          <div className="flex items-center justify-between px-2 py-1 text-[11px] sm:text-xs text-emerald-700 dark:text-emerald-300 font-mono animate-pulse">
            <span className="flex items-center gap-1.5 truncate max-w-[75%] sm:max-w-[80%]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              {interimSpeech ? (
                <span className="truncate">Listening: "{interimSpeech}"</span>
              ) : (
                <span className="truncate">Microphone Active — Speak...</span>
              )}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 shrink-0">Tap mic to stop</span>
          </div>
        )}

        {/* Text Input Area */}
        <div className="flex items-end gap-1.5 sm:gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={
              placeholder ||
              `Ask ${assistantName} or type instructions...`
            }
            className="w-full bg-transparent text-slate-900 dark:text-slate-100 text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none focus:outline-none px-2 py-1.5 min-h-[38px] sm:min-h-[40px] max-h-[120px] sm:max-h-[140px] leading-relaxed font-sans"
          />

          {/* Clear input button */}
          {input.length > 0 && !isLoading && (
            <button
              type="button"
              onClick={() => {
                setInput('')
                if (textareaRef.current) textareaRef.current.style.height = 'auto'
              }}
              title="Clear text"
              aria-label="Clear text"
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 mb-0.5 focus:outline-none transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Toolbar & Action Buttons */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-200/80 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            {/* Voice Microphone Button */}
            <VoiceButton
              onTranscript={handleVoiceTranscript}
              onListeningChange={handleVoiceState}
              disabled={isLoading}
            />

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 font-sans pl-1">
              <Sparkles className="w-3 h-3 text-cyan-500" />
              <span>Press Enter to send, Shift+Enter for newline</span>
            </span>
          </div>

          {/* Send Message Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className={cn(
              'p-2 sm:p-2.5 min-w-[38px] min-h-[38px] sm:min-w-[40px] sm:min-h-[40px] rounded-xl transition-all duration-200 flex items-center justify-center font-medium cursor-pointer',
              input.trim() && !isLoading
                ? 'bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-400 text-white dark:text-slate-950 shadow-md shadow-cyan-500/20 active:scale-95'
                : 'bg-slate-200 dark:bg-slate-800/80 text-slate-400 dark:text-slate-500 cursor-not-allowed opacity-50'
            )}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-400" />
            ) : (
              <ArrowUp className="w-4 h-4 stroke-[2.5]" />
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default MessageComposer
