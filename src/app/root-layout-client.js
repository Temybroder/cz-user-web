"use client"

import { useEffect, useState } from "react"
import { ThemeProvider } from "@/app/components/theme-provider"
import { Toaster } from "@/app/components/ui/toaster"
import { ErrorBoundary } from "@/app/error-boundary"

export default function RootLayoutClient({ children }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <ErrorBoundary>
      <ThemeProvider>
        {isClient ? children : <div className="min-h-screen">{null}</div>}
        <Toaster />
      </ThemeProvider>
    </ErrorBoundary>
  )
}
