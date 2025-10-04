"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import Header from "@/app/components/header"
import Footer from "@/app/components/Footer"
import { useAppContext } from "@/context/app-context"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import { userAPI } from "@/lib/api"

export default function MealPlanFlowPage() {
  const router = useRouter()
  const { user, isAuthenticated, showLoginModal, showLoader, hideLoader } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [hasNutritionalPreference, setHasNutritionalPreference] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      showLoader()
      // Check authentication
      if (!isAuthenticated) {
        hideLoader()
        showLoginModal("/meal-plan/flow")
        return
      }

      try {
        // Check if user has nutritional preferences
        const response = await userAPI.checkNutritionalPreference()
        setHasNutritionalPreference(response.exists)
      } catch (error) {
        console.error("Error checking nutritional preferences:", error)
      } finally {
        setLoading(false)
        hideLoader()
      }
    }

    checkAuth()
  }, [isAuthenticated, showLoginModal, router, showLoader, hideLoader])

  const handleGetStarted = () => {
    if (hasNutritionalPreference) {
      router.push("/meal-plan/confirm-preferences")
    } else {
      // Redirect to create nutritional preferences with return path
      router.push("/nutritional-preferences/create?returnTo=/meal-plan/flow")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <AnimatedLoader />
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center text-sm text-gray-500 mb-6">
            <Link href="/" className="hover:text-gray-700">
              Home
            </Link>
            <ChevronRight size={16} className="mx-1" />
            <span className="text-gray-700">Meal Planner</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-3xl font-bold mb-4">Personalized Meal Plans</h1>
              <p className="text-gray-600 mb-6">
                Get customized meal plans tailored to your preferences, dietary restrictions, and health goals. Our
                AI-powered system will create the perfect meal plan for you.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6 shadow-sm">
                <h2 className="font-bold mb-4 text-lg">How it works</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                      1
                    </div>
                    <span className="text-gray-700">Tell us about your preferences and dietary restrictions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                      2
                    </div>
                    <span className="text-gray-700">Our system generates a personalized meal plan</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                      3
                    </div>
                    <span className="text-gray-700">Choose your delivery frequency and schedule</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3 flex-shrink-0 mt-0.5 shadow-sm">
                      4
                    </div>
                    <span className="text-gray-700">Enjoy fresh, delicious meals delivered to your door</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={handleGetStarted}
                className="w-full md:w-auto bg-gradient-to-r from-red-600 to-orange-500 text-white py-3 px-8 rounded-full font-medium flex items-center justify-center hover:shadow-lg transition-all"
              >
                Get Started
                <ChevronRight size={20} className="ml-2" />
              </button>
            </div>

            <div className="hidden md:block">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="/placeholder-ew947.png"
                  alt="Meal Plan"
                  width={600}
                  height={600}
                  className="rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
