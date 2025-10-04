// "use client"

// import { Heart, Sparkles } from "lucide-react"
// import { Button } from "@/app/components/ui/button"
// import { Dialog, DialogContent } from "@/app/components/ui/dialog"
// import { Card, CardContent } from "@/app/components/ui/card"

// export default function NutritionalPreferencesPrompt({ isOpen, onClose, onResponse }) {
//   const handleResponse = (considerPreferences) => {
//     onResponse(considerPreferences)
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md p-0 bg-white rounded-3xl border-0 shadow-2xl">
//         <Card className="border-0 shadow-none">
//           <CardContent className="p-8 text-center">
//             {/* Icon */}
//             <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-red-200 rounded-full flex items-center justify-center">
//               <Heart className="w-8 h-8 text-red-500" />
//             </div>

//             {/* Title */}
//             <h2 className="text-2xl font-bold text-gray-900 mb-3">Consider your nutritional preferences?</h2>

//             {/* Description */}
//             <p className="text-gray-600 mb-8 leading-relaxed">
//               We can create a personalized meal plan based on your dietary preferences and restrictions for a better
//               experience.
//             </p>

//             {/* Action Buttons */}
//             <div className="space-y-3">
//               <Button
//                 onClick={() => handleResponse(true)}
//                 className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
//               >
//                 <Sparkles className="w-5 h-5 mr-2" />
//                 Yes, use my preferences
//               </Button>

//               <Button
//                 onClick={() => handleResponse(false)}
//                 variant="outline"
//                 className="w-full py-3 rounded-2xl font-medium border-gray-200 hover:bg-gray-50"
//               >
//                 No, create without preferences
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </DialogContent>
//     </Dialog>
//   )
// }



























"use client"

import { Heart, Sparkles } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent, DialogTitle, VisuallyHidden } from "@/app/components/ui/dialog"
import { Card, CardContent } from "@/app/components/ui/card"

export default function NutritionalPreferencesPrompt({ isOpen, onClose, onResponse }) {
  const handleResponse = (considerPreferences) => {
    onResponse(considerPreferences)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 bg-white rounded-3xl border-0 shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Nutritional Preferences Prompt</DialogTitle>
        </VisuallyHidden>
        <Card className="border-0 shadow-none">
          <CardContent className="p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-pink-100 to-red-200 rounded-full flex items-center justify-center">
              <Heart className="w-8 h-8 text-red-500" />
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Consider your nutritional preferences?</h2>

            {/* Description */}
            <p className="text-gray-600 mb-8 leading-relaxed">
              We can create a personalized meal plan based on your dietary preferences and restrictions for a better
              experience.
            </p>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={() => handleResponse(true)}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Yes, use my preferences
              </Button>

              <Button
                onClick={() => handleResponse(false)}
                variant="outline"
                className="w-full py-3 rounded-2xl font-medium border-gray-200 hover:bg-gray-50"
              >
                No, create without preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}
