"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronRight, Calendar, MapPin, CreditCard, Package, CheckCircle, Clock, Home } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { Badge } from "@/app/components/ui/badge"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"
import { paymentAPI } from "@/lib/api"

export default function ActiveSubscriptionsPage() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const data = await paymentAPI.getUserSubscriptions()
      setSubscriptions(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Error fetching subscriptions:", err)
      setError(err.message || "Failed to fetch subscriptions")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatCurrency = (amount) => {
    return `₦${Number(amount).toLocaleString()}`
  }

  const getStatusBadge = (subscription) => {
    if (!subscription.isActive) {
      return <Badge variant="secondary" className="bg-gray-200 text-gray-700">Inactive</Badge>
    }

    const endDate = new Date(subscription.endDate)
    const today = new Date()

    if (endDate < today) {
      return <Badge variant="secondary" className="bg-orange-100 text-orange-700">Expired</Badge>
    }

    return <Badge className="bg-green-100 text-green-700">Active</Badge>
  }

  const getOrderStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
      confirmed: { color: "bg-blue-100 text-blue-700", icon: CheckCircle },
      preparing: { color: "bg-purple-100 text-purple-700", icon: Package },
      in_transit: { color: "bg-indigo-100 text-indigo-700", icon: Package },
      delivered: { color: "bg-green-100 text-green-700", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-700", icon: Clock },
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status?.replace('_', ' ')}
      </Badge>
    )
  }

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <AnimatedLoader />
        </div>
      </ProtectedRoute>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Card className="max-w-md">
            <CardContent className="p-8 text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchSubscriptions}>Retry</Button>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-500 mb-8">
            <Link href="/home" className="hover:text-gray-700 transition-colors flex items-center">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <ChevronRight size={16} className="mx-2" />
            <span className="text-gray-700 font-medium">My Subscriptions</span>
          </div>

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Subscriptions</h1>
            <Button
              onClick={() => router.push("/subscriptions/create")}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            >
              New Subscription
            </Button>
          </div>

          {subscriptions.length === 0 ? (
            <Card className="shadow-lg border-0 rounded-2xl">
              <CardContent className="p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Subscriptions Yet</h3>
                <p className="text-gray-600 mb-6">Start your healthy eating journey today!</p>
                <Button
                  onClick={() => router.push("/subscriptions/create")}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  Create Your First Subscription
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {subscriptions.map((subscription) => (
                <Card key={subscription._id} className="shadow-lg border-0 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {subscription.subscriptionMealPlan?.name || "Subscription Meal Plan"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {subscription.subscriptionMealPlan?.description || "Custom meal plan"}
                        </p>
                      </div>
                      {getStatusBadge(subscription)}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      {/* Subscription Details */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Duration</p>
                            <p className="text-xs text-gray-600">
                              {formatDate(subscription.startDate)} - {formatDate(subscription.endDate)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                            <Package className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Delivery Days</p>
                            <p className="text-xs text-gray-600">
                              {subscription.deliveryDays?.join(", ") || "Not specified"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Total Amount</p>
                            <p className="text-xs text-gray-600">
                              {formatCurrency(subscription.totalAmount)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                            <MapPin className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Delivery Address</p>
                            <p className="text-xs text-gray-600">
                              {subscription.deliveryAddress}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Latest Order (if active) */}
                      {subscription.latestOrder && (
                        <div className="bg-gray-50 rounded-xl p-4">
                          <h4 className="font-semibold text-gray-900 mb-3">Latest Order</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Status</span>
                              {getOrderStatusBadge(subscription.latestOrder.orderStatus)}
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Order Ref</span>
                              <span className="text-sm font-medium text-gray-900">
                                {subscription.latestOrder.orderReferenceCode}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Date</span>
                              <span className="text-sm font-medium text-gray-900">
                                {formatDate(subscription.latestOrder.createdAt)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600">Amount</span>
                              <span className="text-sm font-medium text-gray-900">
                                {formatCurrency(subscription.latestOrder.totalAmountPaid)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl"
                        onClick={() => router.push(`/orders/${subscription.latestOrder?._id}`)}
                        disabled={!subscription.latestOrder}
                      >
                        View Order
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-xl"
                      >
                        Manage Subscription
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  )
}
