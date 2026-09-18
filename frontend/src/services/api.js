import axios from 'axios'
import { getToken, clearAuthStorage } from '../utils/token'

// Single point of configuration for the backend base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Create Axios instance with standard defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor: Attach JWT authorization token if available
api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor: Global error formatting and unauthorized session cleanup
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // If response is 401 Unauthorized, clean stored token and notify session expiry
    if (error.response && error.response.status === 401) {
      clearAuthStorage()
      // Dispatch a custom window event for decoupled auth state sync if needed
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }
    return Promise.reject(error)
  }
)

/**
 * Helper to extract user-friendly error message from API response errors
 * @param {any} error
 * @returns {string}
 */
export const getErrorMessage = (error) => {
  if (!error) return 'An unexpected error occurred. Please try again.'
  if (typeof error === 'string') return error
  if (error.response?.data?.message) return error.response.data.message
  if (error.response?.data?.error) return error.response.data.error
  if (error.message) return error.message
  return 'Network error or server unreachable. Please check your connection.'
}

/* =========================================================================
   API Service Endpoints
   ========================================================================= */

// Authentication Services
export const authService = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData)
    return response.data
  },
  getProfile: async () => {
    try {
      const response = await api.get('/user/me')
      return response.data
    } catch {
      const response = await api.get('/auth/me')
      return response.data
    }
  },
  logout: async () => {
    try {
      const response = await api.post('/auth/logout')
      return response.data
    } catch {
      // Clean up client-side state even if backend logout fails
      return { success: true }
    } finally {
      clearAuthStorage()
    }
  },
}

// User Services
export const userService = {
  getCurrentUser: async () => {
    const response = await api.get('/user/me')
    return response.data
  },
  updateAssistant: async (data) => {
    const response = await api.put('/user/assistant', data)
    return response.data
  },
}

// Assistant Configuration Services
export const assistantService = {
  getAssistant: async () => {
    try {
      const response = await api.get('/user/me')
      return response.data
    } catch {
      const response = await api.get('/assistant')
      return response.data
    }
  },
  updateAssistant: async (data) => {
    const response = await api.put('/user/assistant', data)
    return response.data
  },
}

// AI Conversation & History Services
export const chatService = {
  sendMessage: async (payload) => {
    const response = await api.post('/ai/chat', {
      message: payload.message,
    })

    return response.data
  },

  // Save a conversation/action to persistent history
  saveConversation: async (payload) => {
    const response = await api.post('/conversation/save', {
      message: payload.message,
      response: payload.response,
    })

    return response.data
  },

  getHistory: async () => {
    const response = await api.get('/conversation/history')
    return response.data
  },

  clearHistory: async () => {
    const response = await api.delete('/conversation/history')
    return response.data
  },
}
// Long-Term Memory Services
export const memoryService = {
  getMemories: async () => {
    const response = await api.get('/memory')
    return response.data
  },
  createMemory: async (data) => {
    const response = await api.post('/memory', data)
    return response.data
  },
  deleteMemory: async (key) => {
    const response = await api.delete(`/memory/${encodeURIComponent(key)}`)
    return response.data
  },
}

// User Profile Services
export const profileService = {
  getProfile: async () => {
    const response = await api.get('/profile')
    return response.data
  },
  createProfile: async (data) => {
    const response = await api.post('/profile', data)
    return response.data
  },
  updateProfile: async (data) => {
    const response = await api.put('/profile', data)
    return response.data
  },
}

export default api
