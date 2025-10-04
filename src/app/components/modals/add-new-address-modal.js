"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Checkbox } from "@/app/components/ui/checkbox"
import { useAppContext } from "@/context/app-context"
import Loader from "@/app/components/loader"

export default function AddNewAddressModal({ isOpen, onClose, onSuccess }) {
  const { addAddress } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    country: "Nigeria",
    isDefault: false,
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (checked) => {
    setFormData((prev) => ({ ...prev, isDefault: checked }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Address name is required"
    }

    if (!formData.street.trim()) {
      newErrors.street = "Street address is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Create full address string
      const fullAddress = `${formData.street}, ${formData.city}, ${formData.state}, ${formData.country}`

      const newAddress = await addAddress({
        ...formData,
        fullAddress,
      })

      onSuccess(newAddress)
    } catch (error) {
      console.error("Failed to add address:", error)
      setErrors({ submit: error.message || "Failed to add address" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-xl font-bold text-center">Add new address</DialogTitle>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Address Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Home, Work, etc."
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              name="street"
              placeholder="Street address"
              value={formData.street}
              onChange={handleChange}
              className={errors.street ? "border-red-500" : ""}
            />
            {errors.street && <p className="text-sm text-red-500">{errors.street}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? "border-red-500" : ""}
            />
            {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              className={errors.state ? "border-red-500" : ""}
            />
            {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="isDefault" checked={formData.isDefault} onCheckedChange={handleCheckboxChange} />
            <Label htmlFor="isDefault" className="text-sm font-normal">
              Set as default address
            </Label>
          </div>

          {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}

          <Button type="submit" className="w-full gradient-button" disabled={isLoading}>
            {isLoading ? <Loader /> : "Add address"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
