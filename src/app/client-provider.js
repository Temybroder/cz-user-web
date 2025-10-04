"use client"

import { useState, useEffect } from "react"
import { AppProvider } from "@/context/app-context"

export default function ClientProvider({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return a simple loading state during server rendering
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="h-8 w-8 mx-auto mb-4 rounded-full bg-gray-300"></div>
          <div className="h-4 w-24 mx-auto rounded bg-gray-300"></div>
        </div>
      </div>
    )
  }

  return <AppProvider>{children}</AppProvider>
}
