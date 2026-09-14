import React from 'react'
import { Link } from 'react-router-dom'
import {
  Bot,
  LogOut,
  Sliders,
  User,
  Trash2,
  History,
  Brain,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

export const AssistantHeader = ({
  assistantState = 'idle',
  onClearChat,
  messageCount = 0,
}) => {
  const { user, assistant, logout } = useAuth()

  const assistantName = assistant?.name || assistant?.assistantName || 'Neural Assistant'
  const personality = assistant?.personalityName || 'Helpful & Balanced'
  const wakeWord = assistant?.wakeWord || `Hey ${assistantName}`

  const stateLabels = {
    idle: { label: 'Online & Ready', variant: 'cyan' },
    listening: { label: 'Listening to Voice...', variant: 'emerald' },
    thinking: { label: 'Synthesizing Response...', variant: 'violet' },
    speaking: { label: 'Speaking...', variant: 'cyan' },
  }

  const currentState = stateLabels[assistantState] || stateLabels.idle

  return (
    <header className="w-full px-4 sm:px-6 py-3.5 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Assistant Identity & Live Presence */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-3 group focus:outline-none">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                <Bot className="w-5 h-5 text-white" />
              </div>
              {/* Live status dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-base text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                  {assistantName}
                </span>
                <Badge variant={currentState.variant} dot className="text-[10px] py-0.5 px-2">
                  {currentState.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span className="truncate max-w-[140px] sm:max-w-xs">{personality}</span>
                <span className="text-slate-600">•</span>
                <span className="hidden sm:inline text-cyan-300/80">Trigger: “{wakeWord}”</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right: Controls & Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Clear chat button */}
          {messageCount > 0 && onClearChat && (
            <Button
              size="sm"
              variant="ghost"
              icon={Trash2}
              onClick={onClearChat}
              title="Clear active conversation"
              className="text-slate-400 hover:text-rose-400 text-xs px-2.5"
            >
              <span className="hidden md:inline">Clear Chat</span>
            </Button>
          )}

          {/* Conversation History Link */}
          <Link to="/history">
            <Button
              size="sm"
              variant="glass"
              icon={History}
              title="View Conversation History"
              className="text-xs px-3 text-cyan-300 border-cyan-500/30 hover:border-cyan-400"
            >
              <span className="hidden sm:inline">History</span>
            </Button>
          </Link>

          {/* Memory Vault Link */}
          <Link to="/memory">
            <Button
              size="sm"
              variant="glass"
              icon={Brain}
              title="View Memory Vault"
              className="text-xs px-3 text-indigo-300 border-indigo-500/30 hover:border-indigo-400"
            >
              <span className="hidden sm:inline">Memory</span>
            </Button>
          </Link>

          {/* System Settings Shortcut */}
          <Link to="/settings">
            <Button
              size="sm"
              variant="glass"
              icon={Sliders}
              title="Application & Assistant Settings"
              className="text-xs px-3"
            >
              <span className="hidden sm:inline">Settings</span>
            </Button>
          </Link>

          {/* User Profile Shortcut */}
          <Link to="/profile" className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 transition-colors">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-medium truncate max-w-[120px]">
              {user?.name || user?.email?.split('@')[0]}
            </span>
          </Link>

          {/* Sign Out Action */}
          <Button
            size="sm"
            variant="ghost"
            icon={LogOut}
            onClick={logout}
            title="Sign Out"
            aria-label="Sign Out"
            className="text-slate-400 hover:text-rose-400 px-2.5"
          />
        </div>
      </div>
    </header>
  )
}

export default AssistantHeader
