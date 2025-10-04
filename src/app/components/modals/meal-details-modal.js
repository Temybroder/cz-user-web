"use client"
import { useState } from "react"
import { X, Plus, Minus } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { Checkbox } from "@/app/components/ui/checkbox"

const proteinOptions = [
  { id: "chicken", name: "Chicken", price: 500 },
  { id: "beef", name: "Beef", price: 700 },
  { id: "fish", name: "Fish", price: 600 },
  { id: "turkey", name: "Turkey", price: 800 },
]

const drinkOptions = [
  { id: "coke", name: "Coca Cola", price: 200 },
  { id: "sprite", name: "Sprite", price: 200 },
  { id: "fanta", name: "Fanta", price: 200 },
  { id: "water", name: "Water", price: 100 },
]

export default function MealDetailsModal({ isOpen, onClose, meal, onSave }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedProteins, setSelectedProteins] = useState([])
  const [selectedDrinks, setSelectedDrinks] = useState([])
  const [specifications, setSpecifications] = useState("")

  if (!isOpen || !meal) return null

  const handleProteinChange = (proteinId, checked) => {
    if (checked) {
      setSelectedProteins([...selectedProteins, proteinId])
    } else {
      setSelectedProteins(selectedProteins.filter((id) => id !== proteinId))
    }
  }

  const handleDrinkChange = (drinkId, checked) => {
    if (checked) {
      setSelectedDrinks([...selectedDrinks, drinkId])
    } else {
      setSelectedDrinks(selectedDrinks.filter((id) => id !== drinkId))
    }
  }

  const calculateTotal = () => {
    let total = meal.price * quantity

    selectedProteins.forEach((proteinId) => {
      const protein = proteinOptions.find((p) => p.id === proteinId)
      if (protein) total += protein.price * quantity
    })

    selectedDrinks.forEach((drinkId) => {
      const drink = drinkOptions.find((d) => d.id === drinkId)
      if (drink) total += drink.price * quantity
    })

    return total
  }

  const handleSave = () => {
    const customizations = {
      quantity,
      selectedProteins,
      selectedDrinks,
      specifications,
    }

    onSave(meal, customizations)
    onClose()

    // Reset form
    setQuantity(1)
    setSelectedProteins([])
    setSelectedDrinks([])
    setSpecifications("")
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{meal.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Meal Info */}
          <div>
            <p className="text-gray-600 mb-2">{meal.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">{meal.vendor}</span>
              <span className="text-lg font-bold text-gray-900">₦{meal.price.toLocaleString()}</span>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Protein Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Add Protein (Optional)</label>
            <div className="space-y-2">
              {proteinOptions.map((protein) => (
                <div key={protein.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={protein.id}
                      checked={selectedProteins.includes(protein.id)}
                      onCheckedChange={(checked) => handleProteinChange(protein.id, checked)}
                    />
                    <label htmlFor={protein.id} className="text-sm text-gray-700">
                      {protein.name}
                    </label>
                  </div>
                  <span className="text-sm text-gray-500">+₦{protein.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Drink Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Add Drinks (Optional)</label>
            <div className="space-y-2">
              {drinkOptions.map((drink) => (
                <div key={drink.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={drink.id}
                      checked={selectedDrinks.includes(drink.id)}
                      onCheckedChange={(checked) => handleDrinkChange(drink.id, checked)}
                    />
                    <label htmlFor={drink.id} className="text-sm text-gray-700">
                      {drink.name}
                    </label>
                  </div>
                  <span className="text-sm text-gray-500">+₦{drink.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <label htmlFor="specifications" className="block text-sm font-medium text-gray-700 mb-2">
              Special Instructions (Optional)
            </label>
            <Textarea
              id="specifications"
              placeholder="Any special requests or dietary requirements..."
              value={specifications}
              onChange={(e) => setSpecifications(e.target.value)}
              className="w-full"
              rows={3}
            />
          </div>

          {/* Total */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Total:</span>
              <span>₦{calculateTotal().toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t">
          <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
            Add to Meal Plan
          </Button>
        </div>
      </div>
    </div>
  )
}


























// "use client"
// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { X, Star, Clock, Users, ChefHat, Plus, Minus } from "lucide-react"
// import { Button } from "@/app/components/ui/button"
// import { Checkbox } from "@/app/components/ui/checkbox"
// import { Label } from "@/app/components/ui/label"
// import { Textarea } from "@/app/components/ui/textarea"
// import { Badge } from "@/app/components/ui/badge"

// export default function MealDetailsModal({ isOpen, onClose, meal, day, mealClass, onSave }) {
//   const [selectedProtein, setSelectedProtein] = useState("")
//   const [selectedDrinks, setSelectedDrinks] = useState([])
//   const [customizations, setCustomizations] = useState("")
//   const [totalPrice, setTotalPrice] = useState(meal?.price || 0)
//   const [quantity, setQuantity] = useState(1)

//   const proteinOptions = [
//     { id: "chicken", name: "Grilled Chicken", price: 1500, description: "Tender grilled chicken breast" },
//     { id: "beef", name: "Beef Strips", price: 2000, description: "Seasoned beef strips" },
//     { id: "fish", name: "Grilled Fish", price: 1800, description: "Fresh grilled fish fillet" },
//   ]

//   const drinkOptions = [
//     { id: "yoghurt", name: "Hollandia Yoghurt", price: 500, description: "Creamy natural yoghurt" },
//     { id: "orange", name: "5Alive Pulpy Orange", price: 400, description: "Fresh orange juice with pulp" },
//     { id: "water", name: "Bottled Water", price: 200, description: "Pure drinking water" },
//   ]

//   useEffect(() => {
//     if (meal) {
//       setTotalPrice(meal.price)
//       setSelectedProtein("")
//       setSelectedDrinks([])
//       setCustomizations("")
//       setQuantity(1)
//     }
//   }, [meal])

//   const handleProteinChange = (proteinId) => {
//     setSelectedProtein(proteinId)
//     calculateTotal(proteinId, selectedDrinks, quantity)
//   }

//   const handleDrinkChange = (drinkId, checked) => {
//     const newDrinks = checked ? [...selectedDrinks, drinkId] : selectedDrinks.filter((id) => id !== drinkId)
//     setSelectedDrinks(newDrinks)
//     calculateTotal(selectedProtein, newDrinks, quantity)
//   }

//   const handleQuantityChange = (newQuantity) => {
//     const qty = Math.max(1, newQuantity)
//     setQuantity(qty)
//     calculateTotal(selectedProtein, selectedDrinks, qty)
//   }

//   const calculateTotal = (protein, drinks, qty) => {
//     let basePrice = meal?.price || 0

//     if (protein) {
//       const proteinOption = proteinOptions.find((p) => p.id === protein)
//       if (proteinOption) basePrice += proteinOption.price
//     }

//     drinks.forEach((drinkId) => {
//       const drinkOption = drinkOptions.find((d) => d.id === drinkId)
//       if (drinkOption) basePrice += drinkOption.price
//     })

//     setTotalPrice(basePrice * qty)
//   }

//   const handleSave = () => {
//     const mealData = {
//       status: "pending",
//       mealContents: [
//         meal.name,
//         ...(selectedProtein ? [proteinOptions.find((p) => p.id === selectedProtein)?.name] : []),
//         ...selectedDrinks.map((drinkId) => drinkOptions.find((d) => d.id === drinkId)?.name).filter(Boolean),
//       ],
//       mealClass: mealClass,
//       deliveryTime: new Date(
//         new Date().setHours(mealClass === "breakfast" ? 8 : mealClass === "lunch" ? 13 : 19, 0, 0, 0),
//       ).toISOString(),
//       orderBody: `${mealClass} order with customizations`,
//       orderSubTotal: totalPrice,
//       totalAmount: totalPrice,
//       partnerBusinessBranchId: "pb1",
//       noteToRider: customizations || "Please deliver on time",
//       imageUrl: meal.imageUrl,
//       vendor: meal.vendor,
//       quantity: quantity,
//       customizations: {
//         protein: selectedProtein,
//         drinks: selectedDrinks,
//         notes: customizations,
//       },
//     }

//     onSave(mealData)
//   }

//   if (!meal) return null

//   return (
//     <>
//       {/* Backdrop */}
//       <div
//         className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${
//           isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
//         }`}
//         onClick={onClose}
//       />

//       {/* Modal */}
//       <div
//         className={`fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex flex-col h-full">
//           {/* Header */}
//           <div className="relative">
//             <div className="relative w-full h-64">
//               <Image
//                 src={meal.imageUrl || "/placeholder.svg?height=256&width=400"}
//                 alt={meal.name}
//                 fill
//                 className="object-cover"
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

//               {/* Close Button */}
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
//                 onClick={onClose}
//               >
//                 <X className="w-5 h-5" />
//               </Button>

//               {/* Meal Info Overlay */}
//               <div className="absolute bottom-4 left-4 right-4 text-white">
//                 <div className="flex items-center gap-2 mb-2">
//                   <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
//                     <Star className="w-3 h-3 mr-1 fill-current" />
//                     4.8
//                   </Badge>
//                   <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30">
//                     <Clock className="w-3 h-3 mr-1" />
//                     25-30 mins
//                   </Badge>
//                 </div>
//                 <h2 className="text-2xl font-bold mb-1">{meal.name}</h2>
//                 <p className="text-white/90">Sold by: {meal.vendor}</p>
//               </div>
//             </div>
//           </div>

//           {/* Content */}
//           <div className="flex-1 overflow-y-auto p-6">
//             {/* Price and Quantity */}
//             <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-2xl">
//               <div>
//                 <span className="text-2xl font-bold text-gray-900">₦{meal.price.toLocaleString()}</span>
//                 <p className="text-sm text-gray-500">Base price</p>
//               </div>
//               <div className="flex items-center gap-3">
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => handleQuantityChange(quantity - 1)}
//                   disabled={quantity <= 1}
//                   className="rounded-full"
//                 >
//                   <Minus className="w-4 h-4" />
//                 </Button>
//                 <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
//                 <Button
//                   variant="outline"
//                   size="icon"
//                   onClick={() => handleQuantityChange(quantity + 1)}
//                   className="rounded-full"
//                 >
//                   <Plus className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>

//             {/* Meal Specification */}
//             <div className="mb-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <ChefHat className="w-5 h-5 text-gray-600" />
//                 <h3 className="text-lg font-semibold text-gray-900">Meal Specification</h3>
//                 <Badge variant="secondary" className="text-xs">
//                   Optional
//                 </Badge>
//               </div>
//               <Textarea
//                 value={customizations}
//                 onChange={(e) => setCustomizations(e.target.value)}
//                 placeholder="Add any special instructions or customizations..."
//                 className="rounded-xl border-2 border-gray-200 focus:border-red-500 resize-none"
//                 rows={3}
//               />
//             </div>

//             {/* Choose Protein */}
//             <div className="mb-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <Users className="w-5 h-5 text-gray-600" />
//                 <h3 className="text-lg font-semibold text-gray-900">Choose Protein</h3>
//                 <Badge variant="secondary" className="text-xs">
//                   Optional
//                 </Badge>
//               </div>
//               <div className="space-y-3">
//                 {proteinOptions.map((protein) => (
//                   <div
//                     key={protein.id}
//                     className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
//                       selectedProtein === protein.id
//                         ? "border-red-500 bg-red-50"
//                         : "border-gray-200 hover:border-red-300 hover:bg-gray-50"
//                     }`}
//                     onClick={() => handleProteinChange(protein.id)}
//                   >
//                     <div className="flex items-center">
//                       <div
//                         className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
//                           selectedProtein === protein.id ? "border-red-500 bg-red-500" : "border-gray-300"
//                         }`}
//                       >
//                         {selectedProtein === protein.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
//                       </div>
//                       <div>
//                         <span className="font-medium text-gray-900">{protein.name}</span>
//                         <p className="text-sm text-gray-500">{protein.description}</p>
//                       </div>
//                     </div>
//                     <span className="font-bold text-gray-900">+₦{protein.price.toLocaleString()}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Add Drinks */}
//             <div className="mb-6">
//               <div className="flex items-center gap-2 mb-4">
//                 <div className="w-5 h-5 text-gray-600">🥤</div>
//                 <h3 className="text-lg font-semibold text-gray-900">Add Drinks</h3>
//                 <Badge variant="secondary" className="text-xs">
//                   Optional
//                 </Badge>
//               </div>
//               <div className="space-y-3">
//                 {drinkOptions.map((drink) => (
//                   <div
//                     key={drink.id}
//                     className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-red-300 hover:bg-gray-50 transition-colors duration-200"
//                   >
//                     <div className="flex items-center">
//                       <Checkbox
//                         id={drink.id}
//                         checked={selectedDrinks.includes(drink.id)}
//                         onCheckedChange={(checked) => handleDrinkChange(drink.id, checked)}
//                         className="mr-3"
//                       />
//                       <div>
//                         <Label htmlFor={drink.id} className="font-medium cursor-pointer text-gray-900">
//                           {drink.name}
//                         </Label>
//                         <p className="text-sm text-gray-500">{drink.description}</p>
//                       </div>
//                     </div>
//                     <span className="font-bold text-gray-900">+₦{drink.price.toLocaleString()}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="border-t bg-white p-6">
//             <div className="flex items-center justify-between mb-4">
//               <span className="text-lg font-semibold text-gray-900">Total price</span>
//               <span className="text-2xl font-bold text-red-600">₦{totalPrice.toLocaleString()}</span>
//             </div>
//             <Button
//               onClick={handleSave}
//               className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-2xl shadow-lg font-semibold text-lg"
//             >
//               Save to Meal Plan
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }














// "use client"

// import { useState } from "react"
// import Image from "next/image"
// import { Dialog, DialogContent } from "@/app/components/ui/dialog"
// import { Button } from "@/app/components/ui/button"
// import { Checkbox } from "@/app/components/ui/checkbox"
// import { Label } from "@/app/components/ui/label"
// import { Input } from "@/app/components/ui/input"
// import { ArrowLeft, X } from "lucide-react"

// export default function MealDetailsModal({ isOpen, onClose, meal, day, mealClass, onSave, onBack }) {
//   const [selectedProtein, setSelectedProtein] = useState("")
//   const [selectedDrinks, setSelectedDrinks] = useState([])
//   const [customizations, setCustomizations] = useState("")
//   const [totalPrice, setTotalPrice] = useState(meal?.price || 0)

//   const proteinOptions = [
//     { id: "chicken", name: "Chicken", price: 2500 },
//     { id: "beef", name: "Beef", price: 1000 },
//   ]

//   const drinkOptions = [
//     { id: "yoghurt", name: "Hollandia Yoghurt", price: 2500 },
//     { id: "orange", name: "5Alive Pulpy Orange", price: 1500 },
//   ]

//   const handleProteinChange = (proteinId) => {
//     setSelectedProtein(proteinId)
//     calculateTotal(proteinId, selectedDrinks)
//   }

//   const handleDrinkChange = (drinkId, checked) => {
//     const newDrinks = checked ? [...selectedDrinks, drinkId] : selectedDrinks.filter((id) => id !== drinkId)

//     setSelectedDrinks(newDrinks)
//     calculateTotal(selectedProtein, newDrinks)
//   }

//   const calculateTotal = (protein, drinks) => {
//     let total = meal?.price || 0

//     if (protein) {
//       const proteinOption = proteinOptions.find((p) => p.id === protein)
//       if (proteinOption) total += proteinOption.price
//     }

//     drinks.forEach((drinkId) => {
//       const drinkOption = drinkOptions.find((d) => d.id === drinkId)
//       if (drinkOption) total += drinkOption.price
//     })

//     setTotalPrice(total)
//   }

//   const handleSave = () => {
//     const mealData = {
//       status: "pending",
//       mealContents: [
//         meal.name,
//         ...(selectedProtein ? [proteinOptions.find((p) => p.id === selectedProtein)?.name] : []),
//         ...selectedDrinks.map((drinkId) => drinkOptions.find((d) => d.id === drinkId)?.name).filter(Boolean),
//       ],
//       mealClass: mealClass,
//       deliveryTime: new Date(
//         new Date().setHours(mealClass === "breakfast" ? 8 : mealClass === "lunch" ? 13 : 19, 0, 0, 0),
//       ).toISOString(),
//       orderBody: `${mealClass} order with customizations`,
//       orderSubTotal: totalPrice,
//       totalAmount: totalPrice,
//       partnerBusinessBranchId: "pb1",
//       noteToRider: customizations || "Please deliver on time",
//       imageUrl: meal.imageUrl,
//       customizations: {
//         protein: selectedProtein,
//         drinks: selectedDrinks,
//         notes: customizations,
//       },
//     }

//     onSave(mealData)
//   }

//   if (!meal) return null

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden bg-white rounded-3xl border-0 shadow-2xl">
//         <div className="relative">
//           {/* Header */}
//           <div className="flex items-center justify-between p-6 border-b">
//             <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
//               <ArrowLeft className="w-5 h-5" />
//             </Button>
//             <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
//               <X className="w-5 h-5" />
//             </Button>
//           </div>

//           {/* Content */}
//           <div className="max-h-[70vh] overflow-y-auto">
//             {/* Meal Image */}
//             <div className="relative w-full h-64">
//               <Image src={meal.imageUrl || "/placeholder.svg"} alt={meal.name} fill className="object-cover" />
//             </div>

//             <div className="p-6">
//               {/* Meal Info */}
//               <div className="mb-6">
//                 <h2 className="text-2xl font-bold text-gray-900 mb-2">{meal.name}</h2>
//                 <p className="text-gray-600 mb-1">Sold by: {meal.vendor}</p>
//                 <div className="flex items-center justify-between">
//                   <span className="text-2xl font-bold text-orange-600">₦{meal.price.toLocaleString()}</span>
//                 </div>
//               </div>

//               {/* Meal Specification */}
//               <div className="mb-6">
//                 <div className="flex items-center mb-4">
//                   <h3 className="text-lg font-semibold text-gray-900">Meal Specification</h3>
//                   <span className="ml-2 bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">Required</span>
//                 </div>

//                 <div className="relative mb-4">
//                   <Input
//                     value={customizations}
//                     onChange={(e) => setCustomizations(e.target.value)}
//                     placeholder="Add customizations to your meal"
//                     className="pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-orange-500"
//                   />
//                 </div>
//               </div>

//               {/* Choose Protein */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Protein</h3>
//                 <div className="space-y-3">
//                   {proteinOptions.map((protein) => (
//                     <div
//                       key={protein.id}
//                       className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
//                         selectedProtein === protein.id
//                           ? "border-orange-500 bg-orange-50"
//                           : "border-gray-200 hover:border-orange-300"
//                       }`}
//                       onClick={() => handleProteinChange(protein.id)}
//                     >
//                       <div className="flex items-center">
//                         <div
//                           className={`w-5 h-5 rounded-full border-2 mr-3 ${
//                             selectedProtein === protein.id ? "border-orange-500 bg-orange-500" : "border-gray-300"
//                           }`}
//                         >
//                           {selectedProtein === protein.id && (
//                             <div className="w-full h-full rounded-full bg-white scale-50"></div>
//                           )}
//                         </div>
//                         <span className="font-medium">{protein.name}</span>
//                       </div>
//                       <span className="font-bold">₦{protein.price.toLocaleString()}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Add Drinks */}
//               <div className="mb-6">
//                 <h3 className="text-lg font-semibold text-gray-900 mb-4">Add drinks</h3>
//                 <div className="space-y-3">
//                   {drinkOptions.map((drink) => (
//                     <div
//                       key={drink.id}
//                       className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-orange-300 transition-colors duration-300"
//                     >
//                       <div className="flex items-center">
//                         <Checkbox
//                           id={drink.id}
//                           checked={selectedDrinks.includes(drink.id)}
//                           onCheckedChange={(checked) => handleDrinkChange(drink.id, checked)}
//                           className="mr-3"
//                         />
//                         <Label htmlFor={drink.id} className="font-medium cursor-pointer">
//                           {drink.name}
//                         </Label>
//                       </div>
//                       <span className="font-bold">₦{drink.price.toLocaleString()}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Total Price */}
//               <div className="flex items-center justify-between py-4 border-t-2 border-gray-200 mb-6">
//                 <span className="text-xl font-bold text-gray-900">Total price</span>
//                 <span className="text-2xl font-bold text-orange-600">₦{totalPrice.toLocaleString()}</span>
//               </div>

//               {/* Save Button */}
//               <Button
//                 onClick={handleSave}
//                 className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-2xl shadow-lg font-semibold text-lg"
//               >
//                 Save
//               </Button>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
