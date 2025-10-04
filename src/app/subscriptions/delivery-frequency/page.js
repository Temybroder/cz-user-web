// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Image from "next/image"
// import Link from "next/link"
// import { ChevronRight, ArrowLeft, Calendar, Clock, Truck } from "lucide-react"
// import { Button } from "@/app/components/ui/button"
// import { Card, CardContent } from "@/app/components/ui/card"
// import ProtectedRoute from "@/app/components/protected-route"

// const frequencyOptions = [
//   { value: "daily", label: "Daily", maxDays: 7 },
//   { value: "2-days", label: "2 days a week", maxDays: 2 },
//   { value: "3-days", label: "3 days a week", maxDays: 3 },
//   { value: "4-days", label: "4 days a week", maxDays: 4 },
//   { value: "5-days", label: "5 days a week", maxDays: 5 },
// ]

// const dayOptions = [
//   { value: "Monday", label: "Monday", icon: "📅" },
//   { value: "Tuesday", label: "Tuesday", icon: "📅" },
//   { value: "Wednesday", label: "Wednesday", icon: "📅" },
//   { value: "Thursday", label: "Thursday", icon: "📅" },
//   { value: "Friday", label: "Friday", icon: "📅" },
//   { value: "Saturday", label: "Saturday", icon: "🎉" },
//   { value: "Sunday", label: "Sunday", icon: "☀️" },
// ]

// export default function DeliveryFrequencyPage() {
//   const router = useRouter()
//   const [selectedFrequency, setSelectedFrequency] = useState(null)
//   const [selectedDays, setSelectedDays] = useState([])

//   useEffect(() => {
//     // Get existing subscription data if available
//     const storedData = localStorage.getItem("subscriptionData")
//     if (storedData) {
//       const data = JSON.parse(storedData)
//       if (data.deliveryFrequency) {
//         setSelectedFrequency(data.deliveryFrequency.frequency)
//         setSelectedDays(data.deliveryFrequency.days)
//       }
//     }
//   }, [])

//   const handleFrequencySelect = (frequency) => {
//     setSelectedFrequency(frequency.value)

//     // Reset selected days if they exceed the new limit
//     const maxDays = frequency.maxDays
//     if (selectedDays.length > maxDays) {
//       setSelectedDays(selectedDays.slice(0, maxDays))
//     }
//   }

//   const handleDayToggle = (day) => {
//     const currentFrequency = frequencyOptions.find((f) => f.value === selectedFrequency)
//     if (!currentFrequency) return

//     const maxDays = currentFrequency.maxDays

//     if (selectedDays.includes(day)) {
//       setSelectedDays(selectedDays.filter((d) => d !== day))
//     } else {
//       if (selectedDays.length < maxDays) {
//         setSelectedDays([...selectedDays, day])
//       }
//     }
//   }

//   const handleNext = () => {
//     if (!selectedFrequency || selectedDays.length === 0) return

//     // Store delivery frequency data
//     const deliveryFrequency = {
//       frequency: selectedFrequency,
//       days: selectedDays,
//     }

//     // Update subscription data
//     const existingData = JSON.parse(localStorage.getItem("subscriptionData") || "{}")
//     const updatedData = {
//       ...existingData,
//       deliveryFrequency,
//     }
//     localStorage.setItem("subscriptionData", JSON.stringify(updatedData))

//     // Navigate back to timeline page
//     router.push("/subscriptions/timeline")
//   }

//   const handleBack = () => {
//     router.back()
//   }

//   const canProceed = selectedFrequency && selectedDays.length > 0
//   const currentFrequency = frequencyOptions.find((f) => f.value === selectedFrequency)
//   const maxDays = currentFrequency?.maxDays || 0

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

//           <div className="grid lg:grid-cols-2 gap-12 items-start">
//             {/* Left Content */}
//             <div className="space-y-8">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-4">Delivery frequency</h1>
//                 <p className="text-gray-600">
//                   Choose how often you&apos;d like your meals delivered and select your preferred delivery days.
//                 </p>
//               </div>

//               {/* Frequency Selection */}
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <Clock className="w-6 h-6 mr-2 text-orange-500" />
//                   How often do you like your deliveries?
//                 </h2>

//                 <div className="grid grid-cols-2 gap-3">
//                   {frequencyOptions.map((frequency) => (
//                     <Card
//                       key={frequency.value}
//                       className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
//                         selectedFrequency === frequency.value
//                           ? "ring-2 ring-orange-500 bg-orange-50 shadow-lg"
//                           : "hover:bg-gray-50"
//                       }`}
//                       onClick={() => handleFrequencySelect(frequency)}
//                     >
//                       <CardContent className="p-4 text-center">
//                         <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
//                           <Truck className="w-5 h-5 text-orange-600" />
//                         </div>
//                         <h3 className="font-medium text-gray-900">{frequency.label}</h3>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>

//               {/* Day Selection */}
//               {selectedFrequency && (
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                     <Calendar className="w-6 h-6 mr-2 text-purple-500" />
//                     Select your delivery days
//                   </h2>

//                   <p className="text-sm text-gray-600 mb-4">
//                     Choose {selectedFrequency === "daily" ? "all" : `up to ${maxDays}`} day{maxDays !== 1 ? "s" : ""}{" "}
//                     for delivery
//                     {selectedDays.length > 0 && ` (${selectedDays.length}/${maxDays} selected)`}
//                   </p>

//                   <div className="grid grid-cols-2 gap-3">
//                     {dayOptions.map((day) => {
//                       const isSelected = selectedDays.includes(day.value)
//                       const isDisabled = !isSelected && selectedDays.length >= maxDays

//                       return (
//                         <Card
//                           key={day.value}
//                           className={`cursor-pointer transition-all duration-200 ${
//                             isDisabled
//                               ? "opacity-50 cursor-not-allowed"
//                               : isSelected
//                                 ? "ring-2 ring-purple-500 bg-purple-50 shadow-lg hover:shadow-xl"
//                                 : "hover:bg-gray-50 hover:shadow-md"
//                           }`}
//                           onClick={() => !isDisabled && handleDayToggle(day.value)}
//                         >
//                           <CardContent className="p-4 text-center">
//                             <div className="text-2xl mb-2">{day.icon}</div>
//                             <h3 className={`font-medium ${isSelected ? "text-purple-700" : "text-gray-900"}`}>
//                               {day.label}
//                             </h3>
//                           </CardContent>
//                         </Card>
//                       )
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex space-x-4 pt-6">
//                 <Button
//                   variant="outline"
//                   onClick={handleBack}
//                   className="flex items-center px-6 py-3 rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
//                 >
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back
//                 </Button>

//                 <Button
//                   onClick={handleNext}
//                   disabled={!canProceed}
//                   className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>

//             {/* Right Content - Food Image */}
//             <div className="lg:sticky lg:top-6">
//               <div className="relative w-full h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
//                 <Image
//                   src="/images/why-time.jpg"
//                   alt="Delicious meal spread"
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   )
// }








































// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Image from "next/image"
// import Link from "next/link"
// import { ChevronRight, ArrowLeft, Calendar, Clock, Truck } from "lucide-react"
// import { Button } from "@/app/components/ui/button"
// import { Card, CardContent } from "@/app/components/ui/card"
// import ProtectedRoute from "@/app/components/protected-route"

// const frequencyOptions = [
//   { value: "daily", label: "Daily", maxDays: 7 },
//   { value: "2-days", label: "2 days a week", maxDays: 2 },
//   { value: "3-days", label: "3 days a week", maxDays: 3 },
//   { value: "4-days", label: "4 days a week", maxDays: 4 },
//   { value: "5-days", label: "5 days a week", maxDays: 5 },
// ]

// const dayOptions = [
//   { value: "Monday", label: "Monday", icon: "📅" },
//   { value: "Tuesday", label: "Tuesday", icon: "📅" },
//   { value: "Wednesday", label: "Wednesday", icon: "📅" },
//   { value: "Thursday", label: "Thursday", icon: "📅" },
//   { value: "Friday", label: "Friday", icon: "📅" },
//   { value: "Saturday", label: "Saturday", icon: "🎉" },
//   { value: "Sunday", label: "Sunday", icon: "☀️" },
// ]

// export default function DeliveryFrequencyPage() {
//   const router = useRouter()
//   const [selectedFrequency, setSelectedFrequency] = useState(null)
//   const [selectedDays, setSelectedDays] = useState([])
//   const [mealPlan, setMealPlan] = useState(null)
//   const [startDate, setStartDate] = useState(null)

//   useEffect(() => {
//     // Get existing subscription data if available
//     const storedData = localStorage.getItem("subscriptionData")
//     if (storedData) {
//       const data = JSON.parse(storedData)
//       if (data.deliveryFrequency) {
//         setSelectedFrequency(data.deliveryFrequency.frequency)
//         setSelectedDays(data.deliveryFrequency.days)
//       }
//       if (data.mealPlan) {
//         setMealPlan(data.mealPlan)
//       }
//       if (data.startDate) {
//         setStartDate(data.startDate)
//       }
//     }

//     // Also check for meal plan in separate storage
//     const storedMealPlan = localStorage.getItem("selectedSubscriptionMealPlan")
//     if (storedMealPlan && !mealPlan) {
//       setMealPlan(JSON.parse(storedMealPlan))
//     }
//   }, [mealPlan])

//   const handleFrequencySelect = (frequency) => {
//     setSelectedFrequency(frequency.value)

//     // Reset selected days if they exceed the new limit
//     const maxDays = frequency.maxDays
//     if (selectedDays.length > maxDays) {
//       setSelectedDays(selectedDays.slice(0, maxDays))
//     }
//   }

//   const handleDayToggle = (day) => {
//     const currentFrequency = frequencyOptions.find((f) => f.value === selectedFrequency)
//     if (!currentFrequency) return

//     const maxDays = currentFrequency.maxDays

//     if (selectedDays.includes(day)) {
//       setSelectedDays(selectedDays.filter((d) => d !== day))
//     } else {
//       if (selectedDays.length < maxDays) {
//         setSelectedDays([...selectedDays, day])
//       }
//     }
//   }

//   const handleNext = () => {
//     if (!selectedFrequency || selectedDays.length === 0) return

//     // Store delivery frequency data
//     const deliveryFrequency = {
//       frequency: selectedFrequency,
//       days: selectedDays,
//     }

//     // Update subscription data with all current information
//     const updatedData = {
//       mealPlan,
//       startDate,
//       deliveryFrequency,
//     }
//     localStorage.setItem("subscriptionData", JSON.stringify(updatedData))

//     // Navigate back to timeline page
//     router.push("/subscriptions/timeline")
//   }

//   const handleBack = () => {
//     // Save current progress before going back
//     if (selectedFrequency && selectedDays.length > 0) {
//       const deliveryFrequency = {
//         frequency: selectedFrequency,
//         days: selectedDays,
//       }

//       const updatedData = {
//         mealPlan,
//         startDate,
//         deliveryFrequency,
//       }
//       localStorage.setItem("subscriptionData", JSON.stringify(updatedData))
//     }

//     router.back()
//   }

//   const canProceed = selectedFrequency && selectedDays.length > 0
//   const currentFrequency = frequencyOptions.find((f) => f.value === selectedFrequency)
//   const maxDays = currentFrequency?.maxDays || 0

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

//           <div className="grid lg:grid-cols-2 gap-12 items-start">
//             {/* Left Content */}
//             <div className="space-y-8">
//               <div>
//                 <h1 className="text-3xl font-bold text-gray-900 mb-4">Delivery frequency</h1>
//                 <p className="text-gray-600">
//                   Choose how often you&apos;d like your meals delivered and select your preferred delivery days.
//                 </p>
//               </div>

//               {/* Frequency Selection */}
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                   <Clock className="w-6 h-6 mr-2 text-orange-500" />
//                   How often do you like your deliveries?
//                 </h2>

//                 <div className="grid grid-cols-2 gap-3">
//                   {frequencyOptions.map((frequency) => (
//                     <Card
//                       key={frequency.value}
//                       className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
//                         selectedFrequency === frequency.value
//                           ? "ring-2 ring-orange-500 bg-orange-50 shadow-lg"
//                           : "hover:bg-gray-50"
//                       }`}
//                       onClick={() => handleFrequencySelect(frequency)}
//                     >
//                       <CardContent className="p-4 text-center">
//                         <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
//                           <Truck className="w-5 h-5 text-orange-600" />
//                         </div>
//                         <h3 className="font-medium text-gray-900">{frequency.label}</h3>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>

//               {/* Day Selection */}
//               {selectedFrequency && (
//                 <div>
//                   <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//                     <Calendar className="w-6 h-6 mr-2 text-purple-500" />
//                     Select your delivery days
//                   </h2>

//                   <p className="text-sm text-gray-600 mb-4">
//                     Choose {selectedFrequency === "daily" ? "all" : `up to ${maxDays}`} day{maxDays !== 1 ? "s" : ""}{" "}
//                     for delivery
//                     {selectedDays.length > 0 && ` (${selectedDays.length}/${maxDays} selected)`}
//                   </p>

//                   <div className="grid grid-cols-2 gap-3">
//                     {dayOptions.map((day) => {
//                       const isSelected = selectedDays.includes(day.value)
//                       const isDisabled = !isSelected && selectedDays.length >= maxDays

//                       return (
//                         <Card
//                           key={day.value}
//                           className={`cursor-pointer transition-all duration-200 ${
//                             isDisabled
//                               ? "opacity-50 cursor-not-allowed"
//                               : isSelected
//                                 ? "ring-2 ring-purple-500 bg-purple-50 shadow-lg hover:shadow-xl"
//                                 : "hover:bg-gray-50 hover:shadow-md"
//                           }`}
//                           onClick={() => !isDisabled && handleDayToggle(day.value)}
//                         >
//                           <CardContent className="p-4 text-center">
//                             <div className="text-2xl mb-2">{day.icon}</div>
//                             <h3 className={`font-medium ${isSelected ? "text-purple-700" : "text-gray-900"}`}>
//                               {day.label}
//                             </h3>
//                           </CardContent>
//                         </Card>
//                       )
//                     })}
//                   </div>
//                 </div>
//               )}

//               {/* Action Buttons */}
//               <div className="flex space-x-4 pt-6">
//                 <Button
//                   variant="outline"
//                   onClick={handleBack}
//                   className="flex items-center px-6 py-3 rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
//                 >
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back
//                 </Button>

//                 <Button
//                   onClick={handleNext}
//                   disabled={!canProceed}
//                   className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                 >
//                   Next
//                 </Button>
//               </div>
//             </div>

//             {/* Right Content - Food Image */}
//             <div className="lg:sticky lg:top-6">
//               <div className="relative w-full h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
//                 <Image
//                   src="/images/food-spread.png"
//                   alt="Delicious meal spread"
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </ProtectedRoute>
//   )
// }





































"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowLeft, Calendar, Clock, Truck } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import ProtectedRoute from "@/app/components/protected-route"

const frequencyOptions = [
  { value: "daily", label: "Daily", maxDays: 7 },
  { value: "2-days", label: "2 days a week", maxDays: 2 },
  { value: "3-days", label: "3 days a week", maxDays: 3 },
  { value: "4-days", label: "4 days a week", maxDays: 4 },
  { value: "5-days", label: "5 days a week", maxDays: 5 },
]

const dayOptions = [
  { value: "Monday", label: "Monday", icon: "📅" },
  { value: "Tuesday", label: "Tuesday", icon: "📅" },
  { value: "Wednesday", label: "Wednesday", icon: "📅" },
  { value: "Thursday", label: "Thursday", icon: "📅" },
  { value: "Friday", label: "Friday", icon: "📅" },
  { value: "Saturday", label: "Saturday", icon: "🎉" },
  { value: "Sunday", label: "Sunday", icon: "☀️" },
]

export default function DeliveryFrequencyPage() {
  const router = useRouter()
  const [selectedFrequency, setSelectedFrequency] = useState(null)
  const [selectedDays, setSelectedDays] = useState([])
  const [mealPlan, setMealPlan] = useState(null)
  const [startDate, setStartDate] = useState(null)

  useEffect(() => {
    // Get existing subscription data if available
    const storedData = localStorage.getItem("subscriptionData")
    if (storedData) {
      const data = JSON.parse(storedData)
      if (data.deliveryFrequency) {
        setSelectedFrequency(data.deliveryFrequency.frequency)
        setSelectedDays(data.deliveryFrequency.days)
      }
      if (data.mealPlan) {
        setMealPlan(data.mealPlan)
      }
      if (data.startDate) {
        setStartDate(data.startDate)
      }
    }

    // Also check for meal plan in separate storage
    const storedMealPlan = localStorage.getItem("selectedSubscriptionMealPlan")
    if (storedMealPlan) {
      const parsedMealPlan = JSON.parse(storedMealPlan)
      setMealPlan(parsedMealPlan)
    }
  }, []) // Empty dependency array - only run once on mount

  const handleFrequencySelect = (frequency) => {
    setSelectedFrequency(frequency.value)

    // Reset selected days if they exceed the new limit
    const maxDays = frequency.maxDays
    if (selectedDays.length > maxDays) {
      setSelectedDays(selectedDays.slice(0, maxDays))
    }
  }

  const handleDayToggle = (day) => {
    const currentFrequency = frequencyOptions.find((f) => f.value === selectedFrequency)
    if (!currentFrequency) return

    const maxDays = currentFrequency.maxDays

    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day))
    } else {
      if (selectedDays.length < maxDays) {
        setSelectedDays([...selectedDays, day])
      }
    }
  }

  const handleNext = () => {
    if (!selectedFrequency || selectedDays.length === 0) return

    // Store delivery frequency data
    const deliveryFrequency = {
      frequency: selectedFrequency,
      days: selectedDays,
    }

    // Update subscription data with all current information
    const updatedData = {
      mealPlan,
      startDate,
      deliveryFrequency,
    }
    localStorage.setItem("subscriptionData", JSON.stringify(updatedData))

    // Navigate back to timeline page
    router.push("/subscriptions/timeline")
  }

  const handleBack = () => {
    // Save current progress before going back
    if (selectedFrequency && selectedDays.length > 0) {
      const deliveryFrequency = {
        frequency: selectedFrequency,
        days: selectedDays,
      }

      const updatedData = {
        mealPlan,
        startDate,
        deliveryFrequency,
      }
      localStorage.setItem("subscriptionData", JSON.stringify(updatedData))
    }

    router.back()
  }

  const canProceed = selectedFrequency && selectedDays.length > 0
  const currentFrequency = frequencyOptions.find((f) => f.value === selectedFrequency)
  const maxDays = currentFrequency?.maxDays || 0

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

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Content */}
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Delivery frequency</h1>
                <p className="text-gray-600">
                  Choose how often you&apos;d like your meals delivered and select your preferred delivery days.
                </p>
              </div>

              {/* Frequency Selection */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-orange-500" />
                  How often do you like your deliveries?
                </h2>

                <div className="grid grid-cols-2 gap-3">
                  {frequencyOptions.map((frequency) => (
                    <Card
                      key={frequency.value}
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        selectedFrequency === frequency.value
                          ? "ring-2 ring-orange-500 bg-orange-50 shadow-lg"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleFrequencySelect(frequency)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                          <Truck className="w-5 h-5 text-orange-600" />
                        </div>
                        <h3 className="font-medium text-gray-900">{frequency.label}</h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Day Selection */}
              {selectedFrequency && (
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                    <Calendar className="w-6 h-6 mr-2 text-purple-500" />
                    Select your delivery days
                  </h2>

                  <p className="text-sm text-gray-600 mb-4">
                    Choose {selectedFrequency === "daily" ? "all" : `up to ${maxDays}`} day{maxDays !== 1 ? "s" : ""}{" "}
                    for delivery
                    {selectedDays.length > 0 && ` (${selectedDays.length}/${maxDays} selected)`}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {dayOptions.map((day) => {
                      const isSelected = selectedDays.includes(day.value)
                      const isDisabled = !isSelected && selectedDays.length >= maxDays

                      return (
                        <Card
                          key={day.value}
                          className={`cursor-pointer transition-all duration-200 ${
                            isDisabled
                              ? "opacity-50 cursor-not-allowed"
                              : isSelected
                                ? "ring-2 ring-purple-500 bg-purple-50 shadow-lg hover:shadow-xl"
                                : "hover:bg-gray-50 hover:shadow-md"
                          }`}
                          onClick={() => !isDisabled && handleDayToggle(day.value)}
                        >
                          <CardContent className="p-4 text-center">
                            <div className="text-2xl mb-2">{day.icon}</div>
                            <h3 className={`font-medium ${isSelected ? "text-purple-700" : "text-gray-900"}`}>
                              {day.label}
                            </h3>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  className="flex items-center px-6 py-3 rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed}
                  className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Right Content - Food Image */}
            <div className="lg:sticky lg:top-6">
              <div className="relative w-full h-96 lg:h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/why-time.jpeg"
                  alt="Meal time selection"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
