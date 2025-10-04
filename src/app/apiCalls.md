# Conzooming Dashboard API Endpoints Documentation

This document provides comprehensive documentation for all API endpoints 
used in the Conzooming Dashboard application.

## Table of Contents
1. [Meal Plans API](#meal-plans-api)
2. [Subscription API](#subscription-api)
3. [Payment API](#payment-api)
4. [User Management API](#user-management-api)
5. [Authentication API](#authentication-api)
6. [Cart API](#cart-api)
7. [Order Management API](#order-management-api)
8. [Product & Vendor API](#product--vendor-api)

---

## Meal Plans API

### 1. Check Nutritional Preferences Availability
**Endpoint:** `GET /api/nutritional-preferences/check`

**Used in:**
- `app/api/nutritional-preferences/check/route.js` (line 2-8)
- `app/meal-plan/flow/page.js` (line 45-52)

**Query Parameters:**
\`\`\`javascript
{
  userId: string // User ID to check preferences for
}
\`\`\`

**Sample Request:**
\`\`\`javascript
GET /api/nutritional-preferences/check?userId=user123
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  exists: boolean // true if user has nutritional preferences
}
\`\`\`

---

### 2. Get Nutritional Preferences
**Endpoint:** `GET /api/nutritional-preferences`

**Used in:**
- `app/api/nutritional-preferences/route.js` (line 1-12)
- `app/nutritional-preferences/view/page.js` (line 35-42)

**Sample Request:**
\`\`\`javascript
GET /api/nutritional-preferences
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  data: {
    allergicTo: string[], // ["Peanuts", "Shellfish"]
    currentHealthGoal: string[], // ["Weight Loss", "Muscle Gain"]
    generalPreferences: {
      spicyness: string, // "mediumSpicyness"
      oils: string, // "low"
      sweetness: string, // "average"
      saltiness: string // "low"
    }
  }
}
\`\`\`

---

### 3. Generate Meal Plan with Preferences
**Endpoint:** `POST /api/meal-plans/generate`

**Used in:**
- `app/api/meal-plans/generate/route.js` (line 1-8)
- `app/meal-plan/confirm-preferences/page.js` (line 78-85)

**Sample Payload:**
\`\`\`javascript
{
  preferences: {
    allergicTo: string[],
    currentHealthGoal: string[],
    generalPreferences: {
      spicyness: string,
      oils: string,
      sweetness: string,
      saltiness: string
    }
  },
  userId: string
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string // "Meal plan generated successfully"
}
\`\`\`

---

### 4. Create Meal Plan
**Endpoint:** `POST /api/meal-plans`

**Used in:**
- `app/api/meal-plans/route.js` (line 1-15)
- `app/meal-plans/create/page.js` (line 125-140)

**Sample Payload:**
\`\`\`javascript
{
  userId: string,
  considerNutritionalPreferences: boolean,
  planDetails: [
    {
      dayOfWeek: string, // "Monday"
      meals: [
        {
          status: string, // "pending"
          mealContents: string[], // ["product1", "product2"]
          mealClass: string, // "breakfast", "lunch", "dinner"
          deliveryTime: string, // ISO date string
          orderBody: string,
          orderSubTotal: number,
          totalAmount: number,
          partnerBusinessBranchId: string,
          noteToRider: string,
          imageUrl: string
        }
      ]
    }
  ]
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  _id: string,
  userId: string,
  planDetails: Array,
  createdAt: string,
  updatedAt: string
}
\`\`\`

---

### 5. Get Current Meal Plan
**Endpoint:** `GET /api/meal-plans/current`

**Used in:**
- `app/api/meal-plans/current/route.js` (line 1-120)
- `app/meal-plan/view/page.js` (line 45-55)

**Sample Request:**
\`\`\`javascript
GET /api/meal-plans/current
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  data: {
    userId: string,
    subscriptionId: string,
    planDetails: [
      {
        dayOfWeek: string,
        meals: [
          {
            status: string,
            mealContents: string[],
            mealClass: string,
            deliveryTime: string,
            orderBody: string,
            orderSubTotal: number,
            totalAmount: number,
            partnerBusinessBranchId: string,
            noteToRider: string,
            imageUrl: string
          }
        ]
      }
    ],
    createdAt: string,
    updatedAt: string
  }
}
\`\`\`

---

### 6. Save Meal Plan
**Endpoint:** `POST /api/meal-plans/save`

**Used in:**
- `app/api/meal-plans/save/route.js` (line 1-15)
- `app/meal-plan/view/page.js` (line 180-195)

**Sample Payload:**
\`\`\`javascript
{
  _id: string,
  userId: string,
  planDetails: Array,
  considerNutritionalPreferences: boolean
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string, // "Meal plan saved successfully"
  mealPlanId: string
}
\`\`\`

---

### 7. Edit/Update Meal Plan
**Endpoint:** `PUT /api/meal-plans/edit`

**Used in:**
- `app/api/meal-plans/edit/route.js` (line 1-25)
- `app/meal-plan/view/page.js` (line 220-240)

**Sample Payload:**
\`\`\`javascript
{
  mealPlanId: string,
  day: string, // "Monday"
  mealClass: string, // "breakfast"
  meal: {
    status: string,
    mealContents: string[],
    mealClass: string,
    deliveryTime: string,
    orderBody: string,
    orderSubTotal: number,
    totalAmount: number,
    partnerBusinessBranchId: string,
    noteToRider: string,
    imageUrl: string
  },
  mealIndex: number
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string, // "Meal plan updated successfully"
  updatedMeal: Object
}
\`\`\`

---

### 8. List User Meal Plans
**Endpoint:** `GET /api/meal-plans/list/[userId]`

**Used in:**
- `app/api/meal-plans/list/[userId]/route.js` (line 1-50)
- `app/subscriptions/create/page.js` (line 85-95)

**Path Parameters:**
- `userId`: string - User ID to fetch meal plans for

**Sample Request:**
\`\`\`javascript
GET /api/meal-plans/list/user123
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  mealPlans: [
    {
      _id: string,
      userId: string,
      planDetails: Array,
      considerNutritionalPreferences: boolean,
      createdAt: string,
      updatedAt: string
    }
  ],
  count: number
}
\`\`\`

---

### 9. Create Meal Plan for Subscription
**Endpoint:** `POST /api/meal-plans/create`

**Used in:**
- `app/api/meal-plans/create/route.js` (line 1-80)
- `app/subscriptions/create/page.js` (line 120-135)

**Sample Payload:**
\`\`\`javascript
{
  userId: string,
  considerNutritionalPreferences: boolean
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  _id: string,
  userId: string,
  planDetails: Array,
  considerNutritionalPreferences: boolean,
  createdAt: string,
  updatedAt: string
}
\`\`\`

---

### 10. Update Meal Plan by ID
**Endpoint:** `PUT /api/meal-plans/update/[mealPlanId]`

**Used in:**
- `app/api/meal-plans/update/[mealPlanId]/route.js` (line 1-20)
- `app/meal-plan/view/page.js` (line 260-275)

**Path Parameters:**
- `mealPlanId`: string - Meal plan ID to update

**Sample Payload:**
\`\`\`javascript
{
  planDetails: [
    {
      dayOfWeek: string,
      meals: Array
    }
  ]
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string, // "Meal plan updated successfully"
  mealPlanId: string,
  updatedPlanDetails: Array
}
\`\`\`

---

## Subscription API

### 11. Create Subscription
**Endpoint:** `POST /api/subscriptions/create`

**Used in:**
- `app/api/subscriptions/create/route.js` (line 1-50)
- `app/subscriptions/checkout/page.js` (line 180-210)

**Sample Payload:**
\`\`\`javascript
{
  userId: string,
  subscriptionMealPlan: {
    _id: string,
    planDetails: Array
  },
  startDate: string, // ISO date string
  deliveryDays: string[], // ["Monday", "Wednesday", "Friday"]
  deliveryAddress: {
    id: string,
    name: string,
    fullAddress: string,
    isDefault: boolean
  },
  totalAmount: number,
  paymentId: string
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string, // "Subscription created successfully"
  subscription: {
    _id: string,
    userId: string,
    subscriptionMealPlan: Object,
    startDate: string,
    endDate: string,
    isActive: boolean,
    deliveryDays: string[],
    deliveryAddress: Object,
    totalAmount: number,
    currency: string, // "NGN"
    paymentStatus: string, // "successful"
    paymentId: string,
    createdAt: string,
    updatedAt: string
  }
}
\`\`\`

---

### 12. Check Preferences Availability
**Endpoint:** `GET /api/check-preferences-availability`

**Used in:**
- `app/api/check-preferences-availability/route.js` (line 1-20)
- `app/subscriptions/create/page.js` (line 65-75)

**Query Parameters:**
\`\`\`javascript
{
  userId: string
}
\`\`\`

**Sample Request:**
\`\`\`javascript
GET /api/check-preferences-availability?userId=user123
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  hasPreferences: boolean
}
\`\`\`

---

### 13. Create Health Profile
**Endpoint:** `POST /api/create-health-profile`

**Used in:**
- `app/api/create-health-profile/route.js` (line 1-120)
- `app/subscriptions/create/page.js` (line 150-170)

**Sample Payload:**
\`\`\`javascript
{
  preferences: {
    allergies: string[], // ["Peanuts", "Dairy"]
    dietaryRestrictions: string[], // ["Vegetarian", "Gluten-free"]
    healthGoals: string[], // ["Weight Loss", "Muscle Gain"]
    spiciness: string, // "Mild", "Medium", "Hot"
    cuisinePreferences: string[] // ["Nigerian", "Continental"]
  },
  redirect: boolean // true to generate meal plan immediately
}
\`\`\`

**Sample Response (without redirect):**
\`\`\`javascript
{
  success: boolean,
  message: string // "Health profile created successfully"
}
\`\`\`

**Sample Response (with redirect):**
\`\`\`javascript
{
  _id: string,
  userId: string,
  planDetails: Array,
  createdAt: string,
  updatedAt: string
}
\`\`\`

---

## Payment API

### 14. Initialize Payment
**Endpoint:** `POST /payment/initialize`

**Used in:**
- `lib/api.js` (line 850-870)
- `app/checkout/page.js` (line 120-140)
- `app/subscriptions/checkout/page.js` (line 95-115)

**Sample Payload:**
\`\`\`javascript
{
  amount: number,
  paymentMethod: string, // "wallet", "card"
  paymentMethodId: string,
  currency: string, // "NGN"
  metadata: {
    orderId: string,
    userId: string,
    items?: Array,
    subscriptionId?: string
  }
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  paymentId: string,
  reference: string,
  message: string,
  authorizationUrl?: string // For card payments
}
\`\`\`

---

### 15. Process Payment (Wallet)
**Endpoint:** `POST /payment/process`

**Used in:**
- `lib/api.js` (line 890-915)
- `app/checkout/page.js` (line 160-180)

**Sample Payload:**
\`\`\`javascript
{
  paymentId: string,
  amount: number,
  paymentMethod: string, // "wallet"
  userId: string
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  paymentId: string,
  transactionId: string,
  message: string
}
\`\`\`

---

### 16. Verify Payment
**Endpoint:** `GET /payment/verify/[reference]`

**Used in:**
- `lib/api.js` (line 930-940)
- Payment callback handlers

**Path Parameters:**
- `reference`: string - Payment reference to verify

**Sample Request:**
\`\`\`javascript
GET /payment/verify/ref_1234567890
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  status: string, // "successful", "failed", "pending"
  amount: number,
  currency: string,
  reference: string,
  transactionId: string,
  paidAt?: string
}
\`\`\`

---

### 17. Get Wallet Balance
**Endpoint:** `GET /payment/wallet/balance`

**Used in:**
- `lib/api.js` (line 780-795)
- `app/wallet/page.js` (line 25-35)
- `app/checkout/page.js` (line 100-110)

**Sample Request:**
\`\`\`javascript
GET /payment/wallet/balance
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  balance: number // Wallet balance in kobo/cents
}
\`\`\`

---

### 18. Get Wallet Transactions
**Endpoint:** `GET /payment/wallet/transactions`

**Used in:**
- `lib/api.js` (line 810-835)
- `app/wallet/page.js` (line 40-50)

**Query Parameters:**
\`\`\`javascript
{
  page?: number, // Default: 1
  limit?: number, // Default: 20
  type?: string // "credit", "debit"
}
\`\`\`

**Sample Request:**
\`\`\`javascript
GET /payment/wallet/transactions?page=1&limit=10
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  transactions: [
    {
      id: string,
      type: string, // "credit", "debit"
      amount: number,
      description: string,
      date: string, // ISO date string
      reference?: string,
      status: string // "successful", "pending", "failed"
    }
  ],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
\`\`\`

---

### 19. Top Up Wallet
**Endpoint:** `POST /payment/wallet/topup`

**Used in:**
- `lib/api.js` (line 855-870)
- `components/modals/wallet-top-up-modal.js` (line 45-65)

**Sample Payload:**
\`\`\`javascript
{
  amount: number // Amount in kobo/cents
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  transactionId: string,
  newBalance: number,
  authorizationUrl?: string // For card top-ups
}
\`\`\`

---

## User Management API

### 20. Get Current User
**Endpoint:** `GET /auth/me`

**Used in:**
- `lib/api.js` (line 180-200)
- `context/app-context.js` (line 120-135)

**Sample Request:**
\`\`\`javascript
GET /auth/me
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  id: string,
  firstName: string,
  lastName: string,
  name: string, // Full name
  email: string,
  phone: string,
  phoneCode: string,
  phoneBody: string,
  avatarUrl?: string,
  bio?: string,
  dateOfBirth?: string,
  gender?: string,
  currentLocation?: string,
  isEmailVerified: boolean,
  isPhoneVerified: boolean,
  createdAt: string,
  updatedAt: string
}
\`\`\`

---

### 21. Update User Profile
**Endpoint:** `PUT /users/profile`

**Used in:**
- `lib/api.js` (line 650-665)
- `app/profile/page.js` (line 85-100)

**Sample Payload:**
\`\`\`javascript
{
  name?: string,
  phone?: string,
  bio?: string,
  dateOfBirth?: string,
  gender?: string,
  avatarUrl?: string
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  user: {
    id: string,
    name: string,
    email: string,
    phone: string,
    bio: string,
    dateOfBirth: string,
    gender: string,
    avatarUrl: string,
    updatedAt: string
  }
}
\`\`\`

---

### 22. Get User Addresses
**Endpoint:** `GET /users/addresses`

**Used in:**
- `lib/api.js` (line 685-695)
- `app/profile/page.js` (line 55-65)
- `components/modals/address-modal.js` (line 35-45)

**Sample Request:**
\`\`\`javascript
GET /users/addresses
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  addresses: [
    {
      id: string,
      name: string, // "Home", "Office"
      fullAddress: string,
      street: string,
      city: string,
      state: string,
      country: string,
      postalCode?: string,
      latitude?: number,
      longitude?: number,
      isDefault: boolean,
      createdAt: string,
      updatedAt: string
    }
  ]
}
\`\`\`

---

### 23. Add Address
**Endpoint:** `POST /users/addresses`

**Used in:**
- `lib/api.js` (line 710-725)
- `components/modals/address-modal.js` (line 85-105)

**Sample Payload:**
\`\`\`javascript
{
  name: string, // "Home", "Office"
  street: string,
  city: string,
  state: string,
  country: string,
  postalCode?: string,
  latitude?: number,
  longitude?: number,
  isDefault?: boolean
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  address: {
    id: string,
    name: string,
    fullAddress: string,
    street: string,
    city: string,
    state: string,
    country: string,
    postalCode: string,
    latitude: number,
    longitude: number,
    isDefault: boolean,
    createdAt: string,
    updatedAt: string
  }
}
\`\`\`

---

### 24. Update Address
**Endpoint:** `PUT /users/addresses/[addressId]`

**Used in:**
- `lib/api.js` (line 740-755)
- `components/modals/address-modal.js` (line 125-145)

**Path Parameters:**
- `addressId`: string - Address ID to update

**Sample Payload:**
\`\`\`javascript
{
  name?: string,
  street?: string,
  city?: string,
  state?: string,
  country?: string,
  postalCode?: string,
  latitude?: number,
  longitude?: number,
  isDefault?: boolean
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  address: Object // Updated address object
}
\`\`\`

---

### 25. Delete Address
**Endpoint:** `DELETE /users/addresses/[addressId]`

**Used in:**
- `lib/api.js` (line 770-780)
- `app/profile/page.js` (line 180-190)

**Path Parameters:**
- `addressId`: string - Address ID to delete

**Sample Request:**
\`\`\`javascript
DELETE /users/addresses/addr123
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string // "Address deleted successfully"
}
\`\`\`

---

### 26. Get Nutritional Preferences (User)
**Endpoint:** `GET /users/nutritional-preferences`

**Used in:**
- `lib/api.js` (line 795-805)
- `app/nutritional-preferences/view/page.js` (line 25-35)

**Sample Request:**
\`\`\`javascript
GET /users/nutritional-preferences
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  preferences: {
    id: string,
    allergicTo: string[],
    currentHealthGoal: string[],
    generalPreferences: {
      spicyness: string,
      oils: string,
      sweetness: string,
      saltiness: string
    },
    dietaryRestrictions: string[],
    cuisinePreferences: string[],
    createdAt: string,
    updatedAt: string
  }
}
\`\`\`

---

### 27. Create Nutritional Preference (User)
**Endpoint:** `POST /users/nutritional-preferences`

**Used in:**
- `lib/api.js` (line 820-835)
- `app/nutritional-preferences/create/page.js` (line 120-140)

**Sample Payload:**
\`\`\`javascript
{
  allergicTo: string[],
  currentHealthGoal: string[],
  generalPreferences: {
    spicyness: string,
    oils: string,
    sweetness: string,
    saltiness: string
  },
  dietaryRestrictions?: string[],
  cuisinePreferences?: string[]
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  preferences: {
    id: string,
    allergicTo: string[],
    currentHealthGoal: string[],
    generalPreferences: Object,
    dietaryRestrictions: string[],
    cuisinePreferences: string[],
    createdAt: string,
    updatedAt: string
  }
}
\`\`\`

---

## Authentication API

### 28. Initialize Customer Registration
**Endpoint:** `POST /user/auth/init-register-customer`

**Used in:**
- `lib/api.js` (line 45-75)
- `components/modals/signup-modal.js` (line 65-85)

**Sample Payload:**
\`\`\`javascript
{
  firstName: string,
  lastName: string,
  email: string,
  phoneCode: string, // "+234"
  phoneBody: string, // "8012345678"
  currentLocation?: string,
  referredBy?: string
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  pinId: string, // OTP session ID
  userId: string, // Temporary user ID
  expiresAt: string // OTP expiration time
}
\`\`\`

---

### 29. Complete Customer Registration
**Endpoint:** `POST /user/auth/register-customer`

**Used in:**
- `lib/api.js` (line 90-115)
- `components/modals/otp-verification-modal.js` (line 45-65)

**Sample Payload:**
\`\`\`javascript
{
  phone: string, // Full phone number with country code
  pinId: string, // From init registration
  otp: string, // 6-digit OTP
  userId: string // From init registration
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  user: {
    id: string,
    firstName: string,
    lastName: string,
    name: string,
    email: string,
    phone: string,
    phoneCode: string,
    phoneBody: string,
    isEmailVerified: boolean,
    isPhoneVerified: boolean,
    createdAt: string
  },
  tokens: {
    accessToken: string,
    refreshToken: string,
    expiresAt: string
  }
}
\`\`\`

---

### 30. Request Login OTP
**Endpoint:** `POST /otp/send-otp`

**Used in:**
- `lib/api.js` (line 130-140)
- `components/modals/login-modal.js` (line 45-55)

**Sample Payload:**
\`\`\`javascript
{
  phoneNumber: string // Full phone number with country code
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  pinId: string, // OTP session ID
  userId: string,
  expiresAt: string
}
\`\`\`

---

### 31. Validate Login OTP
**Endpoint:** `POST /otp/validate-login-otp`

**Used in:**
- `lib/api.js` (line 155-175)
- `components/modals/otp-verification-modal.js` (line 85-105)

**Sample Payload:**
\`\`\`javascript
{
  phone: string, // Full phone number
  otp: string, // 6-digit OTP
  pinId: string // From send OTP
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  user: {
    id: string,
    firstName: string,
    lastName: string,
    name: string,
    email: string,
    phone: string,
    phoneCode: string,
    phoneBody: string,
    avatarUrl: string,
    bio: string,
    dateOfBirth: string,
    gender: string,
    currentLocation: string,
    isEmailVerified: boolean,
    isPhoneVerified: boolean,
    createdAt: string,
    updatedAt: string
  },
  tokens: {
    accessToken: string,
    refreshToken: string,
    expiresAt: string
  }
}
\`\`\`

---

### 32. Refresh Access Token
**Endpoint:** `POST /auth/refresh-token`

**Used in:**
- `lib/api.js` (line 190-205)
- `lib/auth-interceptor.js` (line 45-75)

**Sample Payload:**
\`\`\`javascript
{
  refreshToken: string
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  tokens: {
    accessToken: string,
    refreshToken: string,
    expiresAt: string
  }
}
\`\`\`

---

### 33. Logout
**Endpoint:** `POST /auth/logout`

**Used in:**
- `lib/api.js` (line 220-235)
- `app/profile/page.js` (line 250-260)
- `context/app-context.js` (line 85-95)

**Sample Request:**
\`\`\`javascript
POST /auth/logout
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string // "Logged out successfully"
}
\`\`\`

---

## Cart API

### 34. Get Cart
**Endpoint:** `GET /cart`

**Used in:**
- `lib/api.js` (line 550-560)
- `context/app-context.js` (line 150-160)

**Sample Request:**
\`\`\`javascript
GET /cart
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  id: string,
  userId: string,
  items: [
    {
      id: string,
      productId: string,
      name: string,
      description: string,
      price: number,
      quantity: number,
      imageUrl: string,
      options?: Object, // Product customizations
      vendorId: string,
      vendorName: string
    }
  ],
  totalItems: number,
  totalAmount: number,
  appliedCoupon?: {
    code: string,
    discount: number,
    discountType: string // "percentage", "fixed"
  },
  createdAt: string,
  updatedAt: string
}
\`\`\`

---

### 35. Add to Cart
**Endpoint:** `POST /cart/items`

**Used in:**
- `lib/api.js` (line 575-590)
- `app/vendors/[id]/page.js` (line 180-200)
- `components/modals/product-details-modal.js` (line 120-140)

**Sample Payload:**
\`\`\`javascript
{
  productId: string,
  quantity: number,
  options?: Object, // Product customizations
  vendorId: string
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  cart: Object, // Updated cart object
  addedItem: {
    id: string,
    productId: string,
    name: string,
    price: number,
    quantity: number,
    imageUrl: string,
    options: Object
  }
}
\`\`\`

---

### 36. Update Cart Item
**Endpoint:** `PUT /cart/items/[itemId]`

**Used in:**
- `lib/api.js` (line 605-620)
- `app/orders/page.js` (line 45-55)
- `app/checkout/page.js` (line 65-75)

**Path Parameters:**
- `itemId`: string - Cart item ID to update

**Sample Payload:**
\`\`\`javascript
{
  quantity: number,
  options?: Object
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  cart: Object, // Updated cart object
  updatedItem: Object
}
\`\`\`

---

### 37. Remove from Cart
**Endpoint:** `DELETE /cart/items/[itemId]`

**Used in:**
- `lib/api.js` (line 635-645)
- `app/orders/page.js` (line 75-85)
- `app/checkout/page.js` (line 95-105)

**Path Parameters:**
- `itemId`: string - Cart item ID to remove

**Sample Request:**
\`\`\`javascript
DELETE /cart/items/item123
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  cart: Object // Updated cart object
}
\`\`\`

---

### 38. Clear Cart
**Endpoint:** `POST /cart/clear`

**Used in:**
- `lib/api.js` (line 660-670)
- `app/checkout/page.js` (line 200-210)

**Sample Request:**
\`\`\`javascript
POST /cart/clear
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  cart: {
    id: string,
    userId: string,
    items: [],
    totalItems: 0,
    totalAmount: 0,
    updatedAt: string
  }
}
\`\`\`

---

### 39. Apply Coupon
**Endpoint:** `POST /cart/coupon`

**Used in:**
- `lib/api.js` (line 685-700)
- `app/checkout/page.js` (line 230-250)

**Sample Payload:**
\`\`\`javascript
{
  couponCode: string
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  cart: Object, // Updated cart with discount
  appliedCoupon: {
    code: string,
    discount: number,
    discountType: string,
    description: string
  }
}
\`\`\`

---

### 40. Remove Coupon
**Endpoint:** `DELETE /cart/coupon`

**Used in:**
- `lib/api.js` (line 715-725)
- `app/checkout/page.js` (line 270-280)

**Sample Request:**
\`\`\`javascript
DELETE /cart/coupon
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  cart: Object // Updated cart without discount
}
\`\`\`

---

## Order Management API

### 41. Get User Orders
**Endpoint:** `GET /orders`

**Used in:**
- `lib/api.js` (line 950-960)
- `app/orders/page.js` (line 25-35)
- `app/profile/page.js` (line 65-75)

**Query Parameters:**
\`\`\`javascript
{
  status?: string, // "pending", "ongoing", "completed", "cancelled"
  page?: number,
  limit?: number
}
\`\`\`

**Sample Request:**
\`\`\`javascript
GET /orders?status=ongoing&page=1&limit=10
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  orders: [
    {
      id: string,
      orderReferenceCode: string,
      orderStatus: string, // "pending", "ongoing", "completed"
      orderNavigationStatus: string, // "partnerAccepted", "preparing", etc.
      orderedProducts: [
        {
          id: string,
          name: string,
          description: string,
          price: number,
          quantity: number,
          imageUrl: string,
          options: Object
        }
      ],
      billing: {
        pricing: {
          subtotal: number,
          deliveryFee: number,
          serviceFee: number,
          discount: number,
          grandTotal: number
        }
      },
      deliveryAddress: {
        id: string,
        name: string,
        fullAddress: string
      },
      orderProcessing: {
        orderTracking: Object // Tracking timestamps
      },
      timeCreated: string,
      timeUpdated: string
    }
  ],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
\`\`\`

---

### 42. Get Order Details
**Endpoint:** `GET /orders/[orderId]`

**Used in:**
- `lib/api.js` (line 975-985)
- `app/orders/[id]/page.js` (line 35-45)
- `app/orders/[id]/track/page.js` (line 45-55)

**Path Parameters:**
- `orderId`: string - Order ID to fetch

**Sample Request:**
\`\`\`javascript
GET /orders/order123
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  id: string,
  orderReferenceCode: string,
  orderStatus: string,
  orderNavigationStatus: string,
  orderedProducts: Array,
  billing: {
    pricing: {
      subtotal: number,
      deliveryFee: number,
      serviceFee: number,
      discount: number,
      grandTotal: number
    },
    paymentMethod: {
      id: string,
      name: string,
      type: string
    }
  },
  deliveryAddress: Object,
  isPickup: boolean,
  isGift: boolean,
  giftDetails?: {
    recipientName: string,
    recipientPhone: string,
    message: string
  },
  orderProcessing: {
    orderTracking: {
      accepted: string,
      preparing: string,
      assigned: string,
      vendor: string,
      ready: string,
      address: string,
      delivered: string
    }
  },
  rating?: {
    score: number,
    comment: string,
    ratedAt: string
  },
  timeCreated: string,
  timeUpdated: string
}
\`\`\`

---

### 43. Create Order
**Endpoint:** `POST /orders`

**Used in:**
- `lib/api.js` (line 1000-1020)
- `app/checkout/page.js` (line 150-180)

**Sample Payload:**
\`\`\`javascript
{
  items: [
    {
      productId: string,
      quantity: number,
      options?: Object,
      price: number
    }
  ],
  deliveryAddressId?: string, // null if pickup
  isPickup: boolean,
  isGift: boolean,
  giftDetails?: {
    recipientName: string,
    recipientPhone: string,
    message: string
  },
  paymentMethodId: string,
  paymentId: string,
  totalAmount: number,
  subtotal: number,
  deliveryFee: number,
  serviceFee: number,
  appliedCoupon?: {
    code: string,
    discount: number
  }
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  order: {
    id: string,
    orderReferenceCode: string,
    orderStatus: string,
    orderedProducts: Array,
    billing: Object,
    deliveryAddress: Object,
    isPickup: boolean,
    isGift: boolean,
    giftDetails: Object,
    timeCreated: string
  }
}
\`\`\`

---

### 44. Rate Order
**Endpoint:** `POST /orders/[orderId]/rate`

**Used in:**
- `lib/api.js` (line 1035-1050)
- `components/modals/order-rating-modal.js` (line 65-85)

**Path Parameters:**
- `orderId`: string - Order ID to rate

**Sample Payload:**
\`\`\`javascript
{
  score: number, // 1-5 rating
  comment?: string,
  categories?: string[] // ["Food Quality", "Delivery Speed"]
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  rating: {
    id: string,
    orderId: string,
    score: number,
    comment: string,
    categories: string[],
    ratedAt: string
  }
}
\`\`\`

---

## Product & Vendor API

### 45. Get Categories
**Endpoint:** `GET /categories`

**Used in:**
- `lib/api.js` (line 250-265)
- `app/page.js` (line 45-55)

**Sample Request:**
\`\`\`javascript
GET /categories
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  categories: [
    {
      id: string,
      name: string, // "Restaurants", "Groceries"
      icon: string, // "restaurant", "grocery"
      description?: string,
      imageUrl?: string,
      isActive: boolean
    }
  ]
}
\`\`\`

---

### 46. Get Vendors
**Endpoint:** `GET /vendors`

**Used in:**
- `lib/api.js` (line 280-320)
- `app/vendors/page.js` (line 35-55)
- `app/page.js` (line 75-95)

**Query Parameters:**
\`\`\`javascript
{
  type?: string, // "restaurant", "grocery", "pharmacy", "drinks"
  sort?: string, // "rating", "distance", "delivery_time"
  limit?: number,
  page?: number,
  latitude?: number,
  longitude?: number,
  search?: string
}
\`\`\`

**Sample Request:**
\`\`\`javascript
GET /vendors?type=restaurant&sort=rating&limit=10&page=1
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  vendors: [
    {
      id: string,
      name: string,
      cuisine: string, // "African", "Continental"
      deliveryTime: string, // "25-35 min"
      rating: number, // 4.7
      reviewCount: number,
      imageUrl: string,
      coverImageUrl: string,
      address: string,
      phone: string,
      description: string,
      isOpen: boolean,
      deliveryFee: number,
      minimumOrder: number,
      type: string, // "restaurant"
      distance?: number, // in km
      coordinates?: {
        latitude: number,
        longitude: number
      }
    }
  ],
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
\`\`\`

---

### 47. Get Vendor by ID
**Endpoint:** `GET /vendors/[vendorId]`

**Used in:**
- `lib/api.js` (line 340-380)
- `app/vendors/[id]/page.js` (line 45-55)

**Path Parameters:**
- `vendorId`: string - Vendor ID to fetch

**Sample Request:**
\`\`\`javascript
GET /vendors/vendor123
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  id: string,
  name: string,
  cuisine: string,
  deliveryTime: string,
  rating: number,
  reviewCount: number,
  imageUrl: string,
  coverImageUrl: string,
  address: string,
  phone: string,
  description: string,
  isOpen: boolean,
  deliveryFee: number,
  minimumOrder: number,
  type: string,
  operatingHours: {
    monday: { open: string, close: string },
    tuesday: { open: string, close: string },
    // ... other days
  },
  features: string[], // ["Delivery", "Pickup", "Dine-in"]
  paymentMethods: string[], // ["Cash", "Card", "Wallet"]
  coordinates: {
    latitude: number,
    longitude: number
  }
}
\`\`\`

---

### 48. Get Vendor Products
**Endpoint:** `GET /vendors/[vendorId]/products`

**Used in:**
- `lib/api.js` (line 400-440)
- `app/vendors/[id]/page.js` (line 75-85)

**Path Parameters:**
- `vendorId`: string - Vendor ID

**Query Parameters:**
\`\`\`javascript
{
  category?: string,
  search?: string,
  page?: number,
  limit?: number,
  sortBy?: string, // "price", "popularity", "name"
  sortOrder?: string // "asc", "desc"
}
\`\`\`

**Sample Request:**
\`\`\`javascript
GET /vendors/vendor123/products?category=main-course&page=1&limit=20
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  products: [
    {
      id: string,
      vendorId: string,
      name: string,
      description: string,
      price: number,
      category: string, // "Main Course", "Appetizer"
      imageUrl: string,
      images?: string[], // Additional product images
      isAvailable: boolean,
      preparationTime: string, // "20-25 min"
      ingredients?: string[],
      allergens?: string[],
      nutritionalInfo?: {
        calories: number,
        protein: number,
        carbs: number,
        fat: number
      },
      customizations?: [
        {
          name: string, // "Size"
          options: [
            {
              name: string, // "Large"
              priceModifier: number // +500
            }
          ],
          required: boolean
        }
      ],
      tags?: string[], // ["Spicy", "Vegetarian"]
      rating?: number,
      reviewCount?: number
    }
  ],
  categories: string[], // Available categories for this vendor
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
\`\`\`

---

### 49. Search Products
**Endpoint:** `GET /products/search`

**Used in:**
- `lib/api.js` (line 460-520)
- `components/search/search-modal.js` (line 65-85)
- `app/meal-plans/search/page.js` (line 45-65)

**Query Parameters:**
\`\`\`javascript
{
  query: string, // Search term
  categories?: string[], // Category IDs to filter by
  priceRange?: number[], // [min, max] price range
  minRating?: number, // Minimum rating filter
  vendors?: string[], // Vendor IDs to filter by
  location?: {
    latitude: number,
    longitude: number,
    radius?: number // in km
  },
  page?: number,
  limit?: number,
  sortBy?: string, // "relevance", "price", "rating", "distance"
  sortOrder?: string // "asc", "desc"
}
\`\`\`

**Sample Request:**
\`\`\`javascript
GET /products/search?query=jollof&categories=["cat1","cat2"]&priceRange=[1000,5000]&minRating=4&page=1&limit=20
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  products: [
    {
      id: string,
      name: string,
      description: string,
      price: number,
      rating: number,
      reviewCount: number,
      deliveryTime: string,
      imageUrl: string,
      vendor: {
        id: string,
        name: string,
        rating: number,
        deliveryFee: number,
        minimumOrder: number
      },
      category: string,
      isAvailable: boolean,
      distance?: number, // if location provided
      relevanceScore?: number // for search ranking
    }
  ],
  filters: {
    categories: [
      {
        id: string,
        name: string,
        count: number // Number of products in this category
      }
    ],
    priceRange: {
      min: number,
      max: number
    },
    vendors: [
      {
        id: string,
        name: string,
        count: number
      }
    ]
  },
  pagination: {
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
\`\`\`

---

## Additional Missing Endpoints

### 50. Get Payment Methods
**Endpoint:** `GET /payment/methods`

**Used in:**
- `lib/api.js` (line 740-760)
- `components/modals/payment-method-modal.js` (line 25-35)

**Sample Request:**
\`\`\`javascript
GET /payment/methods
Headers: {
  Authorization: "Bearer <access_token>"
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  methods: [
    {
      id: string,
      name: string, // "Conzooming wallet", "Paystack"
      description: string,
      type: string, // "wallet", "card", "bank_transfer"
      isAvailable: boolean,
      icon?: string,
      fees?: {
        percentage: number,
        fixed: number
      }
    }
  ]
}
\`\`\`

---

### 51. Get Order by ID (Alternative endpoint)
**Endpoint:** `GET /orders/[orderId]`

**Used in:**
- `lib/api.js` (line 1065-1075)
- `app/orders/[id]/track/page.js` (line 55-65)

This is the same as endpoint #42 but used specifically for order tracking.

---

### 52. Update Nutritional Preferences
**Endpoint:** `PUT /nutritional-preferences`

**Used in:**
- `lib/api.js` (line 850-870)
- `app/nutritional-preferences/view/page.js` (line 120-140)

**Sample Payload:**
\`\`\`javascript
{
  allergicTo: string[],
  currentHealthGoal: string[],
  generalPreferences: {
    spicyness: string,
    oils: string,
    sweetness: string,
    saltiness: string
  },
  dietaryRestrictions: string[],
  cuisinePreferences: string[]
}
\`\`\`

**Sample Response:**
\`\`\`javascript
{
  success: boolean,
  message: string,
  preferences: Object // Updated preferences object
}
\`\`\`

---

### 53. Create Nutritional Preferences (Alternative)
**Endpoint:** `POST /nutritional-preferences`

**Used in:**
- `lib/api.js` (line 885-905)
- `app/nutritional-preferences/create/page.js` (line 160-180)

This is similar to endpoint #27 but for the general nutritional preferences API.

---

## Notes

### Authentication
- Most endpoints require authentication via Bearer token in the Authorization header
- Tokens are managed by the auth interceptor which handles automatic refresh
- Public endpoints (registration, login, product search) don't require authentication

### Error Handling
All endpoints follow a consistent error response format:
\`\`\`javascript
{
  success: false,
  error: string, // Error message
  code?: string, // Error code
  details?: Object // Additional error details
}
\`\`\`

### Pagination
Endpoints that return lists typically support pagination:
\`\`\`javascript
{
  page: number, // Current page (1-based)
  limit: number, // Items per page
  total: number, // Total items
  totalPages: number // Total pages
}
\`\`\`

### Rate Limiting
- API endpoints may have rate limiting
- Clients should handle 429 (Too Many Requests) responses
- Retry with exponential backoff is recommended

### Data Validation
- All POST/PUT endpoints validate input data
- Invalid data returns 400 (Bad Request) with validation errors
- Required fields are enforced server-side

### File Uploads
- Image uploads typically use multipart/form-data
- File size and type restrictions apply
- Uploaded files are processed and optimized server-side
