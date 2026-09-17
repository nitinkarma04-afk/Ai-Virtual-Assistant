import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Bot,
  LogOut,
  Sliders,
  User,
  Trash2,
  History,
  Brain,
  Sun,
  Moon,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { Badge } from '../common/Badge'
import { Button } from '../common/Button'

export const AssistantHeader = ({
  assistantState = 'idle',
  onClearChat,
  messageCount = 0,
}) => {
  const { user, assistant, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const location = useLocation()

  const assistantName = assistant?.name || assistant?.assistantName || 'Jarvis'
  const personality = assistant?.personalityName || 'Helpful & Balanced'
  const wakeWord = assistant?.wakeWord || `Hey ${assistantName}`

  const stateLabels = {
    idle: { label: 'Ready', variant: 'cyan' },
    listening: { label: 'Listening...', variant: 'emerald' },
    thinking: { label: 'Thinking...', variant: 'violet' },
    speaking: { label: 'Speaking...', variant: 'cyan' },
  }

  const currentState = stateLabels[assistantState] || stateLabels.idle

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Close mobile menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false)
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMobileMenuOpen])

  return (
    <header className="w-full px-3 sm:px-6 py-2.5 sm:py-3 backdrop-blur-xl bg-white/85 dark:bg-slate-950/85 border-b border-slate-200/80 dark:border-slate-800/80 sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Left: Assistant Identity & Live Presence */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <Link to="/dashboard" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              {/* Live status dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-950 animate-pulse" />
            </div>

            <div className="flex flex-col text-left min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white tracking-tight group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors truncate">
                  {assistantName}
                </span>
                <Badge variant={currentState.variant} dot className="text-[9px] sm:text-[10px] py-0.5 px-1.5 sm:px-2 shrink-0">
                  {currentState.label}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                <span className="truncate max-w-[90px] sm:max-w-xs">{personality}</span>
                <span className="text-slate-400 dark:text-slate-600 hidden sm:inline">•</span>
                <span className="hidden sm:inline text-cyan-600 dark:text-cyan-300/90 font-sans">Say “{wakeWord}”</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right: Controls & Navigation Links */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Theme Toggle (Always directly visible on all screen sizes) */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 transition-all cursor-pointer shadow-xs min-w-[36px] min-h-[36px] sm:min-w-[40px] sm:min-h-[40px] flex items-center justify-center"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {/* Desktop Controls (Preserved exactly as before on desktop breakpoints) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Clear chat button */}
            {messageCount > 0 && onClearChat && (
              <Button
                size="sm"
                variant="ghost"
                icon={Trash2}
                onClick={onClearChat}
                title="Clear active conversation"
                className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 text-xs px-2 sm:px-2.5"
              >
                Clear Chat
              </Button>
            )}

            {/* Conversation History Link */}
            <Link to="/history">
              <Button
                size="sm"
                variant="glass"
                icon={History}
                title="View History"
                className="text-xs px-2.5 sm:px-3 text-cyan-700 dark:text-cyan-300 border-cyan-500/20 dark:border-cyan-500/30 hover:border-cyan-400"
              >
                History
              </Button>
            </Link>

            {/* Memory Link */}
            <Link to="/memory">
              <Button
                size="sm"
                variant="glass"
                icon={Brain}
                title="View Memories"
                className="text-xs px-2.5 sm:px-3 text-indigo-700 dark:text-indigo-300 border-indigo-500/20 dark:border-indigo-500/30 hover:border-indigo-400"
              >
                Memories
              </Button>
            </Link>

            {/* Settings Shortcut */}
            <Link to="/settings">
              <Button
                size="sm"
                variant="glass"
                icon={Sliders}
                title="Settings"
                className="text-xs px-2.5 sm:px-3"
              >
                Settings
              </Button>
            </Link>

            {/* User Profile Shortcut */}
            <Link
              to="/profile"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/60 hover:bg-slate-200 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-cyan-500/40 text-xs text-slate-700 dark:text-slate-300 transition-colors"
            >
              <User className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
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
              className="text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-2 sm:px-2.5"
            />
          </div>

          {/* Mobile Menu Button (< md viewports) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            title={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            className="md:hidden p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 transition-all cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center shadow-xs"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Dropdown Menu */}
      {isMobileMenuOpen && (
        <div
          ref={menuRef}
          className="md:hidden mt-2 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 shadow-2xl animate-fade-in space-y-2 text-sm"
        >
          {/* User Info Tile */}
          <div className="px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5" />
              </div>
              <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                {user?.name || user?.email}
              </span>
            </div>
            <Badge variant="cyan" className="text-[10px] shrink-0">Active</Badge>
          </div>

          {/* Navigation Links Grid */}
          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <Link
              to="/history"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <History className="w-4 h-4 text-cyan-500 shrink-0" />
              <span className="font-medium text-xs">History</span>
            </Link>

            <Link
              to="/memory"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Brain className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="font-medium text-xs">Memories</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <Sliders className="w-4 h-4 text-cyan-500 shrink-0" />
              <span className="font-medium text-xs">Settings</span>
            </Link>

            <Link
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <User className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-medium text-xs">Profile</span>
            </Link>
          </div>

          {/* Action Row */}
          <div className="pt-2 border-t border-slate-200/70 dark:border-slate-800/70 flex items-center justify-between gap-2">
            {messageCount > 0 && onClearChat && (
              <button
                type="button"
                onClick={() => {
                  onClearChat()
                  setIsMobileMenuOpen(false)
                }}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/30 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear Chat</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false)
                logout()
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 bg-slate-100 dark:bg-slate-800/60 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}

export default AssistantHeader
