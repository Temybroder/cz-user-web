"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useAppContext } from "@/context/app-context"
import { orderAPI, paymentAPI } from "@/lib/api"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { ChevronRight, MapPin, CreditCard, Gift, Plus, Minus, Trash2 } from "lucide-react"
import AddressModal from "@/app/components/modals/address-modal"
import PaymentMethodModal from "@/app/components/modals/payment-method-modal"
import GiftModal from "@/app/components/modals/gift-modal"
import PaymentSuccessModal from "@/app/components/modals/payment-success-modal"
import PaymentFailureModal from "@/app/components/modals/payment-failure-modal"
import InsufficientBalanceModal from "@/app/components/modals/insufficient-balance-modal"
import LoginModal from "@/app/components/modals/login-modal"


export default function CheckoutPage() {
  const router = useRouter()
  const { user, cart, selectedAddress, clearCart, authChecked, updateCartItem, removeFromCart } = useAppContext()

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isGiftModalOpen, setIsGiftModalOpen] = useState(false)
  const [isPaymentSuccessModalOpen, setIsPaymentSuccessModalOpen] = useState(false)
  const [isPaymentFailureModalOpen, setIsPaymentFailureModalOpen] = useState(false)
  const [isInsufficientBalanceModalOpen, setIsInsufficientBalanceModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isPickup, setIsPickup] = useState(false)
  const [isGift, setIsGift] = useState(false)
  const [giftDetails, setGiftDetails] = useState(null)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)
  const [paymentError, setPaymentError] = useState("")

  // Calculate totals
  const subtotal = cart.totalAmount
  const deliveryFee = isPickup ? 0 : 750
  const serviceFee = 250
  const total = subtotal + deliveryFee + serviceFee

  useEffect(() => {
    // Redirect to home if cart is empty
    if (cart.items.length === 0) {
      router.push("/home")
    }

    // Check if user is authenticated after auth check is complete
    if (authChecked && !user) {
      setIsLoginModalOpen(true)
    }
  }, [cart.items.length, router, authChecked, user])

  const handleAddressSelect = (address) => {
    setIsAddressModalOpen(false)
  }

  const handlePaymentMethodSelect = (method) => {
    setSelectedPaymentMethod(method)
    setIsPaymentModalOpen(false)
  }

  const handleGiftSubmit = (details) => {
    setGiftDetails(details)
    setIsGift(true)
    setIsGiftModalOpen(false)
  }

  const handleQuantityChange = async (itemId, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change)
    try {
      console.log("Updating cart item quantity:", itemId, "to", newQuantity)
      await updateCartItem(itemId, newQuantity)
    } catch (error) {
      console.error("Failed to update cart item:", error)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      console.log("Removing item from cart:", itemId)
      await removeFromCart(itemId)
    } catch (error) {
      console.error("Failed to remove item from cart:", error)
    }
  }

  const handlePlaceOrder = async () => {
    // Check if user is authenticated
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    if (!selectedPaymentMethod) {
      setIsPaymentModalOpen(true)
      return
    }

    if (!selectedAddress && !isPickup) {
      setIsAddressModalOpen(true)
      return
    }

    setIsPlacingOrder(true)
    setPaymentError("")

    try {
      // Check wallet balance if using wallet
      if (selectedPaymentMethod.type === "wallet") {
        const walletBalance = await paymentAPI.getWalletBalance(user.userId || user._id)

        if (walletBalance < total) {
          setIsInsufficientBalanceModalOpen(true)
          setIsPlacingOrder(false)
          return
        }
      }

      // Prepare order data for backend
      const userId = user.userId || user._id
      const paymentMode = selectedPaymentMethod.type === "wallet" ? 2 : 1

      console.log("Cart items before order:", cart.items)
      console.log("First cart item structure:", cart.items[0])

      const orderData = {
        customerId: userId,
        isPickup: isPickup,
        isGift: isGift,
        giftDetails: isGift ? giftDetails : undefined,
        partnerBusinessBranchId: cart.items[0]?.vendorId || null,
        orderSubTotal: subtotal,
        orderBody: cart.items,
        totalAmount: total,
        deliveryAddress: isPickup ? null : selectedAddress,
        noteToRider: "",
        orderType: "single",
        items: cart.items.map((item) => ({
          productId: item.productId || item.id,  // Use actual product ID, fallback to cart item ID
          quantity: item.quantity,
          price: item.price,
          options: item.options || {}
        })),
        deliveryFee: deliveryFee,
        serviceFee: serviceFee,
        paymentMode: paymentMode,
        currency: "NGN"
      }

      console.log("Prepared order data:", orderData)
      console.log("Items array in order:", orderData.items)

      // Process payment through backend
      const paymentResult = await paymentAPI.initializePaymentAndOrder(orderData)

      if (paymentResult.success) {
        // Check payment mode
        if (paymentMode === 1) {
          // Card payment - redirect to Paystack
          if (paymentResult.data?.authorization_url) {
            console.log("Redirecting to Paystack:", paymentResult.data.authorization_url)
            window.location.href = paymentResult.data.authorization_url
          } else {
            throw new Error("Payment gateway URL not received")
          }
        } else if (paymentMode === 2) {
          // Wallet payment - order created successfully
          console.log("Wallet payment successful")

          // Clear cart
          await clearCart()

          // Show success modal
          setIsPaymentSuccessModalOpen(true)
        }
      } else {
        // Handle payment failure
        const errorMsg = paymentResult.message || "Payment failed. Please try again."
        if (errorMsg.includes("Insufficient wallet balance") || errorMsg.includes("insufficient balance")) {
          setIsInsufficientBalanceModalOpen(true)
        } else {
          setPaymentError(errorMsg)
          setIsPaymentFailureModalOpen(true)
        }
      }
    } catch (error) {
      console.error("Failed to place order:", error)
      setPaymentError(error.message || "An error occurred while processing your order.")
      setIsPaymentFailureModalOpen(true)
    } finally {
      setIsPlacingOrder(false)
    }
  }

  const handlePaymentSuccess = () => {
    setIsPaymentSuccessModalOpen(false)
    router.push("/orders")
  }

  const handleGoHome = () => {
    setIsPaymentSuccessModalOpen(false)
    router.push("/home")
  }

  const handleRetryPayment = () => {
    setIsPaymentFailureModalOpen(false)
    setIsPaymentModalOpen(true)
  }

  if (cart.items.length === 0) {
    return null // Will redirect in useEffect
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center mb-8 text-sm">
            <Link href="/home" className="text-gray-500 hover:text-gray-700 transition-colors">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <Link href="/orders" className="text-gray-500 hover:text-gray-700 transition-colors">
              Cart
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
            <span className="font-medium text-gray-900">Checkout</span>
          </div>

          <h1 className="text-3xl font-bold mb-8 text-gray-900">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900">
                    {cart.totalItems} Order{cart.totalItems !== 1 ? "s" : ""} from Super foods
                  </h2>

                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-center p-4 bg-gray-50 rounded-xl">
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={item.imageUrl || `/placeholder.svg?height=64&width=64&query=food ${item.name}`}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                              {item.options && Object.keys(item.options).length > 0 && (
                                <p className="text-sm text-gray-500 mt-1">
                                  {Object.entries(item.options)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(", ")}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-lg text-gray-900">
                                ₦{(item.price * item.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                              <button
                                type="button"
                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-l-lg"
                                onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <button
                                type="button"
                                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-r-lg"
                                onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <button
                              type="button"
                              className="flex items-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg px-3 py-1"
                              onClick={() => handleRemoveItem(item.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pickup Option */}
              <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-200 mr-4">
                        <MapPin className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Pick up</h3>
                        <p className="text-sm text-gray-500">Pick up your order yourself</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="pickup"
                        checked={isPickup}
                        onChange={() => setIsPickup(!isPickup)}
                        className="w-5 h-5 text-red-500 border-gray-300 rounded focus:ring-red-500"
                      />
                      <label htmlFor="pickup" className="ml-2 text-sm font-medium text-gray-900">
                        Pick up
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Address */}
              {!isPickup && (
                <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-green-100 to-green-200 mr-4">
                          <MapPin className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">Delivery address</h3>
                          {selectedAddress ? (
                            <p className="text-sm text-gray-500">{selectedAddress.fullAddress}</p>
                          ) : (
                            <p className="text-sm text-gray-500">Please select a delivery address</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl"
                        onClick={() => setIsAddressModalOpen(true)}
                      >
                        Change
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Send as Gift */}
              <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 mr-4">
                        <Gift className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Send as a gift</h3>
                        {isGift && giftDetails ? (
                          <p className="text-sm text-gray-500">To: {giftDetails.recipientName}</p>
                        ) : (
                          <p className="text-sm text-gray-500">Add their details to the delivery information.</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsGiftModalOpen(true);
                      }}
                      type="button"
                    >
                      {isGift ? "Change" : "Add"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-orange-200 mr-4">
                        <CreditCard className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Payment Method</h3>
                        {selectedPaymentMethod ? (
                          <p className="text-sm text-gray-500">{selectedPaymentMethod.name}</p>
                        ) : (
                          <p className="text-sm text-gray-500">How would you like to pay</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-50 rounded-xl"
                      onClick={() => setIsPaymentModalOpen(true)}
                    >
                      {selectedPaymentMethod ? "Change" : "Choose"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Payment Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4 shadow-2xl border-0 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6 text-gray-900">Payment Summary</h2>

                  {/* Promo Code */}
                  <div className="flex items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center mr-3">
                      <Gift className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-orange-600 font-semibold">Use promo code</span>
                  </div>

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
                    className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder}
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
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelectAddress={handleAddressSelect}
      />

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onSelectPaymentMethod={handlePaymentMethodSelect}
      />

      {/* Gift Modal */}
      <GiftModal
        isOpen={isGiftModalOpen}
        onClose={() => setIsGiftModalOpen(false)}
        onSubmit={handleGiftSubmit}
        initialData={giftDetails}
      />

      {/* Payment Success Modal */}
      <PaymentSuccessModal
        isOpen={isPaymentSuccessModalOpen}
        onClose={() => setIsPaymentSuccessModalOpen(false)}
        onGoHome={handleGoHome}
        onTrackOrder={handlePaymentSuccess}
      />

      {/* Payment Failure Modal */}
      <PaymentFailureModal
        isOpen={isPaymentFailureModalOpen}
        onClose={() => setIsPaymentFailureModalOpen(false)}
        onRetry={handleRetryPayment}
        errorMessage={paymentError}
      />

      {/* Insufficient Balance Modal */}
      <InsufficientBalanceModal
        isOpen={isInsufficientBalanceModalOpen}
        onClose={() => setIsInsufficientBalanceModalOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} redirectAfterLogin="/checkout" />
    </>
  )
}