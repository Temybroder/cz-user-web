
import { NextResponse } from "next/server"

const EXTERNAL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export async function GET(request, { params }) {
  try {
    const { mealPlanId } = params

    const authHeader = request.headers.get("authorization")

    if (!authHeader) {
      return NextResponse.json({ error: "Authorization required" }, { status: 401 })
    }

    // Forward to external API
    const externalResponse = await fetch(`${EXTERNAL_API_BASE}/api/user/order/get-meal-plans/:${mealPlanId}`, {
      method: "GET",
      headers: {
        Authorization: authHeader,
      },
    })

    const responseData = await externalResponse.json()

    if (!externalResponse.ok) {
      return NextResponse.json(responseData, { status: externalResponse.status })
    }

    return NextResponse.json(responseData.data)
  } catch (error) {
    console.error("Error fetching meal plans:", error)
    return NextResponse.json({ error: "Failed to fetch meal plans" }, { status: 500 })
  }
}




















// export async function GET(request) {
//   // In a real application, this would fetch from the database
//   // For now, we'll return a mock response with data matching the schema

//   const mockMealPlan = {
//     userId: "user123",
//     subscriptionId: "sub456",
//     planDetails: [
//       {
//         dayOfWeek: "Monday",
//         meals: [
//           {
//             status: "pending",
//             mealContents: ["product1", "product2", "product3"],
//             mealClass: "breakfast",
//             deliveryTime: new Date(new Date().setHours(8, 0, 0)).toISOString(),
//             orderBody: "Breakfast order",
//             orderSubTotal: 2500,
//             totalAmount: 3000,
//             partnerBusinessBranchId: "vendor1",
//             noteToRider: "Please deliver to reception",
//             imageUrl: "/placeholder-ew947.png",
//           },
//           {
//             status: "pending",
//             mealContents: ["product4", "product5"],
//             mealClass: "lunch",
//             deliveryTime: new Date(new Date().setHours(13, 0, 0)).toISOString(),
//             orderBody: "Lunch order",
//             orderSubTotal: 3500,
//             totalAmount: 4000,
//             partnerBusinessBranchId: "vendor2",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//           {
//             status: "pending",
//             mealContents: ["product6", "product7", "product8"],
//             mealClass: "dinner",
//             deliveryTime: new Date(new Date().setHours(19, 0, 0)).toISOString(),
//             orderBody: "Dinner order",
//             orderSubTotal: 4500,
//             totalAmount: 5000,
//             partnerBusinessBranchId: "vendor3",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//         ],
//       },
//       {
//         dayOfWeek: "Tuesday",
//         meals: [
//           {
//             status: "pending",
//             mealContents: ["product9", "product10"],
//             mealClass: "breakfast",
//             deliveryTime: new Date(new Date().setHours(8, 0, 0)).toISOString(),
//             orderBody: "Breakfast order",
//             orderSubTotal: 2000,
//             totalAmount: 2500,
//             partnerBusinessBranchId: "vendor1",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//           {
//             status: "pending",
//             mealContents: ["product11", "product12", "product13"],
//             mealClass: "lunch",
//             deliveryTime: new Date(new Date().setHours(13, 0, 0)).toISOString(),
//             orderBody: "Lunch order",
//             orderSubTotal: 3800,
//             totalAmount: 4300,
//             partnerBusinessBranchId: "vendor2",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//           {
//             status: "pending",
//             mealContents: ["product14", "product15"],
//             mealClass: "dinner",
//             deliveryTime: new Date(new Date().setHours(19, 0, 0)).toISOString(),
//             orderBody: "Dinner order",
//             orderSubTotal: 4200,
//             totalAmount: 4700,
//             partnerBusinessBranchId: "vendor3",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//         ],
//       },
//       {
//         dayOfWeek: "Wednesday",
//         meals: [
//           {
//             status: "pending",
//             mealContents: ["product16", "product17", "product18"],
//             mealClass: "breakfast",
//             deliveryTime: new Date(new Date().setHours(8, 0, 0)).toISOString(),
//             orderBody: "Breakfast order",
//             orderSubTotal: 2300,
//             totalAmount: 2800,
//             partnerBusinessBranchId: "vendor1",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//           {
//             status: "pending",
//             mealContents: ["product19", "product20"],
//             mealClass: "lunch",
//             deliveryTime: new Date(new Date().setHours(13, 0, 0)).toISOString(),
//             orderBody: "Lunch order",
//             orderSubTotal: 3600,
//             totalAmount: 4100,
//             partnerBusinessBranchId: "vendor2",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//           {
//             status: "pending",
//             mealContents: ["product21", "product22", "product23"],
//             mealClass: "dinner",
//             deliveryTime: new Date(new Date().setHours(19, 0, 0)).toISOString(),
//             orderBody: "Dinner order",
//             orderSubTotal: 4800,
//             totalAmount: 5300,
//             partnerBusinessBranchId: "vendor3",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//         ],
//       },
//       {
//         dayOfWeek: "Thursday",
//         meals: [
//           {
//             status: "pending",
//             mealContents: ["product24", "product25"],
//             mealClass: "breakfast",
//             deliveryTime: new Date(new Date().setHours(8, 0, 0)).toISOString(),
//             orderBody: "Breakfast order",
//             orderSubTotal: 2100,
//             totalAmount: 2600,
//             partnerBusinessBranchId: "vendor1",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//           {
//             status: "pending",
//             mealContents: ["product26", "product27", "product28"],
//             mealClass: "lunch",
//             deliveryTime: new Date(new Date().setHours(13, 0, 0)).toISOString(),
//             orderBody: "Lunch order",
//             orderSubTotal: 3900,
//             totalAmount: 4400,
//             partnerBusinessBranchId: "vendor2",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//           {
//             status: "pending",
//             mealContents: ["product29", "product30"],
//             mealClass: "dinner",
//             deliveryTime: new Date(new Date().setHours(19, 0, 0)).toISOString(),
//             orderBody: "Dinner order",
//             orderSubTotal: 4100,
//             totalAmount: 4600,
//             partnerBusinessBranchId: "vendor3",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//         ],
//       },
//       {
//         dayOfWeek: "Friday",
//         meals: [
//           {
//             status: "pending",
//             mealContents: ["product31", "product32", "product33"],
//             mealClass: "breakfast",
//             deliveryTime: new Date(new Date().setHours(8, 0, 0)).toISOString(),
//             orderBody: "Breakfast order",
//             orderSubTotal: 2400,
//             totalAmount: 2900,
//             partnerBusinessBranchId: "vendor1",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//           {
//             status: "pending",
//             mealContents: ["product34", "product35"],
//             mealClass: "lunch",
//             deliveryTime: new Date(new Date().setHours(13, 0, 0)).toISOString(),
//             orderBody: "Lunch order",
//             orderSubTotal: 3700,
//             totalAmount: 4200,
//             partnerBusinessBranchId: "vendor2",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//           {
//             status: "pending",
//             mealContents: ["product36", "product37", "product38"],
//             mealClass: "dinner",
//             deliveryTime: new Date(new Date().setHours(19, 0, 0)).toISOString(),
//             orderBody: "Dinner order",
//             orderSubTotal: 4900,
//             totalAmount: 5400,
//             partnerBusinessBranchId: "vendor3",
//             noteToRider: "",
//             imageUrl: "/placeholder-ew947.png",
//           },
//         ],
//       },
//     ],
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   }

//   return Response.json({
//     data: mockMealPlan,
//   })
// }
