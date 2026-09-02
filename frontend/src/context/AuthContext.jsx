/* oxlint-disable react/only-export-components */
import React, { createContext, useState, useEffect, useCallback } from 'react'
import {
  getToken,
  setToken as saveToken,
  getStoredUser,
  setStoredUser,
  getStoredAssistant,
  setStoredAssistant,
  clearAuthStorage,
} from '../utils/token'
import { authService, assistantService } from '../services/api'

// Central React Context for Authentication & User Session
export const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  // Synchronous state initialization from storage to prevent layout flicker
  const [token, setTokenState] = useState(() => getToken())
  const [user, setUser] = useState(() => getStoredUser())
  const [assistant, setAssistantState] = useState(() => getStoredAssistant())
  const [isLoading, setIsLoading] = useState(false)

  // Force reset session on unauthorized events
  const handleUnauthorized = useCallback(() => {
    clearAuthStorage()
    setUser(null)
    setTokenState(null)
    setAssistantState(null)
  }, [])

  useEffect(() => {
    let isMounted = true

    const verifySession = async () => {
      const currentToken = getToken()
      if (!currentToken) return

      try {
        const profileData = await authService.getProfile()
        if (isMounted && profileData?.user) {
          setUser(profileData.user)
          setStoredUser(profileData.user)
        }
        if (isMounted && profileData?.assistant) {
          setAssistantState(profileData.assistant)
          setStoredAssistant(profileData.assistant)
        }
      } catch (err) {
        console.warn('Session verification notice:', err?.message || err)
      }
    }

    verifySession()

    window.addEventListener('auth:unauthorized', handleUnauthorized)
    return () => {
      isMounted = false
      window.removeEventListener('auth:unauthorized', handleUnauthorized)
    }
  }, [handleUnauthorized])

  // Login handler
  const login = async (credentials) => {
    setIsLoading(true)
    try {
      const data = await authService.login(credentials)
      const authToken = data.token || data.accessToken
      const authUser = data.user || data.data?.user || { email: credentials.email }
      const authAssistant = data.assistant || data.data?.assistant || null

      if (authToken) {
        saveToken(authToken)
        setTokenState(authToken)
      }

      if (authUser) {
        setStoredUser(authUser)
        setUser(authUser)
      }

      if (authAssistant) {
        setStoredAssistant(authAssistant)
        setAssistantState(authAssistant)
      } else {
        try {
          const assistantRes = await assistantService.getAssistant()
          if (assistantRes?.assistant) {
            setStoredAssistant(assistantRes.assistant)
            setAssistantState(assistantRes.assistant)
          }
        } catch {
          // Assistant setup can happen next
        }
      }

      return data
    } finally {
      setIsLoading(false)
    }
  }

  // Signup handler
  const signup = async (userData) => {
    setIsLoading(true)
    try {
      const data = await authService.signup(userData)
      const authToken = data.token || data.accessToken
      const authUser = data.user || data.data?.user || { email: userData.email, name: userData.name }
      const authAssistant = data.assistant || null

      if (authToken) {
        saveToken(authToken)
        setTokenState(authToken)
      }

      if (authUser) {
        setStoredUser(authUser)
        setUser(authUser)
      }

      if (authAssistant) {
        setStoredAssistant(authAssistant)
        setAssistantState(authAssistant)
      }

      return data
    } finally {
      setIsLoading(false)
    }
  }

  // Logout handler
  const logout = async () => {
    try {
      await authService.logout()
    } catch (err) {
      console.warn('Logout notice:', err?.message || err)
    } finally {
      clearAuthStorage()
      setUser(null)
      setTokenState(null)
      setAssistantState(null)
    }
  }

  // Update user profile in state & storage
  const updateUser = (updatedUserData) => {
    setUser((prev) => {
      const merged = { ...prev, ...updatedUserData }
      setStoredUser(merged)
      return merged
    })
  }

  // Update assistant settings in state & storage
  const setAssistantConfig = (assistantData) => {
    setAssistantState(assistantData)
    setStoredAssistant(assistantData)
  }

  const value = {
    user,
    token,
    assistant,
    isAuthenticated: Boolean(token && user),
    hasAssistant: Boolean(assistant && (assistant.name || assistant.assistantName)),
    isLoading,
    login,
    signup,
    logout,
    updateUser,
    setAssistantConfig,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider

