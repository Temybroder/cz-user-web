// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import { X, Plus, Calendar, Clock } from "lucide-react"
// import { Button } from "@/app/components/ui/button"
// import { Dialog, DialogContent } from "@/app/components/ui/dialog"
// import { Card, CardContent } from "@/app/components/ui/card"

// export default function MealPlanSelectionModal({ isOpen, onClose, mealPlans, onSelectMealPlan, onCreateNew }) {
//   const [selectedPlan, setSelectedPlan] = useState(null)

//   const handleSelectPlan = () => {
//     if (selectedPlan) {
//       onSelectMealPlan(selectedPlan)
//     }
//   }

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//     })
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white rounded-3xl border-0 shadow-2xl">
//         {/* Header */}
//         <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">Select a Meal Plan</h2>
//               <p className="text-gray-600 mt-1">Choose from your existing meal plans or create a new one</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>
//         </div>

//         <div className="p-6">
//           {/* Create New Option */}
//           <Card
//             className="mb-6 border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 cursor-pointer"
//             onClick={onCreateNew}
//           >
//             <CardContent className="p-6">
//               <div className="flex items-center justify-center space-x-4">
//                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
//                   <Plus className="w-6 h-6 text-orange-600" />
//                 </div>
//                 <div className="text-center">
//                   <h3 className="font-semibold text-gray-900">Create New Meal Plan</h3>
//                   <p className="text-gray-600 text-sm">Generate a fresh meal plan for your subscription</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           {/* Existing Meal Plans */}
//           {mealPlans.length > 0 && (
//             <div>
//               <h3 className="font-semibold text-gray-900 mb-4">Your Existing Meal Plans</h3>
//               <div className="grid gap-4">
//                 {mealPlans.map((plan) => (
//                   <Card
//                     key={plan._id}
//                     className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
//                       selectedPlan?._id === plan._id ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-gray-50"
//                     }`}
//                     onClick={() => setSelectedPlan(plan)}
//                   >
//                     <CardContent className="p-6">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <div className="flex items-center space-x-3 mb-3">
//                             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
//                               <Calendar className="w-5 h-5 text-purple-600" />
//                             </div>
//                             <div>
//                               <h4 className="font-semibold text-gray-900">Meal Plan #{plan._id.slice(-6)}</h4>
//                               <p className="text-sm text-gray-500">Created {formatDate(plan.createdAt)}</p>
//                             </div>
//                           </div>

//                           <div className="grid grid-cols-2 gap-4 text-sm">
//                             <div className="flex items-center space-x-2">
//                               <Clock className="w-4 h-4 text-gray-400" />
//                               <span className="text-gray-600">{plan.planDetails?.length || 7} days planned</span>
//                             </div>
//                             <div className="flex items-center space-x-2">
//                               <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
//                                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
//                               </div>
//                               <span className="text-gray-600">
//                                 {plan.considerNutritionalPreferences ? "With" : "Without"} preferences
//                               </span>
//                             </div>
//                           </div>
//                         </div>

//                         {/* Meal Preview */}
//                         <div className="flex -space-x-2 ml-4">
//                           {plan.planDetails?.slice(0, 3).map((day, index) => (
//                             <div
//                               key={index}
//                               className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
//                             >
//                               <Image
//                                 src={day.meals?.[0]?.imageUrl || `/placeholder.svg?height=48&width=48&query=meal`}
//                                 alt="Meal preview"
//                                 width={48}
//                                 height={48}
//                                 className="w-full h-full object-cover"
//                               />
//                             </div>
//                           ))}
//                           {plan.planDetails?.length > 3 && (
//                             <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
//                               +{plan.planDetails.length - 3}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
//             <Button variant="outline" onClick={onClose} className="px-6 py-2 rounded-xl bg-transparent">
//               Cancel
//             </Button>
//             <Button
//               onClick={handleSelectPlan}
//               disabled={!selectedPlan}
//               className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-2 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Select Plan
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
































"use client"

import { useState } from "react"
import Image from "next/image"
import { X, Plus, Calendar, Clock } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent, DialogTitle, VisuallyHidden } from "@/app/components/ui/dialog"
import { Card, CardContent } from "@/app/components/ui/card"

export default function MealPlanSelectionModal({ isOpen, onClose, mealPlans, onSelectMealPlan, onCreateNew }) {
  const [selectedPlan, setSelectedPlan] = useState(null)

  const handleSelectPlan = () => {
    if (selectedPlan) {
      onSelectMealPlan(selectedPlan)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white rounded-3xl border-0 shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Select a Meal Plan</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Select a Meal Plan</h2>
              <p className="text-gray-600 mt-1">Choose from your existing meal plans or create a new one</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Create New Option */}
          <Card
            className="mb-6 border-2 border-dashed border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 cursor-pointer"
            onClick={onCreateNew}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900">Create New Meal Plan</h3>
                  <p className="text-gray-600 text-sm">Generate a fresh meal plan for your subscription</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Existing Meal Plans */}
          {mealPlans.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Your Existing Meal Plans</h3>
              <div className="grid gap-4">
                {mealPlans.map((plan) => (
                  <Card
                    key={plan._id}
                    className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                      selectedPlan?._id === plan._id ? "ring-2 ring-orange-500 bg-orange-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">Meal Plan #{plan._id.slice(-6)}</h4>
                              <p className="text-sm text-gray-500">Created {formatDate(plan.createdAt)}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">{plan.planDetails?.length || 7} days planned</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              </div>
                              <span className="text-gray-600">
                                {plan.considerNutritionalPreferences ? "With" : "Without"} preferences
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Meal Preview */}
                        <div className="flex -space-x-2 ml-4">
                          {plan.planDetails?.slice(0, 3).map((day, index) => (
                            <div
                              key={index}
                              className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 overflow-hidden"
                            >
                              <Image
                                src={day.meals?.[0]?.imageUrl || `/placeholder.svg?height=48&width=48&query=meal`}
                                alt="Meal preview"
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                          {plan.planDetails?.length > 3 && (
                            <div className="w-12 h-12 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                              +{plan.planDetails.length - 3}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-100">
            <Button variant="outline" onClick={onClose} className="px-6 py-2 rounded-xl bg-transparent">
              Cancel
            </Button>
            <Button
              onClick={handleSelectPlan}
              disabled={!selectedPlan}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-2 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select Plan
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
