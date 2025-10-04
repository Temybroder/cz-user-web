import { NextResponse } from "next/server"

const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL || "http://localhost:5000"

export async function GET(request) {
  try {
    // Get query parameters from the request
    const { searchParams } = new URL(request.url)
    const queryString = searchParams.toString()

    // Forward the request to the external API
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/order/meal-plans${queryString ? `?${queryString}` : ""}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // Forward authentication headers
        ...(request.headers.get("authorization") && {
          Authorization: request.headers.get("authorization"),
        }),
        ...(request.headers.get("cookie") && {
          Cookie: request.headers.get("cookie"),
        }),
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error forwarding request to external API to fetch Meal Plan:", error)
    return NextResponse.json({ error: "Failed to process fetch Meal Plan request" }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    // Forward the request to the external API
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/order/user-create-meal-plan`, {
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
    console.error("Error forwarding request to external API:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}















// import { NextResponse } from "next/server"

// // Mock data for meal plans
// const generateMockMealPlan = (useNutritionalPreference = false) => {
//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
//   const mealClasses = ["breakfast", "lunch", "dinner", "snack"]

//   // Sample meal contents
//   const breakfastOptions = [
//     { id: "p1", name: "Oatmeal" },
//     { id: "p2", name: "Eggs Benedict" },
//     { id: "p3", name: "Pancakes" },
//     { id: "p4", name: "Fruit Salad" },
//     { id: "p5", name: "Yogurt Parfait" },
//   ]

//   const lunchOptions = [
//     { id: "p6", name: "Chicken Salad" },
//     { id: "p7", name: "Vegetable Soup" },
//     { id: "p8", name: "Sandwich" },
//     { id: "p9", name: "Rice and Stew" },
//     { id: "p10", name: "Pasta" },
//   ]

//   const dinnerOptions = [
//     { id: "p11", name: "Grilled Salmon" },
//     { id: "p12", name: "Steak" },
//     { id: "p13", name: "Vegetable Curry" },
//     { id: "p14", name: "Roast Chicken" },
//     { id: "p15", name: "Stir Fry" },
//   ]

//   const snackOptions = [
//     { id: "p16", name: "Fruit" },
//     { id: "p17", name: "Nuts" },
//     { id: "p18", name: "Yogurt" },
//     { id: "p19", name: "Protein Bar" },
//     { id: "p20", name: "Smoothie" },
//   ]

//   // Generate random meal plan
//   const planDetails = days.map((day) => {
//     // Generate random meals for each day
//     const meals = []

//     // Add breakfast
//     meals.push({
//       status: "pending",
//       mealContents: [
//         breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)],
//         breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)],
//       ],
//       mealClass: "breakfast",
//       deliveryTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
//       orderBody: "Breakfast order",
//       orderSubTotal: Math.floor(Math.random() * 2000) + 1000,
//       totalAmount: Math.floor(Math.random() * 2000) + 1000,
//       partnerBusinessBranchId: "pb" + Math.floor(Math.random() * 10),
//       noteToRider: "Please deliver on time",
//       imageUrl: `/placeholder.svg?height=128&width=128&query=breakfast meal`,
//     })

//     // Add lunch
//     meals.push({
//       status: "pending",
//       mealContents: [
//         lunchOptions[Math.floor(Math.random() * lunchOptions.length)],
//         lunchOptions[Math.floor(Math.random() * lunchOptions.length)],
//       ],
//       mealClass: "lunch",
//       deliveryTime: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
//       orderBody: "Lunch order",
//       orderSubTotal: Math.floor(Math.random() * 3000) + 2000,
//       totalAmount: Math.floor(Math.random() * 3000) + 2000,
//       partnerBusinessBranchId: "pb" + Math.floor(Math.random() * 10),
//       noteToRider: "Please deliver on time",
//       imageUrl: `/placeholder.svg?height=128&width=128&query=lunch meal`,
//     })

//     // Add dinner
//     meals.push({
//       status: "pending",
//       mealContents: [
//         dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)],
//         dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)],
//       ],
//       mealClass: "dinner",
//       deliveryTime: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
//       orderBody: "Dinner order",
//       orderSubTotal: Math.floor(Math.random() * 4000) + 3000,
//       totalAmount: Math.floor(Math.random() * 4000) + 3000,
//       partnerBusinessBranchId: "pb" + Math.floor(Math.random() * 10),
//       noteToRider: "Please deliver on time",
//       imageUrl: `/placeholder.svg?height=128&width=128&query=dinner meal`,
//     })

//     return {
//       dayOfWeek: day,
//       meals,
//     }
//   })

//   return {
//     _id: "mp" + Math.floor(Math.random() * 1000),
//     userId: "user123",
//     planDetails,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   }
// }

// export async function POST(request) {
//   try {
//     const body = await request.json()
//     const { useNutritionalPreference } = body

//     // Generate mock meal plan
//     const mealPlan = generateMockMealPlan(useNutritionalPreference)

//     return NextResponse.json(mealPlan, { status: 201 })
//   } catch (error) {
//     console.error("Error creating meal plan:", error)
//     return NextResponse.json({ error: "Failed to create meal plan" }, { status: 500 })
//   }
// }

// export async function GET() {
//   try {
//     // Generate mock meal plan
//     const mealPlan = generateMockMealPlan()

//     return NextResponse.json(mealPlan)
//   } catch (error) {
//     console.error("Error fetching meal plan:", error)
//     return NextResponse.json({ error: "Failed to fetch meal plan" }, { status: 500 })
//   }
// }
