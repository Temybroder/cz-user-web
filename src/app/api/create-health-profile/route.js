import { NextResponse } from "next/server"

const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL || "http://localhost:5000"

export async function POST(request) {
  try {
    const body = await request.json()

    const response = await fetch(`${EXTERNAL_API_BASE_URL}/api/user/order/create-health-profile/${userId}`, {
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
    console.error("Error creating health profile:", error)
    return NextResponse.json({ error: "Failed to create health profile" }, { status: 500 })
  }
}





















// import { NextResponse } from "next/server"

// const EXTERNAL_API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.conzooming.com"

// // Mock function to generate meal plan based on preferences
// const generateMealPlanWithPreferences = (preferences) => {
//   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

//   // Sample meals that consider preferences
//   const getMealsBasedOnPreferences = (mealClass) => {
//     const baseMeals = {
//       breakfast: [
//         { name: "Oatmeal with fruits", contents: ["Oatmeal", "Fresh fruits"] },
//         { name: "Scrambled eggs", contents: ["Eggs", "Toast"] },
//         { name: "Smoothie bowl", contents: ["Smoothie", "Granola"] },
//       ],
//       lunch: [
//         { name: "Grilled chicken salad", contents: ["Grilled chicken", "Mixed greens"] },
//         { name: "Rice and stew", contents: ["Rice", "Tomato stew"] },
//         { name: "Pasta with vegetables", contents: ["Pasta", "Mixed vegetables"] },
//       ],
//       dinner: [
//         { name: "Grilled fish", contents: ["Fish", "Vegetables"] },
//         { name: "Chicken curry", contents: ["Chicken", "Curry sauce"] },
//         { name: "Vegetable stir fry", contents: ["Mixed vegetables", "Rice"] },
//       ],
//     }

//     let meals = [...baseMeals[mealClass]]

//     // Filter based on allergies
//     if (preferences.allergies) {
//       meals = meals.filter((meal) => {
//         return !preferences.allergies.some((allergy) =>
//           meal.contents.some((content) => content.toLowerCase().includes(allergy.toLowerCase())),
//         )
//       })
//     }

//     // Adjust spiciness
//     if (preferences.spiciness === "Mild") {
//       meals = meals.filter((meal) => !meal.name.toLowerCase().includes("curry"))
//     }

//     return meals.length > 0 ? meals : baseMeals[mealClass]
//   }

//   const planDetails = days.map((day) => {
//     const meals = []

//     // Add breakfast
//     const breakfastOptions = getMealsBasedOnPreferences("breakfast")
//     const breakfast = breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)]
//     meals.push({
//       status: "pending",
//       mealContents: breakfast.contents,
//       mealClass: "breakfast",
//       deliveryTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
//       orderBody: "Breakfast order",
//       orderSubTotal: Math.floor(Math.random() * 2000) + 1000,
//       totalAmount: Math.floor(Math.random() * 2000) + 1000,
//       partnerBusinessBranchId: "pb" + Math.floor(Math.random() * 10),
//       noteToRider: "Please deliver on time",
//       imageUrl: `/placeholder.svg?height=128&width=128&query=${breakfast.name}`,
//     })

//     // Add lunch
//     const lunchOptions = getMealsBasedOnPreferences("lunch")
//     const lunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)]
//     meals.push({
//       status: "pending",
//       mealContents: lunch.contents,
//       mealClass: "lunch",
//       deliveryTime: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
//       orderBody: "Lunch order",
//       orderSubTotal: Math.floor(Math.random() * 3000) + 2000,
//       totalAmount: Math.floor(Math.random() * 3000) + 2000,
//       partnerBusinessBranchId: "pb" + Math.floor(Math.random() * 10),
//       noteToRider: "Please deliver on time",
//       imageUrl: `/placeholder.svg?height=128&width=128&query=${lunch.name}`,
//     })

//     // Add dinner
//     const dinnerOptions = getMealsBasedOnPreferences("dinner")
//     const dinner = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)]
//     meals.push({
//       status: "pending",
//       mealContents: dinner.contents,
//       mealClass: "dinner",
//       deliveryTime: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
//       orderBody: "Dinner order",
//       orderSubTotal: Math.floor(Math.random() * 4000) + 3000,
//       totalAmount: Math.floor(Math.random() * 4000) + 3000,
//       partnerBusinessBranchId: "pb" + Math.floor(Math.random() * 10),
//       noteToRider: "Please deliver on time",
//       imageUrl: `/placeholder.svg?height=128&width=128&query=${dinner.name}`,
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
//     const { preferences, redirect } = body

//     const authHeader = request.headers.get("authorization")

//     if (!authHeader) {
//       return NextResponse.json({ error: "Authorization required" }, { status: 401 })
//     }

//     // Forward to external API
//     const externalResponse = await fetch(`${EXTERNAL_API_BASE}/api/user/order/create-health-profile:${userId}`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: authHeader,
//       },
//       body: JSON.stringify({ preferences, redirect }),
//     })

//     const responseData = await externalResponse.json()

//     if (!externalResponse.ok) {
//       return NextResponse.json(responseData, { status: externalResponse.status })
//     }

//     return NextResponse.json(responseData)
//   } catch (error) {
//     console.error("Error creating health profile:", error)
//     return NextResponse.json({ error: "Failed to create health profile" }, { status: 500 })
//   }
// }










// // import { NextResponse } from "next/server"

// // // Mock function to generate meal plan based on preferences
// // const generateMealPlanWithPreferences = (preferences) => {
// //   const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

// //   // Sample meals that consider preferences
// //   const getMealsBasedOnPreferences = (mealClass) => {
// //     const baseMeals = {
// //       breakfast: [
// //         { name: "Oatmeal with fruits", contents: ["Oatmeal", "Fresh fruits"] },
// //         { name: "Scrambled eggs", contents: ["Eggs", "Toast"] },
// //         { name: "Smoothie bowl", contents: ["Smoothie", "Granola"] },
// //       ],
// //       lunch: [
// //         { name: "Grilled chicken salad", contents: ["Grilled chicken", "Mixed greens"] },
// //         { name: "Rice and stew", contents: ["Rice", "Tomato stew"] },
// //         { name: "Pasta with vegetables", contents: ["Pasta", "Mixed vegetables"] },
// //       ],
// //       dinner: [
// //         { name: "Grilled fish", contents: ["Fish", "Vegetables"] },
// //         { name: "Chicken curry", contents: ["Chicken", "Curry sauce"] },
// //         { name: "Vegetable stir fry", contents: ["Mixed vegetables", "Rice"] },
// //       ],
// //     }

// //     let meals = [...baseMeals[mealClass]]

// //     // Filter based on allergies
// //     if (preferences.allergies) {
// //       meals = meals.filter((meal) => {
// //         return !preferences.allergies.some((allergy) =>
// //           meal.contents.some((content) => content.toLowerCase().includes(allergy.toLowerCase())),
// //         )
// //       })
// //     }

// //     // Adjust spiciness
// //     if (preferences.spiciness === "Mild") {
// //       meals = meals.filter((meal) => !meal.name.toLowerCase().includes("curry"))
// //     }

// //     return meals.length > 0 ? meals : baseMeals[mealClass]
// //   }

// //   const planDetails = days.map((day) => {
// //     const meals = []

// //     // Add breakfast
// //     const breakfastOptions = getMealsBasedOnPreferences("breakfast")
// //     const breakfast = breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)]
// //     meals.push({
// //       status: "pending",
// //       mealContents: breakfast.contents,
// //       mealClass: "breakfast",
// //       deliveryTime: new Date(new Date().setHours(8, 0, 0, 0)).toISOString(),
// //       orderBody: "Breakfast order",
// //       orderSubTotal: Math.floor(Math.random() * 2000) + 1000,
// //       totalAmount: Math.floor(Math.random() * 2000) + 1000,
// //       partnerBusinessBranchId: "pb" + Math.floor(Math.random() * 10),
// //       noteToRider: "Please deliver on time",
// //       imageUrl: `/placeholder.svg?height=128&width=128&query=${breakfast.name}`,
// //     })

// //     // Add lunch
// //     const lunchOptions = getMealsBasedOnPreferences("lunch")
// //     const lunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)]
// //     meals.push({
// //       status: "pending",
// //       mealContents: lunch.contents,
// //       mealClass: "lunch",
// //       deliveryTime: new Date(new Date().setHours(13, 0, 0, 0)).toISOString(),
// //       orderBody: "Lunch order",
// //       orderSubTotal: Math.floor(Math.random() * 3000) + 2000,
// //       totalAmount: Math.floor(Math.random() * 3000) + 2000,
// //       partnerBusinessBranchId: "pb" + Math.floor(Math.random() * 10),
// //       noteToRider: "Please deliver on time",
// //       imageUrl: `/placeholder.svg?height=128&width=128&query=${lunch.name}`,
// //     })

// //     // Add dinner
// //     const dinnerOptions = getMealsBasedOnPreferences("dinner")
// //     const dinner = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)]
// //     meals.push({
// //       status: "pending",
// //       mealContents: dinner.contents,
// //       mealClass: "dinner",
// //       deliveryTime: new Date(new Date().setHours(19, 0, 0, 0)).toISOString(),
// //       orderBody: "Dinner order",
// //       orderSubTotal: Math.floor(Math.random() * 4000) + 3000,
// //       totalAmount: Math.floor(Math.random() * 4000) + 3000,
// //       partnerBusinessBranchId: "pb" + Math.floor(Math.random() * 10),
// //       noteToRider: "Please deliver on time",
// //       imageUrl: `/placeholder.svg?height=128&width=128&query=${dinner.name}`,
// //     })

// //     return {
// //       dayOfWeek: day,
// //       meals,
// //     }
// //   })

// //   return {
// //     _id: "mp" + Math.floor(Math.random() * 1000),
// //     userId: "user123",
// //     planDetails,
// //     createdAt: new Date().toISOString(),
// //     updatedAt: new Date().toISOString(),
// //   }
// // }

// // export async function POST(request) {
// //   try {
// //     const body = await request.json()
// //     const { preferences, redirect } = body

// //     // In a real application, save preferences to database
// //     console.log("Saving health profile preferences:", preferences)

// //     if (redirect) {
// //       // Generate meal plan with preferences and return it
// //       const mealPlan = generateMealPlanWithPreferences(preferences)
// //       return NextResponse.json(mealPlan, { status: 201 })
// //     }

// //     return NextResponse.json(
// //       {
// //         success: true,
// //         message: "Health profile created successfully",
// //       },
// //       { status: 201 },
// //     )
// //   } catch (error) {
// //     console.error("Error creating health profile:", error)
// //     return NextResponse.json({ error: "Failed to create health profile" }, { status: 500 })
// //   }
// // }
