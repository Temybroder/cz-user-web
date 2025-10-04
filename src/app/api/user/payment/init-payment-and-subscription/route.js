import { NextResponse } from "next/server"

const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL || "http://localhost:5000"

export async function POST(request) {
  try {
    const body = await request.json()

    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/payment/init-payment-and-subscription`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization"),
        }),
        ...(request.headers.get("cookie") && {
          Cookie: request.headers.get("cookie"),
        }),
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error initializing payment and subscription:", error)
    return NextResponse.json(
      { success: false, error: "Failed to initialize payment and subscription" },
      { status: 500 }
    )
  }
}
