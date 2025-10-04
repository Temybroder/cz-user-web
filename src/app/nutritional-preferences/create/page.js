"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { createNutritionalPreference } from "@/lib/api"
import { Button } from "@/app/components/ui/button"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Label } from "@/app/components/ui/label"
import { useAppContext } from "@/context/app-context"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import { ToastContainer } from "@/app/components/ui/toast-notification"
import {
  Apple,
  Sparkles,
  Heart,
  Flame,
  Droplet,
  Candy,
  Circle,
  TrendingUp,
  Dumbbell,
  Battery,
  Pizza,
  Fish,
  Milk,
  Egg,
  Wheat,
  Cherry,
  Activity,
  Target,
  Zap,
  Shield,
  ChevronRight,
  CheckCircle2
} from "lucide-react"

// Import ProtectedRoute dynamically to avoid initialization issues
const ProtectedRoute = dynamic(() => import("@/app/components/protected-route"), {
  ssr: false,
})

function NutritionalPreferencesForm() {
  const { user } = useAppContext()
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get("returnTo")
  const { toast, addToast, removeToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [currentTab, setCurrentTab] = useState("allergies")
  const [formData, setFormData] = useState({
    allergies: [],
    healthGoals: [],
    spiciness: "mediumSpicyness",
    oils: "average",
    sweetness: "average",
    saltiness: "average",
  })

  const commonAllergies = [
    { value: "peanuts", label: "Peanuts", icon: Cherry, color: "bg-amber-50 border-amber-200 hover:bg-amber-100" },
    { value: "dairy", label: "Dairy", icon: Milk, color: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
    { value: "eggs", label: "Eggs", icon: Egg, color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100" },
    { value: "wheat", label: "Wheat", icon: Wheat, color: "bg-orange-50 border-orange-200 hover:bg-orange-100" },
    { value: "soy", label: "Soy", icon: Apple, color: "bg-green-50 border-green-200 hover:bg-green-100" },
    { value: "fish", label: "Fish", icon: Fish, color: "bg-cyan-50 border-cyan-200 hover:bg-cyan-100" },
  ]

  const healthGoals = [
    { value: "weightLoss", label: "Weight Loss", icon: TrendingUp, color: "bg-red-50 border-red-200 hover:bg-red-100" },
    { value: "weightGain", label: "Weight Gain", icon: Target, color: "bg-blue-50 border-blue-200 hover:bg-blue-100" },
    { value: "muscleGain", label: "Muscle Gain", icon: Dumbbell, color: "bg-purple-50 border-purple-200 hover:bg-purple-100" },
    { value: "improveEnergy", label: "Improve Energy", icon: Zap, color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100" },
    { value: "betterDigestion", label: "Better Digestion", icon: Activity, color: "bg-green-50 border-green-200 hover:bg-green-100" },
    { value: "reduceCholesterol", label: "Reduce Cholesterol", icon: Heart, color: "bg-pink-50 border-pink-200 hover:bg-pink-100" },
    { value: "manageBloodSugar", label: "Manage Blood Sugar", icon: Shield, color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100" },
  ]

  const tastePreferences = [
    {
      field: "spiciness",
      label: "Spiciness Level",
      icon: Flame,
      gradient: "from-red-500 to-orange-500",
      options: [
        { value: "lowSpicyness", label: "Mild", emoji: "🌶️" },
        { value: "mediumSpicyness", label: "Medium", emoji: "🌶️🌶️" },
        { value: "highSpicyness", label: "Spicy", emoji: "🌶️🌶️🌶️" }
      ]
    },
    {
      field: "oils",
      label: "Oil Content",
      icon: Droplet,
      gradient: "from-yellow-500 to-amber-500",
      options: [
        { value: "low", label: "Low", emoji: "💧" },
        { value: "average", label: "Average", emoji: "💧💧" },
        { value: "high", label: "High", emoji: "💧💧💧" }
      ]
    },
    {
      field: "sweetness",
      label: "Sweetness Level",
      icon: Candy,
      gradient: "from-pink-500 to-rose-500",
      options: [
        { value: "low", label: "Low", emoji: "🍬" },
        { value: "average", label: "Average", emoji: "🍬🍬" },
        { value: "high", label: "High", emoji: "🍬🍬🍬" }
      ]
    },
    {
      field: "saltiness",
      label: "Saltiness Level",
      icon: Circle,
      gradient: "from-gray-400 to-gray-600",
      options: [
        { value: "low", label: "Low", emoji: "🧂" },
        { value: "average", label: "Average", emoji: "🧂🧂" },
        { value: "high", label: "High", emoji: "🧂🧂🧂" }
      ]
    }
  ]

  const handleCheckboxChange = (field, value) => {
    const currentValues = formData[field]
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((item) => item !== value)
      : [...currentValues, value]

    setFormData({ ...formData, [field]: updatedValues })
  }

  const handlePreferenceChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const backendPayload = {
        preferences: {
          allergies: formData.allergies,
          healthGoals: formData.healthGoals,
          spiciness: formData.spiciness,
          oils: formData.oils,
          sweetness: formData.sweetness,
          saltiness: formData.saltiness
        }
      }

      console.log("Submitting nutritional preferences:", backendPayload)
      console.log("User ID:", user.userId || user._id)

      await createNutritionalPreference(backendPayload, user.userId || user._id)

      // Show success message
      addToast("Your nutritional preferences have been saved successfully!", "success", 3000)

      // Redirect after short delay to show success message
      setTimeout(() => {
        if (returnTo) {
          router.push(returnTo)
        } else {
          router.push("/nutritional-preferences/view")
        }
      }, 1500)
    } catch (error) {
      console.error("Failed to save nutritional preferences:", error)
      addToast(
        error.message || "Failed to save your nutritional preferences. Please try again.",
        "error",
        4000
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <AnimatedLoader fullScreen />
      </div>
    )
  }

  const getProgressPercentage = () => {
    let completed = 0
    if (formData.allergies.length > 0) completed += 33
    if (formData.healthGoals.length > 0) completed += 33
    if (currentTab === "taste") completed += 34
    return completed
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
      <ToastContainer toasts={toast} removeToast={removeToast} />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-orange-500 text-white py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="flex items-center mb-4 text-sm text-white/80">
            <Link href="/home" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-white">Nutritional Preferences</span>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">Personalize Your Food Journey</h1>
              <p className="text-white/90 text-lg">Help us understand your preferences for a better experience</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span>Your Progress</span>
              <span>{getProgressPercentage()}% Complete</span>
            </div>
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        <form onSubmit={handleSubmit}>
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-8 h-auto p-1 bg-white shadow-md">
              <TabsTrigger 
                value="allergies" 
                className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
              >
                <Shield className="w-4 h-4" />
                <span className="hidden sm:inline">Allergies</span>
              </TabsTrigger>
              <TabsTrigger 
                value="goals"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
              >
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Health Goals</span>
              </TabsTrigger>
              <TabsTrigger 
                value="taste"
                className="flex items-center gap-2 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-orange-500 data-[state=active]:text-white"
              >
                <Pizza className="w-4 h-4" />
                <span className="hidden sm:inline">Taste</span>
              </TabsTrigger>
            </TabsList>

            {/* Allergies Tab */}
            <TabsContent value="allergies" className="space-y-6">
              <Card className="border-2 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-red-500 to-orange-500 p-2 rounded-xl text-white">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Food Allergies</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">Select any foods you&apos;re allergic to</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {commonAllergies.map((allergy) => {
                      const Icon = allergy.icon
                      const isSelected = formData.allergies.includes(allergy.value)
                      return (
                        <div
                          key={allergy.value}
                          className={`relative border-2 rounded-xl p-4 transition-all duration-200 ${
                            isSelected
                              ? 'border-red-500 bg-red-50 shadow-lg scale-105'
                              : allergy.color
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-red-500 text-white' : 'bg-white'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <Label
                              htmlFor={`allergy-${allergy.value}`}
                              className="flex-1 cursor-pointer font-medium"
                            >
                              {allergy.label}
                            </Label>
                            <Checkbox
                              id={`allergy-${allergy.value}`}
                              checked={isSelected}
                              onCheckedChange={() => handleCheckboxChange("allergies", allergy.value)}
                              className="h-5 w-5"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Health Goals Tab */}
            <TabsContent value="goals" className="space-y-6">
              <Card className="border-2 shadow-xl bg-white">
                <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 p-2 rounded-xl text-white">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">Health Goals</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">What do you want to achieve?</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {healthGoals.map((goal) => {
                      const Icon = goal.icon
                      const isSelected = formData.healthGoals.includes(goal.value)
                      return (
                        <div
                          key={goal.value}
                          className={`relative border-2 rounded-xl p-4 transition-all duration-200 ${
                            isSelected
                              ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                              : goal.color
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${isSelected ? 'bg-green-500 text-white' : 'bg-white'}`}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <Label
                              htmlFor={`goal-${goal.value}`}
                              className="flex-1 cursor-pointer font-medium"
                            >
                              {goal.label}
                            </Label>
                            <Checkbox
                              id={`goal-${goal.value}`}
                              checked={isSelected}
                              onCheckedChange={() => handleCheckboxChange("healthGoals", goal.value)}
                              className="h-5 w-5"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Taste Preferences Tab */}
            <TabsContent value="taste" className="space-y-6">
              {tastePreferences.map((pref) => {
                const Icon = pref.icon
                return (
                  <Card key={pref.field} className="border-2 shadow-xl bg-white overflow-hidden">
                    <CardHeader className={`bg-gradient-to-r ${pref.gradient} text-white`}>
                      <div className="flex items-center gap-3">
                        <div className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
                          <Icon className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-xl">{pref.label}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <RadioGroup
                        value={formData[pref.field]}
                        onValueChange={(value) => handlePreferenceChange(pref.field, value)}
                        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                      >
                        {pref.options.map((option) => {
                          const isSelected = formData[pref.field] === option.value
                          return (
                            <div
                              key={option.value}
                              className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                                isSelected 
                                  ? `border-transparent bg-gradient-to-br ${pref.gradient} text-white shadow-lg scale-105` 
                                  : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <RadioGroupItem 
                                  value={option.value} 
                                  id={`${pref.field}-${option.value}`}
                                  className={isSelected ? 'border-white text-white' : ''}
                                />
                                <Label 
                                  htmlFor={`${pref.field}-${option.value}`}
                                  className="flex-1 cursor-pointer font-medium flex items-center justify-between"
                                >
                                  <span>{option.label}</span>
                                  <span className="text-2xl">{option.emoji}</span>
                                </Label>
                              </div>
                            </div>
                          )
                        })}
                      </RadioGroup>
                    </CardContent>
                  </Card>
                )
              })}
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center sticky bottom-4 bg-white p-4 rounded-2xl shadow-xl border-2">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>Your preferences help us personalize your experience</span>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-6 text-lg font-semibold rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Save Preferences
                  <CheckCircle2 className="w-5 h-5" />
                </span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

function NutritionalPreferencesCreatePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
          <AnimatedLoader fullScreen />
        </div>
      }>
        <NutritionalPreferencesForm />
      </Suspense>
    </ProtectedRoute>
  )
}

export default NutritionalPreferencesCreatePage

