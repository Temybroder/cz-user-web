// import { DialogTitle } from "@/app/components/ui/dialog"
// import { Dialog, DialogContent } from "@/app/components/ui/dialog"
// import { CheckCircle2 } from "lucide-react"

// export function PaymentSuccessModal({ open, onOpenChange }) {
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
//         <DialogTitle className="sr-only">Payment Successful</DialogTitle>
//         <div className="flex flex-col items-center justify-center p-10">
//           <CheckCircle2 className="w-16 h-16 text-green-500" />
//           <h2 className="mt-4 text-2xl font-bold text-gray-800">Payment Successful!</h2>
//           <p className="mt-2 text-gray-600">Thank you for your purchase.</p>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }


























"use client"

import { Dialog, DialogContent } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { X, Home, Package } from "lucide-react"

export default function PaymentSuccessModal({ isOpen, onClose, onGoHome, onTrackOrder }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
        {/* Header */}
        <div className="relative p-8 text-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center border-4 border-orange-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
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

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful</h2>
          <p className="text-gray-500 leading-relaxed mb-8 px-4">
            Your payment has been received and the vendor has accepted your order.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="flex-1 py-4 rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold transition-all duration-300"
              onClick={onGoHome}
            >
              <Home className="w-5 h-5 mr-2" />
              Go home
            </Button>

            <Button
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={onTrackOrder}
            >
              <Package className="w-5 h-5 mr-2" />
              Track Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
