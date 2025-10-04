import { NextResponse } from "next/server"

const EXTERNAL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    // Forward to external API with query parameters
    const externalResponse = await fetch(`${EXTERNAL_API_BASE}/api/user/order/nutritional-preferences/check/:${userId}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    })

    const responseData = await externalResponse.json()

    if (!externalResponse.ok) {
      return NextResponse.json(responseData, { status: externalResponse.status })
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error checking preferences availability:", error)
    return NextResponse.json({ error: "Failed to check preferences" }, { status: 500 })
  }
}















// import { NextResponse } from "next/server"

// export async function GET(request) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const userId = searchParams.get("userId")

//     if (!userId) {
//       return NextResponse.json({ error: "User ID is required" }, { status: 400 })
//     }

//     // Mock check - in real app, this would check the database
//     // For demo purposes, randomly return true/false
//     const hasPreferences = Math.random() > 0.3 // 70% chance of having preferences

//     return NextResponse.json({ hasPreferences })
//   } catch (error) {
//     console.error("Error checking preferences availability:", error)
//     return NextResponse.json({ error: "Failed to check preferences" }, { status: 500 })
//   }
// }
