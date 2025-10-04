/**
 * Authentication interceptor for API requests
 * Handles automatic token refresh and authenticated fetch
 */
import { authStorage } from "./auth-storage"

// Flag to track if a token refresh is in progress
let isRefreshing = false

// Queue of callbacks to execute after token refresh
let refreshCallbacks = []

/**
 * Execute all pending callbacks with the new token
 * @param {string} token - New access token
 */
const processQueue = (token) => {
  refreshCallbacks.forEach((callback) => callback(token))
  refreshCallbacks = []
}

/**
 * Proactively refresh token if it's about to expire
 * @returns {Promise<void>}
 */
export const proactiveTokenRefresh = async () => {
  // Skip if not authenticated or refresh already in progress
  if (!authStorage.isAuthenticated() || isRefreshing) {
    return
  }

  // Check if token needs refresh
  if (authStorage.needsRefresh()) {
    console.log("Token needs refresh, refreshing...")

    // Set refreshing flag to prevent multiple refresh requests
    isRefreshing = true

    try {
      // Get refresh token
      const refreshToken = authStorage.getRefreshToken()
      if (!refreshToken) {
        console.log("No refresh token available")
        authStorage.clearTokens()
        return
      }

      // Call refresh token endpoint - FIXED: Use correct backend endpoint
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://cz-api-server.onrender.com"}/api/user/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        },
      )

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status}`)
      }

      const data = await response.json()

      if (!data.success || !data.tokens) {
        throw new Error("Invalid response from refresh token endpoint")
      }

      // Store new tokens
      authStorage.setTokens(data.tokens)

      // Process queue with new token
      processQueue(data.tokens.accessToken)

      console.log("Token refreshed successfully")
    } catch (error) {
      console.error("Token refresh failed:", error)

      // Clear tokens on refresh failure
      authStorage.clearTokens()

      // Process queue with null token to trigger error handling
      processQueue(null)
    } finally {
      isRefreshing = false
    }
  }
}

/**
 * Authenticated fetch function
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>} Fetch response
 */
export const authenticatedFetch = async (url, options = {}) => {
  // Wait for any ongoing token refresh
  if (isRefreshing) {
    console.log("Token refresh in progress, waiting...")
    await new Promise((resolve) => {
      refreshCallbacks.push(() => resolve())
    })
  }

  // Get access token
  const accessToken = authStorage.getAccessToken()

  // Set up headers with default Content-Type
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  }

  // Add authorization header if token exists
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`
  }

  // Make the request
  let response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 401 Unauthorized error (token expired)
  if (response.status === 401 && !isRefreshing) {
    console.log("Received 401, attempting token refresh...")

    isRefreshing = true

    try {
      // Get refresh token
      const refreshToken = authStorage.getRefreshToken()
      if (!refreshToken) {
        console.log("No refresh token available")
        authStorage.clearTokens()
        throw new Error("Authentication required")
      }

      // Call refresh token endpoint - FIXED: Use correct backend endpoint
      const refreshResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "https://cz-api-server.onrender.com"}/api/user/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        },
      )

      if (!refreshResponse.ok) {
        throw new Error(`Token refresh failed: ${refreshResponse.status}`)
      }

      const data = await refreshResponse.json()

      if (!data.success || !data.tokens) {
        throw new Error("Invalid response from refresh token endpoint")
      }

      // Store new tokens
      authStorage.setTokens(data.tokens)

      // Process queue with new token
      processQueue(data.tokens.accessToken)

      console.log("Token refreshed successfully, retrying original request")

      // Retry the original request with new token
      response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          Authorization: `Bearer ${data.tokens.accessToken}`,
        },
      })
    } catch (error) {
      console.error("Token refresh failed:", error)

      // Clear tokens on refresh failure
      authStorage.clearTokens()

      // Process queue with null token to trigger error handling
      processQueue(null)

      throw new Error("Authentication required")
    } finally {
      isRefreshing = false
    }
  }

  return response
}
