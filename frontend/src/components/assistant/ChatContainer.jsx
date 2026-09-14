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
    <div className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 overflow-y-auto flex flex-col justify-between">
      {!hasMessages ? (
        /* Empty Conversation State with Central Assistant Orb */
        <div className="my-auto flex flex-col items-center justify-center text-center space-y-6 py-8 animate-fade-in">
          {/* Dynamic Assistant Orb Presence */}
          <div className="relative">
            <AssistantOrb state={assistantState} />
          </div>

          <div className="space-y-2 max-w-lg">
            <div className="inline-flex items-center gap-2 mb-1">
              <Badge variant="cyan" dot className="text-xs font-mono">
                NEURAL CORE ONLINE
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              I am <span className="text-cyan-400">{assistantName}</span>.
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              How can I assist your workflow today? Type your command below or activate hands-free
              with <strong className="text-cyan-300 font-mono">“{wakeWord}”</strong>.
            </p>
          </div>

          {/* Quick Starter Suggestions */}
          {onSelectPrompt && (
            <div className="pt-4 w-full">
              <SuggestedPrompts
                assistantName={assistantName}
                onSelectPrompt={onSelectPrompt}
              />
            </div>
          )}
        </div>
      ) : (
        /* Message Thread */
        <div className="space-y-6 pb-4">
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
          <div ref={bottomRef} className="h-2" />
        </div>
      )}
    </div>
  )
}

export default ChatContainer
