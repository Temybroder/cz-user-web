"use client"

import { useState, useRef, useEffect } from "react"
import { CustomModal } from "@/app/components/ui/custom-modal"
import { GradientButton } from "@/app/components/ui/gradient-button"
import { Input } from "@/app/components/ui/input"

/**
 * OTP Verification Modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {string} props.phoneNumber - User phone number
 * @param {string} props.pinId - PIN ID for OTP verification
 * @param {Function} props.onVerify - Function to verify OTP
 * @param {boolean} props.isRegistration - Whether this is for registration or login
 * @param {string} [props.userId] - User ID (only needed for registration)
 * @returns {JSX.Element} The OTP verification modal component
 */
export default function VerifyOTPModal({
  isOpen,
  onClose,
  phoneNumber,
  pinId,
  onVerify,
  isRegistration = false,
  userId,
}) {
  const [otp, setOtp] = useState(["", "", "", "", ""])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const inputRefs = useRef([])

  // Set up timer
  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  // Focus first input on open
  useEffect(() => {
    if (isOpen && inputRefs.current[0]) {
      setTimeout(() => {
        inputRefs.current[0].focus()
      }, 100)
    }
  }, [isOpen])

  const handleChange = (index, value) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 4 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text/plain").trim()

    // Check if pasted content is a 5-digit number
    if (/^\d{5}$/.test(pastedData)) {
      const digits = pastedData.split("")
      setOtp(digits)

      // Focus the last input
      if (inputRefs.current[4]) {
        inputRefs.current[4].focus()
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpValue = otp.join("")

    if (otpValue.length !== 5) {
      setError("Please enter all 5 digits of the verification code")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      console.log(`OTP Modal: Verifying OTP for ${isRegistration ? "registration" : "login"}`, {
        otpValue,
        pinId,
        isRegistration,
        userId: isRegistration ? userId : undefined,
      })

      await onVerify(otpValue)
    } catch (error) {
      console.error("OTP Modal: Error verifying OTP:", error)
      setError(error.message || "Invalid verification code. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = () => {
    // Reset timer
    setTimeLeft(60)
    // TODO: Implement resend OTP functionality
  }

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Verify Your Phone"
      description={`Enter the 5-digit code sent to ${phoneNumber}`}
      className="max-w-md"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-amber-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Verification Code</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
          {isRegistration ? "Enter the code to complete your registration" : "Enter the code to verify your identity"}
        </p>
      </div>

      {error && <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center space-x-3">
          {otp.map((digit, index) => (
            <Input
              key={index}
              type="text"
              maxLength={1}
              className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              ref={(el) => (inputRefs.current[index] = el)}
              inputMode="numeric"
              pattern="[0-9]*"
            />
          ))}
        </div>

        <GradientButton
          type="submit"
          disabled={isLoading || otp.join("").length !== 5}
          className="w-full h-12 rounded-lg font-medium text-white transition-all hover:shadow-lg"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Verifying...</span>
            </div>
          ) : (
            "Verify"
          )}
        </GradientButton>

        <div className="text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Didn&apos;t receive the code?</p>
          <button
            type="button"
            onClick={handleResendOTP}
            disabled={timeLeft > 0}
            className={`text-sm font-medium ${
              timeLeft > 0
                ? "text-gray-400 dark:text-gray-500 cursor-not-allowed"
                : "text-amber-600 dark:text-amber-500 hover:underline"
            }`}
          >
            {timeLeft > 0 ? `Resend code in ${timeLeft}s` : "Resend code"}
          </button>
        </div>
      </form>
    </CustomModal>
  )
}
