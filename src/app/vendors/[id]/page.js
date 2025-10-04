"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { productAPI } from "@/lib/api"
import Link from "next/link"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import {
  MapPin,
  Clock,
  Star,
  ChevronRight,
  Trash2,
  Plus,
  Minus,
  Phone,
  Navigation,
  Heart,
  Share2,
  ShoppingBag,
} from "lucide-react"
import ProductDetailsModal from "@/app/components/modals/product-details-modal"
import LoginModal from "@/app/components/modals/login-modal"

// Mock vendor data - this should match the mock data from productAPI
const MOCK_VENDORS = [
  {
    id: 1,
    name: "Tasty Bites Restaurant",
    cuisine: "African",
    deliveryTime: "25-35 min",
    rating: 4.7,
    reviewCount: 324,
    imageUrl: "/cozy-italian-restaurant.png",
    coverImageUrl: "/cozy-italian-restaurant.png",
    address: "123 Lagos Street, Victoria Island, Lagos",
    phone: "+234 801 234 5678",
    description:
      "Authentic African cuisine with a modern twist. We serve the best jollof rice, suya, and traditional dishes in Lagos.",
    isOpen: true,
    deliveryFee: 750,
    minimumOrder: 2000,
    type: "restaurant",
  },
  {
    id: 2,
    name: "Fresh Grocers",
    cuisine: "Grocery",
    deliveryTime: "30-45 min",
    rating: 4.5,
    reviewCount: 156,
    imageUrl: "/busy-grocery-aisle.png",
    coverImageUrl: "/busy-grocery-aisle.png",
    address: "456 Market Road, Ikeja, Lagos",
    phone: "+234 802 345 6789",
    description: "Your one-stop shop for fresh groceries, organic produce, and household essentials.",
    isOpen: true,
    deliveryFee: 500,
    minimumOrder: 3000,
    type: "grocery",
  },
  {
    id: 3,
    name: "Quick Meds Pharmacy",
    cuisine: "Pharmacy",
    deliveryTime: "15-25 min",
    rating: 4.8,
    reviewCount: 89,
    imageUrl: "/pharmacy-interior.png",
    coverImageUrl: "/pharmacy-interior.png",
    address: "789 Health Avenue, Lekki, Lagos",
    phone: "+234 803 456 7890",
    description: "Licensed pharmacy providing quality medications and health products with fast delivery.",
    isOpen: true,
    deliveryFee: 300,
    minimumOrder: 1000,
    type: "pharmacy",
  },
  {
    id: 4,
    name: "Juice & Smoothies",
    cuisine: "Drinks",
    deliveryTime: "20-30 min",
    rating: 4.6,
    reviewCount: 203,
    imageUrl: "/vibrant-juice-bar.png",
    coverImageUrl: "/vibrant-juice-bar.png",
    address: "321 Wellness Street, Surulere, Lagos",
    phone: "+234 804 567 8901",
    description: "Fresh juices, smoothies, and healthy beverages made from premium ingredients.",
    isOpen: true,
    deliveryFee: 400,
    minimumOrder: 1500,
    type: "drinks",
  },
  {
    id: 5,
    name: "Healthy Harvest",
    cuisine: "Organic",
    deliveryTime: "25-40 min",
    rating: 4.9,
    reviewCount: 412,
    imageUrl: "/organic-store.png",
    coverImageUrl: "/organic-store.png",
    address: "654 Green Lane, Ikoyi, Lagos",
    phone: "+234 805 678 9012",
    description: "Premium organic groceries and health foods sourced from local farmers.",
    isOpen: true,
    deliveryFee: 600,
    minimumOrder: 2500,
    type: "grocery",
  },
]

// Mock products for vendors
const MOCK_PRODUCTS = [
  {
    id: 101,
    vendorId: 1,
    name: "Jollof Rice Special",
    description: "Our signature jollof rice with chicken, beef, and plantain",
    price: 2500,
    category: "Main Course",
    imageUrl: "/vibrant-jollof-rice.png",
    isAvailable: true,
    preparationTime: "20-25 min",
  },
  {
    id: 102,
    vendorId: 1,
    name: "Chicken Suya",
    description: "Spicy grilled chicken skewers with traditional spices",
    price: 2000,
    category: "Grilled",
    imageUrl: "/grilled-chicken-skewers.png",
    isAvailable: true,
    preparationTime: "15-20 min",
  },
  {
    id: 103,
    vendorId: 2,
    name: "Fresh Tomatoes",
    description: "Organic, locally grown tomatoes (1kg)",
    price: 800,
    category: "Vegetables",
    imageUrl: "/ripe-tomatoes.png",
    isAvailable: true,
    preparationTime: "5 min",
  },
  {
    id: 104,
    vendorId: 3,
    name: "Paracetamol",
    description: "Pain reliever and fever reducer (500mg, 20 tablets)",
    price: 350,
    category: "Pain Relief",
    imageUrl: "/medicine-still-life.png",
    isAvailable: true,
    preparationTime: "5 min",
  },
  {
    id: 105,
    vendorId: 4,
    name: "Mango Smoothie",
    description: "Fresh mango blended with yogurt and honey",
    price: 1200,
    category: "Smoothies",
    imageUrl: "/mango-smoothie.png",
    isAvailable: true,
    preparationTime: "5-10 min",
  },
]

export default function VendorPage() {
  const params = useParams()
  const router = useRouter()
  const { user, cart, addToCart, removeFromCart, updateCartItem } = useAppContext()

  const [vendor, setVendor] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState("all")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null)

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        setIsLoading(true)
        // console.log("ROUTE PARAMETER IS ", params)
        // Get vendor ID from params
        const vendorId = params.id
        // Find vendor in mock data
        const vendorData = await productAPI.getVendorById(vendorId)
        // console.log("++++++ VENDOR ID IS ", vendorId)
        if (!vendorData) {
          console.error("Vendor not found:", vendorId)
          setVendor(null)
          setIsLoading(false)
          return
        }

        setVendor(vendorData)

        // Get products for this vendor from API
        const vendorProductsResponse = await productAPI.getVendorProductsWithFiltering(vendorId, {})
        console.log("Vendor products response:", vendorProductsResponse)

        // Handle different response structures
        let vendorProducts = []
        if (vendorProductsResponse.data && vendorProductsResponse.data.products) {
          vendorProducts = vendorProductsResponse.data.products
        } else if (vendorProductsResponse.products) {
          vendorProducts = vendorProductsResponse.products
        } else if (Array.isArray(vendorProductsResponse)) {
          vendorProducts = vendorProductsResponse
        }

        setProducts(vendorProducts)

        // Extract unique categories from products
        const uniqueCategories = [...new Set(vendorProducts.map((product) => product.category?.name || product.category).filter(Boolean))]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error("Failed to fetch vendor data:", error)
        setVendor(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchVendorData()
    }
  }, [params.id])

  const filteredProducts =
    activeCategory === "all"
      ? products
      : products.filter((product) => {
          const categoryName = product.category?.name || product.category
          return categoryName === activeCategory
        })

  const handleProductClick = (product) => {
    // Navigate to product details page instead of opening modal
    router.push(`/products/${product.id || product._id}`)
  }

  const handleAddToCart = async (product, quantity = 1, options = {}) => {
    try {
      if (!user) {
        setRedirectAfterLogin(window.location.pathname)
        setIsLoginModalOpen(true)
        return
      }

      console.log("Adding product to cart:", product)
      await addToCart(product, quantity, options)
      setIsProductModalOpen(false)
      console.log("Product added successfully")
    } catch (error) {
      console.error("Failed to add to cart:", error)

      if (error.message.includes("login") || error.message.includes("authentication")) {
        setRedirectAfterLogin(window.location.pathname)
        setIsLoginModalOpen(true)
      }
    }
  }

  const handleRemoveFromCart = async (itemId) => {
    try {
      if (!user) {
        setRedirectAfterLogin(window.location.pathname)
        setIsLoginModalOpen(true)
        return
      }

      console.log("Removing item from cart:", itemId)
      await removeFromCart(itemId)
    } catch (error) {
      console.error("Failed to remove from cart:", error)
    }
  }

  const handleUpdateCartItem = async (itemId, quantity) => {
    try {
      if (!user) {
        setRedirectAfterLogin(window.location.pathname)
        setIsLoginModalOpen(true)
        return
      }

      console.log("Updating cart item:", itemId, "to quantity:", quantity)
      await updateCartItem(itemId, quantity)
    } catch (error) {
      console.error("Failed to update cart item:", error)
    }
  }

  const handleProceedToOrder = () => {
    if (!user) {
      setRedirectAfterLogin("/checkout")
      setIsLoginModalOpen(true)
      return
    }

    router.push("/checkout")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
          <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="flex-1 space-y-4">
              <div className="w-1/3 h-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex space-x-2">
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="space-y-2">
                    <div className="w-full h-40 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-1/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full lg:w-96 h-96 bg-gray-200 rounded-lg animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor not found</h1>
          <p className="text-gray-600 mb-6">The vendor you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Button asChild>
            <Link href="/">Go back home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center mb-6 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <Link href="/vendors" className="text-gray-500 hover:text-gray-700 transition-colors">
              Vendors
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className="font-medium text-gray-900">{vendor.name}</span>
          </div>

          {/* Vendor Header */}
          <div className="relative w-full h-64 overflow-hidden rounded-2xl mb-8 shadow-xl">
            <Image
              src={
                vendor.coverImageUrl ||
                `/placeholder.svg?height=256&width=1024&query=restaurant interior ${vendor.name || "/placeholder.svg"}`
              }
              alt={vendor.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

            {/* Vendor info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold mb-2">{vendor.name}</h1>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{vendor.address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      <span>{vendor.phone}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30">
                    <Heart className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-8">
            {/* Main Content */}
            <div className="flex-1">
              {/* Vendor Details */}
              <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-3 shadow-lg">
                        <Star className="w-7 h-7 text-white fill-white" />
                      </div>
                      <div className="font-bold text-xl">{vendor.rating.toFixed(1)}</div>
                      <div className="text-sm text-gray-600">{vendor.reviewCount} reviews</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-3 shadow-lg">
                        <Clock className="w-7 h-7 text-white" />
                      </div>
                      <div className="font-bold text-xl">{vendor.deliveryTime}</div>
                      <div className="text-sm text-gray-600">Delivery time</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl mx-auto mb-3 shadow-lg">
                        <Navigation className="w-7 h-7 text-white" />
                      </div>
                      <div className="font-bold text-xl">₦{vendor.deliveryFee}</div>
                      <div className="text-sm text-gray-600">Delivery fee</div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mx-auto mb-3 shadow-lg">
                        <MapPin className="w-7 h-7 text-white" />
                      </div>
                      <div className="font-bold text-xl">₦{vendor.minimumOrder.toLocaleString()}</div>
                      <div className="text-sm text-gray-600">Minimum order</div>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{vendor.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Category Tabs */}
              <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
                <TabsList className="mb-6 bg-white shadow-lg border-0 p-1 rounded-xl">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium transition-all"
                  >
                    All Items
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium transition-all"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={activeCategory} className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <Card
                        key={product.id}
                        className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-white rounded-2xl"
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="relative w-full h-48">
                          <Image
                            src={product.imageUrl || `/placeholder.svg?height=192&width=384&query=food ${product.name}`}
                            alt={product.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          {!(product.isAvailable ?? product.inStock ?? true) && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="secondary" className="bg-white/90 text-gray-800">
                                Out of Stock
                              </Badge>
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                              <Heart className="w-4 h-4 text-gray-600" />
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xl text-orange-600">₦{product.price.toLocaleString()}</span>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg rounded-xl px-4 py-2"
                              disabled={!(product.isAvailable ?? product.inStock ?? true)}
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAddToCart(product)
                              }}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </div>
                          <div className="mt-3 flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {product.preparationTime}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Order Summary */}
            <div className="w-full mt-8 lg:mt-0 lg:w-96">
              <Card className="sticky top-4 shadow-2xl border-0 bg-white rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="flex items-center justify-between text-xl font-bold mb-6">
                    Your Order
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full">
                      {cart.totalItems} items
                    </Badge>
                  </h2>

                  {cart.items.length === 0 ? (
                    <div className="py-12 text-center">
                      <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-gray-400" />
                      </div>
                      <p className="text-gray-500 mb-2 font-medium">Your cart is empty</p>
                      <p className="text-sm text-gray-400">Add items from the menu to start your order</p>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
                        {cart.items.map((item) => (
                          <div key={item.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
                            <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                              <Image
                                src={item.imageUrl || `/placeholder.svg?height=56&width=56&query=food ${item.name}`}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                              {item.options && Object.keys(item.options).length > 0 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {Object.entries(item.options)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(", ")}
                                </p>
                              )}
                              <div className="flex items-center justify-between mt-3">
                                <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                                  <button
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-l-lg"
                                    onClick={() => handleUpdateCartItem(item.id, Math.max(1, item.quantity - 1))}
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                  <button
                                    type="button"
                                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-r-lg"
                                    onClick={() => handleUpdateCartItem(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-lg"
                                  onClick={() => handleRemoveFromCart(item.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold text-sm">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">₦{cart.totalAmount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Delivery fee</span>
                          <span className="font-medium">₦{vendor.deliveryFee}</span>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200 font-bold text-lg">
                          <span>Total</span>
                          <span className="text-orange-600">
                            ₦{(cart.totalAmount + vendor.deliveryFee).toLocaleString()}
                          </span>
                        </div>

                        <Button
                          className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                          onClick={handleProceedToOrder}
                          disabled={cart.items.length === 0 || cart.totalAmount < vendor.minimumOrder}
                        >
                          {cart.totalAmount < vendor.minimumOrder
                            ? `Minimum order ₦${vendor.minimumOrder.toLocaleString()}`
                            : "Proceed to Checkout"}
                        </Button>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      <ProductDetailsModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        redirectAfterLogin={redirectAfterLogin}
      />
    </>
  )
}






















// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import Image from "next/image"
// import Link from "next/link"
// import { useAppContext } from "@/context/app-context"
// import { Button } from "@/app/components/ui/button"
// import { Card, CardContent } from "@/app/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
// import { Badge } from "@/app/components/ui/badge"
// import {
//   MapPin,
//   Clock,
//   Star,
//   ChevronRight,
//   Trash2,
//   Plus,
//   Minus,
//   Phone,
//   Navigation,
//   Heart,
//   Share2,
//   ShoppingBag,
// } from "lucide-react"
// import ProductDetailsModal from "@/app/components/modals/product-details-modal"
// import LoginModal from "@/app/components/modals/login-modal"

// // Mock vendor data - this should match the mock data from productAPI
// const MOCK_VENDORS = [
//   {
//     id: 1,
//     name: "Tasty Bites Restaurant",
//     cuisine: "African",
//     deliveryTime: "25-35 min",
//     rating: 4.7,
//     reviewCount: 324,
//     imageUrl: "/cozy-italian-restaurant.png",
//     coverImageUrl: "/cozy-italian-restaurant.png",
//     address: "123 Lagos Street, Victoria Island, Lagos",
//     phone: "+234 801 234 5678",
//     description:
//       "Authentic African cuisine with a modern twist. We serve the best jollof rice, suya, and traditional dishes in Lagos.",
//     isOpen: true,
//     deliveryFee: 750,
//     minimumOrder: 2000,
//     type: "restaurant",
//   },
//   {
//     id: 2,
//     name: "Fresh Grocers",
//     cuisine: "Grocery",
//     deliveryTime: "30-45 min",
//     rating: 4.5,
//     reviewCount: 156,
//     imageUrl: "/busy-grocery-aisle.png",
//     coverImageUrl: "/busy-grocery-aisle.png",
//     address: "456 Market Road, Ikeja, Lagos",
//     phone: "+234 802 345 6789",
//     description: "Your one-stop shop for fresh groceries, organic produce, and household essentials.",
//     isOpen: true,
//     deliveryFee: 500,
//     minimumOrder: 3000,
//     type: "grocery",
//   },
//   {
//     id: 3,
//     name: "Quick Meds Pharmacy",
//     cuisine: "Pharmacy",
//     deliveryTime: "15-25 min",
//     rating: 4.8,
//     reviewCount: 89,
//     imageUrl: "/pharmacy-interior.png",
//     coverImageUrl: "/pharmacy-interior.png",
//     address: "789 Health Avenue, Lekki, Lagos",
//     phone: "+234 803 456 7890",
//     description: "Licensed pharmacy providing quality medications and health products with fast delivery.",
//     isOpen: true,
//     deliveryFee: 300,
//     minimumOrder: 1000,
//     type: "pharmacy",
//   },
//   {
//     id: 4,
//     name: "Juice & Smoothies",
//     cuisine: "Drinks",
//     deliveryTime: "20-30 min",
//     rating: 4.6,
//     reviewCount: 203,
//     imageUrl: "/vibrant-juice-bar.png",
//     coverImageUrl: "/vibrant-juice-bar.png",
//     address: "321 Wellness Street, Surulere, Lagos",
//     phone: "+234 804 567 8901",
//     description: "Fresh juices, smoothies, and healthy beverages made from premium ingredients.",
//     isOpen: true,
//     deliveryFee: 400,
//     minimumOrder: 1500,
//     type: "drinks",
//   },
//   {
//     id: 5,
//     name: "Healthy Harvest",
//     cuisine: "Organic",
//     deliveryTime: "25-40 min",
//     rating: 4.9,
//     reviewCount: 412,
//     imageUrl: "/organic-store.png",
//     coverImageUrl: "/organic-store.png",
//     address: "654 Green Lane, Ikoyi, Lagos",
//     phone: "+234 805 678 9012",
//     description: "Premium organic groceries and health foods sourced from local farmers.",
//     isOpen: true,
//     deliveryFee: 600,
//     minimumOrder: 2500,
//     type: "grocery",
//   },
// ]

// // Mock products for vendors
// const MOCK_PRODUCTS = [
//   {
//     id: 101,
//     vendorId: 1,
//     name: "Jollof Rice Special",
//     description: "Our signature jollof rice with chicken, beef, and plantain",
//     price: 2500,
//     category: "Main Course",
//     imageUrl: "/vibrant-jollof-rice.png",
//     isAvailable: true,
//     preparationTime: "20-25 min",
//   },
//   {
//     id: 102,
//     vendorId: 1,
//     name: "Chicken Suya",
//     description: "Spicy grilled chicken skewers with traditional spices",
//     price: 2000,
//     category: "Grilled",
//     imageUrl: "/grilled-chicken-skewers.png",
//     isAvailable: true,
//     preparationTime: "15-20 min",
//   },
//   {
//     id: 103,
//     vendorId: 2,
//     name: "Fresh Tomatoes",
//     description: "Organic, locally grown tomatoes (1kg)",
//     price: 800,
//     category: "Vegetables",
//     imageUrl: "/ripe-tomatoes.png",
//     isAvailable: true,
//     preparationTime: "5 min",
//   },
//   {
//     id: 104,
//     vendorId: 3,
//     name: "Paracetamol",
//     description: "Pain reliever and fever reducer (500mg, 20 tablets)",
//     price: 350,
//     category: "Pain Relief",
//     imageUrl: "/medicine-still-life.png",
//     isAvailable: true,
//     preparationTime: "5 min",
//   },
//   {
//     id: 105,
//     vendorId: 4,
//     name: "Mango Smoothie",
//     description: "Fresh mango blended with yogurt and honey",
//     price: 1200,
//     category: "Smoothies",
//     imageUrl: "/mango-smoothie.png",
//     isAvailable: true,
//     preparationTime: "5-10 min",
//   },
// ]

// export default function VendorPage() {
//   const params = useParams()
//   const router = useRouter()
//   const { user, cart, addToCart, removeFromCart, updateCartItem } = useAppContext()

//   const [vendor, setVendor] = useState(null)
//   const [products, setProducts] = useState([])
//   const [categories, setCategories] = useState([])
//   const [activeCategory, setActiveCategory] = useState("all")
//   const [selectedProduct, setSelectedProduct] = useState(null)
//   const [isProductModalOpen, setIsProductModalOpen] = useState(false)
//   const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)
//   const [redirectAfterLogin, setRedirectAfterLogin] = useState(null)

//   useEffect(() => {
//     const fetchVendorData = async () => {
//       try {
//         setIsLoading(true)

//         // Get vendor ID from params
//         const vendorId = Number.parseInt(params.id)

//         // Find vendor in mock data
//         const vendorData = MOCK_VENDORS.find((v) => v.id === vendorId)

//         if (!vendorData) {
//           console.error("Vendor not found:", vendorId)
//           setVendor(null)
//           setIsLoading(false)
//           return
//         }

//         setVendor(vendorData)

//         // Get products for this vendor
//         const vendorProducts = MOCK_PRODUCTS.filter((p) => p.vendorId === vendorId)
//         setProducts(vendorProducts)

//         // Extract unique categories from products
//         const uniqueCategories = [...new Set(vendorProducts.map((product) => product.category))]
//         setCategories(uniqueCategories)
//       } catch (error) {
//         console.error("Failed to fetch vendor data:", error)
//         setVendor(null)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (params.id) {
//       fetchVendorData()
//     }
//   }, [params.id])

//   const filteredProducts =
//     activeCategory === "all" ? products : products.filter((product) => product.category === activeCategory)

//   const handleProductClick = (product) => {
//     setSelectedProduct(product)
//     setIsProductModalOpen(true)
//   }

//   const handleAddToCart = async (product, quantity = 1, options = {}) => {
//     try {
//       if (!user) {
//         setRedirectAfterLogin(window.location.pathname)
//         setIsLoginModalOpen(true)
//         return
//       }

//       console.log("Adding product to cart:", product)
//       await addToCart(product, quantity, options)
//       setIsProductModalOpen(false)
//       console.log("Product added successfully")
//     } catch (error) {
//       console.error("Failed to add to cart:", error)

//       if (error.message.includes("login") || error.message.includes("authentication")) {
//         setRedirectAfterLogin(window.location.pathname)
//         setIsLoginModalOpen(true)
//       }
//     }
//   }

//   const handleRemoveFromCart = async (itemId) => {
//     try {
//       if (!user) {
//         setRedirectAfterLogin(window.location.pathname)
//         setIsLoginModalOpen(true)
//         return
//       }

//       console.log("Removing item from cart:", itemId)
//       await removeFromCart(itemId)
//     } catch (error) {
//       console.error("Failed to remove from cart:", error)
//     }
//   }

//   const handleUpdateCartItem = async (itemId, quantity) => {
//     try {
//       if (!user) {
//         setRedirectAfterLogin(window.location.pathname)
//         setIsLoginModalOpen(true)
//         return
//       }

//       console.log("Updating cart item:", itemId, "to quantity:", quantity)
//       await updateCartItem(itemId, quantity)
//     } catch (error) {
//       console.error("Failed to update cart item:", error)
//     }
//   }

//   const handleProceedToOrder = () => {
//     if (!user) {
//       setRedirectAfterLogin("/checkout")
//       setIsLoginModalOpen(true)
//       return
//     }

//     router.push("/checkout")
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
//           <div className="flex flex-col lg:flex-row lg:space-x-8">
//             <div className="flex-1 space-y-4">
//               <div className="w-1/3 h-8 bg-gray-200 rounded animate-pulse"></div>
//               <div className="space-y-2">
//                 <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
//               </div>
//               <div className="flex space-x-2">
//                 <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
//                 <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
//                 {Array.from({ length: 6 }).map((_, index) => (
//                   <div key={index} className="space-y-2">
//                     <div className="w-full h-40 bg-gray-200 rounded-lg animate-pulse"></div>
//                     <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
//                     <div className="w-1/3 h-4 bg-gray-200 rounded animate-pulse"></div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="w-full lg:w-96 h-96 bg-gray-200 rounded-lg animate-pulse"></div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (!vendor) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
//             <MapPin className="w-8 h-8 text-gray-400" />
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900 mb-2">Vendor not found</h1>
//           <p className="text-gray-600 mb-6">The vendor you&apos;re looking for doesn&apos;t exist or has been removed.</p>
//           <Button asChild>
//             <Link href="/">Go back home</Link>
//           </Button>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       <div className="min-h-screen bg-gray-50">
//         <div className="max-w-7xl mx-auto px-6 py-8">
//           {/* Breadcrumb */}
//           <div className="flex items-center mb-6 text-sm">
//             <Link href="/" className="text-gray-500 hover:text-gray-700 transition-colors">
//               Home
//             </Link>
//             <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
//             <Link href="/vendors" className="text-gray-500 hover:text-gray-700 transition-colors">
//               Vendors
//             </Link>
//             <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
//             <span className="font-medium text-gray-900">{vendor.name}</span>
//           </div>

//           {/* Vendor Header */}
//           <div className="relative w-full h-64 overflow-hidden rounded-2xl mb-8 shadow-xl">
//             <Image
//               src={
//                 vendor.coverImageUrl ||
//                 `/placeholder.svg?height=256&width=1024&query=restaurant interior ${vendor.name || "/placeholder.svg"}`
//               }
//               alt={vendor.name}
//               fill
//               className="object-cover"
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>

//             {/* Vendor info overlay */}
//             <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
//               <div className="flex items-start justify-between">
//                 <div className="flex-1">
//                   <h1 className="text-3xl font-bold mb-2">{vendor.name}</h1>
//                   <div className="flex items-center space-x-4 text-sm">
//                     <div className="flex items-center">
//                       <MapPin className="w-4 h-4 mr-1" />
//                       <span>{vendor.address}</span>
//                     </div>
//                     <div className="flex items-center">
//                       <Phone className="w-4 h-4 mr-1" />
//                       <span>{vendor.phone}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="flex space-x-2">
//                   <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30">
//                     <Heart className="w-4 h-4 mr-1" />
//                     Save
//                   </Button>
//                   <Button variant="secondary" size="sm" className="bg-white/20 backdrop-blur-sm border-white/30">
//                     <Share2 className="w-4 h-4 mr-1" />
//                     Share
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col lg:flex-row lg:space-x-8">
//             {/* Main Content */}
//             <div className="flex-1">
//               {/* Vendor Details */}
//               <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//                 <CardContent className="p-6">
//                   <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//                     <div className="text-center">
//                       <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl mx-auto mb-3 shadow-lg">
//                         <Star className="w-7 h-7 text-white fill-white" />
//                       </div>
//                       <div className="font-bold text-xl">{vendor.rating.toFixed(1)}</div>
//                       <div className="text-sm text-gray-600">{vendor.reviewCount} reviews</div>
//                     </div>

//                     <div className="text-center">
//                       <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl mx-auto mb-3 shadow-lg">
//                         <Clock className="w-7 h-7 text-white" />
//                       </div>
//                       <div className="font-bold text-xl">{vendor.deliveryTime}</div>
//                       <div className="text-sm text-gray-600">Delivery time</div>
//                     </div>

//                     <div className="text-center">
//                       <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl mx-auto mb-3 shadow-lg">
//                         <Navigation className="w-7 h-7 text-white" />
//                       </div>
//                       <div className="font-bold text-xl">₦{vendor.deliveryFee}</div>
//                       <div className="text-sm text-gray-600">Delivery fee</div>
//                     </div>

//                     <div className="text-center">
//                       <div className="flex items-center justify-center w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl mx-auto mb-3 shadow-lg">
//                         <MapPin className="w-7 h-7 text-white" />
//                       </div>
//                       <div className="font-bold text-xl">₦{vendor.minimumOrder.toLocaleString()}</div>
//                       <div className="text-sm text-gray-600">Minimum order</div>
//                     </div>
//                   </div>

//                   <div className="mt-6 pt-6 border-t border-gray-200">
//                     <p className="text-gray-700 leading-relaxed">{vendor.description}</p>
//                   </div>
//                 </CardContent>
//               </Card>

//               {/* Category Tabs */}
//               <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
//                 <TabsList className="mb-6 bg-white shadow-lg border-0 p-1 rounded-xl">
//                   <TabsTrigger
//                     value="all"
//                     className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium transition-all"
//                   >
//                     All Items
//                   </TabsTrigger>
//                   {categories.map((category) => (
//                     <TabsTrigger
//                       key={category}
//                       value={category}
//                       className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white rounded-lg px-6 py-2 font-medium transition-all"
//                     >
//                       {category}
//                     </TabsTrigger>
//                   ))}
//                 </TabsList>

//                 <TabsContent value={activeCategory} className="mt-0">
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {filteredProducts.map((product) => (
//                       <Card
//                         key={product.id}
//                         className="group overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-0 shadow-lg bg-white rounded-2xl"
//                         onClick={() => handleProductClick(product)}
//                       >
//                         <div className="relative w-full h-48">
//                           <Image
//                             src={product.imageUrl || `/placeholder.svg?height=192&width=384&query=food ${product.name}`}
//                             alt={product.name}
//                             fill
//                             className="object-cover group-hover:scale-110 transition-transform duration-500"
//                           />
//                           {!product.isAvailable && (
//                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
//                               <Badge variant="secondary" className="bg-white/90 text-gray-800">
//                                 Out of Stock
//                               </Badge>
//                             </div>
//                           )}
//                           <div className="absolute top-3 right-3">
//                             <div className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
//                               <Heart className="w-4 h-4 text-gray-600" />
//                             </div>
//                           </div>
//                         </div>
//                         <CardContent className="p-5">
//                           <h3 className="font-bold text-lg mb-2 group-hover:text-orange-600 transition-colors">
//                             {product.name}
//                           </h3>
//                           <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
//                           <div className="flex items-center justify-between">
//                             <span className="font-bold text-xl text-orange-600">₦{product.price.toLocaleString()}</span>
//                             <Button
//                               size="sm"
//                               className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg rounded-xl px-4 py-2"
//                               disabled={!product.isAvailable}
//                               onClick={(e) => {
//                                 e.stopPropagation()
//                                 handleAddToCart(product)
//                               }}
//                             >
//                               <Plus className="w-4 h-4 mr-1" />
//                               Add
//                             </Button>
//                           </div>
//                           <div className="mt-3 flex items-center text-xs text-gray-500">
//                             <Clock className="w-3 h-3 mr-1" />
//                             {product.preparationTime}
//                           </div>
//                         </CardContent>
//                       </Card>
//                     ))}
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </div>

//             {/* Order Summary */}
//             <div className="w-full mt-8 lg:mt-0 lg:w-96">
//               <Card className="sticky top-4 shadow-2xl border-0 bg-white rounded-2xl overflow-hidden">
//                 <CardContent className="p-6">
//                   <h2 className="flex items-center justify-between text-xl font-bold mb-6">
//                     Your Order
//                     <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full">
//                       {cart.totalItems} items
//                     </Badge>
//                   </h2>

//                   {cart.items.length === 0 ? (
//                     <div className="py-12 text-center">
//                       <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
//                         <ShoppingBag className="w-10 h-10 text-gray-400" />
//                       </div>
//                       <p className="text-gray-500 mb-2 font-medium">Your cart is empty</p>
//                       <p className="text-sm text-gray-400">Add items from the menu to start your order</p>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="space-y-4 mb-6 max-h-80 overflow-y-auto">
//                         {cart.items.map((item) => (
//                           <div key={item.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl">
//                             <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
//                               <Image
//                                 src={item.imageUrl || `/placeholder.svg?height=56&width=56&query=food ${item.name}`}
//                                 alt={item.name}
//                                 fill
//                                 className="object-cover"
//                               />
//                             </div>
//                             <div className="flex-1 min-w-0">
//                               <h4 className="font-semibold text-sm truncate">{item.name}</h4>
//                               {item.options && Object.keys(item.options).length > 0 && (
//                                 <p className="text-xs text-gray-500 mt-1">
//                                   {Object.entries(item.options)
//                                     .map(([key, value]) => `${key}: ${value}`)
//                                     .join(", ")}
//                                 </p>
//                               )}
//                               <div className="flex items-center justify-between mt-3">
//                                 <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="w-8 h-8 p-0 hover:bg-gray-100 rounded-l-lg"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       handleUpdateCartItem(item.id, Math.max(1, item.quantity - 1))
//                                     }}
//                                     disabled={item.quantity <= 1}
//                                   >
//                                     <Minus className="w-3 h-3" />
//                                   </Button>
//                                   <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
//                                   <Button
//                                     variant="ghost"
//                                     size="sm"
//                                     className="w-8 h-8 p-0 hover:bg-gray-100 rounded-r-lg"
//                                     onClick={(e) => {
//                                       e.stopPropagation()
//                                       handleUpdateCartItem(item.id, item.quantity + 1)
//                                     }}
//                                   >
//                                     <Plus className="w-3 h-3" />
//                                   </Button>
//                                 </div>
//                                 <Button
//                                   variant="ghost"
//                                   size="sm"
//                                   className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-lg"
//                                   onClick={(e) => {
//                                     e.stopPropagation()
//                                     handleRemoveFromCart(item.id)
//                                   }}
//                                 >
//                                   <Trash2 className="w-4 h-4" />
//                                 </Button>
//                               </div>
//                             </div>
//                             <div className="text-right">
//                               <span className="font-semibold text-sm">
//                                 ₦{(item.price * item.quantity).toLocaleString()}
//                               </span>
//                             </div>
//                           </div>
//                         ))}
//                       </div>

//                       <div className="space-y-3 pt-4 border-t border-gray-200">
//                         <div className="flex items-center justify-between text-sm">
//                           <span className="text-gray-600">Subtotal</span>
//                           <span className="font-medium">₦{cart.totalAmount.toLocaleString()}</span>
//                         </div>
//                         <div className="flex items-center justify-between text-sm">
//                           <span className="text-gray-600">Delivery fee</span>
//                           <span className="font-medium">₦{vendor.deliveryFee}</span>
//                         </div>
//                         <div className="flex items-center justify-between pt-3 border-t border-gray-200 font-bold text-lg">
//                           <span>Total</span>
//                           <span className="text-orange-600">
//                             ₦{(cart.totalAmount + vendor.deliveryFee).toLocaleString()}
//                           </span>
//                         </div>

//                         <Button
//                           className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
//                           onClick={handleProceedToOrder}
//                           disabled={cart.items.length === 0 || cart.totalAmount < vendor.minimumOrder}
//                         >
//                           {cart.totalAmount < vendor.minimumOrder
//                             ? `Minimum order ₦${vendor.minimumOrder.toLocaleString()}`
//                             : "Proceed to Checkout"}
//                         </Button>
//                       </div>
//                     </>
//                   )}
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Product Details Modal */}
//       <ProductDetailsModal
//         isOpen={isProductModalOpen}
//         onClose={() => setIsProductModalOpen(false)}
//         product={selectedProduct}
//         onAddToCart={handleAddToCart}
//       />

//       {/* Login Modal */}
//       <LoginModal
//         isOpen={isLoginModalOpen}
//         onClose={() => setIsLoginModalOpen(false)}
//         redirectAfterLogin={redirectAfterLogin}
//       />
//     </>
//   )
// }
