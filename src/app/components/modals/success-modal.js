"use client"

import { Dialog, DialogContent } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { CheckCircle, Home, FileText } from "lucide-react"

export default function SuccessModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
        <div className="flex flex-col items-center py-12 px-8">
          {/* Success Icon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center border-4 border-orange-300">
                <CheckCircle className="h-8 w-8 text-white fill-white" />
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Your order was successful</h2>
          <p className="text-center text-gray-500 leading-relaxed mb-8 px-4">
            Your order has been received and accepted. Please click on track order to check progress of your order.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 flex-1 py-4 rounded-2xl border-2 border-red-200 text-red-600 hover:bg-red-50 font-semibold transition-all duration-300"
              onClick={onClose}
            >
              <Home className="w-5 h-5" />
              Go home
            </Button>

            <Button
              className="flex items-center justify-center gap-2 flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold py-4 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
              onClick={() => {
                onClose()
                // Navigate to track order page
                // router.push("/orders/track")
              }}
            >
              <FileText className="w-5 h-5" />
              Track Order
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
// import { CheckCircle, Home, FileText } from "lucide-react"

// export default function SuccessModal({ isOpen, onClose }) {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <div className="flex flex-col items-center py-6">
//           <div className="relative mb-4">
//             <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-red-500 rounded-full blur-md opacity-75"></div>
//             <div className="relative bg-white p-4 rounded-full">
//               <CheckCircle className="h-12 w-12 text-accent" />
//             </div>
//           </div>

//           <h2 className="text-2xl font-bold text-center mt-4">Your order was successful</h2>
//           <p className="text-center text-gray-500 mt-2">
//             Your order has been received and accepted. Please click on track order to check progress of your order.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 w-full mt-8">
//             <Button variant="outline" className="flex items-center justify-center gap-2 flex-1" onClick={onClose}>
//               <Home className="w-4 h-4" />
//               Go home
//             </Button>

//             <Button
//               className="flex items-center justify-center gap-2 flex-1 gradient-button"
//               onClick={() => {
//                 onClose()
//                 // Navigate to track order page
//                 // router.push("/orders/track")
//               }}
//             >
//               <FileText className="w-4 h-4" />
//               Track Order
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
