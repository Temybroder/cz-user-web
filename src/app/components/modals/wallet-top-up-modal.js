"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { CreditCard, Building, Smartphone } from "lucide-react"
import { paymentAPI } from "@/lib/api"
import { createPaymentLink } from "@/lib/paystack"
import { useAppContext } from "@/context/app-context"
import AnimatedLoader from "@/app/components/ui/animated-loader"

export default function WalletTopUpModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAppContext()
  const [amount, setAmount] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isPaystackReady, setIsPaystackReady] = useState(false)

  // Load Paystack script
  useEffect(() => {
    if (isOpen && !window.PaystackPop && !document.getElementById("paystack-script")) {
      const script = document.createElement("script")
      script.id = "paystack-script"
      script.src = "https://js.paystack.co/v1/inline.js"
      script.async = true
      script.onload = () => setIsPaystackReady(true)
      document.body.appendChild(script)
    } else if (window.PaystackPop) {
      setIsPaystackReady(true)
    }

    return () => {
      // Cleanup if needed
    }
  }, [isOpen])

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setAmount(value)
    setError("")
  }

  const handleSubmit = async () => {
    if (!amount || Number.parseInt(amount) < 500) {
      setError("Please enter an amount of at least ₦500")
      return
    }

    if (!isPaystackReady) {
      setError("Payment system is initializing. Please try again.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      if (paymentMethod === "card") {
        // Use Paystack for card payments
        const { paymentData, reference } = createPaymentLink({
          email: user.email,
          amount: Number.parseInt(amount),
          paymentFor: "Wallet Top-up",
          userId: user.userId || user._id,
          onSuccess: async (response) => {
            // Verify the transaction on the backend
            await paymentAPI.verifyWalletTopUp({
              reference: response.reference,
              amount: Number.parseInt(amount),
            })

            onSuccess(Number.parseInt(amount))
          },
          onClose: () => {
            setIsLoading(false)
          },
        })

        // Open Paystack payment modal
        const paystack = window.PaystackPop.setup(paymentData)
        paystack.openIframe()
      } else if (paymentMethod === "bank") {
        // For bank transfers, we'll show instructions
        await paymentAPI.initiateWalletTopUpByTransfer({
          amount: Number.parseInt(amount),
        })

        // Show success message with bank details
        onSuccess(Number.parseInt(amount))
      } else if (paymentMethod === "ussd") {
        // For USSD, we'll show the USSD code
        const response = await paymentAPI.initiateWalletTopUpByUSSD({
          amount: Number.parseInt(amount),
        })

        // Show USSD code to dial
        alert(`Please dial ${response.ussdCode} to complete your payment`)
        onSuccess(Number.parseInt(amount))
      }
    } catch (error) {
      console.error("Failed to fund wallet:", error)
      setError(error.message || "Failed to process payment. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const presetAmounts = [1000, 2000, 5000, 10000]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-6">
          <h2 className="text-xl font-bold">Wallet top-up</h2>

          <div className="space-y-4">
            <Label>Top-up Amount</Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-gray-500">₦</span>
              </div>
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="pl-8 bg-gray-50"
                placeholder="Enter amount"
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {presetAmounts.map((presetAmount) => (
                <Button
                  key={presetAmount}
                  type="button"
                  variant="outline"
                  className={`${amount === presetAmount.toString() ? "border-primary text-primary" : ""}`}
                  onClick={() => setAmount(presetAmount.toString())}
                >
                  ₦{presetAmount.toLocaleString()}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>How would you like to pay?</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="card" id="card" />
                <Label htmlFor="card" className="flex items-center cursor-pointer">
                  <CreditCard className="w-5 h-5 mr-2" />
                  <span>Card</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank" className="flex items-center cursor-pointer">
                  <Building className="w-5 h-5 mr-2" />
                  <span>Bank transfer</span>
                </Label>
              </div>

              <div className="flex items-center space-x-2 border rounded-md p-3">
                <RadioGroupItem value="ussd" id="ussd" />
                <Label htmlFor="ussd" className="flex items-center cursor-pointer">
                  <Smartphone className="w-5 h-5 mr-2" />
                  <span>USSD</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button className="w-full gradient-button" onClick={handleSubmit} disabled={isLoading || !amount}>
            {isLoading ? <AnimatedLoader size="small" /> : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
