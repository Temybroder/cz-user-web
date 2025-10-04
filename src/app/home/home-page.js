"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { productAPI } from "@/lib/api"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import Footer from "@/app/components/Footer"
import Header from "@/app/components/header"
import { ChevronRight, ChevronLeft, Star } from "lucide-react"
import { Apple } from "lucide-react";
import GooglePlayIcon from "@/components/ui/GooglePlayIcon";

import LoginModal from "@/app/components/modals/login-modal"
import NutritionalPreferenceToggle from "@/app/components/nutritional-preference-toggle"

export default function HomePage() {
  const router = useRouter()
  const { user, useNutritionalPreference, nutritionalPreference } = useAppContext()

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null)
  const [categories, setCategories] = useState([])
  const [popularRestaurants, setPopularRestaurants] = useState([])
  const [nearbyVendors, setNearbyVendors] = useState([])
  const [groceryStores, setGroceryStores] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await productAPI.getCategories()
        setCategories(categoriesData)

        // Fetch popular restaurants
        const restaurantResult = await productAPI.getVendors("restaurant", {
          sort: "rating",
          limit: 5,
          useNutritionalPreference: user && useNutritionalPreference ? true : undefined,
        })
        
        const restaurantsData = restaurantResult.vendors
        setPopularRestaurants(Array.isArray(restaurantsData) ? restaurantsData : [])
        console.log("EDITED RESTAURANT DATA IS ", restaurantsData)
        // Fetch nearby vendors
        const nearbyResult = await productAPI.getVendors("restaurant", {
          sort: "rating",
          limit: 5,
          useNutritionalPreference: user && useNutritionalPreference ? true : undefined,
        })
        const nearbyData = nearbyResult.vendors 
        setNearbyVendors(Array.isArray(nearbyData) ? nearbyData : [])

        // Fetch grocery stores
        const groceryResult = await productAPI.getVendors("grocery", {
          limit: 5,
          useNutritionalPreference: user && useNutritionalPreference ? true : undefined,
        })
        const groceryData = groceryResult.vendors 
        setGroceryStores(Array.isArray(groceryData) ? groceryData : [])
        console.log("EDITED GROCERY DATA IS ", groceryData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, useNutritionalPreference])

  const handleCategoryClick = (categoryId) => {
    router.push(`/vendors?category=${categoryId}`)
  }

  const handleActionClick = (action) => {
    if (!user) {
      // Set redirect path based on action
      let redirectPath = "/home"
      switch (action) {
        case "meal-plan":
          redirectPath = "/meal-plans/create"
          break
        case "subscription":
          redirectPath = "/subscriptions/create"
          break
        case "nutritional-preference":
          redirectPath = "/nutritional-preferences/create"
          break
      }

      setRedirectAfterLogin(redirectPath)
      setIsLoginModalOpen(true)
      return
    }

    switch (action) {
      case "meal-plan":
        router.push("/meal-plans/create")
        break
      case "subscription":
        router.push("/subscriptions/create")
        break
      case "nutritional-preference":
        router.push("/nutritional-preferences/create")
        break
      default:
        break
    }
  }

  const renderVendorCard = (vendor, index) => (
    <Link
      href={`/vendors/${vendor.id}`}
      key={vendor.id}
      className="group flex-shrink-0 w-72 overflow-hidden transition-all duration-300 rounded-2xl hover:shadow-2xl"
    >
      <div className="relative w-full h-48 overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200">
        <Image
          src={vendor.imageUrl || `/placeholder.svg?height=192&width=288&query=food vendor ${vendor.name}`}
          alt={vendor.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4 bg-white rounded-b-2xl">
        <h3 className="font-bold text-lg text-gray-800 group-hover:text-orange-600 transition-colors">{vendor.name}</h3>
        <div className="flex items-center mt-2 text-sm text-gray-600">
          <span className="font-medium">{vendor.cuisine}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span>{vendor.deliveryTime}</span>
          <div className="flex items-center ml-auto gap-1 bg-amber-50 px-2 py-1 rounded-full">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-bold text-amber-700">{vendor.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-100 drop-shadow-lg">
            Order Your Essentials Now
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-white/95 leading-relaxed">
            From fresh groceries to quick meals, refreshing drinks to vital medications - get everything you need
            delivered to your doorstep. Fast, reliable, and hassle-free.
          </p>

          {/* Nutritional Preference Toggle */}
          {(user || nutritionalPreference) && (
            <div className="max-w-2xl mx-auto mb-12">
              <NutritionalPreferenceToggle />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            <Link
              href="/vendors?category=1"
              className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20"
            >
              <div className="bg-gradient-to-br from-amber-100 to-orange-200 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Image src="/images/icons/restaurant.png" alt="Restaurants" width={40} height={40} />
              </div>
              <p className="font-bold text-lg">Restaurants</p>
            </Link>

            <Link
              href="/vendors?category=2"
              className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20"
            >
              <div className="bg-gradient-to-br from-indigo-100 to-purple-200 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Image src="/images/icons/grocery.png" alt="Groceries" width={40} height={40} />
              </div>
              <p className="font-bold text-lg">Groceries</p>
            </Link>

            <Link
              href="/vendors?category=3"
              className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20"
            >
              <div className="bg-gradient-to-br from-cyan-100 to-blue-200 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Image src="/images/icons/pharmacy.png" alt="Pharmacy" width={40} height={40} />
              </div>
              <p className="font-bold text-lg">Pharmacy</p>
            </Link>

            <Link
              href="/vendors?category=4"
              className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20"
            >
              <div className="bg-gradient-to-br from-rose-100 to-pink-200 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Image src="/images/icons/drink.png" alt="Drinks" width={40} height={40} />
              </div>
              <p className="font-bold text-lg">Drinks</p>
            </Link>
          </div>
        </div>
      </section>


      {/* Call to Action Cards */}
      <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card
              onClick={() => handleActionClick("meal-plan")}
              className="group bg-gradient-to-br from-red-500 to-amber-500 rounded-2xl p-8 text-white flex items-center cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20"
            >
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform">Create Meal Plan</h3>
                <p className="text-sm opacity-90 leading-relaxed">Plan your perfect meals with conzooming.me</p>
              </div>
              <Image src="/images/icons/meal-plan.png" alt="Meal Plan" width={70} height={70} className="group-hover:rotate-12 transition-transform" />
            </Card>

            <Card
              onClick={() => handleActionClick("subscription")}
              className="group bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl p-8 text-white flex items-center cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20"
            >
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform">Start a Subscription</h3>
                <p className="text-sm opacity-90 leading-relaxed">
                  Choose recurring access to fresh, healthy meals delivered to your door
                </p>
              </div>
              <Image src="/images/icons/subscription.png" alt="Subscription" width={70} height={70} className="group-hover:rotate-12 transition-transform" />
            </Card>

            <Card
              onClick={() => handleActionClick("nutritional-preference")}
              className="group bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl p-8 text-white flex items-center cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300 border-2 border-white/20"
            >
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2 group-hover:scale-105 transition-transform">Nutritional Profile</h3>
                <p className="text-sm opacity-90 leading-relaxed">Create or update your nutritional health profile</p>
              </div>
              <Image src="/images/icons/health-profile.png" alt="Health Profile" width={70} height={70} className="group-hover:rotate-12 transition-transform" />
            </Card>
          </div>
      </section>

      {/* Popular Restaurants Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Popular Restaurants</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Previous restaurants">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Next restaurants">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4 pb-4 overflow-x-auto">
          {!isLoading && Array.isArray(popularRestaurants) &&
              popularRestaurants.map((restaurant, index) => renderVendorCard(restaurant, index))
            }
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-64 animate-pulse">
                  <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
                  <div className="w-3/4 h-4 mt-2 bg-gray-200 rounded"></div>
                  <div className="w-full h-3 mt-2 bg-gray-100 rounded"></div>
                </div>
              ))}
          </div>
        </section>

      {/* Close to You Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Close to you</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Previous nearby vendors">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Next nearby vendors">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4 pb-4 overflow-x-auto">
           {!isLoading && Array.isArray(nearbyVendors) &&
              nearbyVendors.map((restaurant, index) => renderVendorCard(restaurant, index))
            }
   
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-64 animate-pulse">
                <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
                <div className="w-3/4 h-4 mt-2 bg-gray-200 rounded"></div>
                <div className="w-full h-3 mt-2 bg-gray-100 rounded"></div>
              </div>
            ))}
        </div>
      </section>

      {/* Grocery Store Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Grocery store</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Previous grocery stores">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Next grocery stores">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4 pb-4 overflow-x-auto">
            {!isLoading && Array.isArray(groceryStores) &&
                groceryStores.map((restaurant, index) => renderVendorCard(restaurant, index))
              }
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-64 animate-pulse">
                <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
                <div className="w-3/4 h-4 mt-2 bg-gray-200 rounded"></div>
                <div className="w-full h-3 mt-2 bg-gray-100 rounded"></div>
              </div>
            ))}
        </div>
      </section>

      {/* Partner Section */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let us work together</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you are a restaurant looking to expand your reach or someone seeking flexible work as a rider, the
              support and tools you need are just a click away.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-bold mb-4">Become one of our partners</h3>
              <p className="text-gray-600 mb-6">
                Grow your brand with us by connecting to a wider audience. Together, we will ensure that customers receive
                consistent, high-quality food, value, and superior service.
              </p>
              <div className="flex space-x-4">
              <Link
                href="#"
                className="inline-flex items-center justify-center w-36 h-12 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Apple className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center w-36 h-12 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <GooglePlayIcon className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Link>
            </div>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="relative rounded-full overflow-hidden border-8 border-white shadow-xl">
                <Image src="/images/partners.jpg" alt="Partners" width={500} height={500} className="w-full h-auto" />
              </div>
              <div
                className="absolute inset-0 rounded-full border-8 border-transparent"
                style={{
                  background: "linear-gradient(45deg, rgba(255,196,0,1) 0%, rgba(255,0,0,1) 100%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              ></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
            <div className="relative">
              <div className="relative rounded-full overflow-hidden border-8 border-white shadow-xl">
                <Image src="/images/rider.jpg" alt="Rider" width={500} height={500} className="w-full h-auto" />
              </div>
              <div
                className="absolute inset-0 rounded-full border-8 border-transparent"
                style={{
                  background: "linear-gradient(45deg, rgba(255,196,0,1) 0%, rgba(255,0,0,1) 100%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              ></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Become one of our riders</h3>
              <p className="text-gray-600 mb-6">
                Enjoy flexible hours, competitive pay, and the chance to explore the city while delivering joy to our
                valued users. Sign up today and start delivering tomorrow!
              </p>
              <div className="flex space-x-4">
              <Link
                href="#"
                className="inline-flex items-center justify-center w-36 h-12 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Apple className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center w-36 h-12 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <GooglePlayIcon className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Link>
            </div>
            </div>
          </div>
        </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        redirectAfterLogin={redirectAfterLogin}
      />
      {/* <Footer/> */}
    </>
  )
}