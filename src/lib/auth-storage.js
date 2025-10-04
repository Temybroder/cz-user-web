/**
 * Secure token storage utility
 * Handles JWT token storage, encryption, and management
 */

// Simple XOR encryption for tokens (for basic security)
const encryptionKey = "conzooming-secure-key-2023"

/**
 * Simple XOR encryption/decryption
 * @param {string} text - Text to encrypt/decrypt
 * @param {string} key - Encryption key
 * @returns {string} Encrypted/decrypted text
 */
function xorEncrypt(text, key) {
  let result = ""
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
    result += String.fromCharCode(charCode)
  }
  return btoa(result) // Base64 encode for storage
}

/**
 * Simple XOR decryption
 * @param {string} encrypted - Encrypted text
 * @param {string} key - Encryption key
 * @returns {string} Decrypted text
 */
function xorDecrypt(encrypted, key) {
  try {
    const text = atob(encrypted) // Base64 decode
    let result = ""
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length)
      result += String.fromCharCode(charCode)
    }
    return result
  } catch (error) {
    console.error("Failed to decrypt token:", error)
    return ""
  }
}

// Storage keys
const ACCESS_TOKEN_KEY = "conzooming_access_token"
const REFRESH_TOKEN_KEY = "conzooming_refresh_token"
const USER_DATA_KEY = "conzooming_user_data"

// Token expiry buffer (5 minutes in milliseconds)
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000

/**
 * Parse JWT token and extract payload
 * @param {string} token - JWT token
 * @returns {Object|null} Token payload or null if invalid
 */
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1]
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error("Failed to parse JWT:", error)
    return null
  }
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} True if token is expired or invalid
 */
function isTokenExpired(token) {
  try {
    const payload = parseJwt(token)
    if (!payload || !payload.exp) return true

    // Check if token is expired with buffer time
    return Date.now() >= payload.exp * 1000 - TOKEN_EXPIRY_BUFFER
  } catch (error) {
    console.error("Failed to check token expiry:", error)
    return true
  }
}

/**
 * Get token expiry time in milliseconds
 * @param {string} token - JWT token
 * @returns {number} Expiry time in milliseconds or 0 if invalid
 */
function getTokenExpiry(token) {
  try {
    const payload = parseJwt(token)
    if (!payload || !payload.exp) return 0
    return payload.exp * 1000
  } catch (error) {
    console.error("Failed to get token expiry:", error)
    return 0
  }
}

/**
 * Auth storage utility
 */
export const authStorage = {
  /**
   * Set tokens and user data
   * @param {Object} tokens - Access and refresh tokens
   * @param {Object} [userData] - User data
   */
  setTokens: (tokens, userData = null) => {
    console.log("Setting tokens:", tokens ? "Tokens provided" : "No tokens")

    if (tokens?.accessToken) {
      localStorage.setItem(ACCESS_TOKEN_KEY, xorEncrypt(tokens.accessToken, encryptionKey))
    }

    if (tokens?.refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, xorEncrypt(tokens.refreshToken, encryptionKey))
    }

    if (userData) {
      localStorage.setItem(USER_DATA_KEY, xorEncrypt(JSON.stringify(userData), encryptionKey))
    }
  },

  /**
   * Get access token
   * @returns {string|null} Access token or null if not found
   */
  getAccessToken: () => {
    const encrypted = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (!encrypted) return null

    const token = xorDecrypt(encrypted, encryptionKey)
    if (isTokenExpired(token)) {
      console.log("Access token is expired")
      return null
    }

    return token
  },

  /**
   * Get refresh token
   * @returns {string|null} Refresh token or null if not found
   */
  getRefreshToken: () => {
    const encrypted = localStorage.getItem(REFRESH_TOKEN_KEY)
    if (!encrypted) return null

    const token = xorDecrypt(encrypted, encryptionKey)
    if (isTokenExpired(token)) {
      console.log("Refresh token is expired")
      authStorage.clearTokens() // Clear all tokens if refresh token is expired
      return null
    }

    return token
  },

  /**
   * Get user data
   * @returns {Object|null} User data or null if not found
   */
  getUser: () => {
    const encrypted = localStorage.getItem(USER_DATA_KEY)
    if (!encrypted) return null

    try {
      return JSON.parse(xorDecrypt(encrypted, encryptionKey))
    } catch (error) {
      console.error("Failed to parse user data:", error)
      return null
    }
  },

  /**
   * Clear all tokens and user data
   */
  clearTokens: () => {
    console.log("Clearing all tokens and user data")
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
  },

  /**
   * Check if user is authenticated (has valid access token)
   * @returns {boolean} True if authenticated
   */
  isAuthenticated: () => {
    return !!authStorage.getAccessToken()
  },

  /**
   * Get access token expiry time
   * @returns {number} Expiry time in milliseconds or 0 if invalid
   */
  getAccessTokenExpiry: () => {
    const token = authStorage.getAccessToken()
    if (!token) return 0
    return getTokenExpiry(token)
  },

  /**
   * Check if access token needs refresh
   * @returns {boolean} True if token needs refresh
   */
  needsRefresh: () => {
    const token = authStorage.getAccessToken()
    if (!token) return true
    return isTokenExpired(token)
  },
}
