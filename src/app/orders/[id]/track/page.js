"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { orderAPI } from "@/lib/api"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Home, FileText } from "lucide-react"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import OrderRatingModal from "@/app/components/modals/order-rating-modal"
import ProtectedRoute from "@/app/components/protected-route"
import Link from 'next/link';

export default function TrackOrderPage() {
  const params = useParams()
  const router = useRouter()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(0)
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false)
  const [trackingCode, setTrackingCode] = useState("")

  // Define the tracking steps
  const trackingSteps = [
    { id: "accepted", label: "Order accepted", description: "Vendor has received your order" },
    { id: "preparing", label: "Preparing order", description: "Vendor is preparing your order" },
    { id: "assigned", label: "Assigned to a rider", description: "Your order has been assigned to a rider" },
    { id: "vendor", label: "Rider now at the vendor", description: "Your rider has arrived at the vendor" },
    { id: "ready", label: "Rider ready to pickup order", description: "Your rider is on the way" },
    { id: "address", label: "Rider now at your address", description: "The rider is around to deliver your order" },
    { id: "delivered", label: "Order delivered", description: "Your order has been delivered" },
  ]

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true)
        const result = await orderAPI.getOrderById(params.id)
        const orderData = result.data
        setOrder(orderData)

        // Set tracking code
        setTrackingCode(orderData.orderReferenceCode || orderData.id.substring(0, 8))

        // Determine current step based on order status
        const statusToStep = {
          partnerAccepted: 0,
          preparing: 1,
          riderAccepted: 2,
          riderAtPartner: 3,
          riderPickedUp: 4,
          riderAtCustomer: 5,
          delivered: 6,
        }

        const step = statusToStep[orderData.orderNavigationStatus] || 0
        setCurrentStep(step)

        // If order is delivered, show rating modal after 2 seconds
        if (orderData.orderNavigationStatus === "delivered" && !orderData.rating) {
          setTimeout(() => {
            setIsRatingModalOpen(true)
          }, 2000)
        }
      } catch (error) {
        console.error("Failed to fetch order:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()

    // Set up polling for order status updates
    const intervalId = setInterval(fetchOrder, 30000) // Poll every 30 seconds

    return () => clearInterval(intervalId)
  }, [params.id])

  const formatTime = (timestamp) => {
    if (!timestamp) return ""
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
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
        <Button className="mt-6 gradient-button" asChild>
          <Link href="/home"> Go back home </Link>
        </Button>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center mb-6 text-sm">
          <Link href="/home" className="text-gray-500 hover:text-gray-700"> Home </Link>
          <span className="mx-2">/</span>
          <Link href="/orders" className="text-gray-500 hover:text-gray-700">Orders </Link>
          <span className="mx-2">/</span>
          <span className="font-medium">Track Order</span>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
          <CardContent className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Stay updated on the status of your delivery</h1>
            <p className="text-white/80">Share this code with your rider</p>
            <div className="flex justify-center mt-4">
              <div className="bg-white text-black text-xl font-bold py-2 px-6 rounded-md">{trackingCode}</div>
            </div>
          </CardContent>
        </Card>

        <div className="relative">
          {/* Timeline */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {/* Steps */}
          <div className="space-y-8">
            {trackingSteps.map((step, index) => (
              <div key={step.id} className="flex items-start">
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center z-10 ${
                      index <= currentStep ? "bg-accent text-white" : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <span className="text-lg font-bold">{index + 1}</span>
                  </div>
                </div>
                <div className="ml-6 flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{step.label}</h3>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                    {index <= currentStep && (
                      <span className="text-sm text-gray-500">
                        {formatTime(order.orderProcessing?.orderTracking?.[step.id])}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full mt-8">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 flex-1"
            onClick={() => router.push("/")}
          >
            <Home className="w-4 h-4" />
            Go home
          </Button>

          <Button
            className="flex items-center justify-center gap-2 flex-1 gradient-button"
            onClick={() => router.push(`/orders/${params.id}`)}
          >
            <FileText className="w-4 h-4" />
            View Order Details
          </Button>
        </div>

        {/* Rating Modal */}
        <OrderRatingModal isOpen={isRatingModalOpen} onClose={() => setIsRatingModalOpen(false)} orderId={params.id} />
      </div>
    </ProtectedRoute>
  )
}
