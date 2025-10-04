"use client"

import { useState, useCallback } from "react"
import { v4 as uuidv4 } from "uuid"

/**
 * Hook to manage toast notifications
 * @returns {Object} Toast methods and state
 * @returns {Array} returns.toast - Array of toast notifications
 * @returns {Function} returns.addToast - Function to add a new toast
 */
export function useToast() {
  const [toast, setToast] = useState([])

  /**
   * Adds a new toast notification
   * @param {string} message - The message to display in the toast
   * @param {string} type - The type of toast (e.g., 'success', 'error', 'info')
   * @param {number} duration - The duration the toast should be displayed in milliseconds. Defaults to 3000.
   */
  const addToast = useCallback((message, type = "info", duration = 3000) => {
    const id = uuidv4()
    setToast((prevToast) => [...prevToast, { id, message, type, duration }])

    setTimeout(() => {
      removeToast(id)
    }, duration)
  }, [removeToast])

  /**
   * Removes a toast notification by its ID
   * @param {string} id - The ID of the toast to remove
   */
  const removeToast = useCallback((id) => {
    setToast((prevToast) => prevToast.filter((toast) => toast.id !== id))
  }, [])

  return { toast, addToast, removeToast }
}
