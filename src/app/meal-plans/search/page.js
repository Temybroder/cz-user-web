"use client"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Search, Star, Clock, MapPin, Plus, Filter, ArrowDown } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Card, CardContent } from "@/app/components/ui/card"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"
import MealDetailsModal from "@/app/components/modals/meal-details-modal"

// Mock meal data
const mockMeals = [
  {
    id: "1",
    name: "Fried rice",
    vendor: "The place",
    price: 2500,
    rating: 4.8,
    deliveryTime: "25-35 min",
    image: "/fried-rice.png",
    description: "Delicious Nigerian fried rice with mixed vegetables and chicken",
    category: "Rice",
    isAvailable: true,
  },
  {
    id: "2",
    name: "Fried rice and chicken",
    vendor: "KFC",
    price: 2500,
    rating: 4.6,
    deliveryTime: "20-30 min",
    image: "/fried-rice-chicken.png",
    description: "Classic fried rice served with crispy fried chicken",
    category: "Rice",
    isAvailable: true,
  },
  {
    id: "3",
    name: "Nigerian fried rice",
    vendor: "Food Embassy",
    price: 2500,
    rating: 4.9,
    deliveryTime: "30-40 min",
    image: "/nigerian-fried-rice.png",
    description: "Authentic Nigerian fried rice with local spices",
    category: "Rice",
    isAvailable: true,
  },
  {
    id: "4",
    name: "Jollof rice",
    vendor: "Wings Chicken",
    price: 2500,
    rating: 4.7,
    deliveryTime: "25-35 min",
    image: "/vibrant-jollof-rice.png",
    description: "Tasty jollof rice with special seasoning",
    category: "Rice",
    isAvailable: true,
  },
  {
    id: "5",
    name: "Pancakes and syrup",
    vendor: "Chicken Republic",
    price: 1800,
    rating: 4.5,
    deliveryTime: "20-30 min",
    image: "/pancakes-syrup.png",
    description: "Fluffy pancakes with maple syrup",
    category: "Breakfast",
    isAvailable: true,
  },
  {
    id: "6",
    name: "Bread and eggs",
    vendor: "KFC",
    price: 1500,
    rating: 4.8,
    deliveryTime: "15-25 min",
    image: "/bread-eggs.png",
    description: "Fresh bread with scrambled eggs",
    category: "Breakfast",
    isAvailable: true,
  },
  {
    id: "7",
    name: "Shawarma",
    vendor: "Food Embassy",
    price: 2500,
    rating: 4.6,
    deliveryTime: "15-25 min",
    image: "/shawarma.png",
    description: "Middle Eastern shawarma with fresh vegetables",
    category: "Wraps",
    isAvailable: true,
  },
]

// Initialize mock meal plan with proper structure
const createMockMealPlan = () => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

  return {
    _id: "mock-meal-plan-id",
    userId: "mock-user-id",
    planName: "My Weekly Meal Plan",
    planDetails: days.map((day) => ({
      dayOfWeek: day,
      meals: [],
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

const initializeMockMealPlan = () => {
  console.log("Initializing mock meal plan...")
  const mockMealPlan = createMockMealPlan()
  localStorage.setItem("currentMealPlan", JSON.stringify(mockMealPlan))
  console.log("Mock meal plan created:", mockMealPlan)
  return mockMealPlan
}

export default function MealSearchPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [visibleMeals, setVisibleMeals] = useState(6)

  // Get context from URL params
  const day = searchParams.get("day")
  const mealClass = searchParams.get("mealClass")
  const mealIndex = searchParams.get("mealIndex")

  useEffect(() => {
    console.log("Search page loaded with params:", { day, mealClass, mealIndex })

    // Ensure meal plan exists
    const existingPlan = localStorage.getItem("currentMealPlan")
    if (!existingPlan) {
      console.log("No existing meal plan found, creating new one...")
      initializeMockMealPlan()
    } else {
      console.log("Existing meal plan found:", JSON.parse(existingPlan))
    }

    // Simulate API call
    setTimeout(() => {
      setMeals(mockMeals)
      setLoading(false)
    }, 1000)

    // Set initial search query if available
    const query = searchParams.get("q")
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams, day, mealClass, mealIndex])

  const handleSearch = (e) => {
    e.preventDefault()
    // Filter meals based on search query
    const filtered = mockMeals.filter(
      (meal) =>
        meal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        meal.vendor.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setMeals(filtered)
  }

  const handleQuickAdd = (meal) => {
    console.log("Quick adding meal:", meal, "for", day, mealClass)
    // Quick add without customization
    handleMealSelection(meal, {
      quantity: 1,
      selectedProteins: [],
      selectedDrinks: [],
      specifications: "",
    })
  }

  const handleMealClick = (meal) => {
    setSelectedMeal(meal)
    setShowDetailsModal(true)
  }

  const handleMealSelection = async (meal, customizations) => {
    try {
      console.log("=== MEAL SELECTION START ===")
      console.log("Adding meal to plan:", { meal, customizations, day, mealClass, mealIndex })

      if (!day || !mealClass) {
        console.error("Missing required parameters:", { day, mealClass })
        alert("Missing day or meal class information. Please try again.")
        return
      }

      // Create meal object for meal plan
      const newMeal = {
        id: `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        status: "pending",
        mealContents: [meal.name],
        mealClass: mealClass,
        deliveryTime: new Date(
          new Date().setHours(mealClass === "breakfast" ? 8 : mealClass === "lunch" ? 13 : 19, 0, 0, 0),
        ).toISOString(),
        orderBody: `${mealClass} order - ${meal.name}`,
        orderSubTotal: meal.price * customizations.quantity,
        totalAmount: meal.price * customizations.quantity,
        partnerBusinessBranchId: "pb" + Math.floor(Math.random() * 5 + 1),
        noteToRider: customizations.specifications || "Please deliver on time",
        imageUrl: meal.image,
        mealName: meal.name,
        vendor: meal.vendor,
        price: meal.price,
        rating: meal.rating,
        deliveryTimeEstimate: meal.deliveryTime,
        customizations,
      }

      console.log("Created new meal object:", newMeal)

      // Get current meal plan from localStorage
      let mealPlan
      const storedMealPlan = localStorage.getItem("currentMealPlan")

      if (storedMealPlan) {
        mealPlan = JSON.parse(storedMealPlan)
        console.log("Loaded existing meal plan:", mealPlan)
      } else {
        console.log("No stored meal plan, creating new one...")
        mealPlan = initializeMockMealPlan()
      }

      // Validate meal plan structure
      if (!mealPlan.planDetails || !Array.isArray(mealPlan.planDetails)) {
        console.error("Invalid meal plan structure:", mealPlan)
        mealPlan = createMockMealPlan()
        console.log("Created new meal plan due to invalid structure:", mealPlan)
      }

      console.log(
        "Available days in meal plan:",
        mealPlan.planDetails.map((d) => d.dayOfWeek),
      )
      console.log("Looking for day:", day)

      // Find the day plan (case-insensitive search)
      const dayPlan = mealPlan.planDetails.find((d) => d.dayOfWeek.toLowerCase() === day.toLowerCase())

      if (dayPlan) {
        console.log("Found day plan for", day, "current meals:", dayPlan.meals)

        // Ensure meals array exists
        if (!Array.isArray(dayPlan.meals)) {
          dayPlan.meals = []
          console.log("Initialized meals array for", day)
        }

        if (mealIndex !== null && mealIndex !== undefined && mealIndex !== "null") {
          // Replace existing meal at specific index
          const mealIndexNum = Number.parseInt(mealIndex)
          const mealClassMeals = dayPlan.meals.filter((m) => m.mealClass === mealClass)

          if (mealClassMeals[mealIndexNum]) {
            const originalMealIndex = dayPlan.meals.findIndex((m) => m === mealClassMeals[mealIndexNum])
            dayPlan.meals[originalMealIndex] = newMeal
            console.log("Replaced meal at index", originalMealIndex)
          } else {
            // Add new meal if index doesn't exist
            dayPlan.meals.push(newMeal)
          }
        } else {
          // Add new meal
          dayPlan.meals.push(newMeal)
          console.log("Added new meal to", day, "for", mealClass)
        }

        console.log("Updated day plan meals:", dayPlan.meals)
      } else {
        console.error("Day plan not found for", day)
        console.error(
          "Available days:",
          mealPlan.planDetails.map((d) => d.dayOfWeek),
        )

        // Create the day plan if it doesn't exist
        const newDayPlan = {
          dayOfWeek: day,
          meals: [newMeal],
        }
        mealPlan.planDetails.push(newDayPlan)
        console.log("Created new day plan for", day)
      }

      // Update the meal plan timestamp
      mealPlan.updatedAt = new Date().toISOString()

      // Save updated meal plan to localStorage
      localStorage.setItem("currentMealPlan", JSON.stringify(mealPlan))
      console.log("Saved updated meal plan to localStorage")

      // Trigger storage event for other tabs/components
      const storageEvent = new StorageEvent("storage", {
        key: "currentMealPlan",
        newValue: JSON.stringify(mealPlan),
        oldValue: storedMealPlan,
        storageArea: localStorage,
        url: window.location.href,
      })
      window.dispatchEvent(storageEvent)
      console.log("Dispatched storage event")

      // Show success message
      alert(`${meal.name} has been added to your ${mealClass} for ${day}!`)

      console.log("=== MEAL SELECTION SUCCESS ===")

      // Navigate back to meal plan view
      router.push("/meal-plans/view")
    } catch (error) {
      console.error("=== MEAL SELECTION ERROR ===")
      console.error("Error updating meal:", error)
      alert("Failed to add meal. Please try again.")
    }
  }

  const loadMoreMeals = () => {
    setVisibleMeals((prev) => prev + 6)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AnimatedLoader />
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Link href="/home" className="hover:text-orange-600 transition-colors">
                Home
              </Link>
              <ChevronRight size={16} className="mx-2" />
              <Link href="/meal-plans/view" className="hover:text-orange-600 transition-colors">
                Meal plan
              </Link>
              <ChevronRight size={16} className="mx-2" />
              <span className="text-gray-700 font-medium">Search Meals</span>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search for delicious meals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500 rounded-xl bg-white/80"
                />
              </div>
              <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-12 px-4 border-gray-200 hover:border-orange-300 hover:bg-orange-50 rounded-xl transition-all duration-300"
              >
                <Filter className="w-5 h-5 text-gray-600" />
              </Button>
            </form>
          </div>
        </div>

        {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              {meals.length} Delicious Meals
            </h1>
            {day && mealClass && (
              <p className="text-gray-600 flex items-center gap-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-medium">
                  {mealClass}
                </span>
                <span>for</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
                  {day}
                </span>
              </p>
            )}
          </div>
        </div>

          {/* Meal Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {meals.slice(0, visibleMeals).map((meal) => (
              <Card
                key={meal.id}
                className="group bg-white/80 backdrop-blur-sm border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer hover:scale-105 rounded-2xl overflow-hidden"
                onClick={() => handleMealClick(meal)}
              >
                <CardContent className="p-0">
                  {/* Meal Image */}
                  <div className="relative h-52 overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                    <Image
                      src={meal.image || "/placeholder.svg"}
                      alt={meal.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3">
                      <div className="bg-white/95 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="text-sm font-bold text-gray-900">{meal.rating}</span>
                      </div>
                    </div>

                    {/* Category Tag */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-orange-500/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                        <span className="text-xs font-semibold text-white">{meal.category}</span>
                      </div>
                    </div>
                  </div>

                  {/* Meal Info */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-600 transition-colors line-clamp-1">{meal.name}</h3>
                      <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">₦{meal.price.toLocaleString()}</span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{meal.description}</p>

                    <div className="flex items-center justify-between mb-5 pb-4 border-b border-gray-100">
                      <div className="flex items-center text-gray-500 text-sm">
                        <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center mr-2">
                          <MapPin className="w-4 h-4 text-orange-600" />
                        </div>
                        <span className="font-medium">{meal.vendor}</span>
                      </div>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-1 text-orange-600" />
                        <span className="font-medium">{meal.deliveryTime}</span>
                      </div>
                    </div>

                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleQuickAdd(meal)
                      }}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold h-11 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                    >
                      <Plus className="w-5 h-5 mr-2" />
                      Add to Plan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          {visibleMeals < meals.length && (
            <div className="text-center">
              <Button
                onClick={loadMoreMeals}
                variant="outline"
                className="px-10 py-3 border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Load More Meals
                <ArrowDown className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}

          {/* No Results */}
          {meals.length === 0 && (
            <div className="text-center py-16">
              <div className="w-28 h-28 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Search className="w-14 h-14 text-orange-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No meals found</h3>
              <p className="text-gray-600">Try adjusting your search terms or browse all available meals</p>
            </div>
          )}
        </div>

        {/* Meal Details Modal */}
        <MealDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false)
            setSelectedMeal(null)
          }}
          meal={selectedMeal}
          onSave={handleMealSelection}
        />
      </div>
    </ProtectedRoute>
  )
}















// "use client"
// import { useState, useEffect } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import Image from "next/image"
// import Link from "next/link"
// import { ChevronRight, Search, Plus, ChevronDown, MapPin, User } from "lucide-react"
// import { Button } from "@/app/components/ui/button"
// import { Input } from "@/app/components/ui/input"
// import { Card, CardContent } from "@/app/components/ui/card"
// import { Badge } from "@/app/components/ui/badge"
// import ProtectedRoute from "@/app/components/protected-route"
// import MealDetailsModal from "@/app/components/modals/meal-details-modal"

// export default function MealSearchPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()

//   // Get context from URL params
//   const day = searchParams.get("day")
//   const mealClass = searchParams.get("mealClass")
//   const mealIndex = searchParams.get("mealIndex")

//   const [searchQuery, setSearchQuery] = useState("Fried rice")
//   const [searchResults, setSearchResults] = useState([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [visibleResults, setVisibleResults] = useState(6)
//   const [selectedMeal, setSelectedMeal] = useState(null)
//   const [showMealDetails, setShowMealDetails] = useState(false)

//   // Mock search results
//   const mockResults = [
//     {
//       id: 1,
//       name: "Fried rice",
//       vendor: "The place",
//       price: 2500,
//       imageUrl: "/placeholder.svg?height=200&width=300",
//       rating: 4.5,
//       deliveryTime: "25-30 mins",
//     },
//     {
//       id: 2,
//       name: "Fried rice and chicken",
//       vendor: "KFC",
//       price: 2500,
//       imageUrl: "/placeholder.svg?height=200&width=300",
//       rating: 4.8,
//       deliveryTime: "20-25 mins",
//     },
//     {
//       id: 3,
//       name: "Nigerian fried rice",
//       vendor: "Food Embassy",
//       price: 2500,
//       imageUrl: "/placeholder.svg?height=200&width=300",
//       rating: 4.6,
//       deliveryTime: "30-35 mins",
//     },
//     {
//       id: 4,
//       name: "Fried rice",
//       vendor: "Mega Chicken",
//       price: 2500,
//       imageUrl: "/placeholder.svg?height=200&width=300",
//       rating: 4.3,
//       deliveryTime: "25-30 mins",
//     },
//     {
//       id: 5,
//       name: "Fried rice and chicken",
//       vendor: "The place",
//       price: 2500,
//       imageUrl: "/placeholder.svg?height=200&width=300",
//       rating: 4.7,
//       deliveryTime: "20-25 mins",
//     },
//     {
//       id: 6,
//       name: "Nigerian fried rice",
//       vendor: "KFC",
//       price: 2500,
//       imageUrl: "/placeholder.svg?height=200&width=300",
//       rating: 4.4,
//       deliveryTime: "25-30 mins",
//     },
//     {
//       id: 7,
//       name: "Shawarma",
//       vendor: "Food Embassy",
//       price: 2500,
//       imageUrl: "/placeholder.svg?height=200&width=300",
//       rating: 4.9,
//       deliveryTime: "15-20 mins",
//     },
//   ]

//   useEffect(() => {
//     // Perform initial search
//     handleSearch()
//   }, [])

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return

//     setIsSearching(true)

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 500))

//       // Filter results based on search query
//       const filteredResults = mockResults.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

//       setSearchResults(filteredResults)
//     } catch (error) {
//       console.error("Search failed:", error)
//     } finally {
//       setIsSearching(false)
//     }
//   }

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch()
//     }
//   }

//   const handleMealClick = (meal) => {
//     setSelectedMeal(meal)
//     setShowMealDetails(true)
//   }

//   const handleQuickAdd = async (meal) => {
//     const newMeal = {
//       status: "pending",
//       mealContents: [meal.name],
//       mealClass: mealClass,
//       deliveryTime: new Date(
//         new Date().setHours(mealClass === "breakfast" ? 8 : mealClass === "lunch" ? 13 : 19, 0, 0, 0),
//       ).toISOString(),
//       orderBody: `${mealClass} order`,
//       orderSubTotal: meal.price,
//       totalAmount: meal.price,
//       partnerBusinessBranchId: "pb1",
//       noteToRider: "Please deliver on time",
//       imageUrl: meal.imageUrl,
//       vendor: meal.vendor,
//     }

//     await updateMealPlan(newMeal)
//   }

//   const updateMealPlan = async (newMeal) => {
//     try {
//       // Get current meal plan
//       const storedMealPlan = localStorage.getItem("currentMealPlan")
//       if (!storedMealPlan) return

//       const mealPlan = JSON.parse(storedMealPlan)
//       const dayPlan = mealPlan.planDetails.find((d) => d.dayOfWeek === day)

//       if (dayPlan) {
//         if (mealIndex !== null) {
//           // Replace existing meal
//           dayPlan.meals[Number.parseInt(mealIndex)] = newMeal
//         } else {
//           // Add new meal
//           dayPlan.meals.push(newMeal)
//         }
//       }

//       // Update localStorage
//       localStorage.setItem("currentMealPlan", JSON.stringify(mealPlan))

//       // Update on server
//       await fetch("/api/meal-plans/edit", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           mealPlanId: mealPlan._id,
//           day,
//           mealClass,
//           meal: newMeal,
//           mealIndex: mealIndex ? Number.parseInt(mealIndex) : null,
//         }),
//       })

//       // Navigate back to meal plan
//       router.push("/meal-plans/view")
//     } catch (error) {
//       console.error("Error updating meal plan:", error)
//     }
//   }

//   const handleMealSave = async (mealData) => {
//     await updateMealPlan(mealData)
//     setShowMealDetails(false)
//   }

//   const loadMore = () => {
//     setVisibleResults((prev) => Math.min(prev + 6, searchResults.length))
//   }

//   return (
//     <ProtectedRoute>
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           {/* Header */}
//           <div className="bg-white shadow-sm border-b sticky top-0 z-10 -mx-4 px-4 py-4 mb-6">
//             <div className="max-w-7xl mx-auto">
//               {/* Breadcrumb */}
//               <div className="flex items-center text-sm text-gray-500 mb-4">
//                 <Link href="/meal-plans/view" className="hover:text-gray-700 transition-colors">
//                   Meal plan
//                 </Link>
//                 <ChevronRight size={16} className="mx-2" />
//                 <span className="text-gray-700">Search</span>
//               </div>

//               {/* Search Bar */}
//               <div className="relative max-w-md">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//                 <Input
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   onKeyPress={handleKeyPress}
//                   placeholder="Search for food"
//                   className="pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 text-lg bg-white"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Results Header */}
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-gray-900">
//               {isSearching ? "Searching..." : `${searchResults.length} results found for '${searchQuery}'`}
//             </h1>
//             {day && mealClass && (
//               <p className="text-gray-600 mt-1">
//                 Selecting {mealClass} for {day}
//               </p>
//             )}
//           </div>

//           {/* Results Grid */}
//           {isSearching ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {[...Array(6)].map((_, i) => (
//                 <Card key={i} className="bg-white border-0 shadow-sm animate-pulse">
//                   <CardContent className="p-0">
//                     <div className="w-full h-48 bg-gray-200 rounded-t-lg"></div>
//                     <div className="p-4 space-y-3">
//                       <div className="h-4 bg-gray-200 rounded w-3/4"></div>
//                       <div className="h-3 bg-gray-200 rounded w-1/2"></div>
//                       <div className="h-8 bg-gray-200 rounded w-full"></div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {searchResults.slice(0, visibleResults).map((meal) => (
//                 <Card
//                   key={meal.id}
//                   className="bg-white border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden"
//                   onClick={() => handleMealClick(meal)}
//                 >
//                   <CardContent className="p-0">
//                     <div className="relative w-full h-48 overflow-hidden">
//                       <Image
//                         src={meal.imageUrl || "/placeholder.svg"}
//                         alt={meal.name}
//                         fill
//                         className="object-cover group-hover:scale-105 transition-transform duration-300"
//                       />
//                       <div className="absolute top-3 left-3">
//                         <Badge className="bg-white/90 text-gray-700 backdrop-blur-sm">⭐ {meal.rating}</Badge>
//                       </div>
//                     </div>

//                     <div className="p-4">
//                       <div className="flex items-start justify-between mb-3">
//                         <div className="flex-1">
//                           <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
//                             {meal.name}
//                           </h3>
//                           <div className="flex items-center text-sm text-gray-500 mb-1">
//                             <User className="w-4 h-4 mr-1" />
//                             {meal.vendor}
//                           </div>
//                           <div className="flex items-center text-sm text-gray-500">
//                             <MapPin className="w-4 h-4 mr-1" />
//                             {meal.deliveryTime}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <span className="text-xl font-bold text-gray-900">₦{meal.price.toLocaleString()}</span>
//                         <Button
//                           onClick={(e) => {
//                             e.stopPropagation()
//                             handleQuickAdd(meal)
//                           }}
//                           className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl px-4 py-2 shadow-lg"
//                         >
//                           <Plus className="w-4 h-4 mr-1" />
//                           Add
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}

//           {/* Load More Button */}
//           {!isSearching && visibleResults < searchResults.length && (
//             <div className="text-center mt-8">
//               <Button
//                 onClick={loadMore}
//                 variant="outline"
//                 className="rounded-2xl border-2 border-red-500 text-red-600 hover:bg-red-50 px-8 py-3 bg-transparent font-medium"
//               >
//                 Load More
//                 <ChevronDown className="w-4 h-4 ml-2" />
//               </Button>
//             </div>
//           )}
//         </div>

//         {/* Meal Details Modal */}
//         <MealDetailsModal
//           isOpen={showMealDetails}
//           onClose={() => setShowMealDetails(false)}
//           meal={selectedMeal}
//           day={day}
//           mealClass={mealClass}
//           onSave={handleMealSave}
//         />
//       </div>
//     </ProtectedRoute>
//   )
// }
