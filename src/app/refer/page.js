"use client"

import { useState, useEffect } from "react"
import { useAppContext } from "@/context/app-context"
import { useRouter } from "next/navigation"
import { Gift, Copy, Share2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ReferFriendPage() {
  const { user, isAuthenticated } = useAppContext()
  const router = useRouter()
  const { toast } = useToast()
  const [copied, setCopied] = useState(false)
  const [referralEarnings, setReferralEarnings] = useState(0)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/home")
      return
    }
  }, [isAuthenticated, router])

  const handleCopyCode = async () => {
    if (!user?.referralCode) return

    try {
      await navigator.clipboard.writeText(user.referralCode)
      setCopied(true)
      toast({
        title: "Code copied!",
        description: "Your referral code has been copied to clipboard",
        variant: "success",
      })

      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy code:", error)
      toast({
        title: "Copy failed",
        description: "Unable to copy code to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleShareCode = async () => {
    if (!user?.referralCode) return

    const shareData = {
      title: "Join Conzooming with my referral code!",
      text: `Use my referral code ${user.referralCode} to get started with Conzooming and enjoy fresh, healthy meals delivered to your door!`,
      url: `https://conzooming.com/signup?ref=${user.referralCode}`,
    }

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData)
      } else {
        // Fallback for browsers that don't support Web Share API
        const shareText = `${shareData.text}\n\n${shareData.url}`
        await navigator.clipboard.writeText(shareText)
        toast({
          title: "Share content copied!",
          description: "Share content has been copied to clipboard",
          variant: "success",
        })
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Failed to share:", error)
        toast({
          title: "Share failed",
          description: "Unable to share your referral code",
          variant: "destructive",
        })
      }
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    )
  }
  // console.log("+++++++++==========AUTHENTICATED USER IS ", user)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <button onClick={() => router.push("/home")} className="hover:text-gray-700 transition-colors">
              Home
            </button>
            <span>{">"}</span>
            <span className="text-gray-900">Refer a friend</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-16">Refer a friend</h1>

          {/* Gift Icon */}
          <div className="flex justify-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Gift className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Refer a Friend Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 mb-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Refer a friend</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Invite a friend and get ₦500 when they sign up with your referral code and make their first order
            </p>

            {/* Referral Earnings */}
            <div className="mb-8">
              <span className="text-red-500 font-medium">Referral earnings(₦{referralEarnings.toLocaleString()})</span>
            </div>

            {/* Referral Code Display */}
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-4 tracking-wider">
                {user.referralCode || "Loading..."}
              </div>
              <button
                onClick={handleCopyCode}
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
                disabled={!user.referralCode}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy code</span>
                  </>
                )}
              </button>
            </div>

            {/* Share Button */}
            <button
              onClick={handleShareCode}
              disabled={!user.referralCode}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-full transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              <Share2 className="w-5 h-5" />
              <span>Share your code</span>
            </button>
          </div>

          {/* Additional Info */}
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <Gift className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">How it works</h3>
                <p className="text-gray-600 text-sm">
                  Share your unique referral code with friends and family to start earning rewards
                </p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-green-600 font-bold text-lg">₦</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Earn Rewards</h3>
                <p className="text-gray-600 text-sm">
                  Get ₦500 credited to your wallet when your referral makes their first order
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
