"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Textarea } from "@/app/components/ui/textarea"

export default function GiftModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [formData, setFormData] = useState({
    recipientName: initialData?.recipientName || "",
    recipientEmail: initialData?.recipientEmail || "",
    senderName: initialData?.senderName || "",
    senderPhone: initialData?.senderPhone || "",
    message: initialData?.message || "",
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

  const validateForm = () => {
    const newErrors = {}

    if (!formData.recipientName.trim()) {
      newErrors.recipientName = "Recipient name is required"
    }

    if (!formData.recipientEmail.trim()) {
      newErrors.recipientEmail = "Recipient email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.recipientEmail)) {
      newErrors.recipientEmail = "Email is invalid"
    }

    if (!formData.senderName.trim()) {
      newErrors.senderName = "Sender name is required"
    }

    if (!formData.senderPhone.trim()) {
      newErrors.senderPhone = "Sender phone is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    onSubmit(formData)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle className="text-xl font-bold text-center">Send order as a gift</DialogTitle>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <h3 className="font-medium">Sending to</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                name="recipientName"
                placeholder="Enter recipient name"
                value={formData.recipientName}
                onChange={handleChange}
                className={errors.recipientName ? "border-red-500" : ""}
              />
              {errors.recipientName && <p className="text-sm text-red-500">{errors.recipientName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email</Label>
              <Input
                id="recipientEmail"
                name="recipientEmail"
                type="email"
                placeholder="Enter recipient email"
                value={formData.recipientEmail}
                onChange={handleChange}
                className={errors.recipientEmail ? "border-red-500" : ""}
              />
              {errors.recipientEmail && <p className="text-sm text-red-500">{errors.recipientEmail}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <h3 className="font-medium">Sending from</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderName">Sender Name</Label>
              <Input
                id="senderName"
                name="senderName"
                placeholder="Enter sender name"
                value={formData.senderName}
                onChange={handleChange}
                className={errors.senderName ? "border-red-500" : ""}
              />
              {errors.senderName && <p className="text-sm text-red-500">{errors.senderName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="senderPhone">Sender Phone</Label>
              <Input
                id="senderPhone"
                name="senderPhone"
                placeholder="Enter sender phone"
                value={formData.senderPhone}
                onChange={handleChange}
                className={errors.senderPhone ? "border-red-500" : ""}
              />
              {errors.senderPhone && <p className="text-sm text-red-500">{errors.senderPhone}</p>}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="message">Leave them a message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Write your message here..."
                rows={4}
                value={formData.message}
                onChange={handleChange}
              />
            </div>
          </div>

          <Button type="submit" className="w-full mt-6 gradient-button">
            Send as gift
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
