"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/app/components/ui/dialog"
import { Button } from "@/app/components/ui/button"
import { Textarea } from "@/app/components/ui/textarea"
import { motion, AnimatePresence } from "framer-motion"
import { orderAPI } from "@/lib/api"
import { useAppContext } from "@/context/app-context"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import { Star } from "lucide-react"
import OrdersPage from "@/app/orders/page"

export default function OrderRatingModal({ isOpen, onClose, orderId, partnerBusinessId, riderId, order }) {
  const { user, showLoader, hideLoader } = useAppContext()
  const [orderRating, setOrderRating] = useState(0)
  const [riderRating, setRiderRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [hasInput, setHasInput] = useState(false)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    // Reset state when modal opens
    if (isOpen) {
      setOrderRating(0)
      setRiderRating(0)
      setComment("")
      setIsSuccess(false)
      setHasInput(false)
      setRating(0)
      setComment("")
      setHoveredRating(0)
      setSubmitting(false)
    }
  }, [isOpen])

  // Check if user has provided any input
  useEffect(() => {
    if (orderRating > 0 || riderRating > 0 || comment.trim() !== "") {
      setHasInput(true)
    } else {
      setHasInput(false)
    }
  }, [orderRating, riderRating, comment])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    if (rating === 0 && orderId) {
      if (!orderId || orderRating === 0) return

      setIsSubmitting(true)

      try {
        // Submit rating to API
        await orderAPI.rateOrder({
          rating: orderRating,
          comment,
          ratedByUser: user.userId || user._id,
          partnerBusinessRated: partnerBusinessId,
          riderRated: riderId,
          orderId,
          status: 1,
        })

        // Show success state
        setIsSuccess(true)
      } catch (error) {
        console.error("Failed to submit rating:", error)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      if (rating === 0) {
        alert("Please select a rating")
        return
      }

      setSubmitting(true)
      showLoader()

      try {
        // Prepare the rating data according to the schema
        const ratingData = {
          rating: rating,
          comment: comment,
          orderId: order.id,
          partnerBusinessRated: order.vendorId, // Assuming the order has a vendorId
          riderRated: order.riderId, // Assuming the order has a riderId
        }

        await orderAPI.rateOrder(order.id, ratingData)
        onClose()
      } catch (error) {
        console.error("Error submitting rating:", error)
      } finally {
        hideLoader()
        setSubmitting(false)
      }
    }
  }

  const handleClose = () => {
    if (isSuccess) {
      onClose()
    } else if (!isSubmitting && !hasInput) {
      onClose()
    } else if (!isSubmitting) {
      // Show confirmation if user has input but hasn't submitted
      if (confirm("Are you sure you want to close without submitting your rating?")) {
        onClose()
      }
    } else {
      onClose()
    }
  }

  const renderOrderRatingOptions = () => {
    return (
      <div className="flex justify-center space-x-4">
        {[1, 2, 3, 4, 5].map((rating) => (
          <button
            key={rating}
            type="button"
            onClick={() => setOrderRating(rating)}
            className={`flex flex-col items-center p-3 rounded-lg transition-all ${
              orderRating === rating
                ? "bg-primary/10 border-2 border-primary"
                : "border border-gray-200 hover:border-primary/50"
            }`}
          >
            <span className="text-3xl mb-2">{rating <= 2 ? "😞" : rating === 3 ? "😐" : "😊"}</span>
            <span className="text-xl font-bold">{rating}</span>
          </button>
        ))}
      </div>
    )
  }

  const renderRiderRatingStars = () => {
    return (
      <div className="flex justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button key={star} type="button" className="p-1" onClick={() => setRiderRating(star)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={star <= riderRating ? "#21a0a0" : "#e2e8f0"}
              className="w-8 h-8 transition-colors"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        ))}
      </div>
    )
  }

  const renderSuccessContent = () => (
    <div className="flex flex-col items-center py-6">
      <div className="relative mb-4">
        <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-red-500 rounded-full blur-md opacity-75"></div>
        <div className="relative bg-white p-4 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mt-4">Thank you for sharing your ordering experience</h2>
      <p className="text-center text-gray-500 mt-2">
        Your feedback will help us in serving you better, thanks once again for sharing your feedback
      </p>

      <Button className="mt-8 gradient-button" onClick={onClose}>
        Go Home
      </Button>
    </div>
  )

  const renderRatingContent = () => (
    <>
      <div className="flex flex-col items-center py-6">
        <div className="relative mb-4">
          <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-red-500 rounded-full blur-md opacity-75"></div>
          <div className="relative bg-white p-4 rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mt-4">Rate your ordering experience</h2>
      </div>

      <div className="space-y-8">
        {orderId && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-center">Rate the order</h3>
            {renderOrderRatingOptions()}
          </div>
        )}

        {riderId && (
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-center">Rate the rider</h3>
            {renderRiderRatingStars()}
          </div>
        )}

        {!orderId && (
          <div className="flex justify-center mb-4">
            {[...Array(5)].map((_, i) => {
              const ratingValue = i + 1
              return (
                <Star
                  key={i}
                  className={`w-8 h-8 cursor-pointer transition text-yellow-500 ${
                    ratingValue <= (hoveredRating || rating) ? "fill-current" : "text-gray-300"
                  }`}
                  onMouseEnter={() => setHoveredRating(ratingValue)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(ratingValue)}
                />
              )
            })}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-medium">Tell us more</h3>
          <Textarea placeholder="Write here" value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
        </div>

        <AnimatePresence>
          {hasInput && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                className="w-full gradient-button"
                onClick={handleSubmit}
                disabled={isSubmitting || orderRating === 0}
              >
                {isSubmitting ? <AnimatedLoader size="small" /> : "Submit"}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {!orderId && (
          <button
            type="submit"
            className="w-full py-3 rounded-md bg-accent text-white font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        )}
      </div>
    </>
  )

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md p-6">
        {isSuccess ? renderSuccessContent() : renderRatingContent()}
      </DialogContent>
    </Dialog>
  )
}
