import { NextResponse } from "next/server"

// External API base URL
const EXTERNAL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function PUT(request) {
  try {
    const body = await request.json()
    const { mealPlanId, day, mealClass, meal, mealIndex } = body

    // Get authorization header from the incoming request
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    // Forward the request to external API
    const externalResponse = await fetch(`${EXTERNAL_API_BASE}/api/user/order/user-update-meal-plan`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader, // Forward the auth header
      },
      body: JSON.stringify({
        mealPlanId,
        day,
        mealClass,
        meal,
        mealIndex,
      }),
    })

    const responseData = await externalResponse.json()

    // Forward the response status and data
    if (!externalResponse.ok) {
      return NextResponse.json(responseData, { status: externalResponse.status })
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error proxying meal plan update:", error)

    // Handle network errors or external API unavailability
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      return NextResponse.json({ error: "External API unavailable for meal-plan update" }, { status: 503 })
    }

    return NextResponse.json({ error: "Failed to update meal plan" }, { status: 500 })
  }
}
