import { NextResponse } from "next/server"

const EXTERNAL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    const externalResponse = await fetch(`${EXTERNAL_API_BASE}/api/user/order/nutritional-preferences/:${userId}`, {
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
    console.error("Error fetching nutritional preferences:", error)
    return NextResponse.json({ error: "Failed to fetch preferences" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    const externalResponse = await fetch(`${EXTERNAL_API_BASE}/nutritional-preferences`, {
      method: "POST",
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
    console.error("Error creating nutritional preferences:", error)
    return NextResponse.json({ error: "Failed to create preferences" }, { status: 500 })
  }
}
