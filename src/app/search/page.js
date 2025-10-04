"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Home, Star, Clock, ShoppingCart, Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Badge } from "@/app/components/ui/badge"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import { productAPI } from "@/lib/api"
import { useAppContext } from "@/context/app-context"

export default function SearchResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, addToCart } = useAppContext()
  const [query, setQuery] = useState(searchParams.get("query") || searchParams.get("q") || "")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Extract filters from URL parameters
  const getFiltersFromURL = useCallback(() => {
    const categories = searchParams.get("categories")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minRating = searchParams.get("minRating")

    return {
      categories: categories ? categories.split(',') : undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      minRating: minRating ? parseInt(minRating) : undefined,
    }
  }, [searchParams])

  const performSearch = useCallback(async (searchQuery) => {
    try {
      setLoading(true)
      setError(null)

      const urlFilters = getFiltersFromURL()
      const searchResults = await productAPI.searchProducts({
        query: searchQuery,
        ...urlFilters,
      })

      console.log("[SEARCH PAGE] API Response:", searchResults)

      // Handle response structure from backend
      if (searchResults && searchResults.data && searchResults.data.products) {
        setResults(searchResults.data.products)
      } else if (searchResults && Array.isArray(searchResults.products)) {
        setResults(searchResults.products)
      } else if (Array.isArray(searchResults)) {
        setResults(searchResults)
      } else {
        setResults([])
      }
    } catch (err) {
      console.error("Search failed:", err)
      setError(err.message || "Failed to search products")
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [getFiltersFromURL])

  useEffect(() => {
    const searchQuery = searchParams.get("query") || searchParams.get("q")
    if (searchQuery) {
      setQuery(searchQuery)
      performSearch(searchQuery)
    } else {
      setLoading(false)
    }
  }, [searchParams, performSearch])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleAddToCart = (product) => {
    if (!user) {
      router.push("/auth/login")
      return
    }

    addToCart({
      id: product._id || product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl || product.image,
      quantity: 1,
    })
  }

  const handleProductClick = (product) => {
    router.push(`/products/${product._id || product.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AnimatedLoader />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/home" className="hover:text-gray-700 transition-colors flex items-center">
            <Home className="w-4 h-4 mr-1" />
            Home
          </Link>
          <ChevronRight size={16} className="mx-2" />
          <span className="text-gray-700 font-medium">Search Results</span>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mb-8">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="Search for food, groceries, drinks, medicine..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 h-12 px-4 rounded-xl border-gray-300 focus:ring-2 focus:ring-green-500"
            />
            <Button
              type="submit"
              className="px-8 h-12 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl"
            >
              Search
            </Button>
          </div>
        </form>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {query ? `Search Results for "${query}"` : "Search Results"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {results.length > 0 ? `${results.length} product${results.length !== 1 ? 's' : ''} found` : 'No products found'}
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </Button>
        </div>

        {/* Error State */}
        {error && (
          <Card className="mb-6">
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => performSearch(query)}>Try Again</Button>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((product) => (
              <Card
                key={product._id || product.id}
                className="shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
              >
                <div onClick={() => handleProductClick(product)}>
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <Image
                      src={product.imageUrl || product.image || `/placeholder.svg?height=200&width=200&query=${product.name}`}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {product.discount && (
                      <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                        -{product.discount}%
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3">
                      {product.rating && (
                        <div className="flex items-center text-yellow-500">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-xs font-medium">
                            {typeof product.rating === 'number' ? product.rating.toFixed(1) : product.rating}
                          </span>
                        </div>
                      )}
                      {product.deliveryTime && (
                        <>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="ml-1 text-xs">{product.deliveryTime}</span>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">
                          ₦{typeof product.price === 'number' ? product.price.toLocaleString() : product.price}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₦{product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="px-4 pb-4">
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 rounded-xl"
                    size="sm"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          !loading && !error && (
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Filter className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  {query
                    ? `We couldn't find any products matching "${query}". Try different keywords or browse our categories.`
                    : "Start searching for products using the search bar above."}
                </p>
                <Button
                  onClick={() => router.push("/home")}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  )
}
