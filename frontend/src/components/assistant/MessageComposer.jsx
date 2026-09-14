import React, { useState, useRef, useEffect } from 'react'
import { ArrowUp, Loader2, Sparkles, X } from 'lucide-react'
import { VoiceButton } from './VoiceButton'
import { cn } from '../../utils/cn'

export const MessageComposer = ({
  onSendMessage,
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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`
    }
  }, [input])

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 pb-4 sm:pb-6 relative z-20">
      <form
        onSubmit={handleSubmit}
        className={cn(
          'relative rounded-2xl border transition-all duration-300 p-2 sm:p-3 bg-slate-900/80 backdrop-blur-2xl shadow-2xl flex flex-col gap-2',
          isVoiceActive
            ? 'border-emerald-500/60 shadow-emerald-500/10 ring-1 ring-emerald-500/40'
            : 'border-slate-800/90 focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/40 focus-within:shadow-cyan-500/10'
        )}
      >
        {/* Voice Active Status Banner */}
        {isVoiceActive && (
          <div className="flex items-center justify-between px-2 py-1 text-xs text-emerald-300 font-mono animate-pulse">
            <span className="flex items-center gap-1.5 truncate max-w-[80%]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
              {interimSpeech ? (
                <span className="truncate">Listening: "{interimSpeech}"</span>
              ) : (
                <span>Microphone Active — Speak to {assistantName}...</span>
              )}
            </span>
            <span className="text-[10px] text-emerald-400/80 shrink-0">Click mic to finish</span>
          </div>
        )}

        {/* Text Input Area */}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={
              placeholder ||
              `Ask ${assistantName} anything, type instructions, or use voice...`
            }
            className="w-full bg-transparent text-slate-100 text-sm placeholder:text-slate-500 resize-none focus:outline-none px-2 py-1.5 min-h-[40px] max-h-[160px] leading-relaxed"
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
              className="p-1 text-slate-500 hover:text-slate-300 mb-1 focus:outline-none transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Toolbar & Action Buttons */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            {/* Voice Microphone Button */}
            <VoiceButton
              onTranscript={handleVoiceTranscript}
              onListeningChange={handleVoiceState}
              disabled={isLoading}
            />

            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-slate-500 font-mono pl-1">
              <Sparkles className="w-3 h-3 text-cyan-500/70" />
              <span>Press Enter to send, Shift+Enter for newline</span>
            </span>
          </div>

          {/* Send Message Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-label="Send message"
            className={cn(
              'p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center font-medium cursor-pointer',
              input.trim() && !isLoading
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/25 active:scale-95'
                : 'bg-slate-800/80 text-slate-500 cursor-not-allowed opacity-50'
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
