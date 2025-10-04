import { NextResponse } from "next/server"

const EXTERNAL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function GET(request, { params }) {
  try {
    const { userId } = await params

    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    // Forward to external API
    const externalResponse = await fetch(`${EXTERNAL_API_BASE}/api/user/order/list-meal-plans/:${userId}`, {
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
    console.error("Error fetching meal plans:", error)
    return NextResponse.json({ error: "Failed to fetch meal plans" }, { status: 500 })
  }
}
















// import { NextResponse } from "next/server"

// // Mock meal plans data
// const mockMealPlans = [
//   {
//     _id: "mp001",
//     userId: "user123",
//     planDetails: [
//       {
//         dayOfWeek: "Monday",
//         meals: [
//           {
//             status: "pending",
//             mealContents: ["Oatmeal", "Berries", "Honey"],
//             mealClass: "breakfast",
//             deliveryTime: new Date().toISOString(),
//             orderBody: "Breakfast order",
//             orderSubTotal: 1500,
//             totalAmount: 1500,
//             partnerBusinessBranchId: "pb1",
//             noteToRider: "Please deliver on time",
//             imageUrl: "/placeholder.svg?height=128&width=128",
//           },
//         ],
//       },
//     ],
//     considerNutritionalPreferences: true,
//     createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
//     updatedAt: new Date().toISOString(),
//   },
//   {
//     _id: "mp002",
//     userId: "user123",
//     planDetails: [
//       {
//         dayOfWeek: "Tuesday",
//         meals: [
//           {
//             status: "pending",
//             mealContents: ["Scrambled Eggs", "Toast", "Avocado"],
//             mealClass: "breakfast",
//             deliveryTime: new Date().toISOString(),
//             orderBody: "Breakfast order",
//             orderSubTotal: 1800,
//             totalAmount: 1800,
//             partnerBusinessBranchId: "pb2",
//             noteToRider: "Please deliver on time",
//             imageUrl: "/placeholder.svg?height=128&width=128",
//           },
//         ],
//       },
//     ],
//     considerNutritionalPreferences: false,
//     createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
//     updatedAt: new Date().toISOString(),
//   },
// ]

// export async function GET(request, { params }) {
//   try {
//     const { userId } = params

//     // In a real application, this would query the database
//     // For now, return mock data if userId matches
//     const userMealPlans = mockMealPlans.filter((plan) => plan.userId === userId)

//     return NextResponse.json({
//       success: true,
//       mealPlans: userMealPlans,
//       count: userMealPlans.length,
//     })
//   } catch (error) {
//     console.error("Error fetching meal plans:", error)
//     return NextResponse.json({ error: "Failed to fetch meal plans" }, { status: 500 })
//   }
// }
