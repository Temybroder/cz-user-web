// Utility functions for API proxy operations
const EXTERNAL_API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cz-api-server.onrender.com"
import { NextResponse } from "next/server"

/**
 * Forward headers from the incoming request to the external API
 * @param {Request} request - The incoming request object
 * @returns {Object} Headers object to forward
 */
export function getForwardHeaders(request) {
  const headers = {
    "Content-Type": "application/json",
  }

  // Forward authentication headers
  if (request.headers.get("authorization")) {
    headers.Authorization = request.headers.get("authorization")
  }

  // Forward user ID header if present
  if (request.headers.get("x-user-id")) {
    headers["X-User-ID"] = request.headers.get("x-user-id")
  }

  // Forward cookies for session-based auth
  if (request.headers.get("cookie")) {
    headers.Cookie = request.headers.get("cookie")
  }

  return headers
}

/**
 * Make a proxied request to the external API
 * @param {string} endpoint - The API endpoint path
 * @param {Object} options - Fetch options (method, body, etc.)
 * @param {Request} request - The original request for header forwarding
 * @returns {Promise<Response>} The API response
 */
export async function proxyRequest(endpoint, options = {}, request) {
  const url = `${EXTERNAL_API_BASE_URL}${endpoint}`
  const headers = getForwardHeaders(request)

  const fetchOptions = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  }

  return fetch(url, fetchOptions)
}

/**
 * Handle API proxy errors with specific error messages
 * @param {Error} error - The error object
 * @param {string} operation - Description of the operation that failed
 * @returns {Response} Error response
 */
export function handleProxyError(error, operation) {
  console.error(`Error ${operation}:`, error)
  return NextResponse.json({ error: `Failed to ${operation}` }, { status: 500 })
}
