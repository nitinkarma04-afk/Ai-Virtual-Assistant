import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './ProtectedRoute'
import { PublicRoute } from './PublicRoute'

// Pages
import { LandingPage } from '../pages/LandingPage'
import { SignupPage } from '../pages/auth/SignupPage'
import { LoginPage } from '../pages/auth/LoginPage'
import { AssistantSetupPage } from '../pages/setup/AssistantSetupPage'
import { AssistantReadyPage } from '../pages/setup/AssistantReadyPage'
import { DashboardPage } from '../pages/dashboard/DashboardPage'
import { ConversationHistoryPage } from '../pages/history/ConversationHistoryPage'
import { MemoryVaultPage } from '../pages/memory/MemoryVaultPage'
import { ProfilePage } from '../pages/profile/ProfilePage'
import { SettingsPage } from '../pages/settings/SettingsPage'

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

      {/* Protected App Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireAssistant>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Conversation History Route */}
      <Route
        path="/history"
        element={
          <ProtectedRoute requireAssistant>
            <ConversationHistoryPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Memory Vault Route */}
      <Route
        path="/memory"
        element={
          <ProtectedRoute requireAssistant>
            <MemoryVaultPage />
          </ProtectedRoute>
        }
      />

      {/* Protected User Profile Route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected Settings Route */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
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
