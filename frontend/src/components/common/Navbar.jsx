import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bot, Sparkles, ArrowRight, LogIn, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { Button } from './Button'
import { Badge } from './Badge'

export const Navbar = () => {
  const { isAuthenticated, user, hasAssistant, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 backdrop-blur-xl bg-slate-50/80 dark:bg-slate-950/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg p-1"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <Bot className="w-5 h-5 text-white" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-cyan-400 rounded-full border-2 border-white dark:border-slate-950 animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-slate-900 dark:text-white text-base sm:text-lg">
                Jarvis<span className="text-cyan-500 font-semibold">AI</span>
              </span>
              <Badge variant="cyan" dot className="hidden sm:inline-flex text-[10px] py-0.5 px-2">
                Online
              </Badge>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-wider">
              PERSONAL AI ASSISTANT
            </span>
          </div>
        </Link>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-500/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 transition-all cursor-pointer shadow-xs"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden md:inline-block text-xs text-slate-600 dark:text-slate-400">
                Hi, <strong className="text-slate-900 dark:text-slate-200">{user?.name || user?.email?.split('@')[0]}</strong>
              </span>

              <Button
                size="sm"
                variant="glow"
                icon={hasAssistant ? LayoutDashboard : Sparkles}
                onClick={() => navigate(hasAssistant ? '/dashboard' : '/assistant-setup')}
              >
                <span className="hidden sm:inline">
                  {hasAssistant ? 'Launch Assistant' : 'Set Up Assistant'}
                </span>
                <span className="sm:hidden">{hasAssistant ? 'Dashboard' : 'Setup'}</span>
              </Button>

              <Button
                size="sm"
                variant="ghost"
                icon={LogOut}
                onClick={logout}
                title="Sign Out"
                aria-label="Sign Out"
                className="text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to="/login">
                <Button size="sm" variant="ghost" icon={LogIn}>
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" variant="primary" icon={ArrowRight} iconPosition="right">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
