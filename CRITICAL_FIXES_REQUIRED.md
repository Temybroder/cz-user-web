# Critical Frontend Fixes Required

## ✅ COMPLETED (Phase 1 - Part 1)

### 1. Authentication - Fixed Critical Issues
- ✅ Fixed refresh token endpoint URL (was using wrong domain)
  - Changed from: `/auth/refresh-token`
  - To: `/api/user/auth/refresh-token`
- ✅ Fixed app-context infinite loop
  - Removed `[isLoading, user]` dependencies causing re-renders
  - Changed to empty dependency array `[]`

---

## 🔴 CRITICAL ISSUES REMAINING

### 2. API Endpoint Path Fixes (URGENT)

#### Authentication Endpoints - Need Verification
```javascript
// lib/api.js - Line 109
initRegisterCustomer: "/api/user/auth/init-register-customer" ✅ CORRECT

// lib/api.js - Line 128
registerCustomer: "/api/user/auth/register-customer" ✅ CORRECT

// lib/api.js - Line 153
initCustomerLogin: "/api/user/auth/init-login-customer" ✅ CORRECT

// lib/api.js - Line 170
loginCustomer: "/api/user/auth/login-customer" ✅ CORRECT
```

#### Cart Endpoints - NEED FIXING
```javascript
// lib/api.js - Line 1017
getCart: `/api/user/order/fetch-cart/${userId}` ✅ CORRECT

// lib/api.js - Line 1026
addToCart: `/api/user/order/add-to-cart/:${user._id}` ❌ WRONG
// FIX TO: `/api/user/order/add-to-cart/${userId}`

// lib/api.js - Line 1039
updateCartItem: `api/user/order/upd-cart/${itemId}` ❌ MISSING LEADING SLASH
// FIX TO: `/api/user/order/upd-cart/${itemId}`

// lib/api.js - Line 1051
removeFromCart: `api/user/order/del-cart/${itemId}` ❌ MISSING LEADING SLASH
// FIX TO: `/api/user/order/del-cart/${itemId}`
```

#### User/Address Endpoints - NEED FIXING
```javascript
// lib/api.js - Line 1142
updateProfile: `/api/user/account/update-account/${userId}` ✅ CORRECT

// lib/api.js - Line 1161
getAddresses: `/api/users/account/fetch-user-addresses/${userId}` ❌ WRONG
// FIX TO: `/api/user/account/fetch-user-addresses/${userId}` (user not users)

// lib/api.js - Line 1170
addAddress: `/api/user/account/add-user-address/${userId}` ❌ WRONG PATTERN
// CHECK BACKEND: Should it be `/api/user/account/add-address` with userId in body?

// lib/api.js - Line 1195
deleteAddress: `/api/user/account/delete-address/${addressId}` ✅ NEEDS VERIFICATION
```

#### Nutritional Preferences - NEED FIXING
```javascript
// lib/api.js - Line 1239
getNutritionalPreferences: `/api/user/order/nutritional-preferences/${userId}` ❌ WRONG
// FIX TO: `/api/user/order/get-health-profile/${userId}`

// lib/api.js - Line 1247
checkNutritionalPreferences: `/api/user/order/nutritional-preferences/${userId}` ❌ WRONG
// FIX TO: `/api/user/order/check-health-profile/${userId}`

// lib/api.js - Line 1256
createNutritionalPreference: `/api/user/order/create-health-profile/${userId}` ✅ CORRECT
```

#### Meal Plan Endpoints - NEED VERIFICATION
```javascript
// lib/api.js - Line 1471
getUserMealPlans: `/api/user/order/list-meal-plans/${userId}` ✅ NEEDS BACKEND VERIFICATION

// lib/api.js - Line 1489
createMealPlan: "/api/user/order/user-create-meal-plan" ✅ NEEDS BACKEND VERIFICATION
```

---

### 3. App Context Issues

#### Line 479-481: Undefined Variables
```javascript
// BROKEN CODE:
const updatePayload = {
  quantity: newQuantity,  // ❌ newQuantity is undefined
  userId: userId          // ❌ userId is undefined
}

// FIX TO:
const updatePayload = {
  quantity: quantity,
  userId: user.userId
}
```

#### Line 587: Missing userId Parameter
```javascript
// BROKEN CODE:
const newPreference = await userAPI.createNutritionalPreference(preferenceData)

// FIX TO:
const newPreference = await userAPI.createNutritionalPreference(preferenceData, user.userId)
```

---

### 4. Missing Backend Endpoints

Based on frontend calls, these endpoints might not exist on backend:

```javascript
// Check if these exist:
GET  /api/user/order/get-health-profile/:userId
GET  /api/user/order/check-health-profile/:userId
GET  /api/user/order/list-meal-plans/:userId
POST /api/user/order/user-create-meal-plan
GET  /api/user/account/fetch-user-addresses/:userId
POST /api/user/account/add-address
DELETE /api/user/account/delete-address/:addressId
```

---

### 5. Nutritional Health Profile Flow

#### Issues Found:
1. **Profile Toggle on Homepage** - Not yet reviewed
2. **Profile Creation Page** - Endpoint mismatch
3. **Meal Plan Generation** - Using profile incorrectly
4. **Product Filtering** - Toggle not working

#### Files to Fix:
- `/src/app/home/page.js` - Toggle implementation
- `/src/app/nutritional-preferences/create/page.js` - Creation flow
- `/src/app/meal-plans/generate/page.js` - AI generation
- `/src/app/components/nutritional-preference-toggle.js` - Toggle component

---

### 6. Subscription Flow Issues

#### Files to Review:
- `/src/app/subscriptions/create/page.js`
- `/src/app/subscriptions/checkout/page.js`
- `/src/app/subscriptions/review/page.js`

#### Expected Issues:
- Payment integration endpoints
- Meal plan selection
- Delivery frequency setup
- Timeline calculation

---

### 7. Order Checkout Flow Issues

#### Files to Review:
- `/src/app/checkout/page.js`
- Address selection logic
- Payment method selection
- Order creation API call

#### Known Issues:
- Address modal integration
- Cart total calculation
- Payment initialization
- Order confirmation flow

---

### 8. Proximity-Based Sorting

#### Requirements:
1. Get user location
2. Calculate distance to vendors
3. Sort by proximity
4. Display distance in UI

#### Files to Implement:
- Vendor list pages
- Product search results
- Restaurant display

#### Backend Endpoint Needed:
```javascript
GET /api/user/product/fetch-vendors?lat=6.5244&lng=3.3792&radius=5000
```

---

## 🔧 IMMEDIATE ACTION ITEMS

### Priority 1 (TODAY - CRITICAL)
1. ✅ Fix auth-interceptor refresh token endpoint
2. ✅ Fix app-context infinite loop
3. ⏳ Fix all API endpoint paths in `lib/api.js`
4. ⏳ Fix app-context undefined variables (line 479, 587)
5. ⏳ Test login/signup flow end-to-end

### Priority 2 (THIS WEEK)
1. ⏳ Implement missing backend endpoints
2. ⏳ Fix nutritional profile creation flow
3. ⏳ Fix meal plan generation with AI
4. ⏳ Fix subscription payment flow
5. ⏳ Fix order checkout flow

### Priority 3 (NEXT WEEK)
1. ⏳ Implement proximity-based sorting
2. ⏳ Fix address management
3. ⏳ Optimize homepage nutritional toggle
4. ⏳ Performance optimization
5. ⏳ End-to-end testing

---

## 📝 TESTING CHECKLIST

### Authentication Flow
- [ ] User can sign up with phone number
- [ ] OTP is sent and verified
- [ ] Tokens are stored correctly
- [ ] User can login with phone number
- [ ] Token refresh works automatically
- [ ] User can logout

### Nutritional Profile Flow
- [ ] User can create health profile
- [ ] Profile is saved to database
- [ ] Toggle on homepage works
- [ ] Products are filtered based on profile
- [ ] Meal plans use profile preferences

### Meal Plan Flow
- [ ] User can generate meal plan with AI
- [ ] Meal plan shows correct products
- [ ] User can edit meal plan (change meals)
- [ ] User can proceed to subscription
- [ ] Total cost is calculated correctly

### Subscription Flow
- [ ] User can select delivery frequency
- [ ] Timeline is calculated correctly
- [ ] Payment is initialized
- [ ] Subscription is created on success
- [ ] User receives confirmation

### Order Flow
- [ ] User can add items to cart
- [ ] Cart updates correctly
- [ ] User can select delivery address
- [ ] User can choose payment method
- [ ] Order is created successfully
- [ ] Payment verification works
- [ ] Rider assignment happens

### Address Management
- [ ] User can view addresses
- [ ] User can add new address
- [ ] User can set default address
- [ ] User can delete address
- [ ] Address selection works in checkout

---

## 🚀 NEXT STEPS

1. **Run this command to continue fixing:**
   ```bash
   cd /c/projects/Conzooming/front-end
   npm run dev
   ```

2. **Test authentication flow first**
3. **Fix remaining API endpoints**
4. **Implement missing backend endpoints**
5. **Continue with Phase 2 fixes**

---

## 📋 BACKEND ENDPOINTS TO CREATE

Create these missing endpoints in the server:

### 1. Health Profile Endpoints
```javascript
// server/api/V1/controllers/user/order.js

// GET /api/user/order/get-health-profile/:userId
async getHealthProfile(req, res) {
  const { userId } = req.params
  // Return user's nutritional health profile
}

// GET /api/user/order/check-health-profile/:userId
async checkHealthProfile(req, res) {
  const { userId } = req.params
  // Check if user has health profile
  // Return { hasProfile: true/false, profile: {...} }
}
```

### 2. Address Endpoints
```javascript
// server/api/V1/controllers/user/account.js

// GET /api/user/account/fetch-user-addresses/:userId
async getUserAddresses(req, res) {
  const { userId } = req.params
  // Return all user addresses
}

// POST /api/user/account/add-address
async addUserAddress(req, res) {
  // Get userId from auth token or body
  // Add new address for user
}

// DELETE /api/user/account/delete-address/:addressId
async deleteUserAddress(req, res) {
  const { addressId } = req.params
  // Delete address if it belongs to authenticated user
}
```

### 3. Meal Plan Endpoints
```javascript
// server/api/V1/controllers/user/order.js

// GET /api/user/order/list-meal-plans/:userId
async listUserMealPlans(req, res) {
  const { userId } = req.params
  // Return all meal plans for user
}

// POST /api/user/order/user-create-meal-plan
async createUserMealPlan(req, res) {
  // Create meal plan for user
  // Generate with AI if requested
}

// PUT /api/user/order/edit-meal-plan/:mealPlanId
async editMealPlan(req, res) {
  const { mealPlanId } = req.params
  // Allow user to change meals in plan
}
```

---

## 🎯 SUMMARY

**Completed:**
- ✅ Fixed auth refresh token endpoints (2 locations)
- ✅ Fixed app-context infinite loop

**Critical Remaining:**
- 🔴 10+ API endpoint path issues
- 🔴 2 undefined variable bugs in app-context
- 🔴 6+ missing backend endpoints
- 🔴 Nutritional profile flow broken
- 🔴 Meal plan generation broken
- 🔴 Subscription flow needs fixing
- 🔴 Order checkout needs fixing
- 🔴 Proximity sorting not implemented

**Estimated Time:**
- Fix all API paths: 30 minutes
- Fix app-context bugs: 15 minutes
- Create missing endpoints: 2-3 hours
- Fix all flows: 4-6 hours
- Testing: 2-3 hours

**Total: 1-2 days of focused work**









"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/app-context"
import { productAPI } from "@/lib/api"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import Footer from "@/app/components/Footer"
import Header from "@/app/components/header"
import { ChevronRight, ChevronLeft, Star } from "lucide-react"
import { Apple } from "lucide-react";
import GooglePlayIcon from "@/components/ui/GooglePlayIcon";

import LoginModal from "@/app/components/modals/login-modal"
import NutritionalPreferenceToggle from "@/app/components/nutritional-preference-toggle"

export default function HomePage() {
  const router = useRouter()
  const { user, useNutritionalPreference, nutritionalPreference } = useAppContext()

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(null)
  const [categories, setCategories] = useState([])
  const [popularRestaurants, setPopularRestaurants] = useState([])
  const [nearbyVendors, setNearbyVendors] = useState([])
  const [groceryStores, setGroceryStores] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesData = await productAPI.getCategories()
        setCategories(categoriesData)

        // Fetch popular restaurants
        const restaurantResult = await productAPI.getVendors("restaurant", {
          sort: "rating",
          limit: 5,
          useNutritionalPreference: user && useNutritionalPreference ? true : undefined,
        })
        
        const restaurantsData = restaurantResult.vendors
        setPopularRestaurants(Array.isArray(restaurantsData) ? restaurantsData : [])
        console.log("EDITED RESTAURANT DATA IS ", restaurantsData)
        // Fetch nearby vendors
        const nearbyResult = await productAPI.getVendors("restaurant", {
          sort: "rating",
          limit: 5,
          useNutritionalPreference: user && useNutritionalPreference ? true : undefined,
        })
        const nearbyData = nearbyResult.vendors 
        setNearbyVendors(Array.isArray(nearbyData) ? nearbyData : [])

        // Fetch grocery stores
        const groceryResult = await productAPI.getVendors("grocery", {
          limit: 5,
          useNutritionalPreference: user && useNutritionalPreference ? true : undefined,
        })
        const groceryData = groceryResult.vendors 
        setGroceryStores(Array.isArray(groceryData) ? groceryData : [])
        console.log("EDITED GROCERY DATA IS ", groceryData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, useNutritionalPreference])

  const handleCategoryClick = (categoryId) => {
    router.push(`/vendors?category=${categoryId}`)
  }

  const handleActionClick = (action) => {
    if (!user) {
      // Set redirect path based on action
      let redirectPath = "/home"
      switch (action) {
        case "meal-plan":
          redirectPath = "/meal-plans/create"
          break
        case "subscription":
          redirectPath = "/subscriptions/create"
          break
        case "nutritional-preference":
          redirectPath = "/nutritional-preferences/create"
          break
      }

      setRedirectAfterLogin(redirectPath)
      setIsLoginModalOpen(true)
      return
    }

    switch (action) {
      case "meal-plan":
        router.push("/meal-plans/create")
        break
      case "subscription":
        router.push("/subscriptions/create")
        break
      case "nutritional-preference":
        router.push("/nutritional-preferences/create")
        break
      default:
        break
    }
  }

  const renderVendorCard = (vendor, index) => (
    <Link
      href={`/vendors/${vendor.id}`}
      key={vendor.id}
      className="flex-shrink-0 w-64 overflow-hidden transition-transform rounded-lg hover:scale-105"
    >
      <div className="relative w-full h-40 overflow-hidden rounded-lg">
        <Image
          src={vendor.imageUrl || `/placeholder.svg?height=160&width=256&query=food vendor ${vendor.name}`}
          alt={vendor.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="mt-2">
        <h3 className="font-medium">{vendor.name}</h3>
        <div className="flex items-center mt-1 text-sm text-gray-500">
          <span>{vendor.cuisine}</span>
          <span className="mx-1">•</span>
          <span>{vendor.deliveryTime}</span>
          <div className="flex items-center ml-auto">
            <Star className="w-4 h-4 text-secondary-dark fill-secondary-dark" />
            <span className="ml-1">{vendor.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  )

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 text-white overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-100 drop-shadow-lg">
            Order Your Essentials Now
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto mb-10 text-white/95 leading-relaxed">
            From fresh groceries to quick meals, refreshing drinks to vital medications - get everything you need
            delivered to your doorstep. Fast, reliable, and hassle-free.
          </p>

          {/* Nutritional Preference Toggle */}
          {(user || nutritionalPreference) && (
            <div className="max-w-2xl mx-auto mb-12">
              <NutritionalPreferenceToggle />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            <Link
              href="/vendors?category=1"
              className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20"
            >
              <div className="bg-gradient-to-br from-amber-100 to-orange-200 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Image src="/images/icons/restaurant.png" alt="Restaurants" width={40} height={40} />
              </div>
              <p className="font-bold text-lg">Restaurants</p>
            </Link>

            <Link
              href="/vendors?category=2"
              className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20"
            >
              <div className="bg-gradient-to-br from-indigo-100 to-purple-200 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Image src="/images/icons/grocery.png" alt="Groceries" width={40} height={40} />
              </div>
              <p className="font-bold text-lg">Groceries</p>
            </Link>

            <Link
              href="/vendors?category=3"
              className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20"
            >
              <div className="bg-gradient-to-br from-cyan-100 to-blue-200 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Image src="/images/icons/pharmacy.png" alt="Pharmacy" width={40} height={40} />
              </div>
              <p className="font-bold text-lg">Pharmacy</p>
            </Link>

            <Link
              href="/vendors?category=4"
              className="group bg-white/10 backdrop-blur-md rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-white/20"
            >
              <div className="bg-gradient-to-br from-rose-100 to-pink-200 w-20 h-20 mx-auto rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-lg">
                <Image src="/images/icons/drink.png" alt="Drinks" width={40} height={40} />
              </div>
              <p className="font-bold text-lg">Drinks</p>
            </Link>
          </div>
        </div>
      </section>


      {/* Call to Action Cards */}
      <section className="container px-4 py-8 mx-auto">
      <div className="py-8 px-4 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              onClick={() => handleActionClick("meal-plan")}
              className="bg-gradient-to-r from-red-500 to-amber-500 rounded-xl p-6 text-white flex items-center"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">Create Meal plan</h3>
                <p className="text-sm opacity-90">Plan your perfect meals with conzooming.me</p>
              </div>
              <Image src="/images/icons/meal-plan.png" alt="Meal Plan" width={60} height={60} />
            </Card>

            <Card
              onClick={() => handleActionClick("subscription")}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-6 text-white flex items-center cursor-pointer"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">Start a subscription</h3>
                <p className="text-sm opacity-90">
                  Choose recurring access to fresh, healthy meals delivered to your door
                </p>
              </div>
              <Image src="/images/icons/subscription.png" alt="Subscription" width={60} height={60} />
            </Card>

            <Card
              onClick={() => handleActionClick("nutritional-preference")}
              className="bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl p-6 text-white flex items-center"
            >
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-1">Nutritional Preference Profile</h3>
                <p className="text-sm opacity-90">Create or update your nutritional health profile</p>
              </div>
              <Image src="/images/icons/health-profile.png" alt="Health Profile" width={60} height={60} />
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Restaurants Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Popular Restaurants</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Previous restaurants">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Next restaurants">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4 pb-4 overflow-x-auto">
          {!isLoading && Array.isArray(popularRestaurants) &&
              popularRestaurants.map((restaurant, index) => renderVendorCard(restaurant, index))
            }
            {isLoading &&
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex-shrink-0 w-64 animate-pulse">
                  <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
                  <div className="w-3/4 h-4 mt-2 bg-gray-200 rounded"></div>
                  <div className="w-full h-3 mt-2 bg-gray-100 rounded"></div>
                </div>
              ))}
          </div>
        </section>

      {/* Close to You Section */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Close to you</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Previous nearby vendors">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Next nearby vendors">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4 pb-4 overflow-x-auto">
           {!isLoading && Array.isArray(nearbyVendors) &&
              nearbyVendors.map((restaurant, index) => renderVendorCard(restaurant, index))
            }
   
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-64 animate-pulse">
                <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
                <div className="w-3/4 h-4 mt-2 bg-gray-200 rounded"></div>
                <div className="w-full h-3 mt-2 bg-gray-100 rounded"></div>
              </div>
            ))}
        </div>
      </section>

      {/* Grocery Store Section */}
      <section className="container px-4 py-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Grocery store</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Previous grocery stores">
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="icon" className="rounded-full" aria-label="Next grocery stores">
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex gap-4 pb-4 overflow-x-auto">
            {!isLoading && Array.isArray(groceryStores) &&
                groceryStores.map((restaurant, index) => renderVendorCard(restaurant, index))
              }
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex-shrink-0 w-64 animate-pulse">
                <div className="w-full h-40 bg-gray-200 rounded-lg"></div>
                <div className="w-3/4 h-4 mt-2 bg-gray-200 rounded"></div>
                <div className="w-full h-3 mt-2 bg-gray-100 rounded"></div>
              </div>
            ))}
        </div>
      </section>

      {/* Partner Section */}
      <div className="py-16 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Let us work together</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you are a restaurant looking to expand your reach or someone seeking flexible work as a rider, the
              support and tools you need are just a click away.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <h3 className="text-2xl font-bold mb-4">Become one of our partners</h3>
              <p className="text-gray-600 mb-6">
                Grow your brand with us by connecting to a wider audience. Together, we will ensure that customers receive
                consistent, high-quality food, value, and superior service.
              </p>
              <div className="flex space-x-4">
              <Link
                href="#"
                className="inline-flex items-center justify-center w-36 h-12 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Apple className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center w-36 h-12 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <GooglePlayIcon className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Link>
            </div>
            </div>
            <div className="order-1 md:order-2 relative">
              <div className="relative rounded-full overflow-hidden border-8 border-white shadow-xl">
                <Image src="/images/partners.jpg" alt="Partners" width={500} height={500} className="w-full h-auto" />
              </div>
              <div
                className="absolute inset-0 rounded-full border-8 border-transparent"
                style={{
                  background: "linear-gradient(45deg, rgba(255,196,0,1) 0%, rgba(255,0,0,1) 100%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              ></div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
            <div className="relative">
              <div className="relative rounded-full overflow-hidden border-8 border-white shadow-xl">
                <Image src="/images/rider.jpg" alt="Rider" width={500} height={500} className="w-full h-auto" />
              </div>
              <div
                className="absolute inset-0 rounded-full border-8 border-transparent"
                style={{
                  background: "linear-gradient(45deg, rgba(255,196,0,1) 0%, rgba(255,0,0,1) 100%)",
                  backgroundOrigin: "border-box",
                  backgroundClip: "content-box, border-box",
                  WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  WebkitMaskComposite: "xor",
                  maskComposite: "exclude",
                }}
              ></div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Become one of our riders</h3>
              <p className="text-gray-600 mb-6">
                Enjoy flexible hours, competitive pay, and the chance to explore the city while delivering joy to our
                valued users. Sign up today and start delivering tomorrow!
              </p>
              <div className="flex space-x-4">
              <Link
                href="#"
                className="inline-flex items-center justify-center w-36 h-12 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Apple className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </Link>
              <Link
                href="#"
                className="inline-flex items-center justify-center w-36 h-12 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <GooglePlayIcon className="w-6 h-6 mr-2" />
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </Link>
            </div>
            </div>
          </div>
        </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        redirectAfterLogin={redirectAfterLogin}
      />
      {/* <Footer/> */}
    </>
  )
}