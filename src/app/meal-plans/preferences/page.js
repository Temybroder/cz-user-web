"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Check, AlertTriangle, Flame, Target, Plus, X } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"

const questions = [
  {
    id: 1,
    title: "Are there any food you need to avoid due to allergies?",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    bgColor: "from-red-500/20 to-orange-500/20",
    borderColor: "border-red-500/30",
    type: "multiple",
    options: ["Nut", "Eggs", "Wheat", "Dairy", "Soy"],
    hasOther: true,
    key: "allergies",
  },
  {
    id: 2,
    title: "How spicy do you like your food?",
    icon: Flame,
    iconColor: "text-orange-500",
    bgColor: "from-orange-500/20 to-red-500/20",
    borderColor: "border-orange-500/30",
    type: "single",
    options: ["Mild", "Medium", "Hot", "Very hot"],
    key: "spiciness",
  },
  {
    id: 3,
    title: "What are your primary goals for your meal plan?",
    icon: Target,
    iconColor: "text-green-500",
    bgColor: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    type: "multiple",
    options: ["Weight loss", "Weight gain", "Better digestion", "No specific goal"],
    key: "goals",
  },
]

export default function MealPlanPreferencesPage() {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [preferences, setPreferences] = useState({})
  const [otherInput, setOtherInput] = useState("")
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [loading, setLoading] = useState(false)

  const question = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1

  const handleOptionSelect = (option) => {
    const questionKey = question.key

    if (question.type === "single") {
      setPreferences((prev) => ({
        ...prev,
        [questionKey]: option,
      }))
    } else {
      setPreferences((prev) => {
        const current = prev[questionKey] || []
        const isSelected = current.includes(option)

        return {
          ...prev,
          [questionKey]: isSelected ? current.filter((item) => item !== option) : [...current, option],
        }
      })
    }
  }

  const handleOtherAdd = () => {
    if (otherInput.trim()) {
      const questionKey = question.key
      setPreferences((prev) => ({
        ...prev,
        [questionKey]: [...(prev[questionKey] || []), otherInput.trim()],
      }))
      setOtherInput("")
      setShowOtherInput(false)
    }
  }

  const removeCustomOption = (option) => {
    const questionKey = question.key
    setPreferences((prev) => ({
      ...prev,
      [questionKey]: (prev[questionKey] || []).filter((item) => item !== option),
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleSavePreferences = async () => {
    setLoading(true)

    try {
      const response = await fetch("/api/create-health-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          preferences,
          redirect: true,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save preferences")
      }

      const mealPlan = await response.json()

      // Store meal plan in localStorage
      localStorage.setItem("currentMealPlan", JSON.stringify(mealPlan))

      // Navigate to meal plan view
      router.push("/meal-plans/view")
    } catch (error) {
      console.error("Error saving preferences:", error)
      setLoading(false)
    }
  }

  const isOptionSelected = (option) => {
    const questionKey = question.key
    const current = preferences[questionKey]

    if (question.type === "single") {
      return current === option
    } else {
      return Array.isArray(current) && current.includes(option)
    }
  }

  const getCustomOptions = () => {
    const questionKey = question.key
    const current = preferences[questionKey] || []
    return Array.isArray(current) ? current.filter((option) => !question.options.includes(option)) : []
  }

  if (loading) {
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <Link href="/home" className="hover:text-gray-700 transition-colors">
              Home
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <Link href="/meal-plans" className="hover:text-gray-700 transition-colors">
              Meal Planner
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-700">Preferences</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Preferences Container */}
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <Card
                className={`bg-gradient-to-br ${question.bgColor} backdrop-blur-sm border-2 ${question.borderColor} shadow-2xl rounded-1xl overflow-hidden`}
              >
                <CardContent className="p-8">
                  {/* Progress Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex space-x-2">
                      {questions.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index <= currentQuestion ? "bg-gradient-to-r from-orange-500 to-red-500" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {currentQuestion + 1} of {questions.length}
                    </span>
                  </div>

                  {/* Question Icon */}
                  <div className="text-center mb-8">
                    <div
                      className={`w-20 h-20 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-3 shadow-lg`}
                    >
                      <question.icon className={`w-10 h-10 ${question.iconColor}`} />
                    </div>
                  </div>

                  {/* Question */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentQuestion}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">{question.title}</h2>

                      {/* Options */}
                      <div className="space-y-3 mb-6">
                        {question.options.map((option) => (
                          <motion.button
                            key={option}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleOptionSelect(option)}
                            className={`w-full p-4 rounded-2xl border-2 transition-all duration-300 text-left font-medium ${
                              isOptionSelected(option)
                                ? "bg-white border-orange-500 text-orange-600 shadow-lg"
                                : "bg-white/60 border-gray-200 hover:border-orange-300 hover:bg-white/80"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{option}</span>
                              {isOptionSelected(option) && <Check className="w-5 h-5 text-orange-500" />}
                            </div>
                          </motion.button>
                        ))}

                        {/* Custom Options Display */}
                        {getCustomOptions().map((option) => (
                          <motion.div
                            key={option}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-between p-4 bg-white border-2 border-orange-500 rounded-2xl"
                          >
                            <span className="font-medium text-orange-600">{option}</span>
                            <button
                              onClick={() => removeCustomOption(option)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </motion.div>
                        ))}

                        {/* Other Option */}
                        {question.hasOther && (
                          <div className="space-y-3">
                            {!showOtherInput ? (
                              <button
                                onClick={() => setShowOtherInput(true)}
                                className="w-full p-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-orange-300 bg-white/60 hover:bg-white/80 transition-all duration-300 text-gray-600 hover:text-orange-600 font-medium"
                              >
                                <div className="flex items-center justify-center">
                                  <Plus className="w-5 h-5 mr-2" />
                                  Other, Please Specify
                                </div>
                              </button>
                            ) : (
                              <div className="flex gap-2">
                                <Input
                                  value={otherInput}
                                  onChange={(e) => setOtherInput(e.target.value)}
                                  placeholder="Please specify..."
                                  className="flex-1 rounded-xl border-2 border-orange-300 focus:border-orange-500"
                                  onKeyPress={(e) => e.key === "Enter" && handleOtherAdd()}
                                />
                                <Button
                                  onClick={handleOtherAdd}
                                  disabled={!otherInput.trim()}
                                  className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl px-6"
                                >
                                  Add
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowOtherInput(false)
                                    setOtherInput("")
                                  }}
                                  className="rounded-xl"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex justify-between pt-6">
                        <Button
                          variant="outline"
                          onClick={handleBack}
                          disabled={currentQuestion === 0}
                          className="flex items-center px-6 py-3 rounded-xl border-2 disabled:opacity-50 bg-transparent"
                        >
                          <ChevronLeft className="w-4 h-4 mr-2" />
                          Back
                        </Button>

                        {isLastQuestion ? (
                          <Button
                            onClick={handleSavePreferences}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl shadow-lg font-semibold"
                          >
                            Save Preferences
                          </Button>
                        ) : (
                          <Button
                            onClick={handleNext}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl shadow-lg"
                          >
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>

            {/* Right - Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden lg:block"
            >
              <div className="relative w-full h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/why-options.jpg"
                  alt="Fresh ingredients and healthy foods"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
