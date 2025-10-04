"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Calendar, Clock, Trash2, MapPin, Truck } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"

export default function SubscriptionReviewPage() {
  const router = useRouter()
  const { user, selectedAddress } = useAppContext()
  const [subscriptionData, setSubscriptionData] = useState(null)
  const [filteredMealPlan, setFilteredMealPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get subscription data from localStorage
    const storedData = localStorage.getItem("subscriptionData")
    if (!storedData) {
      console.error("No subscription data found, redirecting to create")
      router.push("/subscriptions/create")
      return
    }

    try {
      const data = JSON.parse(storedData)
      console.log("Subscription data loaded:", data)

      // Validate required data
      if (!data.mealPlan) {
        console.error("No meal plan in subscription data")
        alert("Your meal plan is missing. Please create a meal plan first.")
        router.push("/subscriptions/create")
        return
      }

      if (!data.deliveryFrequency) {
        console.error("No delivery frequency in subscription data")
        alert("Please select your delivery frequency.")
        router.push("/subscriptions/timeline")
        return
      }

      setSubscriptionData(data)

      // Handle different possible data structures
      const planDetails = data.mealPlan.planDetails || data.mealPlan.mealPlan || data.mealPlan

      console.log("Plan details:", planDetails)

      // Ensure planDetails is an array with valid data
      if (Array.isArray(planDetails) && planDetails.length > 0) {
        const filtered = {
          ...data.mealPlan,
          planDetails: planDetails.filter((day) =>
            data.deliveryFrequency.days.includes(day.dayOfWeek)
          ),
        }

        // Ensure we have meals for the selected days
        if (filtered.planDetails.length === 0) {
          console.error("No meals for selected delivery days")
          alert("No meals available for your selected delivery days. Please adjust your meal plan.")
          router.push("/subscriptions/timeline")
          return
        }

        setFilteredMealPlan(filtered)
      } else {
        console.error("Invalid or empty meal plan structure:", data.mealPlan)
        alert("Your meal plan data is invalid. Please create a new meal plan.")
        router.push("/subscriptions/create")
        return
      }

      setLoading(false)
    } catch (error) {
      console.error("Error processing subscription data:", error)
      alert("Failed to load subscription data. Please start over.")
      router.push("/subscriptions/create")
    }
  }, [router])

  const handleRemoveMeal = (dayOfWeek, mealIndex) => {
    if (!filteredMealPlan) return

    // Handle different possible data structures
    const planDetails = filteredMealPlan.planDetails || filteredMealPlan.mealPlan || filteredMealPlan

    if (!Array.isArray(planDetails)) {
      console.error("Cannot remove meal - invalid plan structure")
      return
    }

    const updatedPlanDetails = planDetails.map((day) => {
      if (day.dayOfWeek === dayOfWeek) {
        return {
          ...day,
          meals: day.meals?.filter((_, index) => index !== mealIndex) || [],
        }
      }
      return day
    })

    const updatedPlan = {
      ...filteredMealPlan,
      planDetails: updatedPlanDetails,
    }

    setFilteredMealPlan(updatedPlan)

    // Update the stored subscription data
    const updatedSubscriptionData = {
      ...subscriptionData,
      mealPlan: updatedPlan,
    }
    setSubscriptionData(updatedSubscriptionData)
    localStorage.setItem("subscriptionData", JSON.stringify(updatedSubscriptionData))
  }

  const handleConfirmSubscription = async () => {
    if (!subscriptionData || !user) return

    try {
      // // First, update the meal plan
      // const updateResponse = await fetch(`/api/meal-plans/update/${subscriptionData.mealPlan._id}`, {
      //   method: "PUT",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     planDetails: filteredMealPlan.planDetails,
      //   }),
      // })

      // if (!updateResponse.ok) {
      //   throw new Error("Failed to update meal plan")
      // }

      // Navigate to checkout
      router.push("/subscriptions/checkout")
    } catch (error) {
      console.error("Error updating meal plan:", error)
      // Handle error - maybe show error modal
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateTotalAmount = () => {
    if (!filteredMealPlan) return 0

    return filteredMealPlan.planDetails.reduce((total, day) => {
      return (
        total +
        day.meals.reduce((dayTotal, meal) => {
          return dayTotal + (meal.totalAmount || 0)
        }, 0)
      )
    }, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AnimatedLoader />
      </div>
    )
  }

  if (!subscriptionData || !filteredMealPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No subscription data found</h1>
          <Button onClick={() => router.push("/subscriptions/create")}>Start Subscription</Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
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
            <Link href="/subscriptions/create" className="hover:text-gray-700 transition-colors">
              Start a subscription
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-700 font-medium">Review</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content - Meal Plan */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Review Your Subscription</h1>
                <p className="text-gray-600">Review your meal plan and subscription details before confirming</p>
              </div>

              {/* Meal Plan Display */}
              <div className="space-y-4">
                {filteredMealPlan.planDetails.map((day) => (
                  <Card key={day.dayOfWeek} className="shadow-lg border-0 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                        {day.dayOfWeek}
                      </h3>

                      <div className="space-y-3">
                        {day.meals.map((meal, mealIndex) => (
                          <div key={mealIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200">
                                <Image
                                  src={
                                    meal.imageUrl || `/placeholder.svg?height=64&width=64&query=${meal.mealClass} meal`
                                  }
                                  alt={`${meal.mealClass} meal`}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900 capitalize">{meal.mealClass}</h4>
                                <p className="text-sm text-gray-600">
                                  {meal.mealContents?.join(", ") || "Meal contents"}
                                </p>
                                <p className="text-sm font-medium text-green-600">
                                  ₦{meal.totalAmount?.toLocaleString() || "0"}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveMeal(day.dayOfWeek, mealIndex)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Confirm Button */}
              <div className="pt-6">
                <Button
                  onClick={handleConfirmSubscription}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Confirm Subscription
                </Button>
              </div>
            </div>

            {/* Right Content - Subscription Details */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Details</h2>

                    {/* Start Date */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Start Date</h3>
                        <p className="text-sm text-gray-600">{formatDate(subscriptionData.startDate)}</p>
                      </div>
                    </div>

                    {/* Delivery Frequency */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <Truck className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Delivery Frequency</h3>
                        <p className="text-sm text-gray-600">{subscriptionData.deliveryFrequency.frequency}</p>
                      </div>
                    </div>

                    {/* Delivery Days */}
                    <div className="flex items-start space-x-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <Clock className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">Delivery Days</h3>
                        <p className="text-sm text-gray-600">{subscriptionData.deliveryFrequency.days.join(", ")}</p>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {selectedAddress && (
                      <div className="flex items-start space-x-3 mb-6">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                          <MapPin className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Delivery Address</h3>
                          <p className="text-sm text-gray-600">{selectedAddress.fullAddress}</p>
                        </div>
                      </div>
                    )}

                    {/* Total Amount */}
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-gray-900">Total Amount</span>
                        <span className="font-bold text-xl text-green-600">
                          ₦{calculateTotalAmount().toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Per week for selected days</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
