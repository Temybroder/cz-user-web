import { NextResponse } from "next/server"

const EXTERNAL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, subscriptionMealPlan, startDate, deliveryDays, deliveryAddress, totalAmount, paymentId } = body

    // Validate required fields before forwarding
    if (!userId || !subscriptionMealPlan || !startDate || !deliveryDays || !deliveryAddress || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    // Forward to external API
    const externalResponse = await fetch(`${EXTERNAL_API_BASE}/api/user/order/user-create-sub-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    })

    const responseData = await externalResponse.json()
    console.log("RESPONSE CONTENT IS " + responseData)
    if (!externalResponse.ok) {
      return NextResponse.json(responseData, { status: externalResponse.status })
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}