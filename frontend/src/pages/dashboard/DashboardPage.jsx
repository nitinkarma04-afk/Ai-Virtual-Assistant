import React from 'react'

import { useAuth } from '../../hooks/useAuth'
import { useChat } from '../../hooks/useChat'

import { AssistantHeader } from '../../components/assistant/AssistantHeader'
import { ChatContainer } from '../../components/assistant/ChatContainer'
import { MessageComposer } from '../../components/assistant/MessageComposer'

export const DashboardPage = () => {
  const { assistant } = useAuth()

 const {
  messages,
  isLoading,
  assistantState,
  setAssistantState,
  sendMessage,
  addActionConversation,
  clearMessages,
} = useChat()

  const assistantName =
    assistant?.name ||
    assistant?.assistantName ||
    'Jarvis'

  const wakeWord =
    assistant?.wakeWord ||
    `Hey ${assistantName}`

  const handleSelectPrompt = (promptText) => {
    sendMessage(promptText)
  }

  const handleSendMessage = (text) => {
    sendMessage(text)
  }

  const handleListeningChange = (isListening) => {
    if (isListening) {
      setAssistantState('listening')
    } else if (assistantState === 'listening') {
      setAssistantState('idle')
    }
  }

  // Handle direct browser actions
  const handleAssistantAction = (action) => {
  if (!action) return

  console.log('Assistant action executed:', action)

  let responseText = ''

  if (action.type === 'OPEN_WEBSITE') {
    responseText = `🌐 Opening ${action.name}...`
  }

  if (action.type === 'SEARCH_WEBSITE') {
    responseText = `🔎 Searching ${action.name} for "${action.query}"...`
  }

  if (!responseText) {
    responseText = 'Done.'
  }

  addActionConversation(
    action.command,
    responseText,
    action
  )
}

  return (
    <div className="h-[100dvh] min-h-[100dvh] max-h-[100dvh] bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-800 dark:selection:text-cyan-200 relative overflow-hidden transition-colors duration-200">

      {/* Background ambient lighting */}
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="fixed bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Fixed Assistant Header */}
      <AssistantHeader
        assistantState={assistantState}
        onClearChat={clearMessages}
        messageCount={messages.length}
      />

      {/* Center Interactive Chat Canvas */}
      <main className="flex-1 flex flex-col w-full relative z-10 overflow-hidden min-h-0">

        <ChatContainer
          messages={messages}
          isLoading={isLoading}
          assistantState={assistantState}
          assistantName={assistantName}
          wakeWord={wakeWord}
          onSelectPrompt={handleSelectPrompt}
        />

        {/* Bottom Message Composer */}
        <MessageComposer
          onSendMessage={handleSendMessage}
          onAction={handleAssistantAction}
          isLoading={isLoading}
          assistantName={assistantName}
          onListeningChange={handleListeningChange}
        />

      </main>
    </div>
  )
}

export default DashboardPage