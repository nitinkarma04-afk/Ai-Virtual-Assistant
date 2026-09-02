const TOKEN_KEY = 'va_auth_token'
const USER_KEY = 'va_user_data'
const ASSISTANT_KEY = 'va_assistant_data'

/**
 * Safely retrieve authentication token from localStorage
 * @returns {string|null}
 */
export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY) || null
  } catch (error) {
    console.error('Failed to read auth token from storage:', error)
    return null
  }
}

/**
 * Store authentication token into localStorage
 * @param {string} token
 */
export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    } else {
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch (error) {
    console.error('Failed to save auth token to storage:', error)
  }
}

/**
 * Remove authentication token from localStorage
 */
export const removeToken = () => {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch (error) {
    console.error('Failed to remove auth token from storage:', error)
  }
}

/**
 * Safely retrieve parsed user object from localStorage
 * @returns {object|null}
 */
export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error('Failed to read user data from storage:', error)
    return null
  }
}

/**
 * Store user object into localStorage (excluding sensitive fields like passwords)
 * @param {object} user
 */
export const setStoredUser = (user) => {
  try {
    if (user) {
      // Ensure passwords or secrets are never persisted
      const safeUser = { ...user }
      delete safeUser.password
      delete safeUser.token
      localStorage.setItem(USER_KEY, JSON.stringify(safeUser))
    } else {
      localStorage.removeItem(USER_KEY)
    }
  } catch (error) {
    console.error('Failed to save user data to storage:', error)
  }
}

/**
 * Remove user object from localStorage
 */
export const removeStoredUser = () => {
  try {
    localStorage.removeItem(USER_KEY)
  } catch (error) {
    console.error('Failed to remove user data from storage:', error)
  }
}

/**
 * Safely retrieve assistant configuration from localStorage
 * @returns {object|null}
 */
export const getStoredAssistant = () => {
  try {
    const raw = localStorage.getItem(ASSISTANT_KEY)
    return raw ? JSON.parse(raw) : null
  } catch (error) {
    console.error('Failed to read assistant data from storage:', error)
    return null
  }
}

/**
 * Store assistant configuration into localStorage
 * @param {object} assistant
 */
export const setStoredAssistant = (assistant) => {
  try {
    if (assistant) {
      localStorage.setItem(ASSISTANT_KEY, JSON.stringify(assistant))
    } else {
      localStorage.removeItem(ASSISTANT_KEY)
    }
  } catch (error) {
    console.error('Failed to save assistant data to storage:', error)
  }
}

/**
 * Remove assistant configuration from localStorage
 */
export const removeStoredAssistant = () => {
  try {
    localStorage.removeItem(ASSISTANT_KEY)
  } catch (error) {
    console.error('Failed to remove assistant data from storage:', error)
  }
}

/**
 * Clear all authentication and session data from localStorage
 */
export const clearAuthStorage = () => {
  removeToken()
  removeStoredUser()
  removeStoredAssistant()
}

