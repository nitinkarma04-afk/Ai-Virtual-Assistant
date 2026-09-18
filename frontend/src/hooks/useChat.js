import { useState, useEffect, useRef } from 'react'

import { chatService, getErrorMessage } from '../services/api'

import { getToken } from '../utils/token'

/**
 * Custom hook to manage AI conversation state, API streaming/dispatch,
 * visual assistant states, and local assistant actions.
 */
export const useChat = () => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const [assistantState, setAssistantState] = useState('idle')

  const speakingTimeoutRef = useRef(null)

  // Fetch past conversation history from backend if available
  useEffect(() => {
    let isMounted = true

    const fetchHistory = async () => {
      const token = getToken()

      if (!token) return

      try {
        const data = await chatService.getHistory()

        if (!isMounted || !data) return

        const rawList =
          data?.conversations ||
          data?.history ||
          data?.messages ||
          (Array.isArray(data) ? data : [])

        if (Array.isArray(rawList) && rawList.length > 0) {
          const formatted = rawList.flatMap((item, idx) => {
            // Backend Conversation document containing both user message and assistant response
            if (item?.message && item?.response) {
              const baseTime =
                item?.createdAt ||
                item?.timestamp ||
                new Date().toISOString()

              const baseId =
                item?._id ||
                item?.id ||
                `hist-${idx}`

              return [
                {
                  id: `${baseId}-usr`,
                  sender: 'user',
                  text: item.message,
                  timestamp: baseTime,
                },
                {
                  id: `${baseId}-ast`,
                  sender: 'assistant',
                  text: item.response,
                  timestamp: baseTime,
                },
              ]
            }

            // Standalone message object
            return [
              {
                id:
                  item?.id ||
                  item?._id ||
                  `hist-${idx}`,

                sender:
                  item?.sender ||
                  (item?.role === 'user' ? 'user' : 'assistant'),

                text:
                  item?.text ||
                  item?.content ||
                  item?.message ||
                  item?.response ||
                  '',

                timestamp:
                  item?.timestamp ||
                  item?.createdAt ||
                  new Date().toISOString(),

                actionData:
                  item?.action ||
                  item?.actionData ||
                  null,
              },
            ]
          })

          if (isMounted && formatted.length > 0) {
            setMessages(formatted)
          }
        }
      } catch (err) {
        console.warn(
          'History fetch notice:',
          err?.message || err
        )
      }
    }

    fetchHistory()

    return () => {
      isMounted = false

      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current)
      }
    }
  }, [])

  /**
   * Helper to parse AI response text from varied backend payload shapes
   */
  const extractResponseText = (data) => {
    if (!data) {
      return 'I received your request, but no response text was generated.'
    }

    if (typeof data === 'string') {
      return data
    }

    if (data?.response) return data.response
    if (data?.message) return data.message
    if (data?.reply) return data.reply
    if (data?.text) return data.text
    if (data?.content) return data.content

    if (data?.data?.response) return data.data.response
    if (data?.data?.message) return data.data.message
    if (data?.data?.reply) return data.data.reply

    return typeof data === 'object'
      ? JSON.stringify(data)
      : String(data)
  }

  /**
   * Add a local assistant message.
   *
   * This does NOT call the AI API.
   * Useful for browser/device actions such as:
   * "Opening YouTube..."
   */


  const addActionConversation = async (
  command,
  responseText,
  actionData = null
) => {
  if (!command || !responseText) return

  const timestamp = new Date().toISOString()

  const userMessage = {
    id: `usr-action-${Date.now()}`,
    sender: 'user',
    text: command,
    timestamp,
  }

  const assistantMessage = {
    id: `ast-action-${Date.now() + 1}`,
    sender: 'assistant',
    text: responseText,
    timestamp,
    actionData,
    isLocalAction: true,
  }

  // Immediately show both messages in chat
  setMessages((prev) => [
    ...prev,
    userMessage,
    assistantMessage,
  ])

  setAssistantState('speaking')

  if (speakingTimeoutRef.current) {
    clearTimeout(speakingTimeoutRef.current)
  }

  speakingTimeoutRef.current = setTimeout(() => {
    setAssistantState('idle')
  }, 2500)

  // Save conversation to backend
  try {
    await chatService.saveConversation({
      message: command,
      response: responseText,
    })
  } catch (err) {
    console.warn(
      'Action conversation save notice:',
      err?.message || err
    )
  }
}
 const addAssistantMessage = async (text, actionData = null) => {
  if (!text) return

  const assistantMessage = {
    id: `ast-local-${Date.now()}`,
    sender: 'assistant',
    text,
    timestamp: new Date().toISOString(),
    actionData,
    isLocalAction: true,
  }

  setMessages((prev) => [
    ...prev,
    assistantMessage,
  ])

  setAssistantState('speaking')

  if (speakingTimeoutRef.current) {
    clearTimeout(speakingTimeoutRef.current)
  }

  speakingTimeoutRef.current = setTimeout(() => {
    setAssistantState('idle')
  }, 2500)

  // Save action to backend history
  if (actionData?.command) {
    try {
      await chatService.saveConversation({
        message: actionData.command,
        response: text,
      })
    } catch (err) {
      console.warn(
        'Action history save notice:',
        err?.message || err
      )
    }
  }
} 
  /**
   * Send a new message to the AI Assistant
   */
  const sendMessage = async (inputText) => {
    const trimmed = (inputText || '').trim()

    if (!trimmed || isLoading) return

    const userMessageId = `usr-${Date.now()}`

    const userMessage = {
      id: userMessageId,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toISOString(),
    }

    // Optimistically update conversation thread
    setMessages((prev) => [
      ...prev,
      userMessage,
    ])

    setIsLoading(true)
    setError(null)
    setAssistantState('thinking')

    try {
      // Dispatch payload to existing backend /chat endpoint
      const payload = {
        message: trimmed,
        prompt: trimmed,
        content: trimmed,
      }

      const response =
        await chatService.sendMessage(payload)

      const replyText =
        extractResponseText(response)

      const actionPayload =
        response?.action ||
        response?.data?.action ||
        null

      const assistantMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: replyText,
        timestamp: new Date().toISOString(),
        actionData: actionPayload,
      }

      setMessages((prev) => [
        ...prev,
        assistantMessage,
      ])

      setAssistantState('speaking')

      // Return to idle state after speaking
      if (speakingTimeoutRef.current) {
        clearTimeout(speakingTimeoutRef.current)
      }

      speakingTimeoutRef.current = setTimeout(() => {
        setAssistantState('idle')
      }, 4000)
    } catch (err) {
      console.error(
        'Chat dispatch error:',
        err
      )

      const errorMsg = getErrorMessage(err)

      setError(errorMsg)

      const errorMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `⚠️ Neural communication failure: ${errorMsg}`,
        timestamp: new Date().toISOString(),
        isError: true,
      }

      setMessages((prev) => [
        ...prev,
        errorMessage,
      ])

      setAssistantState('idle')
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Clear active conversation
   */
  const clearMessages = async () => {
    setMessages([])
    setError(null)
    setAssistantState('idle')

    try {
      await chatService.clearHistory()
    } catch {
      // Local state is already cleared
    }
  }
return {
  messages,
  isLoading,
  error,
  assistantState,
  setAssistantState,
  sendMessage,
  addAssistantMessage,
  addActionConversation,
  clearMessages,
}
}

export default useChat