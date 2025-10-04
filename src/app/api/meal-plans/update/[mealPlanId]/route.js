import { NextResponse } from "next/server"

const EXTERNAL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function PUT(request, { params }) {
  try {
    const { mealPlanId } = params
    const body = await request.json()

    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    // Forward to external API
    const externalResponse = await fetch(`${EXTERNAL_API_BASE}/api/user/order/user-update-meal-plan`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    })

    const responseData = await externalResponse.json()

    if (!externalResponse.ok) {
      return NextResponse.json(responseData, { status: externalResponse.status })
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error updating meal plan:", error)
    return NextResponse.json({ error: "Failed to update meal plan" }, { status: 500 })
  }
}















// import { NextResponse } from "next/server"

// export async function PUT(request, { params }) {
//   try {
//     const { mealPlanId } = params
//     const body = await request.json()
//     const { planDetails } = body

//     // In a real application, this would update the meal plan in the database
//     console.log("Updating meal plan:", mealPlanId, "with data:", planDetails)

//     // Mock successful update
//     return NextResponse.json({
//       success: true,
//       message: "Meal plan updated successfully",
//       mealPlanId,
//       updatedPlanDetails: planDetails,
//     })
//   } catch (error) {
//     console.error("Error updating meal plan:", error)
//     return NextResponse.json({ error: "Failed to update meal plan" }, { status: 500 })
//   }
// }
