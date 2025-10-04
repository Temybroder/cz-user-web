"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Check, X } from "lucide-react"
import Header from "@/app/components/header"
import Footer from "@/app/components/Footer"
import { useAppContext } from "@/context/app-context"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import { getNutritionalPreference, generateMealPlan } from "@/lib/api"
import { mealPlanAPI, userAPI } from "@/lib/api"

export default function ConfirmPreferencesPage() {
  const router = useRouter()
  const { user, isAuthenticated, showLoginModal, showLoader, hideLoader } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [generatingPlan, setGeneratingPlan] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      showLoader()
      // Check authentication
      if (!isAuthenticated) {
        hideLoader()
        showLoginModal("/meal-plan/confirm-preferences")
        return
      }

      try {
        // Get user's nutritional preferences
        const response = await userAPI.getNutritionalPreference()
        setPreferences(response.data)
        setShowModal(true)
      } catch (error) {
        console.error("Error fetching nutritional preferences:", error)
        router.push("/nutritional-preferences/create?returnTo=/meal-plan/flow")
      } finally {
        setLoading(false)
        hideLoader()
      }
    }

    checkAuth()
  }, [isAuthenticated, showLoginModal, router, showLoader, hideLoader])

  const handleGeneratePlan = async (usePreferences) => {
    setShowModal(false)
    setGeneratingPlan(true)
    showLoader()

    try {
      const response = await mealPlanAPI.generateMealPlan({
        useNutritionalPreferences: usePreferences,
      })

      // Navigate to the meal plan view page
      router.push("/meal-plan/view")
    } catch (error) {
      console.error("Error generating meal plan:", error)
    } finally {
      hideLoader()
      setGeneratingPlan(false)
    }
  }

  if (loading || generatingPlan) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <AnimatedLoader />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <ChevronRight size={16} className="mx-1" />
            <Link href="/meal-plan/flow" className="hover:text-gray-700">
              Meal Planner
            </Link>
            <ChevronRight size={16} className="mx-1" />
            <span className="text-gray-700">Confirm Preferences</span>
          </div>

          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-4">Generating Your Meal Plan</h1>
            <p className="text-gray-600 mb-6">We&apos;re preparing your personalized meal plan. This may take a moment.</p>
          </div>
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Use Nutritional Preferences?</h3>
            <p className="text-gray-600 mb-6">
              We noticed you have a nutritional preference profile. Would you like us to consider these preferences when
              creating your meal plan?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleGeneratePlan(true)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg flex items-center justify-center hover:bg-green-700"
              >
                <Check size={18} className="mr-2" />
                Yes, Use Them
              </button>
              <button
                onClick={() => handleGeneratePlan(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg flex items-center justify-center hover:bg-gray-300"
              >
                <X size={18} className="mr-2" />
                No, Thanks
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
