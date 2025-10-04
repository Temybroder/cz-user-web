import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()
    const { userId, subscriptionMealPlan, startDate, deliveryDays, deliveryAddress, totalAmount, paymentId } = body

    // Validate required fields
    if (!userId || !subscriptionMealPlan || !startDate || !deliveryDays || !deliveryAddress || !totalAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Calculate end date (e.g., 4 weeks from start date)
    const startDateObj = new Date(startDate)
    const endDate = new Date(startDateObj)
    endDate.setDate(startDateObj.getDate() + 28) // 4 weeks

    // Create subscription object
    const subscription = {
      _id: `sub_${Date.now()}`,
      userId,
      subscriptionMealPlan,
      startDate,
      endDate: endDate.toISOString(),
      isActive: true,
      deliveryDays,
      deliveryAddress,
      totalAmount,
      currency: "NGN",
      paymentStatus: "successful",
      paymentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real application, this would save to the database
    console.log("Creating subscription:", subscription)

    return NextResponse.json(
      {
        success: true,
        message: "Subscription created successfully",
        subscription,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating subscription:", error)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }
}
