import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook for browser Web Speech Recognition API
 * Gracefully handles unsupported browsers, permissions, and continuous/interim transcripts.
 */
export const useSpeechRecognition = (options = {}) => {
  const { onResult, onEnd, onError, continuous = true, lang = 'en-US' } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [interimTranscript, setInterimTranscript] = useState('')
  const [error, setError] = useState(null)

  // Check if browser supports Web Speech API
  const isSupported =
    typeof window !== 'undefined' &&
    Boolean(window.SpeechRecognition || window.webkitSpeechRecognition)

  const recognitionRef = useRef(null)

  // Store callback references to prevent SpeechRecognition instance re-creation and abort on re-render
  const onResultRef = useRef(onResult)
  const onEndRef = useRef(onEnd)
  const onErrorRef = useRef(onError)
  const transcriptRef = useRef(transcript)

  useEffect(() => {
    onResultRef.current = onResult
    onEndRef.current = onEnd
    onErrorRef.current = onError
    transcriptRef.current = transcript
  }, [onResult, onEnd, onError, transcript])

  // Initialize SpeechRecognition instance
  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = continuous
    recognition.interimResults = true
    recognition.lang = lang

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onresult = (event) => {
      let finalStr = ''
      let interimStr = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i]
        const text = item[0]?.transcript || ''
        if (item.isFinal) {
          finalStr += text
        } else {
          interimStr += text
        }
      }

      let updatedFull = transcriptRef.current
      if (finalStr) {
        updatedFull = transcriptRef.current
          ? `${transcriptRef.current} ${finalStr}`
          : finalStr
        transcriptRef.current = updatedFull
        setTranscript(updatedFull)
      }

      setInterimTranscript(interimStr)

      if (onResultRef.current && (finalStr || interimStr)) {
        onResultRef.current(updatedFull, finalStr, interimStr)
      }
    }

    recognition.onerror = (event) => {
      let errorMsg = 'Voice recognition error'
      switch (event.error) {
        case 'not-allowed':
        case 'service-not-allowed':
          errorMsg = 'Microphone permission denied. Please allow microphone access in browser.'
          break
        case 'no-speech':
          errorMsg = 'No speech detected. Please speak into your microphone.'
          break
        case 'network':
          errorMsg = 'Network error occurred during speech recognition.'
          break
        case 'audio-capture':
          errorMsg = 'No microphone device was found.'
          break
        default:
          errorMsg = event.error || 'Speech recognition failed.'
      }

      setError(errorMsg)
      setIsListening(false)
      if (onErrorRef.current) onErrorRef.current(errorMsg, event)
    }

    recognition.onend = () => {
      setIsListening(false)
      setInterimTranscript('')
      if (onEndRef.current) onEndRef.current()
    }

    recognitionRef.current = recognition

    return () => {
      try {
        recognition.abort()
      } catch {
        // Ignore cleanup abort errors
      }
    }
  }, [isSupported, continuous, lang])

  const startListening = useCallback(() => {
    if (!isSupported || !recognitionRef.current) {
      setError('Web Speech API is not supported in this browser. Use Chrome or Edge.')
      return
    }

    setError(null)
    setTranscript('')
    setInterimTranscript('')

    try {
      recognitionRef.current.start()
    } catch {
      // If already started or restarting
      try {
        recognitionRef.current.stop()
        setTimeout(() => {
          try {
            recognitionRef.current?.start()
          } catch {
            // Ignore restart error
          }
        }, 100)
      } catch (err) {
        console.warn('Speech recognition restart notice:', err?.message || err)
      }
    }
  }, [isSupported])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch {
      // Ignore stop errors
    }
    setIsListening(false)
  }, [])

  const resetTranscript = useCallback(() => {
    setTranscript('')
    setInterimTranscript('')
    setError(null)
  }, [])

  return {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}

export default useSpeechRecognition
