"use client"

import { AppProvider } from "@/context/app-context"
import RootLayoutClient from "@/app/components/root-layout-client"

export function ClientComponentBoundary({ children }) {
  return (
    <AppProvider>
      <RootLayoutClient>{children}</RootLayoutClient>
    </AppProvider>
  )
}
