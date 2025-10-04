"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, MapPin, CreditCard, Calendar, Truck } from "lucide-react"
import { useAppContext } from "@/context/app-context"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"
import AddressModal from "@/app/components/modals/address-modal"
import PaymentMethodModal from "@/app/components/modals/payment-method-modal"
import SubscriptionSuccessModal from "@/app/components/modals/subscription-success-modal"
import PaymentFailureModal from "@/app/components/modals/payment-failure-modal"
import InsufficientBalanceModal from "@/app/components/modals/insufficient-balance-modal"
import { paymentAPI } from "@/lib/api"

export default function SubscriptionCheckoutPage() {
  const router = useRouter()
  const { user, selectedAddress, setSelectedAddress, addresses } = useAppContext()
  const [subscriptionData, setSubscriptionData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isPaymentFailureModalOpen, setIsPaymentFailureModalOpen] = useState(false)
  const [isInsufficientBalanceModalOpen, setIsInsufficientBalanceModalOpen] = useState(false)
  const [paymentError, setPaymentError] = useState("")

  useEffect(() => {
    // Get subscription data from localStorage
    const storedData = localStorage.getItem("subscriptionData")
    if (!storedData) {
      router.push("/subscriptions/create")
      return
    }

    setSubscriptionData(JSON.parse(storedData))
    setLoading(false)
  }, [router])

  const calculateTotalAmount = () => {
    if (!subscriptionData?.mealPlan) return 0

    return subscriptionData.mealPlan.planDetails.reduce((total, day) => {
      return (
        total +
        day.meals.reduce((dayTotal, meal) => {
          return dayTotal + (meal.totalAmount || 0)
        }, 0)
      )
    }, 0)
  }

  const subtotal = calculateTotalAmount()
  const deliveryFee = 750
  const serviceFee = 250
  const total = subtotal + deliveryFee + serviceFee

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method)
    setIsPaymentModalOpen(false)
  }

  const handleAddressSelect = (address) => {
    console.log("Address selected in checkout:", address)
    setSelectedAddress(address)
    setIsAddressModalOpen(false)
  }

  const handlePlaceOrder = async () => {
    console.log("Place Order clicked - selectedPaymentMethod:", selectedPaymentMethod)
    console.log("Place Order clicked - selectedAddress:", selectedAddress)

    if (!selectedPaymentMethod) {
      console.log("No payment method, opening payment modal")
      setIsPaymentModalOpen(true)
      return
    }

    if (!selectedAddress) {
      console.log("No address selected, opening address modal")
      setIsAddressModalOpen(true)
      return
    }

    setIsPlacingOrder(true)
    setPaymentError("")

    try {
      const userId = user.userId || user._id

      // Determine payment mode: 1 = Card/Paystack, 2 = Wallet
      const paymentMode = selectedPaymentMethod.type === "wallet" ? 2 : 1

      console.log("Processing payment - Mode:", paymentMode, "Method:", selectedPaymentMethod)

      // Get meal plan ID - need to get it from the stored meal plan
      const storedMealPlan = localStorage.getItem("selectedSubscriptionMealPlan")
      let mealPlanId = null

      if (storedMealPlan) {
        const parsedPlan = JSON.parse(storedMealPlan)
        mealPlanId = parsedPlan._id || parsedPlan.id
      }

      if (!mealPlanId) {
        throw new Error("Meal plan ID not found. Please restart the subscription process.")
      }

      // Calculate end date (30 days from start)
      const startDate = new Date(subscriptionData.startDate)
      const endDate = new Date(startDate)
      endDate.setDate(endDate.getDate() + 30)

      const payload = {
        customerId: userId,
        mealPlanId: mealPlanId,
        deliveryDays: subscriptionData.deliveryFrequency.days,
        deliveryAddress: selectedAddress.fullAddress,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        currency: "NGN",
        totalAmount: total,
        paymentMode: paymentMode,
      }

      console.log("Sending subscription payment request:", payload)

      const result = await paymentAPI.processPayAndSubscribe(payload)
      console.log("Payment result:", result)

      if (result.success) {
        if (paymentMode === 1) {
          // Paystack payment - redirect to authorization URL
          if (result.data?.authorization_url) {
            console.log("Redirecting to Paystack:", result.data.authorization_url)
            window.location.href = result.data.authorization_url
          } else {
            throw new Error("Payment gateway URL not received")
          }
        } else if (paymentMode === 2) {
          // Wallet payment - subscription created successfully
          console.log("Wallet payment successful")

          // Clear subscription data
          localStorage.removeItem("subscriptionData")
          localStorage.removeItem("selectedSubscriptionMealPlan")

          // Show success modal
          setIsSuccessModalOpen(true)
        }
      } else {
        // Payment failed - check if it's insufficient balance
        const errorMsg = result.message || "Payment initialization failed"
        if (errorMsg.includes("Insufficient wallet balance") || errorMsg.includes("insufficient balance")) {
          setIsInsufficientBalanceModalOpen(true)
        } else {
          setPaymentError(errorMsg)
          setIsPaymentFailureModalOpen(true)
        }
      }
    } catch (error) {
      console.error("Error placing subscription order:", error)

      // Check for insufficient balance error
      if (error.message?.includes("Insufficient wallet balance") || error.message?.includes("insufficient balance")) {
        setIsInsufficientBalanceModalOpen(true)
      } else {
        setPaymentError(error.message || "An error occurred while processing your subscription")
        setIsPaymentFailureModalOpen(true)
      }
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <AnimatedLoader />
      </div>
    )
  }

  if (!subscriptionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No subscription data found</h1>
          <Button onClick={() => router.push("/subscriptions/create")}>Start Subscription</Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <Link href="/" className="hover:text-gray-700 transition-colors">
              Home
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <Link href="/subscriptions" className="hover:text-gray-700 transition-colors">
              Super foods
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-700 font-medium">Checkout</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Subscription Orders */}
              <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Orders</h2>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200">
                      <Image
                        src="/placeholder.svg?height=64&width=64"
                        alt="Subscription meals"
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{subscriptionData.deliveryFrequency.frequency}</h3>
                      <p className="text-sm text-gray-500">Weekly plan</p>
                      <p className="font-medium text-green-600">₦{subtotal.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Delivery address</h3>
                        <p className="text-sm text-gray-500">
                          {selectedAddress?.fullAddress || "Please select a delivery address"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddressModalOpen(true)}
                      className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Payment Method</h3>
                        <p className="text-sm text-gray-500">
                          {selectedPaymentMethod?.name || "How would you like to pay"}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setIsPaymentModalOpen(true)}
                      className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl"
                    >
                      {selectedPaymentMethod ? "Change" : "Choose"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Content - Payment Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 shadow-2xl border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Summary</h2>

                  {/* Subscription Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Start Date</p>
                        <p className="text-xs text-gray-500">{formatDate(subscriptionData.startDate)}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Truck className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Delivery Days</p>
                        <p className="text-xs text-gray-500">{subscriptionData.deliveryFrequency.days.join(", ")}</p>
                      </div>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">₦{subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Delivery fee</span>
                      <span className="font-semibold text-gray-900">₦{deliveryFee.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Service fee</span>
                      <span className="font-semibold text-gray-900">₦{serviceFee.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-200 mb-6">
                    <span className="font-bold text-xl text-gray-900">Total</span>
                    <span className="font-bold text-xl text-gray-900">₦{total.toLocaleString()}</span>
                  </div>

                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isPlacingOrder ? "Processing..." : "Place Order"}
                  </Button>

                  <p className="mt-4 text-xs text-center text-gray-500">
                    By clicking the button, you agree to our terms and conditions
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Modals */}
        <AddressModal
          isOpen={isAddressModalOpen}
          onClose={() => setIsAddressModalOpen(false)}
          onSelectAddress={handleAddressSelect}
        />

        <PaymentMethodModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          onSelectPaymentMethod={handlePaymentMethodSelect}
        />

        <SubscriptionSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => setIsSuccessModalOpen(false)}
          subscriptionData={subscriptionData}
        />

        <PaymentFailureModal
          isOpen={isPaymentFailureModalOpen}
          onClose={() => setIsPaymentFailureModalOpen(false)}
          onRetry={() => {
            setIsPaymentFailureModalOpen(false)
            setIsPaymentModalOpen(true)
          }}
          errorMessage={paymentError}
        />

        <InsufficientBalanceModal
          isOpen={isInsufficientBalanceModalOpen}
          onClose={() => setIsInsufficientBalanceModalOpen(false)}
        />
      </div>
    </ProtectedRoute>
  )
}
