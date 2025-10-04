"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
import { Label } from "@/app/components/ui/label"
import { Input } from "@/app/components/ui/input"
import { X } from "lucide-react"

export default function ProductDetailsModal({ isOpen, onClose, product, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const [selectedOptions, setSelectedOptions] = useState({})
  const [totalPrice, setTotalPrice] = useState(product ? product.price : 0)

  // Reset state when product changes
  useEffect(() => {
    if (product) {
      setQuantity(1)
      setSelectedOptions({})
      setTotalPrice(product.price)
    }
  }, [product])

  if (!product) return null

  const handleOptionChange = (category, option) => {
    const newOptions = { ...selectedOptions, [category]: option }
    setSelectedOptions(newOptions)

    // Recalculate price if option has additional cost
    let newTotalPrice = product.price

    Object.entries(newOptions).forEach(([_, selectedOption]) => {
      if (selectedOption.additionalCost) {
        newTotalPrice += selectedOption.additionalCost
      }
    })

    setTotalPrice(newTotalPrice)
  }

  const handleQuantityChange = (newQuantity) => {
    setQuantity(Math.max(1, newQuantity))
  }

  const handleAddToCart = () => {
    console.log("Product details modal: Adding to cart", { product, quantity, selectedOptions })
    onAddToCart(product, quantity, selectedOptions)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden">
        <DialogTitle className="sr-only">Product Details</DialogTitle>
        <Button
          variant="ghost"
          size="icon"
          className="absolute z-10 right-4 top-4 bg-white rounded-full"
          onClick={onClose}
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="relative w-full h-64">
          <Image
            src={product.imageUrl || `/placeholder.svg?height=256&width=512&query=food ${product.name}`}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">{product.name}</h2>
            <span className="text-xl font-bold">₦{totalPrice.toLocaleString()}</span>
          </div>

          <p className="mt-2 text-gray-600">{product.description}</p>

          {/* Product Options */}
          {product.options &&
            Object.entries(product.options).map(([category, options]) => (
              <div key={category} className="mt-6">
                <h3 className="mb-3 font-medium">
                  {category}
                  {product.requiredOptions && product.requiredOptions.includes(category) && (
                    <span className="ml-2 text-xs text-white bg-primary px-2 py-0.5 rounded">Required</span>
                  )}
                </h3>

                <RadioGroup
                  value={selectedOptions[category]?.id || ""}
                  onValueChange={(value) => {
                    const option = options.find((opt) => opt.id === value)
                    handleOptionChange(category, option)
                  }}
                  className="space-y-2"
                >
                  {options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="ml-2 font-normal">
                          {option.name}
                        </Label>
                      </div>
                      {option.additionalCost > 0 && (
                        <span className="text-sm">+₦{option.additionalCost.toLocaleString()}</span>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

          {/* Special Instructions */}
          <div className="mt-6">
            <Label htmlFor="instructions">Special Instructions (Optional)</Label>
            <Input id="instructions" placeholder="E.g., No onions, extra spicy, etc." className="mt-1" />
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center border rounded-md">
              <Button
                type="button"
                variant="ghost"
                className="h-10 px-3"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                type="button"
                variant="ghost"
                className="h-10 px-3"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                +
              </Button>
            </div>

            <Button className="gradient-button" onClick={handleAddToCart}>
              Add
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}






















// "use client"

// import { useState, useEffect } from "react"
// import Image from "next/image"
// import { Dialog, DialogContent } from "@/app/components/ui/dialog"
// import { Button } from "@/app/components/ui/button"
// import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group"
// import { Label } from "@/app/components/ui/label"
// import { Input } from "@/app/components/ui/input"
// import { X } from "lucide-react"

// export default function ProductDetailsModal({ isOpen, onClose, product, onAddToCart }) {
//   const [quantity, setQuantity] = useState(1)
//   const [selectedOptions, setSelectedOptions] = useState({})
//   const [totalPrice, setTotalPrice] = useState(product ? product.price : 0)

//   // Reset state when product changes
//   useEffect(() => {
//     if (product) {
//       setQuantity(1)
//       setSelectedOptions({})
//       setTotalPrice(product.price)
//     }
//   }, [product])

//   if (!product) return null

//   const handleOptionChange = (category, option) => {
//     const newOptions = { ...selectedOptions, [category]: option }
//     setSelectedOptions(newOptions)

//     // Recalculate price if option has additional cost
//     let newTotalPrice = product.price

//     Object.entries(newOptions).forEach(([_, selectedOption]) => {
//       if (selectedOption.additionalCost) {
//         newTotalPrice += selectedOption.additionalCost
//       }
//     })

//     setTotalPrice(newTotalPrice)
//   }

//   const handleQuantityChange = (newQuantity) => {
//     setQuantity(Math.max(1, newQuantity))
//   }

//   const handleAddToCart = () => {
//     console.log("Product details modal: Adding to cart", { product, quantity, selectedOptions })
//     onAddToCart(product, quantity, selectedOptions)
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md p-0 overflow-hidden">
//         <Button
//           variant="ghost"
//           size="icon"
//           className="absolute z-10 right-4 top-4 bg-white rounded-full"
//           onClick={onClose}
//         >
//           <X className="w-4 h-4" />
//         </Button>

//         <div className="relative w-full h-64">
//           <Image
//             src={product.imageUrl || `/placeholder.svg?height=256&width=512&query=food ${product.name}`}
//             alt={product.name}
//             fill
//             className="object-cover"
//           />
//         </div>

//         <div className="p-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-bold">{product.name}</h2>
//             <span className="text-xl font-bold">₦{totalPrice.toLocaleString()}</span>
//           </div>

//           <p className="mt-2 text-gray-600">{product.description}</p>

//           {/* Product Options */}
//           {product.options &&
//             Object.entries(product.options).map(([category, options]) => (
//               <div key={category} className="mt-6">
//                 <h3 className="mb-3 font-medium">
//                   {category}
//                   {product.requiredOptions && product.requiredOptions.includes(category) && (
//                     <span className="ml-2 text-xs text-white bg-primary px-2 py-0.5 rounded">Required</span>
//                   )}
//                 </h3>

//                 <RadioGroup
//                   value={selectedOptions[category]?.id || ""}
//                   onValueChange={(value) => {
//                     const option = options.find((opt) => opt.id === value)
//                     handleOptionChange(category, option)
//                   }}
//                   className="space-y-2"
//                 >
//                   {options.map((option) => (
//                     <div key={option.id} className="flex items-center justify-between p-3 border rounded-md">
//                       <div className="flex items-center">
//                         <RadioGroupItem value={option.id} id={option.id} />
//                         <Label htmlFor={option.id} className="ml-2 font-normal">
//                           {option.name}
//                         </Label>
//                       </div>
//                       {option.additionalCost > 0 && (
//                         <span className="text-sm">+₦{option.additionalCost.toLocaleString()}</span>
//                       )}
//                     </div>
//                   ))}
//                 </RadioGroup>
//               </div>
//             ))}

//           {/* Special Instructions */}
//           <div className="mt-6">
//             <Label htmlFor="instructions">Special Instructions (Optional)</Label>
//             <Input id="instructions" placeholder="E.g., No onions, extra spicy, etc." className="mt-1" />
//           </div>

//           {/* Quantity and Add to Cart */}
//           <div className="flex items-center justify-between mt-6">
//             <div className="flex items-center border rounded-md">
//               <Button
//                 type="button"
//                 variant="ghost"
//                 className="h-10 px-3"
//                 onClick={() => handleQuantityChange(quantity - 1)}
//                 disabled={quantity <= 1}
//               >
//                 -
//               </Button>
//               <span className="w-8 text-center">{quantity}</span>
//               <Button
//                 type="button"
//                 variant="ghost"
//                 className="h-10 px-3"
//                 onClick={() => handleQuantityChange(quantity + 1)}
//               >
//                 +
//               </Button>
//             </div>

//             <Button className="gradient-button" onClick={handleAddToCart}>
//               Add
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }

