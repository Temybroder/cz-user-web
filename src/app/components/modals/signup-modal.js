"use client"

import { useState } from "react"
import { UserPlus } from "lucide-react"
import { CustomModal } from "@/app/components/ui/custom-modal"
import { GradientButton } from "@/app/components/ui/gradient-button"
import { Label } from "@/app/components/ui/label"
import { Input } from "@/app/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { useAppContext } from "@/context/app-context"
import VerifyOTPModal from "./otp-verification-modal"

/**
 * Sign-up Modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {Function} props.onLoginClick - Function to open login modal
 * @returns {JSX.Element} The sign-up modal component
 */
export default function SignupModal({ isOpen, onClose, onLoginClick }) {
  const { registerUser, verifyRegistrationOTP } = useAppContext()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    countryCode: "+234",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [fullPhoneNumber, setFullPhoneNumber] = useState("")
  const [pinId, setPinId] = useState("")
  const [userId, setUserId] = useState("")
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCountryCodeChange = (value) => {
    setFormData((prev) => ({ ...prev, countryCode: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phoneNumber) {
      setError("Please fill in all required fields")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      // Format the phone number
      const formattedPhoneNumber = `${formData.countryCode}${formData.phoneNumber}`
      setFullPhoneNumber(formattedPhoneNumber)

      console.log("Signup Modal: Registering user", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formattedPhoneNumber,
      })

      // Register user using the context function
      const response = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formattedPhoneNumber,
      })

      console.log("Signup Modal: Registration response", response)

      // Store the pinId and userId from the response
      setPinId(response.pinId)
      setUserId(response.userId)
      setShowOtpModal(true)
    } catch (error) {
      console.error("Signup Modal: Error registering user:", error)
      setError(error.message || "Failed to register. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOTP = async (enteredOtp) => {
    console.log("Signup Modal: Completing registration", {
      phoneNumber: fullPhoneNumber,
      pinId,
      otp: enteredOtp,
      userId,
    })
    try {
      // Complete registration using the context function
      await verifyRegistrationOTP(fullPhoneNumber, pinId, enteredOtp, userId)

      // Close modals and redirect
      setShowOtpModal(false)
      onClose()
    } catch (error) {
      console.error("Signup Modal: Error verifying OTP:", error)
      throw error
    }
  }

  const renderFlag = (code) => {
    switch (code) {
      case "+234":
        return (
          <div className="w-5 h-3.5 bg-green-600 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1/3 h-full bg-white"></div>
            </div>
          </div>
        )
      case "+1":
        return (
          <div className="w-5 h-3.5 bg-blue-600 relative overflow-hidden">
            <div className="absolute w-full h-full flex">
              {[...Array(13)].map((_, i) => (
                <div key={i} className="h-full w-0.5 bg-white"></div>
              ))}
            </div>
            <div className="absolute top-0 left-0 w-7 h-3.5 bg-red-600"></div>
          </div>
        )
      case "+44":
        return <div className="w-5 h-3.5 bg-gradient-to-r from-blue-600 via-white to-red-600"></div>
      default:
        return null
    }
  }

  return (
    <>
      <CustomModal
        isOpen={isOpen && !showOtpModal}
        onClose={onClose}
        title="Create an account"
        description="Join Conzooming to order food, groceries, and more"
        className="max-w-md"
        hideCloseButton
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-red-500 rounded-full blur-md opacity-75"></div>
            <div className="relative bg-white p-4 rounded-full">
              <UserPlus className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Sign Up</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
            Create your account to get started with Conzooming
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </Label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                className="h-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </Label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                className="h-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              className="h-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </Label>
            <div className="flex gap-2">
              <div className="w-28">
                <Select value={formData.countryCode} onValueChange={handleCountryCodeChange}>
                  <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {renderFlag(formData.countryCode)}
                        <span className="text-gray-900 dark:text-white">{formData.countryCode}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <SelectItem value="+234">
                      <div className="flex items-center gap-2">
                        {renderFlag("+234")}
                        <span>+234 (NG)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="+1">
                      <div className="flex items-center gap-2">
                        {renderFlag("+1")}
                        <span>+1 (US)</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="+44">
                      <div className="flex items-center gap-2">
                        {renderFlag("+44")}
                        <span>+44 (UK)</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                placeholder="812 345 6789"
                className="h-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">We&apos;ll send a verification code to this number</p>
          </div>

          <GradientButton
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-lg font-medium text-white transition-all hover:shadow-lg"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              "Create Account"
            )}
          </GradientButton>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onLoginClick}
              className="font-medium text-amber-600 dark:text-amber-500 hover:underline transition-colors"
            >
              Log in
            </button>
          </div>
        </form>
      </CustomModal>

      <VerifyOTPModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        phoneNumber={fullPhoneNumber}
        pinId={pinId}
        onVerify={handleVerifyOTP}
        isRegistration={true}
        userId={userId}
      />
    </>
  )
}
