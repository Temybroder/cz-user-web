"use client"

import { useEffect, useState } from "react"
import { AppProvider } from "@/context/app-context"
import RootLayoutClient from "@/app/components/root-layout-client"

export function Providers({ children }) {
  // This ensures the component only renders on the client
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // During server rendering or initial mount, return a minimal version
  // with the same structure to avoid hydration errors
  if (!mounted) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <AppProvider>
      <RootLayoutClient>{children}</RootLayoutClient>
    </AppProvider>
  )
}













// "use client"

// import { useEffect, useState } from "react"
// import { AppProvider } from "@/context/app-context"
// import RootLayoutClient from "@/app/components/root-layout-client"

// export function Providers({ children }) {
//   // This ensures the component only renders on the client
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   if (!mounted) {
//     // Return a placeholder with the same structure to avoid hydration errors
//     return <div className="min-h-screen">{null}</div>
//   }

//   return (
//     <AppProvider>
//       <RootLayoutClient>{children}</RootLayoutClient>
//     </AppProvider>
//   )
// }
