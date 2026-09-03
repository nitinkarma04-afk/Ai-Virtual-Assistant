import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bot, Sparkles, ArrowRight, LogIn, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Button } from './Button'
import { Badge } from './Badge'

export const Navbar = () => {
  const { isAuthenticated, user, hasAssistant, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-4 backdrop-blur-xl bg-slate-950/75 border-b border-slate-800/80 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
            <Bot className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-slate-950 animate-pulse" />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base sm:text-lg">
                Neural<span className="text-cyan-400">Core</span>
              </span>
              <Badge variant="cyan" dot className="hidden sm:inline-flex text-[10px] py-0.5 px-2">
                AI Ready
              </Badge>
            </div>
            <span className="text-[11px] text-slate-400 font-mono tracking-wider">
              PERSONAL ASSISTANT
            </span>
          </div>
        </Link>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="hidden md:inline-block text-xs text-slate-400">
                Hi, <strong className="text-slate-200">{user?.name || user?.email?.split('@')[0]}</strong>
              </span>

              <Button
                size="sm"
                variant="glow"
                icon={hasAssistant ? LayoutDashboard : Sparkles}
                onClick={() => navigate(hasAssistant ? '/dashboard' : '/assistant-setup')}
              >
                <span className="hidden sm:inline">
                  {hasAssistant ? 'Launch Dashboard' : 'Setup Assistant'}
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
                className="text-slate-400 hover:text-rose-400"
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

