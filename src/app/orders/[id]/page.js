"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { orderAPI } from "@/lib/api"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import { ArrowLeft, MapPin, Clock, Phone, Truck, Star } from "lucide-react"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"

export default function OrderDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        const result = await orderAPI.getOrderById(params.id)
        const orderData = result.data
        setOrder(orderData)
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [params.id])

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      preparing: "bg-orange-100 text-orange-800",
      ready: "bg-purple-100 text-purple-800",
      delivered: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    }
    return statusColors[status] || "bg-gray-100 text-gray-800"
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AnimatedLoader fullScreen />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container px-4 py-16 mx-auto text-center">
        <h1 className="text-2xl font-bold">Order not found</h1>
        <p className="mt-4 text-gray-600">The order you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button className="mt-6 gradient-button" onClick={() => router.push("/orders")}>
          Back to Orders
        </Button>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container px-4 py-8 mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Order Details</h1>
            <p className="text-gray-600">Order #{order.orderReferenceCode || order.id.substring(0, 8)}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Order Status</CardTitle>
                  <Badge className={getStatusColor(order.orderNavigationStatus)}>
                    {order.orderNavigationStatus?.replace(/([A-Z])/g, " $1").trim() || "Pending"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium">Ordered on</p>
                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                </div>
                {order.estimatedDeliveryTime && (
                  <div className="flex items-center gap-4 mt-4">
                    <Truck className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Estimated Delivery</p>
                      <p className="text-sm text-gray-600">{formatDate(order.estimatedDeliveryTime)}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader>
                <CardTitle>Order Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Image
                        src={item.image || "/placeholder.svg?height=60&width=60"}
                        alt={item.name}
                        className="w-15 h-15 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                          <span className="text-sm font-medium">{formatCurrency(item.price)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Vendor Information */}
            {order.vendor && (
              <Card>
                <CardHeader>
                  <CardTitle>Vendor Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <Image
                      src={order.vendor.image || "/placeholder.svg?height=60&width=60"}
                      alt={order.vendor.name}
                      className="w-15 h-15 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{order.vendor.name}</h4>
                      <p className="text-sm text-gray-600">{order.vendor.address}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">{order.vendor.rating || "N/A"}</span>
                      </div>
                    </div>
                    {order.vendor.phone && (
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(order.deliveryFee || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Fee</span>
                  <span>{formatCurrency(order.serviceFee || 0)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatCurrency(order.discount)}</span>
                  </div>
                )}
                <hr />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="font-medium">{order.deliveryAddress?.name}</p>
                    <p className="text-sm text-gray-600">{order.deliveryAddress?.address}</p>
                    <p className="text-sm text-gray-600">{order.deliveryAddress?.city}</p>
                    {order.deliveryAddress?.phone && (
                      <p className="text-sm text-gray-600 mt-1">{order.deliveryAddress.phone}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Method</span>
                    <span className="capitalize">{order.paymentMethod || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status</span>
                    <Badge
                      className={
                        order.paymentStatus === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {order.paymentStatus || "Pending"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button className="w-full gradient-button" onClick={() => router.push(`/orders/${params.id}/track`)}>
                <Truck className="w-4 h-4 mr-2" />
                Track Order
              </Button>

              {order.orderNavigationStatus === "delivered" && !order.rating && (
                <Button variant="outline" className="w-full bg-transparent">
                  <Star className="w-4 h-4 mr-2" />
                  Rate Order
                </Button>
              )}

              {["pending", "confirmed"].includes(order.orderNavigationStatus) && (
                <Button variant="outline" className="w-full text-red-600 hover:text-red-700 bg-transparent">
                  Cancel Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
