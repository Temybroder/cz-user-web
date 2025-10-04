"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import Header from "@/app/components/header"
import Footer from "@/app/components/Footer"
import Loader from "@/app/components/loader"

export default function RootLayoutClient({ children }) {
  const pathname = usePathname()
  const { isLoading, authChecked } = useAppContext()
  const [isPageLoading, setIsPageLoading] = useState(true)

  // Pages that should not have the global header/footer
  const excludedRoutes = ["/about", "/partners", "/riders", "/", "/landing", "/nutritional-preferences"]

  // Check if current route should exclude header/footer
  const shouldExcludeHeaderFooter = excludedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  )

  useEffect(() => {
    if (authChecked) {
      setIsPageLoading(false)
    }
  }, [authChecked])

  if (isPageLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  }

  // Conditionally render header and footer
  return (
    <div className="flex flex-col min-h-screen">
      {!shouldExcludeHeaderFooter && <Header />}
      <main className="flex-grow">{children}</main>
      {!shouldExcludeHeaderFooter && <Footer />}
    </div>
  )
}
