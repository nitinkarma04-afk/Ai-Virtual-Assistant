import React, { useEffect, useRef } from 'react'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'
import { SuggestedPrompts } from './SuggestedPrompts'
import { AssistantOrb } from './AssistantOrb'
import { Badge } from '../common/Badge'

export const ChatContainer = ({
  messages = [],
  isLoading = false,
  assistantState = 'idle',
  assistantName = 'Assistant',
  wakeWord = 'Hey Assistant',
  onSelectPrompt,
}) => {
  const bottomRef = useRef(null)

  // Auto-scroll to bottom whenever a new message is added or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  const hasMessages = messages.length > 0

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-6 overflow-y-auto overflow-x-hidden flex flex-col justify-between min-h-0">
      {!hasMessages ? (
        /* Empty Conversation State */
        <div className="my-auto flex flex-col items-center justify-center text-center space-y-4 sm:space-y-6 py-4 sm:py-8 animate-fade-in w-full">
          {/* Assistant Orb Visualizer */}
          <div className="relative">
            <AssistantOrb state={assistantState} />
          </div>

          <div className="space-y-1.5 sm:space-y-2 max-w-lg px-2">
            <div className="inline-flex items-center gap-2 mb-1">
              <Badge variant="cyan" dot className="text-[10px] sm:text-xs font-mono">
                ASSISTANT ONLINE
              </Badge>
            </div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Hello, I am <span className="text-cyan-600 dark:text-cyan-400">{assistantName}</span>.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              How can I help you today? Ask a question, give instructions, or activate hands-free mode
              with <strong className="text-cyan-700 dark:text-cyan-300 font-mono font-normal">“{wakeWord}”</strong>.
            </p>
          </div>

          {/* Quick Starter Suggestions */}
          {onSelectPrompt && (
            <div className="pt-2 sm:pt-4 w-full">
              <SuggestedPrompts
                assistantName={assistantName}
                onSelectPrompt={onSelectPrompt}
              />
            </div>
          )}
        </div>
      ) : (
        /* Message Thread */
        <div className="space-y-3.5 sm:space-y-6 pb-2 sm:pb-4 w-full">
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              assistantName={assistantName}
            />
          ))}

          {/* Typing / Thinking Indicator */}
          {isLoading && <TypingIndicator assistantName={assistantName} />}

          {/* Scroll target anchor */}
          <div ref={bottomRef} className="h-1" />
        </div>
      )}
    </div>
  )
}

export default ChatContainer
