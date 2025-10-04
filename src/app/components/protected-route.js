"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/context/app-context"
import { authStorage } from "@/lib/auth-storage"
import LoginModal from "@/app/components/modals/login-modal"
import AnimatedLoader from "@/app/components/ui/animated-loader"

/**
 * Protected route component that requires authentication
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render when authenticated
 * @param {boolean} [props.showModal=true] - Whether to show login modal for unauthenticated users
 * @returns {JSX.Element} The protected route component
 */
export default function ProtectedRoute({ children, showModal = true }) {
  const { user, authChecked, isAuthenticated } = useAppContext()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [currentPath, setCurrentPath] = useState("")

  // Set current path on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname)
    }
  }, [])

  useEffect(() => {
    if (authChecked) {
      // Check if user is authenticated using both context and storage
      const hasValidAuth = user && isAuthenticated() && authStorage.isAuthenticated()

      if (!hasValidAuth && showModal) {
        console.log("User not authenticated, showing login modal")
        setIsLoginModalOpen(true)
      }
    }
  }, [authChecked, user, isAuthenticated, showModal])

  const handleCloseLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false)
  }

  // Show loading state while checking authentication
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AnimatedLoader size="lg" />
      </div>
    )
  }

  // Always render children, but show login modal if not authenticated
  return (
    <>
      {children}
      {showModal && (
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={handleCloseLoginModal}
          redirectAfterLogin={currentPath}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </>
  )
}
