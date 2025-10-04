"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  ChevronRight,
  Edit2,
  AlertTriangle,
  Target,
  Thermometer,
  Droplet,
  Cookie,
  SatelliteIcon as Salt,
} from "lucide-react"
import Header from "@/app/components/header"
import Footer from "@/app/components/Footer"
import { useAppContext } from "@/context/app-context"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import { userAPI } from "@/lib/api"

// Helper function to get human-readable values
const getReadableValue = (key, value) => {
  if (key === "spiciness") {
    const spicynessMap = {
      lowSpicyness: "Mild",
      lowspicyness: "Mild",
      mild: "Mild",
      mediumSpicyness: "Medium",
      mediumspicyness: "Medium",
      medium: "Medium",
      highSpicyness: "Hot",
      highspicyness: "Hot",
      hot: "Hot",
    }
    return spicynessMap[value] || value
  }

  if (["oils", "sweetness", "saltiness"].includes(key)) {
    return {
      low: "Low",
      average: "Average",
      high: "High",
    }[value] || value
  }

  return value
}

// Helper function to get icon for preference
const getPreferenceIcon = (key) => {
  switch (key) {
    case "spicyness":
    case "spiciness":
      return <Thermometer className="text-red-500" />
    case "oils":
      return <Droplet className="text-yellow-500" />
    case "sweetness":
      return <Cookie className="text-pink-500" />
    case "saltiness":
      return <Salt className="text-blue-500" />
    default:
      return null
  }
}

export default function ViewNutritionalPreferencesPage() {
  const router = useRouter()
  const { user, isAuthenticated, showLoginModal } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [preferences, setPreferences] = useState(null)

  useEffect(() => {
    const fetchPreferences = async () => {
      // Check authentication
      if (!isAuthenticated) {
        setLoading(false)
        showLoginModal("/nutritional-preferences/view")
        return
      }

      try {
        // Get user's nutritional preferences
        const response = await userAPI.getNutritionalPreferences(user._id)
        console.log("Nutritional preferences response:", response)
        setPreferences(response.data || response)
      } catch (error) {
        console.error("Error fetching nutritional preferences:", error)
        // If no preferences exist, redirect to create page
        router.push("/nutritional-preferences/create")
      } finally {
        setLoading(false)
      }
    }

    fetchPreferences()
  }, [isAuthenticated, showLoginModal, router, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AnimatedLoader />
      </div>
    )
  }

  if (!preferences) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AnimatedLoader />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-orange-50/30">
      <Header />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <Link href="/home" className="hover:text-orange-600 transition-colors">
              Home
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-700 font-medium">Nutritional Preferences</span>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Your Nutritional Preferences
              </h1>
              <p className="text-gray-600 mt-2">Manage your dietary preferences and health goals</p>
            </div>
            <Link
              href="/nutritional-preferences/create"
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl flex items-center justify-center hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Edit2 size={18} className="mr-2" />
              Edit Preferences
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-6">
            {/* Allergies Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-red-100 hover:shadow-xl transition-shadow">
              <div className="p-5 bg-gradient-to-r from-red-50 to-red-100/50 border-b border-red-200 flex items-center">
                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
                  <AlertTriangle className="text-red-600" size={22} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Allergies</h2>
              </div>
              <div className="p-6">
                {preferences.allergicTo && preferences.allergicTo.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {preferences.allergicTo.map((allergy) => (
                      <span
                        key={allergy}
                        className="bg-gradient-to-r from-red-50 to-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium border border-red-200 shadow-sm"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-400 italic">No allergies specified</p>
                  </div>
                )}
              </div>
            </div>

            {/* Health Goals Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100 hover:shadow-xl transition-shadow">
              <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-100/50 border-b border-green-200 flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mr-3">
                  <Target className="text-green-600" size={22} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Health Goals</h2>
              </div>
              <div className="p-6">
                {preferences.currentHealthGoals && preferences.currentHealthGoals.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {preferences.currentHealthGoals.map((goal) => (
                      <span
                        key={goal}
                        className="bg-gradient-to-r from-green-50 to-emerald-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium border border-green-200 shadow-sm"
                      >
                        {goal}
                      </span>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-400 italic">No health goals specified</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Taste Preferences Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-orange-100 hover:shadow-xl transition-shadow">
            <div className="p-5 bg-gradient-to-r from-orange-50 to-amber-100/50 border-b border-orange-200">
              <h2 className="text-xl font-bold text-gray-800">Taste Preferences</h2>
            </div>
            <div className="p-6">
              {preferences.generalPreferences && Object.keys(preferences.generalPreferences).length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(preferences.generalPreferences).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center p-4 border border-gray-200 rounded-xl hover:border-orange-300 hover:bg-orange-50/50 transition-all shadow-sm"
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-amber-100 flex items-center justify-center mr-4 shadow-sm">
                        {getPreferenceIcon(key)}
                      </div>
                      <div>
                        <div className="text-sm text-gray-500 capitalize font-medium">
                          {key === "spicyness" || key === "spiciness" ? "Spiciness" : key}
                        </div>
                        <div className="font-bold text-gray-800 text-lg">{getReadableValue(key, value)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 italic">No taste preferences specified</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
