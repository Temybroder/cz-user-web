"use client"

/**
 * Hook to detect if the current device is mobile
 * @returns {boolean} True if the device is mobile
 */
export function useMobile() {
  if (typeof window === "undefined") {
    return false
  }

  const width = window.innerWidth
  return width <= 768
}
