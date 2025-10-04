"use client"

import { useState } from "react"
import { Smartphone } from "lucide-react"
import { CustomModal } from "@/app/components/ui/custom-modal"
import { GradientButton } from "@/app/components/ui/gradient-button"
import { Label } from "@/app/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select"
import { Input } from "@/app/components/ui/input"
import { useAppContext } from "@/context/app-context"
import VerifyOTPModal from "./otp-verification-modal"
import SignupModal from "./signup-modal"

const DEBUG = true
const logDebug = (...args) => {
  if (DEBUG) {
    console.log(...args)
  }
}

export default function LoginModal({ isOpen, onClose, redirectAfterLogin }) {
  logDebug("LoginModal rendering")
  const context = useAppContext()
  logDebug("LoginModal context:", {
    hasRequestOTP: !!context.requestOTP,
    hasVerifyOTP: !!context.verifyLoginOTP,
  })

  const { requestOTP, verifyLoginOTP } = useAppContext()

  const [phoneNumber, setPhoneNumber] = useState("")
  const [countryCode, setCountryCode] = useState("+234")
  const [isLoading, setIsLoading] = useState(false)
  const [showOtpModal, setShowOtpModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)
  const [fullPhoneNumber, setFullPhoneNumber] = useState("")
  const [pinId, setPinId] = useState("")
  const [userId, setUserId] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!phoneNumber) {
      setError("Please enter your phone number")
      return
    }

    setError("")
    setIsLoading(true)

    try {
        const fullPhonePayload = {
              phoneCode: countryCode,
              phoneBody: phoneNumber
             }

      // Format the phone number
      const formattedPhoneNumber = `${countryCode}${phoneNumber}`
      setFullPhoneNumber(formattedPhoneNumber)

      logDebug("Login Modal: Requesting OTP for", fullPhonePayload)

      if (!requestOTP) {
        throw new Error("requestOTP function is not available")
      }

      // Request OTP using the context function
      const response = await requestOTP(fullPhonePayload)
      logDebug("Login Modal: OTP request response", response)

      // Store the pinId and userId from the response
      setPinId(response.pinId)
      setUserId(response.userId)
      setShowOtpModal(true)
    } catch (error) {
      console.error("Login Modal: Error requesting OTP:", error)
      setError(error.message || "Failed to request OTP. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }


  const handleVerifyLoginOTP = async (enteredOtp) => {
    logDebug("Login Modal: Verifying OTP", { enteredOtp, pinId })
    try {
      if (!verifyLoginOTP) {
        throw new Error("verifyLoginOTP function is not available")
      }

         const fullPhonePayload = {
              phoneCode: countryCode,
              phoneBody: phoneNumber
          }

      // Verify OTP using the context function
      await verifyLoginOTP(fullPhonePayload, enteredOtp, pinId)

      // Close modals
      setShowOtpModal(false)
      onClose()

      // Redirect if needed
      if (redirectAfterLogin) {
        window.location.href = redirectAfterLogin
      }
    } catch (error) {
      console.error("Login Modal: Error verifying OTP:", error)
      throw error
    }
  }

  const handleSignupClick = () => {
    setShowSignupModal(true)
  }

  const handleLoginClick = () => {
    setShowSignupModal(false)
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
        isOpen={isOpen && !showOtpModal && !showSignupModal}
        onClose={onClose}
        title="Welcome back"
        description="Login to your account to continue"
        className="max-w-md"
        hideCloseButton
      >
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-400 to-red-500 rounded-full blur-md opacity-75"></div>
            <div className="relative bg-white p-4 rounded-full">
              <Smartphone className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Phone Number Login</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
            Enter your phone number to receive a verification code
          </p>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </Label>
            <div className="flex gap-2">
              <div className="w-28">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="h-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {renderFlag(countryCode)}
                        <span className="text-gray-900 dark:text-white">{countryCode}</span>
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
                id="phone"
                type="tel"
                placeholder="812 345 6789"
                className="h-12 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
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
              "Continue"
            )}
          </GradientButton>

          <div className="text-center text-sm text-gray-500 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              onClick={handleSignupClick}
              className="font-medium text-amber-600 dark:text-amber-500 hover:underline transition-colors"
            >
              Sign up
            </button>
          </div>
        </form>
      </CustomModal>

      <VerifyOTPModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        phoneNumber={fullPhoneNumber}
        pinId={pinId}
        onVerify={handleVerifyLoginOTP}
        isRegistration={false}
      />

      <SignupModal isOpen={showSignupModal} onClose={onClose} onLoginClick={handleLoginClick} />
    </>
  )
}
