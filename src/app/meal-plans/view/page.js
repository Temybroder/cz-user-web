
"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export default function MealPlanViewPage() {
  const router = useRouter()
  const { user } = useAppContext()
  const [mealPlan, setMealPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("breakfast")

  useEffect(() => {
    // Try to get meal plan from localStorage first
    const storedMealPlan = localStorage.getItem("currentMealPlan")

    if (storedMealPlan) {
      try {
        const parsedPlan = JSON.parse(storedMealPlan)
        console.log("Loaded meal plan from localStorage:", parsedPlan)
        setMealPlan(parsedPlan)
        setLoading(false)
      } catch (error) {
        console.error("Failed to parse meal plan from localStorage:", error)
        router.push("/meal-plans/flow")
      }
    } else {
      // Redirect to create page if no meal plan found
      router.push("/meal-plans/flow")
    }
  }, [router])

  // Listen for meal updates from search page
  useEffect(() => {
    const handleMealUpdate = () => {
      const updatedMealPlan = localStorage.getItem("currentMealPlan")
      if (updatedMealPlan) {
        setMealPlan(JSON.parse(updatedMealPlan))
      }
    }

    // Listen for storage changes
    window.addEventListener("storage", handleMealUpdate)

    // Also check when page becomes visible (user returns from search)
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        handleMealUpdate()
      }
    })

    return () => {
      window.removeEventListener("storage", handleMealUpdate)
      document.removeEventListener("visibilitychange", handleMealUpdate)
    }
  }, [])

  const handleEditMeal = (day, mealClass, mealIndex = null) => {
    // Navigate to search page with context
    const searchParams = new URLSearchParams({
      day,
      mealClass,
      ...(mealIndex !== null && { mealIndex: mealIndex.toString() }),
    })

    router.push(`/meal-plans/search?${searchParams.toString()}`)
  }

  const handleSubscribe = () => {
    // Validate meal plan before proceeding
    if (!mealPlan) {
      alert("No meal plan data available. Please create a meal plan first.")
      router.push("/meal-plans/flow")
      return
    }

    // Normalize and save meal plan for subscription flow
    const planDetails = mealPlan?.planDetails || mealPlan?.mealPlan || mealPlan

    if (!Array.isArray(planDetails) || planDetails.length === 0) {
      alert("Invalid meal plan data. Please create a new meal plan.")
      router.push("/meal-plans/flow")
      return
    }

    // Save normalized meal plan for subscription timeline
    const normalizedMealPlan = {
      planDetails: planDetails
    }

    console.log("Saving meal plan for subscription:", normalizedMealPlan)
    localStorage.setItem("selectedSubscriptionMealPlan", JSON.stringify(normalizedMealPlan))

    // Navigate to subscription timeline
    router.push("/subscriptions/timeline")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AnimatedLoader />
      </div>
    )
  }

  if (!mealPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md p-8 text-center">
          <CardContent>
            <div className="mb-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🍽️</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">No Meal Plan Found</h1>
              <p className="text-gray-600 mb-6">
                You don&apos;t have a meal plan yet. Create one to start your subscription journey!
              </p>
            </div>
            <Button
              onClick={() => router.push("/meal-plans/flow")}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Create Meal Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getMealsForActiveTab = () => {
    // Handle different possible data structures
    const planDetails = mealPlan?.planDetails || mealPlan?.mealPlan || mealPlan

    // Ensure planDetails is an array
    if (!Array.isArray(planDetails)) {
      console.error("Invalid meal plan structure:", mealPlan)
      return days.map((day) => ({ day, meals: null }))
    }

    return days.map((day) => {
      const dayPlan = planDetails.find((d) => d.dayOfWeek === day)
      const meals = dayPlan?.meals?.filter((meal) => meal.mealClass === activeTab) || []
      return { day, meals: meals.length > 0 ? meals[0] : null }
    })
  }

  const getTabIcon = (tab) => {
    switch (tab) {
      case "breakfast":
        return "🍳"
      case "lunch":
        return "🌞"
      case "dinner":
        return "🌙"
      default:
        return "🍽️"
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <Link href="/home" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-700 font-medium">Meal Plan</span>
          </div>

          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                Your Meal Plan
              </h1>
              <p className="text-gray-600">We&apos;ve curated this personalized plan just for you ✨</p>
            </div>
            <Button
              onClick={handleSubscribe}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Subscribe Now
            </Button>
          </div>

          {/* Meal Type Tabs */}
          <div className="flex space-x-2 mb-10 bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl w-fit shadow-lg border border-gray-100">
            {["breakfast", "lunch", "dinner"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md scale-105"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span className="text-xl">{getTabIcon(tab)}</span>
                <span className="capitalize">{tab}</span>
              </button>
            ))}
          </div>

          {/* Meal Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getMealsForActiveTab().map(({ day, meals }) => (
              <Card key={day} className="group bg-white/80 backdrop-blur-sm border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden">
                <CardContent className="p-0">
                  {meals ? (
                    <div className="relative">
                      {/* Meal Image */}
                      <div className="relative w-full h-40 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                        <Image
                          src={meals?.imageUrl || "/placeholder.svg?height=160&width=320&query=meal"}
                          alt={`${activeTab} meal`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-sm font-bold text-orange-600">{day}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                          {meals.mealContents && meals.mealContents.length > 0
                            ? typeof meals.mealContents[0] === "object"
                              ? meals.mealContents[0].name
                              : meals.mealContents[0]
                            : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} meal`}
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">{meals.vendor || "Conzooming Kitchen"}</p>
                        <button
                          onClick={() => handleEditMeal(day, activeTab, 0)}
                          className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                        >
                          Edit Meal
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                        <span className="text-3xl">{getTabIcon(activeTab)}</span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{day}</h3>
                      <p className="text-sm text-gray-500 mb-4">No meal planned yet</p>
                      <button
                        onClick={() => handleEditMeal(day, activeTab)}
                        className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg"
                      >
                        Add Meal
                      </button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </ProtectedRoute>
  )
}
