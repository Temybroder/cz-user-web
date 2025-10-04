"use client"

import { forwardRef } from "react"

export const GradientButton = forwardRef(({ children, className = "", disabled = false, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={`relative inline-flex items-center justify-center w-full py-3 px-4 overflow-hidden bg-gradient-to-r from-amber-500 to-red-500 rounded-md text-white font-medium shadow-sm transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

GradientButton.displayName = "GradientButton"
