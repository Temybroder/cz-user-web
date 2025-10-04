"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, Sparkles, Clock, Users, Heart, ArrowRight } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/app/components/ui/dialog"
import { Card, CardContent } from "@/app/components/ui/card"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"

export default function MealPlanFlowPage() {
  const router = useRouter()
  const { user, isLoading: contextLoading } = useAppContext()
  const [loading, setLoading] = useState(false)
  const [showPreferenceModal, setShowPreferenceModal] = useState(false)
  const [considerPreferences, setConsiderPreferences] = useState(null)

  const handleGetStarted = () => {
    setShowPreferenceModal(true)
  }

  const handlePreferenceChoice = async (usePreferences) => {
    setConsiderPreferences(usePreferences)
    setShowPreferenceModal(false)
    setLoading(true)

    try {
      if (usePreferences) {
        // Check if user has nutritional preferences
        const checkResponse = await fetch(`/api/nutritional-preferences/check?userId=${user.userId || user.id}`)

        if (!checkResponse.ok) {
          const errorData = await checkResponse.json()
          throw new Error(errorData.message || "Failed to check preferences")
        }

        const data = await checkResponse.json()
        const hasProfile = data.hasProfile || data.exists || false

        if (hasProfile) {
          // Create meal plan with preferences
          await createMealPlan(true)
        } else {
          // Redirect to preferences page with return URL
          router.push("/nutritional-preferences/create?returnTo=/meal-plans/flow")
          return
        }
      } else {
        // Create meal plan without preferences
        await createMealPlan(false)
      }
    } catch (error) {
      console.error("Error in preference flow:", error)
      setLoading(false)
    }
  }

  const createMealPlan = async (usePreferences) => {
    try {
      const response = await fetch("/api/meal-plans/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.userId || user.id,
          considerNutritionalPreferences: usePreferences,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to create meal plan")
      }

      const responseData = await response.json()
      const mealPlan = responseData.data || responseData.mealPlan || responseData

      // Store meal plan in localStorage for the view page
      localStorage.setItem("currentMealPlan", JSON.stringify(mealPlan))

      // Navigate to meal plan view
      router.push("/meal-plans/view")
    } catch (error) {
      console.error("Error creating meal plan:", error)
      alert(error.message || "Failed to create meal plan. Please try again.")
      setLoading(false)
    }
  }

  if (loading || contextLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="flex-grow flex items-center justify-center">
          <AnimatedLoader />
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-300 mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-white">Meal Planner</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <div className="mb-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 mb-6"
                >
                  <Sparkles className="w-4 h-4 text-orange-400 mr-2" />
                  <span className="text-sm font-medium">Subscription based</span>
                </motion.div>

                <h1 className="text-4xl mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Welcome to your Meal Planner
                </h1>

                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  Create meal plan for Subscription order
                </p>
              </div>

              {/* Process Steps */}
              <div className="space-y-6 mb-12">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                  <Card className="bg-white/10 backdrop-blur-sm border-orange-500/30 hover:bg-white/15 transition-all duration-300">
                    <CardContent className="">
                      <div className="flex items-center mt-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mr-4">
                          <Clock className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">Weekly timeline</h3>
                          <p className="text-gray-300">We curate your weekly meal preset</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                  <Card className="bg-white/10 backdrop-blur-sm border-green-500/30 hover:bg-white/15 transition-all duration-300">
                    <CardContent className="p-4">
                      <div className="flex items-center mt-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">Choose your preference</h3>
                          <p className="text-gray-300">Meal plan/timetable curated based on your preference</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                  <Card className="bg-white/10 backdrop-blur-sm border-purple-500/30 hover:bg-white/15 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center mt-2">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-white mb-1">Then Subscribe</h3>
                          <p className="text-gray-300">Meal plan/timetable curated. Life gets easy!</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
                <Button
                  onClick={handleGetStarted}
                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
                >
                  Get started
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/meal-planning.jpeg"
                  alt="Delicious meal spread"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Nutritional Preference Modal */}
        <Dialog open={showPreferenceModal} onOpenChange={setShowPreferenceModal}>
          <DialogContent className="sm:max-w-md bg-white rounded-3xl border-0 shadow-2xl">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                Consider your nutritional preferences?
              </DialogTitle>
              <DialogDescription className="text-gray-600 mb-6">
                Would you like us to consider your dietary preferences when creating your meal plan?
              </DialogDescription>
              <DialogFooter className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  onClick={() => handlePreferenceChoice(false)}
                  className="flex-1 py-3 rounded-xl border-2 hover:bg-gray-50"
                >
                  No, skip preferences
                </Button>
                <Button
                  onClick={() => handlePreferenceChoice(true)}
                  className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl shadow-lg"
                >
                  Yes, use my preferences
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ProtectedRoute>
  )
}
