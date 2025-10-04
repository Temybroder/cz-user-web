// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Image from "next/image"
// import Link from "next/link"
// import { ChevronRight, Calendar, Eye, Truck } from "lucide-react"
// import { useAppContext } from "@/context/app-context"
// import { Button } from "@/app/components/ui/button"
// import { Card, CardContent } from "@/app/components/ui/card"
// import AnimatedLoader from "@/app/components/ui/animated-loader"
// import ProtectedRoute from "@/app/components/protected-route"
// import StartDateModal from "@/app/components/modals/start-date-modal"

// export default function SubscriptionTimelinePage() {
//   const router = useRouter()
//   const { user } = useAppContext()
//   const [mealPlan, setMealPlan] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [startDate, setStartDate] = useState(null)
//   const [deliveryFrequency, setDeliveryFrequency] = useState(null)
//   const [showStartDateModal, setShowStartDateModal] = useState(false)

//   useEffect(() => {
//     // Get meal plan from localStorage
//     const storedMealPlan = localStorage.getItem("selectedSubscriptionMealPlan")
//     if (storedMealPlan) {
//       setMealPlan(JSON.parse(storedMealPlan))
//     } else {
//       // Redirect back if no meal plan
//       router.push("/subscriptions/create")
//       return
//     }

//     // Get subscription data from localStorage if exists
//     const storedSubscriptionData = localStorage.getItem("subscriptionData")
//     if (storedSubscriptionData) {
//       const data = JSON.parse(storedSubscriptionData)
//       setStartDate(data.startDate)
//       setDeliveryFrequency(data.deliveryFrequency)
//     }

//     setLoading(false)
//   }, [router])

//   const handleViewPlan = () => {
//     if (!startDate || !deliveryFrequency) {
//       // Store current meal plan in the format expected by meal plan view
//       localStorage.setItem("currentMealPlan", JSON.stringify(mealPlan))
//       router.push("/meal-plans/view")
//     }
//   }

//   const handleStartDateSelect = (date) => {
//     setStartDate(date)
//     setShowStartDateModal(false)

//     // Navigate to delivery frequency page
//     router.push("/subscriptions/delivery-frequency")
//   }

//   const handleSubscriptionDetailsClick = () => {
//     router.push("/subscriptions/delivery-frequency")
//   }

//   const handleReviewAndSubscribe = () => {
//     // Store subscription data
//     const subscriptionData = {
//       mealPlan,
//       startDate,
//       deliveryFrequency,
//     }
//     localStorage.setItem("subscriptionData", JSON.stringify(subscriptionData))

//     router.push("/subscriptions/review")
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <AnimatedLoader />
//       </div>
//     )
//   }

//   if (!mealPlan) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <h1 className="text-2xl font-bold text-gray-900 mb-4">No meal plan found</h1>
//           <Button onClick={() => router.push("/subscriptions/create")}>Start Subscription</Button>
//         </div>
//       </div>
//     )
//   }

//   const formatDate = (dateString) => {
//     if (!dateString) return null
//     return new Date(dateString).toLocaleDateString("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   const canViewPlan = !startDate || !deliveryFrequency

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-6xl mx-auto px-4 py-6">
//           {/* Breadcrumb */}
//           <div className="flex items-center text-sm text-gray-500 mb-8">
//             <Link href="/" className="hover:text-gray-700 transition-colors">
//               Home
//             </Link>
//             <ChevronRight size={16} className="mx-2" />
//             <Link href="/meal-plans" className="hover:text-gray-700 transition-colors">
//               Meal Planner
//             </Link>
//             <ChevronRight size={16} className="mx-2" />
//             <Link href="/subscriptions/create" className="hover:text-gray-700 transition-colors">
//               Start a subscription
//             </Link>
//             <ChevronRight size={16} className="mx-2" />
//             <span className="text-gray-700 font-medium">Subscribe</span>
//           </div>

//           <div className="grid lg:grid-cols-3 gap-8">
//             {/* Left Content */}
//             <div className="lg:col-span-2 space-y-6">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscribe</h1>
//                 <p className="text-gray-600">
//                   Use conzooming AI recommended meal plan and make life easier for yourself
//                 </p>
//               </div>

//               {/* Your Meal Plan */}
//               <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                       <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
//                         <div className="text-2xl">🥗</div>
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-900">Your meal plan</h3>
//                         <p className="text-sm text-gray-500">Curated specially for you</p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="outline"
//                       onClick={handleViewPlan}
//                       disabled={!canViewPlan}
//                       className={`rounded-xl ${
//                         canViewPlan ? "border-red-500 text-red-500 hover:bg-red-50" : "opacity-50 cursor-not-allowed"
//                       }`}
//                     >
//                       <Eye className="w-4 h-4 mr-2" />
//                       View plan
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Start Date */}
//               <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                       <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
//                         <Calendar className="w-6 h-6 text-blue-600" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-900">Start date</h3>
//                         <p className="text-sm text-gray-500">
//                           {startDate ? formatDate(startDate) : "When should we start delivering?"}
//                         </p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="outline"
//                       onClick={() => setShowStartDateModal(true)}
//                       className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl"
//                     >
//                       {startDate ? "Change" : "Choose"}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Subscription Details */}
//               <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
//                 <CardContent className="p-6">
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-4">
//                       <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
//                         <Truck className="w-6 h-6 text-purple-600" />
//                       </div>
//                       <div>
//                         <h3 className="font-semibold text-gray-900">Subscription details</h3>
//                         <p className="text-sm text-gray-500">
//                           {deliveryFrequency
//                             ? `${deliveryFrequency.frequency} - ${deliveryFrequency.days.join(", ")}`
//                             : "How often would you like deliveries?"}
//                         </p>
//                       </div>
//                     </div>
//                     <Button
//                       variant="outline"
//                       onClick={handleSubscriptionDetailsClick}
//                       className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl bg-transparent"
//                     >
//                       {deliveryFrequency ? "Change" : "Choose"}
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Review and Subscribe Button */}
//               {startDate && deliveryFrequency && (
//                 <div className="pt-4">
//                   <Button
//                     onClick={handleReviewAndSubscribe}
//                     className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
//                   >
//                     Review and Subscribe!
//                   </Button>
//                 </div>
//               )}
//             </div>

//             {/* Right Content - Food Image */}
//             <div className="lg:col-span-1">
//               <div className="sticky top-6">
//                 <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
//                   <Image
//                     src="/images/jollof.png"
//                     alt="Delicious meal spread"
//                     fill
//                     className="object-cover"
//                   />
//                   <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Start Date Modal */}
//         <StartDateModal
//           isOpen={showStartDateModal}
//           onClose={() => setShowStartDateModal(false)}
//           onSelectDate={handleStartDateSelect}
//           selectedDate={startDate}
//         />
//       </div>
//     </ProtectedRoute>
//   )
// }


































"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Calendar, Eye, Truck } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"
import StartDateModal from "@/app/components/modals/start-date-modal"

export default function SubscriptionTimelinePage() {
  const router = useRouter()
  const { user } = useAppContext()
  const [mealPlan, setMealPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState(null)
  const [deliveryFrequency, setDeliveryFrequency] = useState(null)
  const [showStartDateModal, setShowStartDateModal] = useState(false)

  useEffect(() => {
    // Get meal plan from localStorage
    const storedMealPlan = localStorage.getItem("selectedSubscriptionMealPlan")
    if (storedMealPlan) {
      setMealPlan(JSON.parse(storedMealPlan))
    } else {
      // Redirect back if no meal plan
      router.push("/subscriptions/create")
      return
    }

    // Get subscription data from localStorage if exists
    const storedSubscriptionData = localStorage.getItem("subscriptionData")
    if (storedSubscriptionData) {
      const data = JSON.parse(storedSubscriptionData)
      if (data.startDate) {
        setStartDate(data.startDate)
      }
      if (data.deliveryFrequency) {
        setDeliveryFrequency(data.deliveryFrequency)
      }
    }

    setLoading(false)
  }, [router])

  const handleViewPlan = () => {
    // Store current meal plan in the format expected by meal plan view
    console.log("Saving meal plan to view:", mealPlan)

    // Ensure the meal plan has the correct structure
    const mealPlanToSave = mealPlan?.planDetails || mealPlan?.mealPlan || mealPlan

    console.log("Normalized meal plan structure:", mealPlanToSave)
    localStorage.setItem("currentMealPlan", JSON.stringify(mealPlanToSave))
    router.push("/meal-plans/view")
  }

  const handleStartDateSelect = (date) => {
    setStartDate(date)
    setShowStartDateModal(false)

    // Update subscription data in localStorage immediately
    const existingData = JSON.parse(localStorage.getItem("subscriptionData") || "{}")
    const updatedData = {
      ...existingData,
      mealPlan,
      startDate: date,
    }
    localStorage.setItem("subscriptionData", JSON.stringify(updatedData))

    // Only navigate to delivery frequency if not already set
    if (!deliveryFrequency) {
      router.push("/subscriptions/delivery-frequency")
    }
  }

  const handleSubscriptionDetailsClick = () => {
    // Store current data before navigating
    const subscriptionData = {
      mealPlan,
      startDate,
      deliveryFrequency,
    }
    localStorage.setItem("subscriptionData", JSON.stringify(subscriptionData))

    router.push("/subscriptions/delivery-frequency")
  }

  const handleReviewAndSubscribe = () => {
    // Normalize meal plan structure before saving
    const planDetails = mealPlan?.planDetails || mealPlan?.mealPlan || mealPlan

    console.log("Original mealPlan:", mealPlan)
    console.log("Normalized planDetails:", planDetails)

    // Store subscription data with normalized structure
    const subscriptionData = {
      mealPlan: {
        planDetails: Array.isArray(planDetails) ? planDetails : []
      },
      startDate,
      deliveryFrequency,
    }

    console.log("Saving subscription data:", subscriptionData)
    localStorage.setItem("subscriptionData", JSON.stringify(subscriptionData))

    router.push("/subscriptions/review")
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
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No meal plan found</h1>
          <Button onClick={() => router.push("/subscriptions/create")}>Start Subscription</Button>
        </div>
      </div>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 py-6">
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
            <span className="text-gray-700 font-medium">Subscribe</span>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Subscribe</h1>
                <p className="text-gray-600">
                  Use conzooming AI recommended meal plan and make life easier for yourself
                </p>
              </div>

              {/* Your Meal Plan */}
              <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <div className="text-2xl">🥗</div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Your meal plan</h3>
                        <p className="text-sm text-gray-500">Curated specially for you</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleViewPlan}
                      className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl bg-transparent"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View plan
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Start Date */}
              <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Start date</h3>
                        <p className="text-sm text-gray-500">
                          {startDate ? formatDate(startDate) : "When should we start delivering?"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowStartDateModal(true)}
                      className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      {startDate ? "Change" : "Choose"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Details */}
              <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                        <Truck className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Subscription details</h3>
                        <p className="text-sm text-gray-500">
                          {deliveryFrequency
                            ? `${deliveryFrequency.frequency} - ${deliveryFrequency.days.join(", ")}`
                            : "How often would you like deliveries?"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={handleSubscriptionDetailsClick}
                      className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl bg-transparent"
                    >
                      {deliveryFrequency ? "Change" : "Choose"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Review and Subscribe Button */}
              {startDate && deliveryFrequency && (
                <div className="pt-4">
                  <Button
                    onClick={handleReviewAndSubscribe}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-4 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                  >
                    Review and Subscribe!
                  </Button>
                </div>
              )}
            </div>

            {/* Right Content - Food Image */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                  <Image
                    src="/images/why-time.jpg"
                    alt="Timeline"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Date Modal */}
        <StartDateModal
          isOpen={showStartDateModal}
          onClose={() => setShowStartDateModal(false)}
          onSelectDate={handleStartDateSelect}
          selectedDate={startDate}
        />
      </div>
    </ProtectedRoute>
  )
}
