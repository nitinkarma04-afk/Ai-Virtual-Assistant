import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * ProtectedRoute component: ensures user is authenticated before granting access.
 * Shows an ambient loading state while session is being verified.
 * Redirects to /login if unauthenticated, preserving destination in location state.
 */
export const ProtectedRoute = ({ children, requireAssistant = false }) => {
  const { isAuthenticated, isLoading, hasAssistant } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="relative flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
          <div className="absolute w-8 h-8 rounded-full bg-cyan-500/10 blur-md"></div>
        </div>
        <p className="mt-4 text-sm font-medium tracking-wide text-cyan-300/80 animate-pulse">
          Synchronizing Neural Core...
        </p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // If a route specifically requires assistant setup first (and not already on setup page)
  if (requireAssistant && !hasAssistant && location.pathname !== '/assistant-setup') {
    return <Navigate to="/assistant-setup" replace />
  }

  return children ? children : <Outlet />
}

export default ProtectedRoute

