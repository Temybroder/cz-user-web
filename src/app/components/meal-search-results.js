"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, ChevronDown } from "lucide-react"
import MealDetailsModal from "@/components/modals/meal-details-modal"

export default function MealSearchResults({
  isOpen,
  onClose,
  searchQuery,
  results,
  day,
  mealClass,
  mealIndex,
  onMealUpdate,
  onBackToSearch,
}) {
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [showMealDetails, setShowMealDetails] = useState(false)
  const [visibleResults, setVisibleResults] = useState(6)

  const handleMealClick = (meal) => {
    setSelectedMeal(meal)
    setShowMealDetails(true)
  }

  const handleQuickAdd = async (meal) => {
    const newMeal = {
      status: "pending",
      mealContents: [meal.name],
      mealClass: mealClass,
      deliveryTime: new Date(
        new Date().setHours(mealClass === "breakfast" ? 8 : mealClass === "lunch" ? 13 : 19, 0, 0, 0),
      ).toISOString(),
      orderBody: `${mealClass} order`,
      orderSubTotal: meal.price,
      totalAmount: meal.price,
      partnerBusinessBranchId: "pb1",
      noteToRider: "Please deliver on time",
      imageUrl: meal.imageUrl,
    }

    await onMealUpdate(newMeal, day, mealClass, mealIndex)
  }

  const handleMealSave = async (mealData) => {
    await onMealUpdate(mealData, day, mealClass, mealIndex)
    setShowMealDetails(false)
  }

  const loadMore = () => {
    setVisibleResults((prev) => Math.min(prev + 6, results.length))
  }

  if (showMealDetails) {
    return (
      <MealDetailsModal
        isOpen={isOpen}
        onClose={onClose}
        meal={selectedMeal}
        day={day}
        mealClass={mealClass}
        onSave={handleMealSave}
        onBack={() => setShowMealDetails(false)}
      />
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={onBackToSearch} className="mr-4 rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <DialogTitle className="text-2xl font-bold text-gray-900">
                  {results.length} results found for &apos;{searchQuery}&apos;
                </DialogTitle>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.slice(0, visibleResults).map((meal) => (
                <div
                  key={meal.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => handleMealClick(meal)}
                >
                  <div className="relative w-full h-40">
                    <Image
                      src={meal.imageUrl || "/placeholder.svg"}
                      alt={meal.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{meal.name}</h3>
                        <p className="text-sm text-gray-500">{meal.vendor}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">₦{meal.price.toLocaleString()}</span>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleQuickAdd(meal)
                        }}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl px-4 py-2 shadow-lg"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            {visibleResults < results.length && (
              <div className="text-center mt-8">
                <Button
                  onClick={loadMore}
                  variant="outline"
                  className="rounded-2xl border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3 bg-transparent"
                >
                  Load More
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
























// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog"
// import { Button } from "@/app/components/ui/button"
// import { ArrowLeft, Plus, ChevronDown } from "lucide-react"
// import MealDetailsModal from "@/app/components/modals/meal-details-modal"

// export default function MealSearchResults({
//   isOpen,
//   onClose,
//   searchQuery,
//   results,
//   day,
//   mealClass,
//   mealIndex,
//   onMealUpdate,
//   onBackToSearch,
// }) {
//   const [selectedMeal, setSelectedMeal] = useState(null)
//   const [showMealDetails, setShowMealDetails] = useState(false)
//   const [visibleResults, setVisibleResults] = useState(6)

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
//     }

//     await onMealUpdate(newMeal, day, mealClass, mealIndex)
//   }

//   const handleMealSave = async (mealData) => {
//     await onMealUpdate(mealData, day, mealClass, mealIndex)
//     setShowMealDetails(false)
//   }

//   const loadMore = () => {
//     setVisibleResults((prev) => Math.min(prev + 6, results.length))
//   }

//   if (showMealDetails) {
//     return (
//       <MealDetailsModal
//         isOpen={isOpen}
//         onClose={onClose}
//         meal={selectedMeal}
//         day={day}
//         mealClass={mealClass}
//         onSave={handleMealSave}
//         onBack={() => setShowMealDetails(false)}
//       />
//     )
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
//         <div className="p-6">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <div className="flex items-center">
//               <Button variant="ghost" size="icon" onClick={onBackToSearch} className="mr-4 rounded-full">
//                 <ArrowLeft className="w-5 h-5" />
//               </Button>
//               <div>
//                 <DialogTitle className="text-2xl font-bold text-gray-900">
//                   {results.length} results found for &apos;{searchQuery}&apos;
//                 </DialogTitle>
//               </div>
//             </div>
//           </div>

//           {/* Results Grid */}
//           <div className="max-h-[60vh] overflow-y-auto">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {results.slice(0, visibleResults).map((meal) => (
//                 <div
//                   key={meal.id}
//                   className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
//                   onClick={() => handleMealClick(meal)}
//                 >
//                   <div className="relative w-full h-40">
//                     <Image
//                       src={meal.imageUrl || "/placeholder.svg"}
//                       alt={meal.name}
//                       fill
//                       className="object-cover group-hover:scale-105 transition-transform duration-300"
//                     />
//                   </div>

//                   <div className="p-4">
//                     <div className="flex items-start justify-between mb-2">
//                       <div className="flex-1">
//                         <h3 className="font-bold text-lg text-gray-900 mb-1">{meal.name}</h3>
//                         <p className="text-sm text-gray-500">{meal.vendor}</p>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-between">
//                       <span className="text-xl font-bold text-gray-900">₦{meal.price.toLocaleString()}</span>
//                       <Button
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           handleQuickAdd(meal)
//                         }}
//                         className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl px-4 py-2 shadow-lg"
//                       >
//                         <Plus className="w-4 h-4 mr-1" />
//                         Add
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             {/* Load More Button */}
//             {visibleResults < results.length && (
//               <div className="text-center mt-8">
//                 <Button
//                   onClick={loadMore}
//                   variant="outline"
//                   className="rounded-2xl border-2 border-orange-500 text-orange-600 hover:bg-orange-50 px-8 py-3 bg-transparent"
//                 >
//                   Load More
//                   <ChevronDown className="w-4 h-4 ml-2" />
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
