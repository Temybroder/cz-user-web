"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Clock, Calendar, ChevronDown, ChevronUp, ShoppingBag } from "lucide-react"
import Header from "@/app/components/header"
import Footer from "@/app/components/Footer"
import { useAppContext } from "@/context/app-context"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import { mealPlanAPI } from "@/lib/api"
import { getCurrentMealPlan } from "@/lib/api"

const mealClassIcons = {
  breakfast: "/placeholder-ew947.png",
  lunch: "/placeholder-ew947.png",
  dinner: "/placeholder-ew947.png",
  snack: "/placeholder-ew947.png",
}

export default function MealPlanViewPage() {
  const router = useRouter()
  const { user, isAuthenticated, showLoginModal, showLoader, hideLoader } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [mealPlan, setMealPlan] = useState(null)
  const [expandedDays, setExpandedDays] = useState({})

  useEffect(() => {
    const fetchMealPlan = async () => {
      showLoader()
      // Check authentication
      if (!isAuthenticated) {
        hideLoader()
        showLoginModal("/meal-plan/view")
        return
      }

      try {
        // Get user's current meal plan
        // const response = await getCurrentMealPlan()
        const response = await mealPlanAPI.getMealPlanDetails()
        setMealPlan(response.data)

        // Initialize expanded state for all days
        const expanded = {}
        response.data.planDetails.forEach((day, index) => {
          expanded[day.dayOfWeek] = index === 0 // Expand only the first day
        })
        setExpandedDays(expanded)
      } catch (error) {
        console.error("Error fetching meal plan:", error)
        router.push("/meal-plan/flow")
      } finally {
        setLoading(false)
        hideLoader()
      }
    }

    fetchMealPlan()
  }, [isAuthenticated, showLoginModal, router, showLoader, hideLoader])

  const toggleDayExpansion = (day) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
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
            <span className="text-gray-700">Your Meal Plan</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Your Personalized Meal Plan</h1>
            <p className="text-gray-600">Here&apos;s your customized meal plan for the week. You can modify it anytime.</p>
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 bg-gradient-to-r from-orange-500 to-red-600 text-white">
              <h2 className="text-xl font-bold mb-2">Weekly Meal Plan</h2>
              <p>Customized based on your preferences and nutritional needs</p>
            </div>

            <div className="divide-y divide-gray-200">
              {mealPlan.planDetails.map((dayPlan) => (
                <div key={dayPlan.dayOfWeek} className="border-b border-gray-200 last:border-b-0">
                  <button
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    onClick={() => toggleDayExpansion(dayPlan.dayOfWeek)}
                  >
                    <div className="flex items-center">
                      <Calendar className="text-orange-500 mr-3" size={20} />
                      <span className="font-medium">{dayPlan.dayOfWeek}</span>
                    </div>
                    <div>
                      {expandedDays[dayPlan.dayOfWeek] ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                  </button>

                  {expandedDays[dayPlan.dayOfWeek] && (
                    <div className="px-6 pb-4">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {dayPlan.meals.map((meal, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-4 shadow-sm">
                            <div className="flex items-center mb-3">
                              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                                <Image
                                  src={mealClassIcons[meal.mealClass] || "/placeholder-ew947.png"}
                                  alt={meal.mealClass}
                                  width={24}
                                  height={24}
                                />
                              </div>
                              <div>
                                <h3 className="font-medium capitalize">{meal.mealClass}</h3>
                                <div className="flex items-center text-sm text-gray-500">
                                  <Clock size={14} className="mr-1" />
                                  {formatTime(meal.deliveryTime)}
                                </div>
                              </div>
                            </div>

                            <div className="mb-3">
                              <div className="text-sm text-gray-600 mb-2">Meal contents:</div>
                              <ul className="text-sm space-y-1">
                                {meal.mealContents.map((content, idx) => (
                                  <li key={idx} className="flex items-center">
                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></span>
                                    Product {idx + 1}
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
                              <div className="text-sm font-medium">₦{meal.totalAmount?.toLocaleString() || "0"}</div>
                              <button className="text-xs bg-orange-500 text-white px-3 py-1.5 rounded-full flex items-center">
                                <ShoppingBag size={14} className="mr-1" />
                                Order Now
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <button
              className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 px-8 rounded-full font-medium hover:shadow-lg transition-all"
              onClick={() => router.push("/meal-plan/edit")}
            >
              Customize Meal Plan
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
