import { NextResponse } from "next/server"

const EXTERNAL_API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || process.env.EXTERNAL_API_BASE_URL || "http://localhost:5000"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 })
    }

    // Call the correct backend endpoint
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/order/check-health-profile/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization"),
        }),
        ...(request.headers.get("cookie") && {
          Cookie: request.headers.get("cookie"),
        }),
      },
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to check health profile",
        },
        { status: response.status }
      )
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      hasProfile: data.hasProfile || false,
      profileId: data.profileId || null,
    })
  } catch (error) {
    console.error("Error checking nutritional preferences:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}
