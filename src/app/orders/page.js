"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAppContext } from "@/context/app-context"
import { orderAPI } from "@/lib/api"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Badge } from "@/app/components/ui/badge"
import { ShoppingCart, Package, CheckCircle, Trash2, Plus, Minus, Clock, MapPin } from "lucide-react"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"

// Helper function to get valid image URL
const getValidImageUrl = (imageUrl, fallbackName = "item") => {
  if (!imageUrl) {
    return `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(fallbackName)}`
  }

  // Check if it's a Google Drive sharing link
  if (imageUrl.includes('drive.google.com/file/d/')) {
    // Try to extract file ID and convert to direct link
    const match = imageUrl.match(/\/file\/d\/([^/]+)/)
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`
    }
  }

  // Check if it's already a valid image URL
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('/')) {
    return imageUrl
  }

  // Fallback to placeholder
  return `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(fallbackName)}`
}

export default function OrdersPage() {
  const router = useRouter()
  const { user, cart, updateCartItem, removeFromCart, clearCart } = useAppContext()
  const [activeTab, setActiveTab] = useState("cart")
  const [ongoingOrders, setOngoingOrders] = useState([])
  const [completedOrders, setCompletedOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isClearingCart, setIsClearingCart] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        setIsLoading(true)
        const userId = user._id || user.userId
        const response = await orderAPI.getOrders(userId)

        // Handle different response structures - ensure orders is an array
        let orders = []
        if (Array.isArray(response)) {
          orders = response
        } else if (response?.orders && Array.isArray(response.orders)) {
          orders = response.orders
        } else if (response?.data && Array.isArray(response.data)) {
          orders = response.data
        } else if (response?.data?.orders && Array.isArray(response.data.orders)) {
          orders = response.data.orders
        }

        console.log("Fetched orders:", orders)

        // Filter orders based on status
        setOngoingOrders(orders.filter((order) => order.orderStatus === "ongoing" || order.orderStatus === "pending"))
        setCompletedOrders(orders.filter((order) => order.orderStatus === "completed"))
      } catch (error) {
        console.error("Failed to fetch orders:", error)
        // Set empty arrays on error
        setOngoingOrders([])
        setCompletedOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  const handleQuantityChange = async (itemId, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change)
    try {
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      console.error("Failed to update cart item:", error)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      await removeFromCart(itemId)
    } catch (error) {
      console.error("Failed to remove item from cart:", error)
    }
  }

  const handleCheckout = () => {
    router.push("/checkout")
  }

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear all items from your cart?")) {
      return
    }

    try {
      setIsClearingCart(true)
      await clearCart()
    } catch (error) {
      console.error("Failed to clear cart:", error)
      alert("Failed to clear cart. Please try again.")
    } finally {
      setIsClearingCart(false)
    }
  }

  const renderCartTab = () => {
    if (cart.items.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 mb-6 text-gray-300">
            <ShoppingCart className="w-full h-full" />
          </div>
          <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-6">Add items to your cart to get started</p>
          <Button
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            onClick={() => router.push("/")}
          >
            Browse Restaurants
          </Button>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              {cart.totalItems} Order{cart.totalItems !== 1 ? "s" : ""} from Vendors
            </h2>
            <Button
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-50 hover:border-red-600"
              onClick={handleClearCart}
              disabled={isClearingCart}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isClearingCart ? "Clearing..." : "Clear Cart"}
            </Button>
          </div>

          {cart.items.map((item) => (
            <Card key={item.id} className="overflow-hidden shadow-sm border-0 bg-white">
              <CardContent className="p-0">
                <div className="flex items-center p-6">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={getValidImageUrl(item.imageUrl, item.name)}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                        {item.options && Object.keys(item.options).length > 0 && (
                          <p className="text-sm text-gray-500 mt-1">
                            {Object.entries(item.options)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border rounded-lg">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0"
                          onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="w-12 text-center font-medium">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-10 w-10 p-0"
                          onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Gift Section */}
          <Card className="border border-dashed border-gray-300 bg-gray-50">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Send as a gift</h3>
                  <p className="text-sm text-gray-500">Add their details to the delivery information.</p>
                </div>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={handleCheckout}
                >
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Delivery Address */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Delivery address</h3>
                  <p className="text-sm text-gray-500">Behind Ikeja city mall, Opic roundabout, Ikeja, Lagos State.</p>
                </div>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={handleCheckout}
                >
                  Change
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <ShoppingCart className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Payment Method</h3>
                  <p className="text-sm text-gray-500">How would you like to pay</p>
                </div>
                <Button
                  variant="outline"
                  className="text-red-500 border-red-500 hover:bg-red-50"
                  onClick={handleCheckout}
                >
                  Choose
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 border-0 shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-6">Payment Summary</h3>

              {/* Promo Code */}
              <div className="flex items-center p-3 bg-orange-50 rounded-lg mb-6">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                  <Package className="w-4 h-4 text-orange-600" />
                </div>
                <span className="text-orange-600 font-medium">Use promo code</span>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₦{cart.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery fee</span>
                  <span className="font-medium">₦750</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service fee</span>
                  <span className="font-medium">₦250</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg">₦{(cart.totalAmount + 750 + 250).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 rounded-lg"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const renderOrdersList = (orders, emptyMessage) => {
    if (orders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-24 h-24 mb-6 text-gray-300">
            <Package className="w-full h-full" />
          </div>
          <h3 className="text-xl font-medium mb-2">{emptyMessage}</h3>
          <p className="text-gray-500 mb-6">Check back later for updates</p>
          <Button
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            onClick={() => router.push("/")}
          >
            Browse Restaurants
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-sm"
            onClick={() => router.push(`/orders/${order.id}`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  {order.orderedProducts && order.orderedProducts[0] ? (
                    <Image
                      src={`/diverse-food-spread.png?height=64&width=64&query=food ${order.orderedProducts[0].name}`}
                      alt={order.orderedProducts[0].name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold text-lg">
                        {order.orderedProducts && order.orderedProducts[0] ? order.orderedProducts[0].name : "Order"}
                        {order.orderedProducts && order.orderedProducts.length > 1
                          ? ` + ${order.orderedProducts.length - 1} more`
                          : ""}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Order #{order.orderReferenceCode || order.id.substring(0, 8)}
                      </p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>
                          {new Date(order.timeCreated).toLocaleDateString()} at{" "}
                          {new Date(order.timeCreated).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₦{(order.billing?.pricing?.grandTotal || 0).toLocaleString()}</p>
                      <Badge
                        className={`mt-2 ${
                          order.orderStatus === "completed"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : order.orderStatus === "ongoing"
                              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                        }`}
                      >
                        {order.orderStatus === "completed"
                          ? "Completed"
                          : order.orderStatus === "ongoing"
                            ? "Ongoing"
                            : "Pending"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold mb-8">Orders</h1>

          <Tabs defaultValue="cart" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white shadow-sm">
              <TabsTrigger
                value="cart"
                className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>My Cart</span>
                {cart.totalItems > 0 && <Badge className="ml-1 bg-red-500 text-white">{cart.totalItems}</Badge>}
              </TabsTrigger>
              <TabsTrigger
                value="ongoing"
                className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <Package className="w-4 h-4" />
                <span>Ongoing</span>
                {ongoingOrders.length > 0 && (
                  <Badge className="ml-1 bg-blue-500 text-white">{ongoingOrders.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Completed</span>
              </TabsTrigger>
            </TabsList>

            {isLoading && activeTab !== "cart" ? (
              <div className="flex justify-center py-12">
                <AnimatedLoader />
              </div>
            ) : (
              <>
                <TabsContent value="cart">{renderCartTab()}</TabsContent>
                <TabsContent value="ongoing">{renderOrdersList(ongoingOrders, "No ongoing orders")}</TabsContent>
                <TabsContent value="completed">{renderOrdersList(completedOrders, "No completed orders")}</TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}

























// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Image from "next/image"
// import { useAppContext } from "@/context/app-context"
// import { orderAPI } from "@/lib/api"
// import { Button } from "@/app/components/ui/button"
// import { Card, CardContent } from "@/app/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
// import { ShoppingCart, Package, CheckCircle, Trash2, Plus, Minus } from "lucide-react"
// import AnimatedLoader from "@/app/components/ui/animated-loader"
// import ProtectedRoute from "@/app/components/protected-route"

// export default function OrdersPage() {
//   const router = useRouter()
//   const { user, cart, updateCartItem, removeFromCart } = useAppContext()
//   const [activeTab, setActiveTab] = useState("cart")
//   const [ongoingOrders, setOngoingOrders] = useState([])
//   const [completedOrders, setCompletedOrders] = useState([])
//   const [isLoading, setIsLoading] = useState(true)

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!user) return

//       try {
//         setIsLoading(true)
//         const orders = await orderAPI.getOrders()

//         // Filter orders based on status
//         setOngoingOrders(orders.filter((order) => order.orderStatus === "ongoing" || order.orderStatus === "pending"))
//         setCompletedOrders(orders.filter((order) => order.orderStatus === "completed"))
//       } catch (error) {
//         console.error("Failed to fetch orders:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchOrders()
//   }, [user])

//   const handleQuantityChange = async (itemId, currentQuantity, change) => {
//     const newQuantity = Math.max(1, currentQuantity + change)
//     try {
//       await updateCartItem(itemId, newQuantity)
//     } catch (error) {
//       console.error("Failed to update cart item:", error)
//     }
//   }

//   const handleRemoveItem = async (itemId) => {
//     try {
//       await removeFromCart(itemId)
//     } catch (error) {
//       console.error("Failed to remove item from cart:", error)
//     }
//   }

//   const handleCheckout = () => {
//     router.push("/checkout")
//   }

//   const renderCartTab = () => {
//     if (cart.items.length === 0) {
//       return (
//         <div className="flex flex-col items-center justify-center py-16">
//           <div className="w-24 h-24 mb-6 text-gray-300">
//             <ShoppingCart className="w-full h-full" />
//           </div>
//           <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
//           <p className="text-gray-500 mb-6">Add items to your cart to get started</p>
//           <Button className="gradient-button" onClick={() => router.push("/home")}>
//             Browse Restaurants
//           </Button>
//         </div>
//       )
//     }

//     return (
//       <div className="space-y-6">
//         <div className="space-y-4">
//           {cart.items.map((item) => (
//             <Card key={item.id} className="overflow-hidden">
//               <CardContent className="p-0">
//                 <div className="flex items-center p-4">
//                   <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
//                     <Image
//                       src={item.imageUrl || `/placeholder.svg?height=80&width=80&query=food ${item.name}`}
//                       alt={item.name}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                   <div className="ml-4 flex-1">
//                     <div className="flex justify-between">
//                       <h3 className="font-medium">{item.name}</h3>
//                       <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
//                     </div>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {item.options &&
//                         Object.entries(item.options)
//                           .map(([key, value]) => `${key}: ${value}`)
//                           .join(", ")}
//                     </p>
//                     <div className="flex items-center justify-between mt-2">
//                       <div className="flex items-center border rounded-md">
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8"
//                           onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
//                           disabled={item.quantity <= 1}
//                         >
//                           <Minus className="w-4 h-4" />
//                         </Button>
//                         <span className="w-8 text-center">{item.quantity}</span>
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="icon"
//                           className="h-8 w-8"
//                           onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
//                         >
//                           <Plus className="w-4 h-4" />
//                         </Button>
//                       </div>
//                       <Button
//                         variant="ghost"
//                         size="icon"
//                         className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                         onClick={() => handleRemoveItem(item.id)}
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         <Card>
//           <CardContent className="p-4">
//             <h3 className="font-medium mb-4">Order Summary</h3>
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Subtotal</span>
//                 <span>₦{cart.totalAmount.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Delivery Fee</span>
//                 <span>₦750</span>
//               </div>
//               <div className="flex justify-between">
//                 <span className="text-gray-600">Service Fee</span>
//                 <span>₦250</span>
//               </div>
//               <div className="border-t pt-2 mt-2">
//                 <div className="flex justify-between font-medium">
//                   <span>Total</span>
//                   <span>₦{(cart.totalAmount + 750 + 250).toLocaleString()}</span>
//                 </div>
//               </div>
//             </div>
//             <Button className="w-full mt-4 gradient-button" onClick={handleCheckout}>
//               Proceed to Checkout
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     )
//   }

//   const renderOrdersList = (orders, emptyMessage) => {
//     if (orders.length === 0) {
//       return (
//         <div className="flex flex-col items-center justify-center py-16">
//           <div className="w-24 h-24 mb-6 text-gray-300">
//             <Package className="w-full h-full" />
//           </div>
//           <h3 className="text-xl font-medium mb-2">{emptyMessage}</h3>
//           <p className="text-gray-500 mb-6">Check back later for updates</p>
//           <Button className="gradient-button" onClick={() => router.push("/home")}>
//             Browse Restaurants
//           </Button>
//         </div>
//       )
//     }

//     return (
//       <div className="space-y-4">
//         {orders.map((order) => (
//           <Card
//             key={order.id}
//             className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
//             onClick={() => router.push(`/orders/${order.id}`)}
//           >
//             <CardContent className="p-4">
//               <div className="flex items-start">
//                 <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
//                   {order.orderedProducts && order.orderedProducts[0] ? (
//                     <Image
//                       src={`/diverse-food-spread.png?height=64&width=64&query=food ${order.orderedProducts[0].name}`}
//                       alt={order.orderedProducts[0].name}
//                       fill
//                       className="object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-gray-200 flex items-center justify-center">
//                       <Package className="w-8 h-8 text-gray-400" />
//                     </div>
//                   )}
//                 </div>
//                 <div className="ml-4 flex-1">
//                   <div className="flex justify-between">
//                     <div>
//                       <h3 className="font-medium">
//                         {order.orderedProducts && order.orderedProducts[0] ? order.orderedProducts[0].name : "Order"}
//                         {order.orderedProducts && order.orderedProducts.length > 1
//                           ? ` + ${order.orderedProducts.length - 1} more`
//                           : ""}
//                       </h3>
//                       <p className="text-sm text-gray-500 mt-1">
//                         Order #{order.orderReferenceCode || order.id.substring(0, 8)}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         {new Date(order.timeCreated).toLocaleDateString()} at{" "}
//                         {new Date(order.timeCreated).toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-medium">₦{(order.billing?.pricing?.grandTotal || 0).toLocaleString()}</p>
//                       <div
//                         className={`mt-1 text-xs px-2 py-1 rounded-full inline-block ${
//                           order.orderStatus === "completed"
//                             ? "bg-green-100 text-green-800"
//                             : order.orderStatus === "ongoing"
//                               ? "bg-blue-100 text-blue-800"
//                               : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {order.orderStatus === "completed"
//                           ? "Completed"
//                           : order.orderStatus === "ongoing"
//                             ? "Ongoing"
//                             : "Pending"}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     )
//   }

//   return (
//     <ProtectedRoute>
//       <div className="container px-4 py-8 mx-auto">
//         <h1 className="text-2xl font-bold mb-6">Orders</h1>

//         <Tabs defaultValue="cart" value={activeTab} onValueChange={setActiveTab}>
//           <TabsList className="grid w-full grid-cols-3 mb-8">
//             <TabsTrigger value="cart" className="flex items-center gap-2">
//               <ShoppingCart className="w-4 h-4" />
//               <span>My Cart</span>
//               {cart.items.length > 0 && (
//                 <span className="ml-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                   {cart.items.length}
//                 </span>
//               )}
//             </TabsTrigger>
//             <TabsTrigger value="ongoing" className="flex items-center gap-2">
//               <Package className="w-4 h-4" />
//               <span>Ongoing</span>
//               {ongoingOrders.length > 0 && (
//                 <span className="ml-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                   {ongoingOrders.length}
//                 </span>
//               )}
//             </TabsTrigger>
//             <TabsTrigger value="completed" className="flex items-center gap-2">
//               <CheckCircle className="w-4 h-4" />
//               <span>Completed</span>
//             </TabsTrigger>
//           </TabsList>

//           {isLoading && activeTab !== "cart" ? (
//             <div className="flex justify-center py-12">
//               <AnimatedLoader />
//             </div>
//           ) : (
//             <>
//               <TabsContent value="cart">{renderCartTab()}</TabsContent>
//               <TabsContent value="ongoing">{renderOrdersList(ongoingOrders, "No ongoing orders")}</TabsContent>
//               <TabsContent value="completed">{renderOrdersList(completedOrders, "No completed orders")}</TabsContent>
//             </>
//           )}
//         </Tabs>
//       </div>
//     </ProtectedRoute>
//   )
// }
