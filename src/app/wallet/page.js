"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { paymentAPI } from "@/lib/api"
import { Button } from "@/app/components/ui/button"
import { useAppContext } from "@/context/app-context"
import Link from "next/link"
import { Card, CardContent } from "@/app/components/ui/card"
// import 
import { Plus, CheckCircle, XCircle } from "lucide-react"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import ProtectedRoute from "@/app/components/protected-route"
import WalletTopUpModal from "@/app/components/modals/wallet-top-up-modal"

export default function WalletPage() {
  const router = useRouter()
  const [balance, setBalance] = useState(0)
    const { user, cart, updateCartItem, removeFromCart } = useAppContext()
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isTopUpModalOpen, setIsTopUpModalOpen] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!user?._id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const { userAPI } = await import("@/lib/api")

        console.log("=== FRONTEND WALLET FETCH ===")
        console.log("Fetching wallet for user:", user._id)
        console.log("User object:", user)

        const walletData = await userAPI.getWalletData(user._id)

        console.log("=== WALLET RESPONSE ===")
        console.log("Full response:", JSON.stringify(walletData, null, 2))
        console.log("Success?:", walletData.success)
        console.log("Data:", walletData.data)
        console.log("Balance:", walletData.data?.balance)
        console.log("Transactions:", walletData.data?.transactions)

        if (walletData.success) {
          const balance = walletData.data.balance || 0
          const transactions = walletData.data.transactions || []

          console.log("Setting balance to:", balance)
          console.log("Setting transactions to:", transactions)

          setBalance(balance)
          setTransactions(transactions)
        } else {
          setError(walletData.message || "Failed to load wallet")
        }
      } catch (error) {
        console.error("Failed to fetch wallet data:", error)
        setError(error.message || "Failed to load wallet. Please contact support.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchWalletData()
  }, [user])

  const handleTopUp = () => {
    setIsTopUpModalOpen(true)
  }

  const handleTopUpSuccess = async (amount) => {
    setIsTopUpModalOpen(false)

    try {
      const { userAPI } = await import("@/lib/api")
      const walletData = await userAPI.getWalletData(user._id)

      if (walletData.success) {
        setBalance(walletData.data.balance || 0)
        setTransactions(walletData.data.transactions || [])
      }
    } catch (error) {
      console.error("Failed to refresh wallet data:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <AnimatedLoader fullScreen />
      </div>
    )
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex justify-center items-center min-h-screen px-4">
          <div className="w-full max-w-md text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-8">
              <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Wallet Not Found</h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="space-y-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-orange-500 hover:bg-orange-600"
                >
                  Retry
                </Button>
                <Link href="/home">
                  <Button variant="outline" className="w-full">
                    Go to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex justify-center px-4 py-8 mx-auto">
        <div className="w-full max-w-3xl">
          <div className="flex items-center mb-6 text-sm">
            <Link href="/home" className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="font-medium">Wallet</span>
          </div>

          <h1 className="text-2xl font-bold mb-8">Wallet</h1>

          {/* Balance Card */}
          <Card className="mb-6">
            <CardContent className="p-0">
              <div className="relative bg-black text-white p-6 rounded-lg">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-yellow-500 opacity-20 -mr-8 -mt-8"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full bg-red-500 opacity-20 -ml-8 -mb-8"></div>
                <div className="absolute top-1/2 right-1/4 w-12 h-12 rounded-full bg-red-500 opacity-10 transform -translate-y-1/2"></div>

                <h2 className="text-gray-300 mb-2">Available balance</h2>
                <div className="text-4xl font-bold">₦{balance.toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>

          {/* Fund Wallet Button */}
          <Button
            className="w-full py-6 mb-8 bg-gray-100 hover:bg-gray-200 text-gray-800 flex items-center justify-center gap-2 rounded-lg border border-gray-200"
            onClick={handleTopUp}
          >
            <Plus className="w-5 h-5" />
            <span className="text-base font-medium">Fund Wallet</span>
          </Button>

          {/* Recent Transactions */}
          <h2 className="text-xl font-bold mb-4">Recent transactions</h2>

          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "credit"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-medium">{transaction.description}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        transaction.type === "credit"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}₦
                      {transaction.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center border rounded-lg">
              <p className="text-gray-500">No transactions yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Up Modal */}
      <WalletTopUpModal
        isOpen={isTopUpModalOpen}
        onClose={() => setIsTopUpModalOpen(false)}
        onSuccess={handleTopUpSuccess}
      />
    </ProtectedRoute>
  )
}
