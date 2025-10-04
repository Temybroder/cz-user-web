"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "@/context/app-context"
import Header from "@/app/components/header"
import Footer from "@/app/components/Footer"
import Loader from "@/app/components/loader"

export default function ClientWrapper({ children }) {
  const { isLoading, authChecked } = useAppContext()
  const [isPageLoading, setIsPageLoading] = useState(true)

  useEffect(() => {
    if (authChecked) {
      setIsPageLoading(false)
    }
  }, [authChecked])

  if (isPageLoading || isLoading) {
    return <Loader />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  )
}
