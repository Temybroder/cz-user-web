"use client"

import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Wallet } from "lucide-react"

export default function InsufficientBalanceModal({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="sr-only">Insufficient Balance</DialogTitle>
        <div className="flex flex-col items-center py-6">
          <div className="relative mb-4">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-red-500 rounded-full blur-md opacity-75"></div>
            <div className="relative bg-white p-4 rounded-full">
              <Wallet className="h-12 w-12 text-primary" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mt-4">Insufficient balance</h2>
          <p className="text-center text-gray-500 mt-2">
            Your balance isn&apos;t enough to complete this transaction, please fund your wallet
          </p>

          <Button
            className="w-full mt-8 gradient-button"
            onClick={() => {
              onClose()
              // Navigate to wallet funding page
              // router.push("/wallet/fund")
            }}
          >
            Fund wallet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

















// "use client"

// import { Dialog, DialogContent } from "@/app/components/ui/dialog"
// import { Button } from "@/app/components/ui/button"
// import { Wallet } from "lucide-react"

// export default function InsufficientBalanceModal({ isOpen, onClose }) {
//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <div className="flex flex-col items-center py-6">
//           <div className="relative mb-4">
//             <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-red-500 rounded-full blur-md opacity-75"></div>
//             <div className="relative bg-white p-4 rounded-full">
//               <Wallet className="h-12 w-12 text-primary" />
//             </div>
//           </div>

//           <h2 className="text-2xl font-bold text-center mt-4">Insufficient balance</h2>
//           <p className="text-center text-gray-500 mt-2">
//             Your balance isn&apos;t enough to complete this transaction, please fund your wallet
//           </p>

//           <Button
//             className="w-full mt-8 gradient-button"
//             onClick={() => {
//               onClose()
//               // Navigate to wallet funding page
//               // router.push("/wallet/fund")
//             }}
//           >
//             Fund wallet
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
