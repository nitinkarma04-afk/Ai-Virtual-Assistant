import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'
import { useAuth } from '../hooks/useAuth'

// Phase 3 Built Pages
import { LandingPage } from '../pages/LandingPage'
import { SignupPage } from '../pages/auth/SignupPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { AssistantSetupPage } from '../pages/setup/AssistantSetupPage'
import { AssistantReadyPage } from '../pages/setup/AssistantReadyPage'

// Phase 4+ Route Placeholders (To be built in subsequent phases)
const FutureRoutePlaceholder = ({ title, description, badge }) => {
  const { user, logout, assistant } = useAuth()
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center selection:bg-cyan-500/30 selection:text-cyan-200">
      <div className="max-w-md w-full p-8 rounded-2xl bg-slate-900/60 border border-slate-800 backdrop-blur-xl shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
          {badge || 'Phase 4 Preview'}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
        <p className="text-sm text-slate-400">{description}</p>
        {assistant && (
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-cyan-300">
            Active Assistant: <strong>{assistant.name || assistant.assistantName}</strong>
          </div>
        )}
        {user && (
          <div className="pt-4 border-t border-slate-800/80 flex flex-col items-center gap-3">
            <span className="text-xs text-slate-500">
              Authenticated as <strong className="text-slate-300">{user.name || user.email}</strong>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/20 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Landing Page */}
      <Route path="/" element={<LandingPage />} />

      {/* Public Authentication Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Protected Assistant Onboarding Routes */}
      <Route
        path="/assistant-setup"
        element={
          <ProtectedRoute>
            <AssistantSetupPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/assistant-ready"
        element={
          <ProtectedRoute>
            <AssistantReadyPage />
          </ProtectedRoute>
        }
      />

      {/* Protected App Routes (Phase 4+ Targets) */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireAssistant>
            <FutureRoutePlaceholder
              title="AI Dashboard & Live Command Center"
              badge="Phase 4 Target"
              description="Real-time assistant visualizer, live microphone streaming, wake-word engine, and interactive chat canvas."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute requireAssistant>
            <FutureRoutePlaceholder
              title="Conversation History"
              badge="Phase 5 Target"
              description="Searchable past interaction sessions and timeline logs."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/memory"
        element={
          <ProtectedRoute requireAssistant>
            <FutureRoutePlaceholder
              title="Memory Vault"
              badge="Phase 5 Target"
              description="Long-term assistant learned facts, preferences, and knowledge repository."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <FutureRoutePlaceholder
              title="User Profile"
              badge="Phase 5 Target"
              description="User credentials, assistant metadata, and activity statistics."
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <FutureRoutePlaceholder
              title="Application Settings"
              badge="Phase 5 Target"
              description="Audio pitch/speed calibration, wake-word sensitivity, and theme glows."
            />
          </ProtectedRoute>
        }
      />

      {/* 404 Not Found Fallback */}
      <Route
        path="*"
        element={
          <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
            <h1 className="text-6xl font-extrabold text-cyan-400">404</h1>
            <p className="mt-3 text-lg font-medium text-slate-300">Neural Pathway Not Found</p>
            <p className="mt-1 text-sm text-slate-500">The requested route does not exist.</p>
          </div>
        }
      />
    </Routes>
  )
}

export default AppRoutes
