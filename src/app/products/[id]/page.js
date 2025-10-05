"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { useAppContext } from "@/context/app-context"
import { productAPI } from "@/lib/api"
import { Button } from "@/app/components/ui/button"
import { Badge } from "@/app/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Toast } from "@/app/components/ui/toastCart" // ADD THIS IMPORT
import { Card, CardContent } from "@/app/components/ui/card"
import { Star, Clock, MapPin, ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react"
import AnimatedLoader from "@/app/components/ui/animated-loader"

// Default images by product type
const DEFAULT_IMAGES = {
  food: '/vibrant-jollof-rice.png',
  drink: '/mango-smoothie.png',
  grocery: '/ripe-tomatoes.png',
  drug: '/medicine-still-life.png',
  default: '/placeholder.svg?height=400&width=400&query=product'
}

const getDefaultImage = (productType) => {
  if (!productType) return DEFAULT_IMAGES.default
  const type = productType.toLowerCase()
  if (type.includes('food') || type.includes('meal')) return DEFAULT_IMAGES.food
  if (type.includes('drink') || type.includes('beverage')) return DEFAULT_IMAGES.drink
  if (type.includes('grocery') || type.includes('groceries')) return DEFAULT_IMAGES.grocery
  if (type.includes('drug') || type.includes('medicine') || type.includes('pharmacy')) return DEFAULT_IMAGES.drug
  return DEFAULT_IMAGES.default
}

const getValidImageUrl = (imageUrl, productType) => {
  // If no image URL, return default
  if (!imageUrl) return getDefaultImage(productType)

  // Clean up malformed URLs from backend (e.g., "http://localhost:5000chicken.png" -> "/chicken.png")
  // This happens when backend concatenates base URL with filename without proper slash
  const malformedPattern = /^https?:\/\/[^/]+([a-zA-Z0-9])/
  if (malformedPattern.test(imageUrl)) {
    // Extract the filename part after the domain
    const match = imageUrl.match(/^https?:\/\/[^/]+(.+)$/)
    if (match && match[1]) {
      // If the extracted part doesn't start with /, add it
      return match[1].startsWith('/') ? match[1] : `/${match[1]}`
    }
  }

  // If already a valid absolute URL with proper format, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Check if it's properly formatted (has a slash after domain)
    try {
      new URL(imageUrl)
      return imageUrl
    } catch (e) {
      // If URL constructor fails, it's malformed, use default
      console.warn('Malformed image URL:', imageUrl)
      return getDefaultImage(productType)
    }
  }

  // If it starts with /, it's a relative path - return as is
  if (imageUrl.startsWith('/')) {
    return imageUrl
  }

  // Otherwise, it's likely a filename only, prepend with /
  return `/${imageUrl}`
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addToCart } = useAppContext()

  const [product, setProduct] = useState(null)
  const { toast, addToast, removeToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true)
        const response = await productAPI.getProductById(params.id)
        setProduct(response)
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      fetchProduct()
    }
  }, [params.id])

  const handleAddToCart = async () => {
    if (!product) return

    try {
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: getValidImageUrl(product.imageUrl, product.productType),
        description: product.description,
        quantity: quantity
      })
      // Show success message
      addToast("Product Added to cart!", "success", 3000)
    } catch (error) {
      addToast(
        error.message || "Failed to add to cart. Please try again.",
        "error",
        4000
      )
      console.error("Failed to add to cart:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <AnimatedLoader size="large" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Button onClick={() => router.push("/home")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* ADD THIS LINE - Render the Toast component */}
      <Toast toasts={toast} removeToast={removeToast} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-white">
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl">
            <Image
              src={getValidImageUrl(product.imageUrl, product.productType)}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.discount && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                -{product.discount}%
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <Badge className="mb-2">{product.productType}</Badge>
            <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                <span className="font-semibold">{product.rating.toFixed(1)}</span>
              </div>
              {product.category && <Badge variant="outline">{product.category.name}</Badge>}
              <div className="flex items-center gap-1 text-gray-600">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{product.deliveryTime}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-red-600">₦{product.price.toLocaleString()}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            {product.vendor && (
              <Card className="mb-6">
                <CardContent className="p-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-1">Vendor</h3>
                  <p className="font-semibold">{product.vendor.name}</p>
                  {product.vendor.phone && (
                    <p className="text-sm text-gray-600">
                      {typeof product.vendor.phone === 'object'
                        ? product.vendor.phone.fullPhoneNumber || `${product.vendor.phone.phoneCode}${product.vendor.phone.phoneNumber}`
                        : product.vendor.phone}
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex items-center gap-4 mb-6">
              <span className="font-semibold">Quantity:</span>
              <div className="flex items-center gap-2 border rounded-lg">
                <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-bold w-12 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <span className="font-semibold">Total: ₦{(product.price * quantity).toLocaleString()}</span>
            </div>

            <Button
              onClick={handleAddToCart}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>

            {product.ingredients && product.ingredients.length > 0 && (
              <Card className="mt-6">
                <CardContent className="p-4">
                  <h3 className="font-bold mb-2">Ingredients</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.ingredients.map((ingredient, index) => (
                      <Badge key={index} variant="outline">{ingredient}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}






















// "use client"

// import { useState, useEffect } from "react"
// import { useParams, useRouter } from "next/navigation"
// import Image from "next/image"
// import { useAppContext } from "@/context/app-context"
// import { productAPI } from "@/lib/api"
// import { Button } from "@/app/components/ui/button"
// import { Badge } from "@/app/components/ui/badge"
// import { useToast } from "@/hooks/use-toast"
// import { Card, CardContent } from "@/app/components/ui/card"
// import { Star, Clock, MapPin, ShoppingCart, Plus, Minus, ArrowLeft } from "lucide-react"
// import AnimatedLoader from "@/app/components/ui/animated-loader"

// // Default images by product type
// const DEFAULT_IMAGES = {
//   food: '/vibrant-jollof-rice.png',
//   drink: '/mango-smoothie.png',
//   grocery: '/ripe-tomatoes.png',
//   drug: '/medicine-still-life.png',
//   default: '/placeholder.svg?height=400&width=400&query=product'
// }

// const getDefaultImage = (productType) => {
//   if (!productType) return DEFAULT_IMAGES.default
//   const type = productType.toLowerCase()
//   if (type.includes('food') || type.includes('meal')) return DEFAULT_IMAGES.food
//   if (type.includes('drink') || type.includes('beverage')) return DEFAULT_IMAGES.drink
//   if (type.includes('grocery') || type.includes('groceries')) return DEFAULT_IMAGES.grocery
//   if (type.includes('drug') || type.includes('medicine') || type.includes('pharmacy')) return DEFAULT_IMAGES.drug
//   return DEFAULT_IMAGES.default
// }

// const getValidImageUrl = (imageUrl, productType) => {
//   // If no image URL, return default
//   if (!imageUrl) return getDefaultImage(productType)

//   // Clean up malformed URLs from backend (e.g., "http://localhost:5000chicken.png" -> "/chicken.png")
//   // This happens when backend concatenates base URL with filename without proper slash
//   const malformedPattern = /^https?:\/\/[^/]+([a-zA-Z0-9])/
//   if (malformedPattern.test(imageUrl)) {
//     // Extract the filename part after the domain
//     const match = imageUrl.match(/^https?:\/\/[^/]+(.+)$/)
//     if (match && match[1]) {
//       // If the extracted part doesn't start with /, add it
//       return match[1].startsWith('/') ? match[1] : `/${match[1]}`
//     }
//   }

//   // If already a valid absolute URL with proper format, return as is
//   if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
//     // Check if it's properly formatted (has a slash after domain)
//     try {
//       new URL(imageUrl)
//       return imageUrl
//     } catch (e) {
//       // If URL constructor fails, it's malformed, use default
//       console.warn('Malformed image URL:', imageUrl)
//       return getDefaultImage(productType)
//     }
//   }

//   // If it starts with /, it's a relative path - return as is
//   if (imageUrl.startsWith('/')) {
//     return imageUrl
//   }

//   // Otherwise, it's likely a filename only, prepend with /
//   return `/${imageUrl}`
// }

// export default function ProductDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const { addToCart } = useAppContext()

//   const [product, setProduct] = useState(null)
//   const { toast, addToast, removeToast } = useToast()
//   const [isLoading, setIsLoading] = useState(true)
//   const [quantity, setQuantity] = useState(1)

//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         setIsLoading(true)
//         const response = await productAPI.getProductById(params.id)
//         setProduct(response)
//       } catch (error) {
//         console.error("Failed to fetch product:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     if (params.id) {
//       fetchProduct()
//     }
//   }, [params.id])

//   const handleAddToCart = async () => {
//     if (!product) return

//     try {
//       await addToCart({
//         id: product.id,
//         name: product.name,
//         price: product.price,
//         imageUrl: getValidImageUrl(product.imageUrl, product.productType),
//         description: product.description,
//         quantity: quantity
//       })
//       // Show success message
//       addToast("Product Added to cart!", "success", 3000)
//     } catch (error) {
//       addToast(
//         error.message || "Failed to add to cart. Please try again.",
//         "error",
//         4000
//       )
//       console.error("Failed to add to cart:", error)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <AnimatedLoader size="large" />
//       </div>
//     )
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center p-4">
//         <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
//         <Button onClick={() => router.push("/home")}>
//           <ArrowLeft className="w-4 h-4 mr-2" />
//           Back to Home
//         </Button>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <Button variant="ghost" onClick={() => router.back()} className="mb-6 hover:bg-white">
//           <ArrowLeft className="w-5 h-5 mr-2" />
//           Back
//         </Button>

//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
//           <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-xl">
//             <Image
//               src={getValidImageUrl(product.imageUrl, product.productType)}
//               alt={product.name}
//               fill
//               className="object-cover"
//             />
//             {product.discount && (
//               <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-full font-bold shadow-lg">
//                 -{product.discount}%
//               </div>
//             )}
//           </div>

//           <div className="flex flex-col">
//             <Badge className="mb-2">{product.productType}</Badge>
//             <h1 className="text-3xl font-bold mb-3">{product.name}</h1>
            
//             <div className="flex items-center gap-4 mb-4">
//               <div className="flex items-center gap-1">
//                 <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
//                 <span className="font-semibold">{product.rating.toFixed(1)}</span>
//               </div>
//               {product.category && <Badge variant="outline">{product.category.name}</Badge>}
//               <div className="flex items-center gap-1 text-gray-600">
//                 <Clock className="w-4 h-4" />
//                 <span className="text-sm">{product.deliveryTime}</span>
//               </div>
//             </div>

//             <div className="flex items-baseline gap-3 mb-6">
//               <span className="text-3xl font-bold text-red-600">₦{product.price.toLocaleString()}</span>
//               {product.originalPrice && product.originalPrice > product.price && (
//                 <span className="text-lg text-gray-400 line-through">₦{product.originalPrice.toLocaleString()}</span>
//               )}
//             </div>

//             <p className="text-gray-600 mb-6">{product.description}</p>

//             {product.vendor && (
//               <Card className="mb-6">
//                 <CardContent className="p-4">
//                   <h3 className="text-sm font-semibold text-gray-500 mb-1">Vendor</h3>
//                   <p className="font-semibold">{product.vendor.name}</p>
//                   {product.vendor.phone && (
//                     <p className="text-sm text-gray-600">
//                       {typeof product.vendor.phone === 'object'
//                         ? product.vendor.phone.fullPhoneNumber || `${product.vendor.phone.phoneCode}${product.vendor.phone.phoneNumber}`
//                         : product.vendor.phone}
//                     </p>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             <div className="flex items-center gap-4 mb-6">
//               <span className="font-semibold">Quantity:</span>
//               <div className="flex items-center gap-2 border rounded-lg">
//                 <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
//                   <Minus className="w-4 h-4" />
//                 </Button>
//                 <span className="font-bold w-12 text-center">{quantity}</span>
//                 <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
//               <span className="font-semibold">Total: ₦{(product.price * quantity).toLocaleString()}</span>
//             </div>

//             <Button
//               onClick={handleAddToCart}
//               size="lg"
//               className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
//             >
//               <ShoppingCart className="w-5 h-5 mr-2" />
//               Add to Cart
//             </Button>

//             {product.ingredients && product.ingredients.length > 0 && (
//               <Card className="mt-6">
//                 <CardContent className="p-4">
//                   <h3 className="font-bold mb-2">Ingredients</h3>
//                   <div className="flex flex-wrap gap-2">
//                     {product.ingredients.map((ingredient, index) => (
//                       <Badge key={index} variant="outline">{ingredient}</Badge>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
