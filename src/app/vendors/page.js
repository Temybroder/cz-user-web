"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import {
  MapPin,
  Clock,
  Star,
  Search,
  Filter,
  ChevronLeft,
  Utensils,
  ShoppingBag,
  Coffee,
  Pill,
  TrendingUp,
  Navigation,
} from "lucide-react"
import { productAPI } from "@/lib/api"
import LoginModal from "@/app/components/modals/login-modal"
import { useAppContext } from "@/context/app-context"

// Category configuration
const CATEGORIES = {
  1: {
    name: "Restaurants",
    icon: Utensils,
    color: "from-orange-500 to-red-500",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    type: "restaurant",
  },
  2: {
    name: "Groceries",
    icon: ShoppingBag,
    color: "from-green-500 to-emerald-500",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    type: "grocery",
  },
  3: {
    name: "Pharmacy",
    icon: Pill,
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    type: "pharmacy",
  },
  4: {
    name: "Drinks",
    icon: Coffee,
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    type: "drinks",
  },
}

function VendorCategoryContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { user } = useAppContext()

  const categoryId = searchParams.get("category") || "1"
  const category = CATEGORIES[categoryId] || CATEGORIES[1]
  const CategoryIcon = category.icon

  const [vendors, setVendors] = useState([])
  const [popularVendors, setPopularVendors] = useState([])
  const [nearbyVendors, setNearbyVendors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showLoginModal, setShowLoginModal] = useState(false)

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setIsLoading(true)

        // Fetch all vendors for this category
        const vendorResults = await productAPI.getVendors(category.type)
        const allVendors = vendorResults.vendors
        setVendors(allVendors)

        // Get popular vendors (sorted by rating)
        const popularResult = await productAPI.getVendors(category.type, {
          sort: "rating",
          limit: 6,
        })
        const popular = popularResult.vendors
        setPopularVendors(popular)

        // Get nearby vendors (sorted by distance)
        const nearbyResult = await productAPI.getVendors(category.type, {
          sort: "distance",
          limit: 6,
        })
        const nearby = nearbyResult.vendors
        setNearbyVendors(nearby)
      } catch (error) {
        console.error("Failed to fetch vendors:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchVendors()
  }, [category.type])

  const handleVendorClick = (vendorId) => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    router.push(`/vendors/${vendorId}`)
  }

  const filteredVendors = vendors.filter(
    (vendor) =>
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.cuisine.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const renderVendorCard = (vendor, showDistance = true) => (
    <Card
      key={vendor.id}
      className="group cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border-0 shadow-lg"
      onClick={() => handleVendorClick(vendor.id)}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={vendor.imageUrl || `/placeholder.svg?height=192&width=384&query=${category.type} ${vendor.name}`}
          alt={vendor.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Rating badge */}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-gray-900 font-semibold">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {vendor.rating.toFixed(1)}
          </Badge>
        </div>

        {/* Distance badge */}
        {showDistance && (
          <div className="absolute top-3 left-3">
            <Badge className={`${category.bgColor} ${category.textColor} font-semibold`}>
              <Navigation className="w-3 h-3 mr-1" />
              {(Math.random() * 5 + 0.5).toFixed(1)} km
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-orange-600 transition-colors">
              {vendor.name}
            </h3>
            <p className="text-sm text-gray-600">{vendor.cuisine}</p>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{vendor.deliveryTime}</span>
            </div>
            <div className="flex items-center text-gray-500">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Available</span>
            </div>
          </div>

          {/* Action button */}
          <Button
            className={`w-full bg-gradient-to-r ${category.color} text-white hover:shadow-lg transition-all`}
            onClick={(e) => {
              e.stopPropagation()
              handleVendorClick(vendor.id)
            }}
          >
            View Menu
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderSkeletonCard = () => (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <CardContent className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
        <div className="flex justify-between">
          <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4" />
          <div className="h-3 bg-gray-100 rounded animate-pulse w-1/4" />
        </div>
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
      </CardContent>
    </Card>
  )

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className={`bg-gradient-to-r ${category.color} text-white`}>
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 mr-4"
                onClick={() => router.back()}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
              <div className="flex items-center">
                <div className="bg-white/20 p-3 rounded-full mr-4">
                  <CategoryIcon className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{category.name}</h1>
                  <p className="text-white/80">Discover the best {category.name.toLowerCase()} near you</p>
                </div>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder={`Search ${category.name.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:bg-white/20"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Most Popular Section */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <TrendingUp className={`w-6 h-6 mr-3 ${category.textColor}`} />
              <h2 className="text-2xl font-bold text-gray-900">Most Popular</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <div key={i}>{renderSkeletonCard()}</div>)
                : popularVendors.map((vendor) => renderVendorCard(vendor, false))}
            </div>
          </section>

          {/* Close to You Section */}
          <section className="mb-12">
            <div className="flex items-center mb-6">
              <Navigation className={`w-6 h-6 mr-3 ${category.textColor}`} />
              <h2 className="text-2xl font-bold text-gray-900">Close to You</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <div key={i}>{renderSkeletonCard()}</div>)
                : nearbyVendors.map((vendor) => renderVendorCard(vendor, true))}
            </div>
          </section>

          {/* All Vendors Section */}
          {!isLoading && filteredVendors.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  All {category.name}
                  {searchQuery && (
                    <span className="text-lg font-normal text-gray-600 ml-2">
                      ({filteredVendors.length} results for &quot;{searchQuery}&quot;)
                    </span>
                  )}
                </h2>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVendors.map((vendor) => renderVendorCard(vendor, true))}
              </div>
            </section>
          )}

          {/* No results */}
          {!isLoading && searchQuery && filteredVendors.length === 0 && (
            <div className="text-center py-12">
              <div
                className={`w-16 h-16 mx-auto mb-4 rounded-full ${category.bgColor} flex items-center justify-center`}
              >
                <Search className={`w-8 h-8 ${category.textColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-600">
                Try adjusting your search terms or browse all {category.name.toLowerCase()}
              </p>
              <Button variant="outline" className="mt-4" onClick={() => setSearchQuery("")}>
                Clear search
              </Button>
            </div>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        redirectAfterLogin={`/vendors?category=${categoryId}`}
      />
    </>
  )
}

export default function VendorCategoryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      }
    >
      <VendorCategoryContent />
    </Suspense>
  )
}
