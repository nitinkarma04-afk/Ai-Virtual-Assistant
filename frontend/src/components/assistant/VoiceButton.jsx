import React from 'react'
import { Mic, MicOff, AlertCircle } from 'lucide-react'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { cn } from '../../utils/cn'

export const VoiceButton = ({
  onTranscript,
  onListeningChange,
  disabled = false,
  className = '',
}) => {
  const handleTranscript = React.useCallback(
    (_fullTranscript, newSegment, interimSegment) => {
      if (onTranscript) {
        onTranscript(newSegment, interimSegment)
      }
    },
    [onTranscript]
  )

  const { isSupported, isListening, startListening, stopListening, error } =
    useSpeechRecognition({
      continuous: true,
      onResult: handleTranscript,
    })

  // Synchronize listening state with parent
  const prevListeningRef = React.useRef(isListening)
  React.useEffect(() => {
    if (prevListeningRef.current !== isListening) {
      prevListeningRef.current = isListening
      if (onListeningChange) {
        onListeningChange(isListening)
      }
    }
  }, [isListening, onListeningChange])

  const handleToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isSupported) {
    return (
      <button
        type="button"
        disabled
        title="Web Speech API not supported in this browser. Use Chrome or Edge for voice input."
        className={cn(
          'p-2.5 rounded-xl bg-slate-200/60 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600 border border-slate-300 dark:border-slate-800 cursor-not-allowed transition-all opacity-60',
          className
        )}
        aria-label="Voice input unsupported"
      >
        <MicOff className="w-4 h-4" />
      </button>
    )
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        disabled={disabled}
        onClick={handleToggle}
        title={
          isListening
            ? 'Listening... Click to stop voice input'
            : error
            ? error
            : 'Click to speak to assistant'
        }
        aria-label={isListening ? 'Stop voice recognition' : 'Start voice recognition'}
        className={cn(
          'p-2 sm:p-2.5 min-w-[38px] min-h-[38px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center rounded-xl border transition-all duration-200 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500',
          isListening
            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/80 shadow-md animate-pulse'
            : error
            ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/40 hover:bg-rose-500/20'
            : 'bg-slate-100 dark:bg-slate-900/70 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-800 hover:text-cyan-600 dark:hover:text-cyan-300 hover:border-cyan-500/40 hover:bg-slate-200/80 dark:hover:bg-slate-800/80',
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          className
        )}
      >
        {isListening ? (
          <div className="relative flex items-center justify-center">
            <Mic className="w-4 h-4 text-emerald-600 dark:text-emerald-300 animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
        ) : error ? (
          <AlertCircle className="w-4 h-4 text-rose-500" />
        ) : (
          <Mic className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}

export default VoiceButton
