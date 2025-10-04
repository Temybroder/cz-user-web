import { NextResponse } from "next/server"

const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL || "http://localhost:5000"

export async function POST(request) {
  try {
    const body = await request.json()

    // Forward the request to the external API
    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/order/user-create-meal-plan`, {
      method: "POST",
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
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
     console.error("Error creating meal plan:", error)
    return NextResponse.json({ error: "Failed to create meal plan" }, { status: 500 })
  }
}













// import { NextResponse } from "next/server"

// // Enhanced mock data generation
// const generateMockMealPlan = (considerPreferences = false, userId = null) => {
//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

//   // Sample meal contents with more variety
//   const mealOptions = {
//     breakfast: [
//       { name: "Oatmeal with berries", contents: ["Oatmeal", "Mixed berries", "Honey"] },
//       { name: "Scrambled eggs with toast", contents: ["Eggs", "Whole grain toast", "Avocado"] },
//       { name: "Smoothie bowl", contents: ["Banana smoothie", "Granola", "Chia seeds"] },
//       { name: "Pancakes", contents: ["Pancakes", "Maple syrup", "Fresh fruits"] },
//       { name: "Yogurt parfait", contents: ["Greek yogurt", "Granola", "Berries"] },
//     ],
//     lunch: [
//       { name: "Grilled chicken salad", contents: ["Grilled chicken", "Mixed greens", "Vinaigrette"] },
//       { name: "Jollof rice with chicken", contents: ["Jollof rice", "Grilled chicken", "Plantain"] },
//       { name: "Pasta primavera", contents: ["Pasta", "Mixed vegetables", "Olive oil"] },
//       { name: "Fish and chips", contents: ["Fried fish", "Sweet potato fries", "Coleslaw"] },
//       { name: "Vegetable soup", contents: ["Mixed vegetables", "Bread roll", "Herbs"] },
//     ],
//     dinner: [
//       { name: "Grilled salmon", contents: ["Salmon fillet", "Steamed vegetables", "Rice"] },
//       { name: "Beef stir fry", contents: ["Beef strips", "Mixed vegetables", "Noodles"] },
//       { name: "Chicken curry", contents: ["Chicken", "Curry sauce", "Basmati rice"] },
//       { name: "Vegetable lasagna", contents: ["Lasagna", "Mixed vegetables", "Cheese"] },
//       { name: "Pork chops", contents: ["Pork chops", "Mashed potatoes", "Green beans"] },
//     ],
//   }

//   const planDetails = days.map((day) => {
//     const meals = [][
//       // Generate meals for each class
//       ("breakfast", "lunch", "dinner")
//     ].forEach((mealClass) => {
//       const options = mealOptions[mealClass]
//       const selectedMeal = options[Math.floor(Math.random() * options.length)]

//       const basePrice = mealClass === "breakfast" ? 1500 : mealClass === "lunch" ? 2500 : 3500
//       const price = basePrice + Math.floor(Math.random() * 1000)

//       meals.push({
//         status: "pending",
//         mealContents: selectedMeal.contents,
//         mealClass: mealClass,
//         deliveryTime: new Date(
//           new Date().setHours(mealClass === "breakfast" ? 8 : mealClass === "lunch" ? 13 : 19, 0, 0, 0),
//         ).toISOString(),
//         orderBody: `${mealClass} order - ${selectedMeal.name}`,
//         orderSubTotal: price,
//         totalAmount: price,
//         partnerBusinessBranchId: "pb" + Math.floor(Math.random() * 5 + 1),
//         noteToRider: "Please deliver on time",
//         imageUrl: `/placeholder.svg?height=128&width=128&query=${selectedMeal.name}`,
//         mealName: selectedMeal.name,
//       })
//     })

//     return {
//       dayOfWeek: day,
//       meals,
//     }
//   })

//   return {
//     _id: "mp" + Math.floor(Math.random() * 10000),
//     userId: userId || "user123",
//     planDetails,
//     considerNutritionalPreferences: considerPreferences,
//     createdAt: new Date().toISOString(),
//     updatedAt: new Date().toISOString(),
//   }
// }

// export async function POST(request) {
//   try {
//     const body = await request.json()
//     const { userId, considerNutritionalPreferences = false } = body

//     // Generate meal plan
//     const mealPlan = generateMockMealPlan(considerNutritionalPreferences, userId)

//     return NextResponse.json(mealPlan, { status: 201 })
//   } catch (error) {
//     console.error("Error creating meal plan:", error)
//     return NextResponse.json({ error: "Failed to create meal plan" }, { status: 500 })
//   }
// }
