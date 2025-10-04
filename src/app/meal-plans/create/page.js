"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"

export default function MealPlanFlowPage() {
  const router = useRouter()
  const { user, nutritionalPreference, isLoading: contextLoading } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [showPreferenceModal, setShowPreferenceModal] = useState(false)

  useEffect(() => {
    // If context is loaded and we have user data
    if (!contextLoading && user) {
      setLoading(false)
    }
  }, [contextLoading, user])

  const handleGetStarted = () => {
    // If user has nutritional preferences, show the modal
    if (nutritionalPreference) {
      setShowPreferenceModal(true)
    } else {
      // Otherwise, redirect to create nutritional preferences
      router.push("/nutritional-preferences/create?returnTo=/meal-plans/create")
    }
  }

  const handleUsePreferences = async (usePreferences) => {
    setShowPreferenceModal(false)
    setLoading(true)

    try {
      // Call API to generate meal plan
      const response = await fetch("/api/meal-plans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId || user._id,
          considerNutritionalPreferences: usePreferences,
          planDetails: {}
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create meal plan")
      }

      const mealPlan = await response.json()

      // Store meal plan in local storage for the next page
      localStorage.setItem("currentMealPlan", JSON.stringify(mealPlan))

      // Redirect to meal plan view
      router.push("/meal-plans/view")
    } catch (error) {
      console.error("Error creating meal plan:", error)
      // Handle error
    } finally {
      setLoading(false)
    }
  }

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <AnimatedLoader />
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
              <ChevronRight size={16} className="mx-1" />
              <Link href="/meal-plans" className="hover:text-gray-700">
                Meal Planner
              </Link>
              <ChevronRight size={16} className="mx-1" />
              <span className="text-gray-700">Get Started</span>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h1 className="text-3xl font-bold mb-4">Personalized Meal Plans</h1>
                <p className="text-gray-600 mb-6">
                  Get customized meal plans tailored to your preferences, dietary restrictions, and health goals. Our
                  AI-powered system will create the perfect meal plan for you.
                </p>

                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <h2 className="font-bold mb-2">How it works</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <span>Tell us about your preferences and dietary restrictions</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <span>Our system generates a personalized meal plan</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <span>Choose your delivery frequency and schedule</span>
                    </li>
                    <li className="flex items-start">
                      <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-2 flex-shrink-0 mt-0.5">
                        4
                      </div>
                      <span>Enjoy fresh, delicious meals delivered to your door</span>
                    </li>
                  </ul>
                </div>

                <Button onClick={handleGetStarted} className="w-full md:w-auto gradient-button">
                  Get Started
                  <ChevronRight size={20} className="ml-2" />
                </Button>
              </div>

              <div className="hidden md:block">
                <Image
                  src="/placeholder.svg?key=dhwzz"
                  alt="Meal Plan"
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </main>

        {/* Nutritional Preference Modal */}
        <Dialog open={showPreferenceModal} onOpenChange={setShowPreferenceModal}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle>Use Nutritional Preferences?</DialogTitle>
            <DialogDescription>
              We noticed you already have a nutritional preference profile. Would you like us to consider these
              preferences when creating your meal plan?
            </DialogDescription>
            <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <Button variant="outline" onClick={() => handleUsePreferences(false)}>
                No, Create Without Preferences
              </Button>
              <Button className="gradient-button" onClick={() => handleUsePreferences(true)}>
                Yes, Use My Preferences
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
