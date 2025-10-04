"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Calendar, Clock, Gift, Sparkles } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { mealPlanAPI } from "@/lib/api"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"
import MealPlanSelectionModal from "@/app/components/modals/meal-plan-selection-modal"
import NutritionalPreferencesPrompt from "@/app/components/modals/nutritional-preferences-prompt"

export default function StartSubscriptionPage() {
  const router = useRouter()
  const { user, isLoading: contextLoading } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [mealPlans, setMealPlans] = useState([])
  const [showMealPlanModal, setShowMealPlanModal] = useState(false)
  const [showNutritionalPrompt, setShowNutritionalPrompt] = useState(false)
  const [selectedMealPlan, setSelectedMealPlan] = useState(null)

  useEffect(() => {
    if (!contextLoading && user) {
      fetchUserMealPlans()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextLoading, user])

  const fetchUserMealPlans = async () => {
    try {
      setLoading(true)

      const response = await mealPlanAPI.getUserMealPlans(user.userId)

      // Handle successful response with meal plans
      if (response.success && response.mealPlans && response.mealPlans.length > 0) {
        setMealPlans(response.mealPlans)
        setShowMealPlanModal(true)
      } else {
        // No meal plans found - this is expected for new users
        console.log("No meal plans found (expected for new users)")
        setMealPlans([])
        setShowNutritionalPrompt(true)
      }
    } catch (error) {
      // 404 is expected for new users without meal plans - not an error
      if (error.message?.includes("No Meal Plans found") || error.message?.includes("404")) {
        console.log("No meal plans found (expected for new users)")
      } else {
        console.error("Error fetching meal plans:", error.message)
      }
      setMealPlans([])
      setShowNutritionalPrompt(true)
    } finally {
      setLoading(false)
    }
  }

  const handleGetStarted = () => {
    if (mealPlans.length > 0) {
      setShowMealPlanModal(true)
    } else {
      setShowNutritionalPrompt(true)
    }
  }

  const handleMealPlanSelected = (mealPlan) => {
    setSelectedMealPlan(mealPlan)
    setShowMealPlanModal(false)

    // Store selected meal plan for next page
    localStorage.setItem("selectedSubscriptionMealPlan", JSON.stringify(mealPlan))

    // Navigate to subscription timeline page
    router.push("/subscriptions/timeline")
  }

  const handleCreateNewMealPlan = () => {
    setShowMealPlanModal(false)
    setShowNutritionalPrompt(true)
  }

  const handleNutritionalPreferenceResponse = async (considerPreferences) => {
    setShowNutritionalPrompt(false)
    setLoading(true)

    try {
      // Ensure we have a valid userId
      const userId = user?.userId || user?._id

      if (!userId) {
        throw new Error("User ID is missing. Please log in again.")
      }

      const payload = {
        userId: userId,
        considerNutritionalPreferences: considerPreferences
      }

      console.log("Creating meal plan with payload:", payload)
      console.log("User object:", { userId: user?.userId, _id: user?._id })

      const response = await mealPlanAPI.createMealPlan(payload)

      console.log("Meal plan created:", response)

      // Extract meal plan from response
      const mealPlan = response.planDetails || response.mealPlan || response.data || response

      if (!mealPlan) {
        throw new Error("Invalid response from server - no meal plan data received")
      }

      // Store meal plan for next page
      localStorage.setItem("selectedSubscriptionMealPlan", JSON.stringify(mealPlan))

      // Navigate to subscription timeline page
      router.push("/subscriptions/timeline")
    } catch (error) {
      console.error("Error creating meal plan:", error)
      alert(error.message || "Failed to create meal plan. Please try again.")
      setLoading(false)
    }
  }

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
        <AnimatedLoader />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Home
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <Link href="/meal-plans" className="hover:text-gray-700 transition-colors">
              Meal Planner
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-700 font-medium">Start a subscription</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                  Start a subscription
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Unlock exclusive access to fresh, healthy meals delivered to your door. Experience convenience like
                  never before with our personalized meal subscriptions.
                </p>
              </div>

              {/* Features */}
              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Flexible Scheduling</h3>
                    <p className="text-gray-600">Choose your delivery days and frequency that fits your lifestyle</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Personalized Meals</h3>
                    <p className="text-gray-600">
                      AI-powered meal plans tailored to your preferences and dietary needs
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Save Time</h3>
                    <p className="text-gray-600">No more meal planning or grocery shopping - we handle everything</p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGetStarted}
                className="w-full lg:w-auto bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-12 py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                <Gift className="w-6 h-6 mr-3" />
                Get started
              </Button>
            </div>

            {/* Right Content - Hero Card */}
            <div className="relative">
              <Card className="overflow-hidden shadow-2xl border-0 bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 text-white transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <CardContent className="p-8 lg:p-12 text-center">
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <div className="text-4xl">👆</div>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold mb-4">Start a subscription</h2>
                  <p className="text-purple-100 text-lg leading-relaxed">
                    Unlock exclusive access to fresh, healthy meals delivered to your door.
                  </p>
                </CardContent>
              </Card>

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-400 to-red-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-15 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>

        {/* Meal Plan Selection Modal */}
        <MealPlanSelectionModal
          isOpen={showMealPlanModal}
          onClose={() => setShowMealPlanModal(false)}
          mealPlans={mealPlans}
          onSelectMealPlan={handleMealPlanSelected}
          onCreateNew={handleCreateNewMealPlan}
        />

        {/* Nutritional Preferences Prompt */}
        <NutritionalPreferencesPrompt
          isOpen={showNutritionalPrompt}
          onClose={() => setShowNutritionalPrompt(false)}
          onResponse={handleNutritionalPreferenceResponse}
        />
      </div>
    </ProtectedRoute>
  )
}
