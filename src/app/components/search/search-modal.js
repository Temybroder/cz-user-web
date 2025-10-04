"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent } from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Slider } from "@/app/components/ui/slider"
import { Checkbox } from "@/app/components/ui/checkbox"
import { Label } from "@/app/components/ui/label"
import { Search, X, Star, Clock, Filter, History } from "lucide-react"
import { productAPI } from "@/lib/api"
import AnimatedLoader from "@/app/components/ui/animated-loader"

export default function SearchModal({ isOpen, onClose }) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: [0, 10000],
    minRating: 0,
  })
  const [availableCategories, setAvailableCategories] = useState([])
  const searchInputRef = useRef(null)
  const searchTimeout = useRef(null)

  // Load recent searches from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSearches = localStorage.getItem("recentSearches")
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches))
      }
    }
  }, [])

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus()
      }, 100)
    }
  }, [isOpen])

  // Fetch available categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await productAPI.getCategories()
        setAvailableCategories(categories)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    if (isOpen) {
      fetchCategories()
    }
  }, [isOpen])

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    // Clear previous timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current)
    }

    // Set a timeout to avoid too many API calls
    searchTimeout.current = setTimeout(async () => {
      setIsLoading(true)

      try {
        // Map frontend filters to backend API parameters
        const searchParams = {
          query: searchQuery,
          minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
          maxPrice: filters.priceRange[1] < 10000 ? filters.priceRange[1] : undefined,
          minRating: filters.minRating > 0 ? filters.minRating : undefined,
          categories: filters.categories.length > 0 ? filters.categories : undefined,
        }

        const searchResults = await productAPI.searchProducts(searchParams)
        // API returns { products: [...], pagination: {...} }
        setResults(searchResults.products || searchResults || [])

        // Save to recent searches
        if (searchQuery.trim() && !recentSearches.includes(searchQuery)) {
          const updatedSearches = [searchQuery, ...recentSearches.slice(0, 4)]
          setRecentSearches(updatedSearches)
          localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
        }
      } catch (error) {
        console.error("Search failed:", error)
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  const handleClearSearch = () => {
    setQuery("")
    setResults([])
  }

  const handleRecentSearchClick = (searchQuery) => {
    setQuery(searchQuery)
    handleSearch(searchQuery)
  }

  const handleClearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }

  const handleCategoryChange = (category, checked) => {
    setFilters((prev) => {
      const updatedCategories = checked ? [...prev.categories, category] : prev.categories.filter((c) => c !== category)

      return {
        ...prev,
        categories: updatedCategories,
      }
    })
  }

  const handlePriceRangeChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: value,
    }))
  }

  const handleRatingChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      minRating: value[0],
    }))
  }

  const handleApplyFilters = () => {
    handleSearch()
    setShowFilters(false)
  }

  const handleResetFilters = () => {
    setFilters({
      categories: [],
      priceRange: [0, 10000],
      minRating: 0,
    })
  }

  const handleResultClick = (result) => {
    onClose()
    router.push(`/products/${result.id}`)
  }

  const handleViewAllResults = () => {
    onClose()
    // Navigate to search page with current query and filters
    const params = new URLSearchParams()
    if (query) params.append('query', query)
    if (filters.categories.length > 0) params.append('categories', filters.categories.join(','))
    if (filters.priceRange[0] > 0) params.append('minPrice', filters.priceRange[0])
    if (filters.priceRange[1] < 10000) params.append('maxPrice', filters.priceRange[1])
    if (filters.minRating > 0) params.append('minRating', filters.minRating)
    router.push(`/search?${params.toString()}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl h-[90vh] p-0 overflow-hidden flex flex-col bg-gradient-to-br from-white to-gray-50 border-2 border-gray-100 shadow-2xl">
        <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-red-500 w-5 h-5 group-hover:scale-110 transition-transform" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder="Search for food, groceries, drinks, and more..."
              className="pl-12 pr-12 h-14 text-lg border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-2 focus:ring-red-200 transition-all shadow-sm hover:shadow-md bg-white"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                handleSearch(e.target.value)
              }}
            />
            {query && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-600 hover:scale-110 transition-all"
                onClick={handleClearSearch}
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              className={`flex items-center gap-2 rounded-xl transition-all hover:scale-105 ${
                showFilters
                  ? "bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-md"
                  : "border-2 border-gray-200 hover:border-red-300"
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" />
              <span className="font-medium">Filters</span>
            </Button>
            {results.length > 0 && (
              <div className="text-sm font-semibold text-gray-700 bg-red-50 px-4 py-1.5 rounded-full border border-red-200">
                {results.length} result{results.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="p-6 border-b border-gray-200 bg-white/50 backdrop-blur-sm max-h-[35vh] overflow-y-auto">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Filter Results</h3>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Categories</h4>
                <div className="grid grid-cols-2 gap-2">
                  {availableCategories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`category-${category.id}`}
                        checked={filters.categories.includes(category.id)}
                        onCheckedChange={(checked) => handleCategoryChange(category.id, checked)}
                      />
                      <Label htmlFor={`category-${category.id}`} className="text-sm">
                        {category.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Price Range</h4>
                <Slider
                  defaultValue={filters.priceRange}
                  min={0}
                  max={10000}
                  step={100}
                  onValueChange={handlePriceRangeChange}
                  className="mb-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>₦{filters.priceRange[0].toLocaleString()}</span>
                  <span>₦{filters.priceRange[1].toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Minimum Rating</h4>
                <div className="flex items-center gap-2">
                  <Slider
                    defaultValue={[filters.minRating]}
                    min={0}
                    max={5}
                    step={1}
                    onValueChange={handleRatingChange}
                  />
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span>{filters.minRating}</span>
                    <Star className="w-4 h-4 fill-current" />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button variant="outline" size="sm" className="rounded-xl hover:scale-105 transition-all" onClick={handleResetFilters}>
                  Reset
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all" onClick={handleApplyFilters}>
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <AnimatedLoader />
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-4 space-y-3 pb-24">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="p-4 flex items-center bg-white hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 cursor-pointer rounded-2xl border-2 border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300 group"
                    onClick={() => handleResultClick(result)}
                  >
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 shadow-md group-hover:scale-105 transition-transform">
                      <Image
                        src={result.imageUrl || `/placeholder.svg?height=80&width=80&query=food ${result.name}`}
                        alt={result.name}
                        width={80}
                        height={80}
                        className="object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-bold text-gray-800 group-hover:text-red-600 transition-colors">{result.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-1 mt-0.5">{result.description}</p>
                      <div className="flex items-center mt-2 gap-3">
                        <div className="flex items-center text-yellow-500 bg-yellow-50 px-2 py-0.5 rounded-lg">
                          <Star className="w-4 h-4 fill-current" />
                          <span className="ml-1 text-xs font-semibold">{result.rating.toFixed(1)}</span>
                        </div>
                        <div className="flex items-center text-gray-600 bg-gray-100 px-2 py-0.5 rounded-lg">
                          <Clock className="w-4 h-4" />
                          <span className="ml-1 text-xs font-medium">{result.deliveryTime}</span>
                        </div>
                        <span className="text-base font-bold text-red-600">₦{result.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="sticky bottom-0 p-4 bg-white border-t-2 border-gray-200">
                <Button
                  onClick={handleViewAllResults}
                  className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all h-12 text-base font-semibold"
                >
                  View All Results
                </Button>
              </div>
            </>
          ) : query ? (
            <div className="py-16 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-lg font-semibold text-gray-700">No results found for &quot;{query}&quot;</p>
              <p className="text-sm text-gray-500 mt-2">Try a different search term or adjust your filters</p>
            </div>
          ) : recentSearches.length > 0 ? (
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-bold flex items-center text-gray-800">
                  <History className="w-5 h-5 mr-2 text-red-500" />
                  Recent Searches
                </h3>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleClearRecentSearches}>
                  Clear
                </Button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 rounded-xl cursor-pointer border-2 border-transparent hover:border-red-200 transition-all group"
                    onClick={() => handleRecentSearchClick(search)}
                  >
                    <History className="w-4 h-4 text-gray-400 group-hover:text-red-500 mr-3 transition-colors" />
                    <span className="font-medium text-gray-700 group-hover:text-red-600 transition-colors">{search}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="py-16 text-center">
              <div className="text-6xl mb-4">🔎</div>
              <p className="text-lg font-semibold text-gray-700">Start searching</p>
              <p className="text-sm text-gray-500 mt-2">Find your favorite food, groceries, drinks & more</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
