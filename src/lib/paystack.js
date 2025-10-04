/**
 * Paystack Integration Helper
 *
 * This module provides utility functions for integrating with Paystack payment gateway.
 * Documentation: https://paystack.com/docs/api/
 */

// Base Paystack API URL
const PAYSTACK_API_URL = "https://api.paystack.co"

// Helper function for making Paystack API requests
async function paystackRequest(endpoint, options = {}) {
  const url = `${PAYSTACK_API_URL}${endpoint}`

  // Get Paystack secret key from environment variables
  const secretKey = process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY

  if (!secretKey) {
    throw new Error("Paystack secret key is not configured")
  }

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`,
    },
  }

  const response = await fetch(url, { ...defaultOptions, ...options })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "An unknown error occurred" }))
    throw new Error(error.message || "Something went wrong with Paystack")
  }

  return response.json()
}

// Initialize a transaction and get a payment URL
export async function initializeTransaction(data) {
  const payload = {
    email: data.email,
    amount: data.amount * 100, // Paystack amount is in kobo (100 kobo = 1 Naira)
    callback_url: data.callbackUrl,
    reference: data.reference,
    metadata: data.metadata || {},
    currency: "NGN",
  }

  return paystackRequest("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify(payload),
  })
}

// Verify a transaction using the reference
export async function verifyTransaction(reference) {
  return paystackRequest(`/transaction/verify/${reference}`)
}

// Get banks list
export async function getBanks() {
  return paystackRequest("/bank")
}

// Resolve account number
export async function resolveAccountNumber(accountNumber, bankCode) {
  return paystackRequest(`/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`)
}

// Create a payment page for client-side integration
export function createPaymentLink(data) {
  // Generate a unique reference
  const reference = `CONZ_${Date.now()}_${Math.floor(Math.random() * 1000000)}`

  // Construct the payment data
  const paymentData = {
    key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
    email: data.email,
    amount: data.amount * 100, // Convert to kobo
    ref: reference,
    currency: "NGN",
    callback: (response) => {
      // Handle successful payment
      if (response.status === "success") {
        if (data.onSuccess) {
          data.onSuccess(response)
        }
      }
    },
    onClose: () => {
      // Handle when the Paystack modal is closed
      if (data.onClose) {
        data.onClose()
      }
    },
    metadata: {
      custom_fields: [
        {
          display_name: "Payment For",
          variable_name: "payment_for",
          value: data.paymentFor || "Wallet Top-up",
        },
        {
          display_name: "User ID",
          variable_name: "user_id",
          value: data.userId || "",
        },
      ],
    },
  }

  return { paymentData, reference }
}
