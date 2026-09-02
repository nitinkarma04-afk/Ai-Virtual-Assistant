import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

/**
 * PublicRoute component: prevents authenticated users from revisiting login/signup.
 * Redirects authenticated users to /dashboard or their intended destination.
 */
export const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, hasAssistant } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-100">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin"></div>
      </div>
    )
  }

  if (isAuthenticated) {
    // If the user hasn't configured an assistant yet, direct to setup; otherwise dashboard
    const destination = !hasAssistant ? '/assistant-setup' : '/dashboard'
    const redirectPath = location.state?.from?.pathname || destination
    return <Navigate to={redirectPath} replace />
  }

  return children ? children : <Outlet />
}

export default PublicRoute

