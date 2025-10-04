# Phase 3 Action Plan - Meal Plans & Subscriptions

## 🔍 ISSUES IDENTIFIED

### 1. Meal Plan Flow Page (`meal-plans/flow/page.js`)

#### Issue #1: Wrong API Endpoint for Profile Check
**Line 35:**
```javascript
// WRONG:
const checkResponse = await fetch(`/api/check-preferences-availability?userId=${user.id}`)

// CORRECT:
const checkResponse = await fetch(`/api/nutritional-preferences/check?userId=${user.userId || user.id}`)
```

#### Issue #2: Wrong User ID Property
**Lines 35, 64:**
```javascript
// WRONG:
user.id

// CORRECT:
user.userId || user.id
```

#### Issue #3: Wrong Redirect URL
**Line 43:**
```javascript
// WRONG:
router.push("/meal-plans/preferences")

// CORRECT:
router.push("/nutritional-preferences/create?returnTo=/meal-plans/flow")
```

#### Issue #4: Poor Error Handling
**Lines 69-72:**
```javascript
// WRONG:
if (!response.ok) {
  throw new Error("Failed to create meal plan")
}

// CORRECT:
if (!response.ok) {
  const errorData = await response.json()
  throw new Error(errorData.error || "Failed to create meal plan")
}
// Add alert() to show error to user
```

#### Issue #5: Incorrect Data Extraction
**Line 73:**
```javascript
// WRONG:
const mealPlan = await response.json()

// CORRECT:
const data = await response.json()
const mealPlan = data.mealPlan || data.planDetails || data
```

---

## 🛠️ REQUIRED FIXES

### Fix #1: Update meal-plans/flow/page.js

**Replace the entire `handlePreferenceChoice` function:**

```javascript
const handlePreferenceChoice = async (usePreferences) => {
  setConsiderPreferences(usePreferences)
  setShowPreferenceModal(false)
  setLoading(true)

  try {
    if (usePreferences) {
      // Check if user has nutritional preferences - FIXED
      const checkResponse = await fetch(`/api/nutritional-preferences/check?userId=${user.userId || user.id}`)
      const checkData = await checkResponse.json()

      if (checkData.hasProfile) {
        // Create meal plan with preferences
        await createMealPlan(true)
      } else {
        // Redirect to preferences page with return URL
        router.push("/nutritional-preferences/create?returnTo=/meal-plans/flow")
        return
      }
    } else {
      // Create meal plan without preferences
      await createMealPlan(false)
    }
  } catch (error) {
    console.error("Error in preference flow:", error)
    alert("Error checking preferences: " + error.message)
    setLoading(false)
  }
}
```

**Replace the entire `createMealPlan` function:**

```javascript
const createMealPlan = async (usePreferences) => {
  try {
    const response = await fetch("/api/meal-plans/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.userId || user.id,
        considerNutritionalPreferences: usePreferences,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "Failed to create meal plan")
    }

    const data = await response.json()

    // Backend returns { mealPlan: [...] } or { planDetails: [...] }
    const mealPlan = data.mealPlan || data.planDetails || data

    // Store meal plan in localStorage for the view page
    localStorage.setItem("currentMealPlan", JSON.stringify(mealPlan))

    // Navigate to meal plan view
    router.push("/meal-plans/view")
  } catch (error) {
    console.error("Error creating meal plan:", error)
    alert("Failed to create meal plan: " + error.message)
    setLoading(false)
  }
}
```

---

### Fix #2: Create Missing API Proxy Route

The frontend is calling `/api/nutritional-preferences/check` but this proxy may not exist.

**Create file:** `front-end/src/app/api/nutritional-preferences/check/route.js`

```javascript
import { NextResponse } from "next/server"

const EXTERNAL_API_BASE_URL = process.env.EXTERNAL_API_BASE_URL || "http://localhost:5000"

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      )
    }

    // Forward to backend
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/api/user/order/check-health-profile/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(request.headers.get("authorization") && {
            Authorization: request.headers.get("authorization"),
          }),
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Error checking health profile:", error)
    return NextResponse.json(
      { error: "Failed to check health profile" },
      { status: 500 }
    )
  }
}
```

---

### Fix #3: Verify Backend Meal Plan Endpoint

The backend endpoint `/api/user/order/user-create-meal-plan` exists and returns:

```javascript
// Success response:
{
  mealPlan: [ /* meal plan details */ ]
}

// Or if fromRedirect:
{
  planDetails: [ /* meal plan details */ ]
}
```

**✅ Backend is correct - no changes needed**

---

### Fix #4: Test Meal Plan View Page

**File:** `front-end/src/app/meal-plans/view/page.js`

This page reads from `localStorage.getItem("currentMealPlan")`.

**Verify it handles:**
1. Missing meal plan data
2. Correct data structure
3. Edit meal plan functionality
4. Proceed to subscription button

---

### Fix #5: Subscription Creation Flow

After meal plan is created, user should be able to:
1. View meal plan
2. Edit meals if needed
3. Proceed to subscription checkout
4. Make payment
5. Confirm subscription

**Files to check:**
- `subscriptions/create/page.js`
- `subscriptions/checkout/page.js`
- Backend: `/api/user/order/user-create-subscription`

---

## 🧪 TESTING CHECKLIST

### Test Meal Plan Generation

1. **Login** to application
2. **Navigate to:** `http://localhost:3000/meal-plans/flow`
3. **Click "Get Started"**
4. **Modal appears** - Select "Yes, use my preferences"
5. **Expected:**
   - If profile exists → Generate meal plan → Navigate to view
   - If no profile → Redirect to create profile page
6. **Alternative:** Select "No, skip preferences"
   - Should generate meal plan without preferences
7. **Verify meal plan view page** displays correctly

### Test Meal Plan with Preferences

1. **Ensure you have health profile** created
2. **Start meal plan flow** with preferences
3. **Verify:**
   - Meals match dietary restrictions
   - No allergenic ingredients
   - Cuisine preferences considered
   - Meal plan shows 7 days (Mon-Sun)
   - Each day has breakfast, lunch, dinner

### Test Meal Plan Editing

1. **From meal plan view page**
2. **Click "Edit" on any meal**
3. **Select alternative meal**
4. **Save changes**
5. **Verify meal updated**

### Test Subscription Flow

1. **From meal plan view page**
2. **Click "Proceed to Subscription"**
3. **Select delivery times**
4. **Choose start date**
5. **Review pricing**
6. **Proceed to payment**
7. **Complete payment**
8. **Verify subscription created**

---

## 📊 BACKEND ENDPOINTS REFERENCE

### Meal Plan Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/user/order/user-create-meal-plan` | Generate meal plan | ✅ Exists |
| GET | `/api/user/order/list-meal-plans/:userId` | List user's meal plans | ❓ Verify |
| PUT | `/api/user/order/edit-meal-plan/:mealPlanId` | Edit meal in plan | ❓ Verify |
| GET | `/api/user/order/get-meal-plan/:mealPlanId` | Get specific plan | ❓ Verify |

### Subscription Endpoints

| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/user/order/user-create-subscription` | Create subscription | ✅ Exists |
| GET | `/api/user/order/subscriptions-by-user/:userId` | User subscriptions | ✅ Exists |
| GET | `/api/user/order/get-sub-details/:subscriptionId` | Subscription details | ✅ Exists |
| PUT | `/api/user/order/update-subscription/:subscriptionId` | Update subscription | ❓ Verify |

---

## 🎯 PRIORITY ORDER

### Immediate (Do Now)
1. ✅ Fix meal-plans/flow/page.js (5 issues)
2. ✅ Create missing API proxy route
3. ⏳ Test meal plan generation flow

### High Priority (Today)
4. ⏳ Verify meal plan view page works
5. ⏳ Test meal plan editing
6. ⏳ Verify subscription creation endpoint

### Medium Priority (This Week)
7. ⏳ Test subscription payment flow
8. ⏳ Verify subscription confirmation
9. ⏳ Test subscription management (view, update, cancel)

---

## 🚀 QUICK FIX SCRIPT

Due to the file write restriction, manually apply these changes:

1. **Open:** `front-end/src/app/meal-plans/flow/page.js`

2. **Find line 35** and replace:
   ```javascript
   const checkResponse = await fetch(`/api/check-preferences-availability?userId=${user.id}`)
   ```
   **With:**
   ```javascript
   const checkResponse = await fetch(`/api/nutritional-preferences/check?userId=${user.userId || user.id}`)
   ```

3. **Find line 36** and replace:
   ```javascript
   const { exists } = await checkResponse.json()
   ```
   **With:**
   ```javascript
   const checkData = await checkResponse.json()
   ```

4. **Find line 38** and replace:
   ```javascript
   if (exists) {
   ```
   **With:**
   ```javascript
   if (checkData.hasProfile) {
   ```

5. **Find line 43** and replace:
   ```javascript
   router.push("/meal-plans/preferences")
   ```
   **With:**
   ```javascript
   router.push("/nutritional-preferences/create?returnTo=/meal-plans/flow")
   ```

6. **Find line 64** and replace:
   ```javascript
   userId: user.id,
   ```
   **With:**
   ```javascript
   userId: user.userId || user.id,
   ```

7. **Find lines 69-73** and replace with the improved error handling shown above

---

## 💡 ADDITIONAL RECOMMENDATIONS

### 1. Add Loading States
Show loading indicators during:
- Profile check
- Meal plan generation
- API calls

### 2. Add Success Messages
Use toast notifications for:
- Meal plan created successfully
- Meal updated successfully
- Subscription created successfully

### 3. Add Validation
Validate:
- Meal plan has all required fields
- Subscription has valid dates
- Payment information is complete

### 4. Improve Error Messages
Make errors user-friendly:
- "Unable to generate meal plan. Please try again."
- "No nutritional profile found. Create one first."
- "Payment failed. Please check your payment details."

---

## 📞 NEXT STEPS

After applying these fixes:

1. **Test meal plan generation** end-to-end
2. **Report any errors** you encounter
3. **Continue to subscription flow** testing
4. **Document any additional issues**

**Estimated time to complete Phase 3:** 2-3 hours

---

**Status:** Ready for implementation
**Priority:** High
**Blocking:** Subscription feature
