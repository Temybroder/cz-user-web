"use client"

import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { X, AlertCircle, RotateCcw } from "lucide-react"

export default function PaymentFailureModal({ isOpen, onClose, onRetry, errorMessage }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl [&>button]:hidden">
        <DialogTitle className="sr-only">Order not Confirmed</DialogTitle>

        {/* Header */}
        <div className="relative p-8 text-center">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          {/* Error Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center border-4 border-red-300">
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order not Confirmed</h2>
          <p className="text-gray-500 leading-relaxed mb-8 px-4">
            {errorMessage || "We couldn't process your payment. Please try again or use a different payment method."}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold transition-all duration-300"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={onRetry}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

















// "use client"

// import { Dialog, DialogContent } from "@/app/components/ui/dialog"
// import { Button } from "@/app/components/ui/button"
// import { X, AlertCircle, RotateCcw } from "lucide-react"

// export default function PaymentFailureModal({ isOpen, onClose, onRetry, errorMessage }) {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
//         {/* Header */}
//         <div className="relative p-8 text-center">
//           <Button
//             variant="ghost"
//             size="icon"
//             className="absolute right-4 top-4 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
//             onClick={onClose}
//           >
//             <X className="w-5 h-5" />
//           </Button>

//           {/* Error Icon */}
//           <div className="flex justify-center mb-8">
//             <div className="relative">
//               <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full flex items-center justify-center">
//                 <div className="w-16 h-16 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center border-4 border-red-300">
//                   <AlertCircle className="w-8 h-8 text-white" />
//                 </div>
//               </div>
//             </div>
//           </div>

//           <h2 className="text-3xl font-bold text-gray-900 mb-4">Payment Failed</h2>
//           <p className="text-gray-500 leading-relaxed mb-8 px-4">
//             {errorMessage || "We couldn't process your payment. Please try again or use a different payment method."}
//           </p>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4">
//             <Button
//               variant="outline"
//               className="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold transition-all duration-300"
//               onClick={onClose}
//             >
//               Cancel
//             </Button>

//             <Button
//               className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
//               onClick={onRetry}
//             >
//               <RotateCcw className="w-5 h-5 mr-2" />
//               Try Again
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
