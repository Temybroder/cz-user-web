"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Label } from "@/app/components/ui/label"
import { X, CreditCard, ChevronRight } from "lucide-react"

export default function PaymentMethodModal({ isOpen, onClose, onSelectPaymentMethod }) {
  const [selectedMethodId, setSelectedMethodId] = useState("conzooming-wallet")

  // Mock payment methods
  const paymentMethods = [
    {
      id: "conzooming-wallet",
      name: "Conzooming wallet",
      description: "Pay with your Conzooming wallet balance",
      icon: "wallet",
      type: "wallet",
    },
    {
      id: "paystack",
      name: "Paystack",
      description: "Pay with card via Paystack",
      icon: "card",
      type: "card",
    },
  ]

  const handleContinue = () => {
    const selectedMethod = paymentMethods.find((method) => method.id === selectedMethodId)
    if (selectedMethod) {
      onSelectPaymentMethod(selectedMethod)
    }
  }

  const renderIcon = (iconType) => {
    switch (iconType) {
      case "wallet":
        return (
          <div className="flex items-center space-x-1">
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-2 bg-white rounded-sm"></div>
            </div>
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <div className="w-3 h-2 bg-white rounded-sm"></div>
            </div>
          </div>
        )
      case "card":
        return (
          <div className="w-8 h-6 bg-blue-500 rounded flex items-center justify-center">
            <div className="space-y-0.5">
              <div className="w-4 h-0.5 bg-white rounded"></div>
              <div className="w-4 h-0.5 bg-white rounded"></div>
              <div className="w-4 h-0.5 bg-white rounded"></div>
            </div>
          </div>
        )
      default:
        return <CreditCard className="w-6 h-6 text-gray-600" />
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl [&>button]:hidden">
        {/* Header */}
        <div className="relative p-6 pb-4">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Payment Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <div className="w-12 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-lg flex items-center justify-center relative">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center absolute -top-1 -right-1 border-2 border-white">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold text-center text-gray-900 mb-8">Payment method</DialogTitle>
        </div>

        {/* Payment Methods */}
        <div className="px-6 pb-6">
          <RadioGroup value={selectedMethodId} onValueChange={setSelectedMethodId} className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`flex items-center p-4 border-2 rounded-2xl transition-all cursor-pointer ${
                  selectedMethodId === method.id
                    ? "border-red-500 bg-red-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
                onClick={() => setSelectedMethodId(method.id)}
              >
                <div className="flex items-center justify-center w-12 h-12 mr-4">{renderIcon(method.icon)}</div>
                <div className="flex-1">
                  <Label htmlFor={`payment-${method.id}`} className="font-semibold text-gray-900 cursor-pointer">
                    {method.name}
                  </Label>
                  {method.description && <p className="text-sm text-gray-500 mt-1">{method.description}</p>}
                </div>
                <RadioGroupItem
                  value={method.id}
                  id={`payment-${method.id}`}
                  className="w-6 h-6 border-2 border-gray-300 data-[state=checked]:border-red-500 data-[state=checked]:bg-red-500"
                />
              </div>
            ))}
          </RadioGroup>

          <Button
            className="w-full mt-8 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
            onClick={handleContinue}
            disabled={!selectedMethodId}
          >
            Continue
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}