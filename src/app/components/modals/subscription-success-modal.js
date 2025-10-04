"use client"

import { useRouter } from "next/navigation"
import { CheckCircle, Calendar, Truck, Home } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent } from "@/app/components/ui/dialog"
import { Card, CardContent } from "@/app/components/ui/card"

export default function SubscriptionSuccessModal({ isOpen, onClose, subscriptionData }) {
  const router = useRouter()

  const handleGoHome = () => {
    onClose()
    router.push("/home")
  }

  const handleViewSubscriptions = () => {
    onClose()
    router.push("/subscriptions/active")
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-white rounded-3xl border-0 shadow-2xl">
        <Card className="border-0 shadow-none">
          <CardContent className="p-8 text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Order Confirmed! 🎉</h2>

            {/* Description */}
            <p className="text-gray-600 mb-6 leading-relaxed">
              Your subscription order has been confirmed successfully. Get ready to enjoy delicious, healthy meals
              delivered to your door!
            </p>

            {/* Subscription Details */}
            {subscriptionData && (
              <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-3 text-center">Subscription Details</h3>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Start Date</p>
                      <p className="text-xs text-gray-600">{formatDate(subscriptionData.startDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                      <Truck className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Delivery Days</p>
                      <p className="text-xs text-gray-600">
                        {subscriptionData.deliveryFrequency?.days?.join(", ") || "Not specified"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleViewSubscriptions}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                View My Subscriptions
              </Button>

              <Button
                onClick={handleGoHome}
                variant="outline"
                className="w-full py-3 rounded-2xl font-medium border-gray-200 hover:bg-gray-50 bg-transparent"
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
