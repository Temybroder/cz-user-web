/**
 * API utility functions with JWT token-based authentication
 */
import { authenticatedFetch, proactiveTokenRefresh } from "./auth-interceptor"
import { authStorage } from "./auth-storage"

// Base API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://cz-api-server.onrender.com"

/**
 * Helper function for making authenticated API requests
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} API response
 */
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  console.log(`Making API request to: ${url}`, options)

  try {
    // Proactively refresh token if needed
    await proactiveTokenRefresh()

    const response = await authenticatedFetch(url, options)
    console.log(`Response status: ${response.status}`)

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "An unknown error occurred",
        success: false,
      }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    console.log("API response data:", data)

    // Return the data directly if it's a success response
    return data.success !== false ? data.data || data : data
  } catch (error) {
    console.error(`API request failed for ${url}:`, error)
    throw error
  }
}

/**
 * Helper function for making public API requests (no authentication)
 * @param {string} endpoint - API endpoint
 * @param {Object} options - Fetch options
 * @returns {Promise<any>} API response
 */
async function fetchPublicAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  console.log(`Making public API request to: ${url}`)

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await fetch(url, { ...defaultOptions, ...options })
    console.log(`Response status: ${response.status}`)

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: "An unknown error occurred",
        success: false,
      }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    const data = await response.json()
    console.log("API response data:", data)

    return data.success !== false ? data.data || data : data
  } catch (error) {
    console.error(`Public API request failed for ${url}:`, error)
    throw error
  }
}

// Auth related API calls
export const authAPI = {
  /**
   * Initialize user registration
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response including pinId
   */
  initRegisterCustomer: async (userData) => {
    console.log("Initializing user registration:", userData)

    // Parse phone number for backend format
    const phoneNumber = userData.phoneNumber || ""
    // Extract country code properly (e.g., +234, +1, +44)
    let phoneCode = "+234"
    let phoneBody = phoneNumber

    if (phoneNumber.startsWith("+")) {
      // Find where the country code ends (when we hit a digit that's part of the local number)
      // For +234, code is 4 chars; for +1, code is 2 chars; for +44, code is 3 chars
      const match = phoneNumber.match(/^(\+\d{1,3})(.+)$/)
      if (match) {
        phoneCode = match[1]
        phoneBody = match[2]
      }
    }

    const payload = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phoneCode,
      phoneBody,
      currentLocation: userData.currentLocation || "",
      referredBy: userData.referredBy || "",
    }

    return fetchPublicAPI("/api/user/auth/init-register-customer", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  },


  
  /**
   * Complete user registration with OTP
   * @param {string} phoneNumber - User phone number
   * @param {string} pinId - PIN ID received from initRegisterCustomer
   * @param {string} otp - One-time password
   * @param {string} userId - User ID from registration
   * @returns {Promise<Object>} User data and tokens
   */
  registerCustomer: async (phoneNumber, pinId, otp, userId) => {
    console.log("Completing user registration:", { phoneNumber, pinId, otp, userId })

    const response = await fetchPublicAPI("/api/user/auth/register-customer", {
      method: "POST",
      body: JSON.stringify({
        phone: phoneNumber,
        pinId,
        otp,
        userId,
      }),
    })

    // Store tokens and user data
    if (response.tokens && response.user) {
      authStorage.setTokens(response.tokens, response.user)
    }

    return response
  },

 /**
   * Initialize customer login (request OTP)
   * @param {string} phoneNumber - User phone number
   * @returns {Promise<Object>} OTP response data including pinId and userId
   */
  initCustomerLogin: async (fullPhonePayload) => {
    console.log("Initializing customer login:", fullPhonePayload)
    return fetchPublicAPI("/api/user/auth/init-login-customer", {
      method: "POST",
      body: JSON.stringify(fullPhonePayload), // Send the payload directly, not wrapped
    })
  },


 /**
   * Complete customer login with OTP
   * @param {string} phoneNumber - User phone number
   * @param {string} otp - One-time password
   * @param {string} pinId - PIN ID received from initCustomerLogin
   * @returns {Promise<Object>} User data and tokens
   */
  loginCustomer: async (fullPhonePayload, otp, pinId) => {
    console.log("Completing customer login:", { fullPhonePayload, otp, pinId })

    const response = await fetchPublicAPI("/api/user/auth/login-customer", {
      method: "POST",
      body: JSON.stringify({
        fullPhonePayload: fullPhonePayload,
        otp,
        pinId,
      }),
    })

    // Store tokens and user data
    if (response.tokens && response.user) {
      authStorage.setTokens(response.tokens, response.user)
    }

    return response
  },



  /**
   * Refresh access token
   * @returns {Promise<Object>} New tokens
   */
  refreshToken: async () => {
    console.log("Refreshing access token")
    const refreshToken = authStorage.getRefreshToken()

    if (!refreshToken) {
      throw new Error("No refresh token available")
    }

    const response = await fetchPublicAPI("/api/user/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })

    // Store new tokens
    if (response.tokens) {
      authStorage.setTokens(response.tokens)
    }

    return response
  },


  /**
   * Logout user
   * @returns {Promise<Object>} Logout response
   */
  logout: async () => {
    console.log("Logging out user")

    try {
      // Call backend logout endpoint
      await fetchAPI("/api/user/auth/logout", {
        method: "POST",
      })
    } catch (error) {
      console.error("Backend logout failed:", error)
      // Continue with client-side logout even if backend fails
    }

    // Clear tokens from storage
    authStorage.clearTokens()

    return { success: true, message: "Logged out successfully" }
  },



  /**
   * Get current user from stored data
   * @returns {Promise<Object|null>} User data or null if not authenticated
   */
  getCurrentUser: async () => {
    console.log("Getting current user from storage")

    try {
      // First check if we have stored user data
      const storedUser = authStorage.getUser()
      if (storedUser && authStorage.isAuthenticated()) {
        return storedUser
      }

      // If no stored user but we have tokens, try to fetch from backend
      if (authStorage.isAuthenticated()) {
        try {
          const userData = await fetchAPI("/api/user/auth/me")
          if (userData) {
            // Update stored user data
            authStorage.setTokens(
              {
                accessToken: authStorage.getAccessToken(),
                refreshToken: authStorage.getRefreshToken(),
              },
              userData,
            )
            return userData
          }
        } catch (error) {
          console.error("Failed to fetch user from backend:", error)
          // Clear invalid tokens
          authStorage.clearTokens()
        }
      }

      return null
    } catch (error) {
      console.error("Failed to get current user:", error)
      return null
    }
  },
}


// Product related API calls - these go directly to external API
export const productAPI = {
  /**
   * Get all categories
   * @param {Object} options - Query options
   * @returns {Promise<Array>} List of categories
   */

    getCategories: async () => {
    // For now, return mock data
    return [
      { id: 1, name: "Restaurants", icon: "restaurant" },
      { id: 2, name: "Groceries", icon: "grocery" },
      { id: 3, name: "Pharmacy", icon: "pharmacy" },
      { id: 4, name: "Drinks", icon: "drinks" },
        ]
      },

  // getCategories: async (options = {}) => {
  //   console.log("Fetching categories from external API")

  //   const params = new URLSearchParams()
  //   if (options.limit) params.append("limit", options.limit.toString())
  //   if (options.offset) params.append("offset", options.offset.toString())
  //   if (options.active !== undefined) params.append("active", options.active.toString())

  //   const queryString = params.toString()
  //   return fetchPublicAPI(`/categories${queryString ? `?${queryString}` : ""}`)
  // },

  /**
   * Get category by ID
   * @param {string|number} categoryId - Category ID
   * @returns {Promise<Object|null>} Category data
   */
  getCategoryById: async (categoryId) => {
    console.log("Fetching category by ID:", categoryId)
    return fetchPublicAPI(`/api/user/product/categories/${categoryId}`)
  },

  /**
   * Get vendors by type and filters
   * @param {string|null} type - Vendor type (restaurant, grocery, etc.)
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} List of vendors
   */
  getVendors: async (type = null, options = {}) => {
    console.log("Fetching vendors from external API", { type, options })

    const params = new URLSearchParams()
    if (type) params.append("type", type)
    if (options.sort) params.append("sort", options.sort)
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.offset) params.append("offset", options.offset.toString())
    if (options.location) params.append("location", options.location)
    if (options.radius) params.append("radius", options.radius.toString())
    if (options.rating) params.append("min_rating", options.rating.toString())
    if (options.delivery_fee) params.append("max_delivery_fee", options.delivery_fee.toString())
    if (options.is_open !== undefined) params.append("is_open", options.is_open.toString())
    if (options.search) params.append("search", options.search)

    const queryString = params.toString()
    return fetchPublicAPI(`/api/user/product/fetch-vendors${queryString ? `?${queryString}` : ""}`)
  },

  /**
   * Get vendor by ID
   * @param {string|number} vendorId - Vendor ID
   * @returns {Promise<Object|null>} Vendor data
   */
  getVendorById: async (vendorId) => {
    console.log("Fetching vendor by ID from external API:", vendorId)
    return fetchPublicAPI(`/api/user/product/fetch-vendor/${vendorId}`)
  },

  /**
   * Get vendor products with filters
   * @param {string|number} vendorId - Vendor ID
   * @param {Object} filters - Product filters
   * @returns {Promise<Array>} Vendor products
   */
  getVendorProductsWithFiltering: async (vendorId, filters = {}) => {
    console.log("Fetching vendor products from external API:", { vendorId, filters })

    const params = new URLSearchParams()
    if (filters.category) params.append("category", filters.category)
    if (filters.search) params.append("search", filters.search)
    if (filters.productType) params.append("productType", filters.productType)
    if (filters.showOutOfStock) params.append("showOutOfStock", filters.showOutOfStock.toString())
    if (filters.page) params.append("page", filters.page.toString())
    if (filters.limit) params.append("limit", filters.limit.toString())
    if (filters.sortBy) params.append("sortBy", filters.sortBy)
    if (filters.sortOrder) params.append("sortOrder", filters.sortOrder)

    const queryString = params.toString()
    console.log(" ++++++++++++ VENDOR PRODUCTS ENDPOINT IS ", `/api/user/product/fetch-vendor-products/${vendorId}${queryString ? `?${queryString}` : ""}`)
    return fetchPublicAPI(`/api/user/product/fetch-vendor-products/${vendorId}${queryString ? `?${queryString}` : ""}`)
  },

    /**
   * Get product by ID
   * @param {string|number} productId - Product ID
   * @returns {Promise<Object|null>} Product data
   */
  getVendorProducts: async (vendorId) => {
    console.log("Fetching Vendor products from external API")
    return fetchPublicAPI(`/api/partner/inventory/get-seller-products/${vendorId}`)
  },

  /**
   * Get product by ID
   * @param {string|number} productId - Product ID
   * @returns {Promise<Object|null>} Product data
   */
  getProductById: async (productId) => {
    console.log("Fetching product by ID from external API:", productId)
    return fetchPublicAPI(`/api/partner/inventory/get-product/${productId}`)
  },

  /**
   * Search products across all vendors
   * @param {Object} params - Search parameters
   * @returns {Promise<Object>} Search results with pagination
   */
  searchProducts: async (params = {}) => {
    console.log("Searching products from external API:", params)

    const searchParams = new URLSearchParams()

    // Basic search parameters
    if (params.query) searchParams.append("query", params.query)
    if (params.location) searchParams.append("location", params.location)
    if (params.radius) searchParams.append("radius", params.radius.toString())

    // Category filters
    if (params.categories && Array.isArray(params.categories)) {
      params.categories.forEach((categoryId) => {
        searchParams.append("categories", categoryId.toString())
      })
    }

    // Vendor type filters
    if (params.vendor_types && Array.isArray(params.vendor_types)) {
      params.vendor_types.forEach((type) => {
        searchParams.append("vendor_types", type)
      })
    }

    // Price range filters
    if (params.min_price) searchParams.append("min_price", params.min_price.toString())
    if (params.max_price) searchParams.append("max_price", params.max_price.toString())

    // Rating filter
    if (params.min_rating) searchParams.append("min_rating", params.min_rating.toString())

    // Availability filter
    if (params.available !== undefined) searchParams.append("available", params.available.toString())

    // Sorting options
    if (params.sort) searchParams.append("sort", params.sort)

    // Pagination
    if (params.limit) searchParams.append("limit", params.limit.toString())
    if (params.offset) searchParams.append("offset", params.offset.toString())
    if (params.page) searchParams.append("page", params.page.toString())

    const queryString = searchParams.toString()
    return fetchPublicAPI(`/api/user/product/search${queryString ? `?${queryString}` : ""}`)
  },

  /**
   * Get featured products
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Featured products
   */
  getFeaturedProducts: async (options = {}) => {
    console.log("Fetching featured products from external API")

    const params = new URLSearchParams()
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.location) params.append("location", options.location)
    if (options.vendor_type) params.append("vendor_type", options.vendor_type)

    const queryString = params.toString()
    return fetchPublicAPI(`/products/featured${queryString ? `?${queryString}` : ""}`)
  },

  /**
   * Get popular products
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Popular products
   */
  getPopularProducts: async (options = {}) => {
    console.log("Fetching popular products from external API")

    const params = new URLSearchParams()
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.location) params.append("location", options.location)
    if (options.vendor_type) params.append("vendor_type", options.vendor_type)
    if (options.time_period) params.append("time_period", options.time_period)

    const queryString = params.toString()
    return fetchPublicAPI(`/products/popular${queryString ? `?${queryString}` : ""}`)
  },

  /**
   * Get product recommendations for user
   * @param {Object} options - Query options
   * @returns {Promise<Array>} Recommended products
   */
  getRecommendedProducts: async (options = {}) => {
    console.log("Fetching recommended products from external API")

    const params = new URLSearchParams()
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.location) params.append("location", options.location)
    if (options.based_on) params.append("based_on", options.based_on)

    const queryString = params.toString()
    return fetchAPI(`/products/recommendations${queryString ? `?${queryString}` : ""}`)
  },

  /**
   * Get product reviews
   * @param {string|number} productId - Product ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Product reviews with pagination
   */
  getProductReviews: async (productId, options = {}) => {
    console.log("Fetching product reviews from external API:", productId)

    const params = new URLSearchParams()
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.offset) params.append("offset", options.offset.toString())
    if (options.sort) params.append("sort", options.sort)
    if (options.rating) params.append("rating", options.rating.toString())

    const queryString = params.toString()
    return fetchPublicAPI(`/products/${productId}/reviews${queryString ? `?${queryString}` : ""}`)
  },

  /**
   * Add product review
   * @param {string|number} productId - Product ID
   * @param {Object} reviewData - Review data
   * @returns {Promise<Object>} Created review
   */
  addProductReview: async (productId, reviewData) => {
    console.log("Adding product review to external API:", { productId, reviewData })
    return fetchAPI(`/products/${productId}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    })
  },

  /**
   * Get vendor reviews
   * @param {string|number} vendorId - Vendor ID
   * @param {Object} options - Query options
   * @returns {Promise<Object>} Vendor reviews with pagination
   */
  getVendorReviews: async (vendorId, options = {}) => {
    console.log("Fetching vendor reviews from external API:", vendorId)

    const params = new URLSearchParams()
    if (options.limit) params.append("limit", options.limit.toString())
    if (options.offset) params.append("offset", options.offset.toString())
    if (options.sort) params.append("sort", options.sort)
    if (options.rating) params.append("rating", options.rating.toString())

    const queryString = params.toString()
    return fetchPublicAPI(`/vendors/${vendorId}/reviews${queryString ? `?${queryString}` : ""}`)
  },

  /**
   * Add vendor review
   * @param {string|number} vendorId - Vendor ID
   * @param {Object} reviewData - Review data
   * @returns {Promise<Object>} Created review
   */
  addVendorReview: async (vendorId, reviewData) => {
    console.log("Adding vendor review to external API:", { vendorId, reviewData })
    return fetchAPI(`/vendors/${vendorId}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    })
  },

  /**
   * Get product categories for a vendor
   * @param {string|number} vendorId - Vendor ID
   * @returns {Promise<Array>} Product categories
   */
  getVendorCategories: async (vendorId) => {
    console.log("Fetching vendor categories from external API:", vendorId)
    return fetchPublicAPI(`/vendors/${vendorId}/categories`)
  },

  /**
   * Check product availability
   * @param {string|number} productId - Product ID
   * @param {number} quantity - Requested quantity
   * @returns {Promise<Object>} Availability status
   */
  checkProductAvailability: async (productId, quantity = 1) => {
    console.log("Checking product availability from external API:", { productId, quantity })
    return fetchPublicAPI(`/products/${productId}/availability?quantity=${quantity}`)
  },

  /**
   * Get delivery estimate for vendor
   * @param {string|number} vendorId - Vendor ID
   * @param {string} deliveryAddress - Delivery address
   * @returns {Promise<Object>} Delivery estimate
   */
  getDeliveryEstimate: async (vendorId, deliveryAddress) => {
    console.log("Getting delivery estimate from external API:", { vendorId, deliveryAddress })
    return fetchPublicAPI(`/vendors/${vendorId}/delivery-estimate`, {
      method: "POST",
      body: JSON.stringify({ delivery_address: deliveryAddress }),
    })
  },

  /**
   * Get vendor operating hours
   * @param {string|number} vendorId - Vendor ID
   * @returns {Promise<Object>} Operating hours
   */
  getVendorOperatingHours: async (vendorId) => {
    console.log("Fetching vendor operating hours from external API:", vendorId)
    return fetchPublicAPI(`/vendors/${vendorId}/operating-hours`)
  },

  /**
   * Check if vendor is currently open
   * @param {string|number} vendorId - Vendor ID
   * @returns {Promise<Object>} Vendor open status
   */
  checkVendorOpenStatus: async (vendorId) => {
    console.log("Checking vendor open status from external API:", vendorId)
    return fetchPublicAPI(`/vendors/${vendorId}/status`)
  },

  /**
   * Get product by ID
   * @param {string} productId - Product ID
   * @returns {Promise<Object>} Product details
   */
  getProductById: async (productId) => {
    console.log('Fetching product by ID:', productId);
    return fetchPublicAPI(`/api/user/product/${productId}`)
  }
};

export const productAPI22 = {
  /**
   * Get all categories
   * @returns {Promise<Array>} List of categories
   */
  getCategories: async () => {
    // For now, return mock data
    return [
      { id: 1, name: "Restaurants", icon: "restaurant" },
      { id: 2, name: "Groceries", icon: "grocery" },
      { id: 3, name: "Pharmacy", icon: "pharmacy" },
      { id: 4, name: "Drinks", icon: "drinks" },
    ]
  },

  /**
   * Get vendors by type
   * @param {string|null} type - Vendor type (restaurant, grocery, etc.)
   * @param {Object} options - Filter options
   * @returns {Promise<Array>} List of vendors
   */
  getVendors: async (type = null, options = {}) => {
    // For now, return mock data
    const mockVendors = [
      {
        id: 1,
        name: "Tasty Bites Restaurant",
        cuisine: "African",
        deliveryTime: "25-35 min",
        rating: 4.7,
        imageUrl: "/cozy-italian-restaurant.png",
        type: "restaurant",
      },
      {
        id: 2,
        name: "Fresh Grocers",
        cuisine: "Grocery",
        deliveryTime: "30-45 min",
        rating: 4.5,
        imageUrl: "/busy-grocery-aisle.png",
        type: "grocery",
      },
      {
        id: 3,
        name: "Quick Meds Pharmacy",
        cuisine: "Pharmacy",
        deliveryTime: "15-25 min",
        rating: 4.8,
        imageUrl: "/pharmacy-interior.png",
        type: "pharmacy",
      },
      {
        id: 4,
        name: "Juice & Smoothies",
        cuisine: "Drinks",
        deliveryTime: "20-30 min",
        rating: 4.6,
        imageUrl: "/vibrant-juice-bar.png",
        type: "drinks",
      },
      {
        id: 5,
        name: "Healthy Harvest",
        cuisine: "Organic",
        deliveryTime: "25-40 min",
        rating: 4.9,
        imageUrl: "/organic-store.png",
        type: "grocery",
      },
    ]

    // Filter by type if provided
    let filteredVendors = type ? mockVendors.filter((v) => v.type === type) : mockVendors

    // Apply sorting if specified
    if (options.sort) {
      switch (options.sort) {
        case "rating":
          filteredVendors.sort((a, b) => b.rating - a.rating)
          break
        case "distance":
          // In a real app, this would use actual distance calculations
          // For mock data, we'll just randomize
          filteredVendors.sort(() => Math.random() - 0.5)
          break
        default:
          break
      }
    }

    // Apply limit if specified
    if (options.limit && options.limit > 0) {
      filteredVendors = filteredVendors.slice(0, options.limit)
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    return filteredVendors
  },

  /**
   * Get vendor by ID
   * @param {string|number} vendorId - Vendor ID
   * @returns {Promise<Object|null>} Vendor data or null if not found
   */
  getVendorById: async (vendorId) => {
    console.log("Getting vendor by ID:", vendorId)

    // Mock vendor data - this should match the data in the vendor page
    const mockVendors = [
      {
        id: 1,
        name: "Tasty Bites Restaurant",
        cuisine: "African",
        deliveryTime: "25-35 min",
        rating: 4.7,
        reviewCount: 324,
        imageUrl: "/cozy-italian-restaurant.png",
        coverImageUrl: "/cozy-italian-restaurant.png",
        address: "123 Lagos Street, Victoria Island, Lagos",
        phone: "+234 801 234 5678",
        description:
          "Authentic African cuisine with a modern twist. We serve the best jollof rice, suya, and traditional dishes in Lagos.",
        isOpen: true,
        deliveryFee: 750,
        minimumOrder: 2000,
        type: "restaurant",
      },
      {
        id: 2,
        name: "Fresh Grocers",
        cuisine: "Grocery",
        deliveryTime: "30-45 min",
        rating: 4.5,
        reviewCount: 156,
        imageUrl: "/busy-grocery-aisle.png",
        coverImageUrl: "/busy-grocery-aisle.png",
        address: "456 Market Road, Ikeja, Lagos",
        phone: "+234 802 345 6789",
        description: "Your one-stop shop for fresh groceries, organic produce, and household essentials.",
        isOpen: true,
        deliveryFee: 500,
        minimumOrder: 3000,
        type: "grocery",
      },
      {
        id: 3,
        name: "Quick Meds Pharmacy",
        cuisine: "Pharmacy",
        deliveryTime: "15-25 min",
        rating: 4.8,
        reviewCount: 89,
        imageUrl: "/pharmacy-interior.png",
        coverImageUrl: "/pharmacy-interior.png",
        address: "789 Health Avenue, Lekki, Lagos",
        phone: "+234 803 456 7890",
        description: "Licensed pharmacy providing quality medications and health products with fast delivery.",
        isOpen: true,
        deliveryFee: 300,
        minimumOrder: 1000,
        type: "pharmacy",
      },
      {
        id: 4,
        name: "Juice & Smoothies",
        cuisine: "Drinks",
        deliveryTime: "20-30 min",
        rating: 4.6,
        reviewCount: 203,
        imageUrl: "/vibrant-juice-bar.png",
        coverImageUrl: "/vibrant-juice-bar.png",
        address: "321 Wellness Street, Surulere, Lagos",
        phone: "+234 804 567 8901",
        description: "Fresh juices, smoothies, and healthy beverages made from premium ingredients.",
        isOpen: true,
        deliveryFee: 400,
        minimumOrder: 1500,
        type: "drinks",
      },
      {
        id: 5,
        name: "Healthy Harvest",
        cuisine: "Organic",
        deliveryTime: "25-40 min",
        rating: 4.9,
        reviewCount: 412,
        imageUrl: "/organic-store.png",
        coverImageUrl: "/organic-store.png",
        address: "654 Green Lane, Ikoyi, Lagos",
        phone: "+234 805 678 9012",
        description: "Premium organic groceries and health foods sourced from local farmers.",
        isOpen: true,
        deliveryFee: 600,
        minimumOrder: 2500,
        type: "grocery",
      },
    ]

    // Find vendor by ID
    const vendor = mockVendors.find((v) => v.id === Number.parseInt(vendorId))

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return vendor || null
  },

  /**
   * Get vendor products
   * @param {string|number} vendorId - Vendor ID
   * @param {Object} filters - Product filters
   * @returns {Promise<Array>} Vendor products
   */
  getVendorProducts: async (vendorId, filters = {}) => {
    console.log("Getting vendor products for:", vendorId)

    // Mock products for vendors
    const mockProducts = [
      {
        id: 101,
        vendorId: 1,
        name: "Jollof Rice Special",
        description: "Our signature jollof rice with chicken, beef, and plantain",
        price: 2500,
        category: "Main Course",
        imageUrl: "/vibrant-jollof-rice.png",
        isAvailable: true,
        preparationTime: "20-25 min",
      },
      {
        id: 102,
        vendorId: 1,
        name: "Chicken Suya",
        description: "Spicy grilled chicken skewers with traditional spices",
        price: 2000,
        category: "Grilled",
        imageUrl: "/grilled-chicken-skewers.png",
        isAvailable: true,
        preparationTime: "15-20 min",
      },
      {
        id: 103,
        vendorId: 2,
        name: "Fresh Tomatoes",
        description: "Organic, locally grown tomatoes (1kg)",
        price: 800,
        category: "Vegetables",
        imageUrl: "/ripe-tomatoes.png",
        isAvailable: true,
        preparationTime: "5 min",
      },
      {
        id: 104,
        vendorId: 3,
        name: "Paracetamol",
        description: "Pain reliever and fever reducer (500mg, 20 tablets)",
        price: 350,
        category: "Pain Relief",
        imageUrl: "/medicine-still-life.png",
        isAvailable: true,
        preparationTime: "5 min",
      },
      {
        id: 105,
        vendorId: 4,
        name: "Mango Smoothie",
        description: "Fresh mango blended with yogurt and honey",
        price: 1200,
        category: "Smoothies",
        imageUrl: "/mango-smoothie.png",
        isAvailable: true,
        preparationTime: "5-10 min",
      },
    ]

    // Filter products by vendor ID
    const vendorProducts = mockProducts.filter((p) => p.vendorId === Number.parseInt(vendorId))

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return vendorProducts
  },

  /**
   * Search products
   * @param {Object} params - Search parameters
   * @returns {Promise<Array>} Search results
   */
  searchProductsXX: async (params = {}) => {
    // For now, return mock data
    const mockProducts = [
      {
        id: 101,
        name: "Jollof Rice",
        description: "Spicy rice dish with vegetables and protein",
        price: 1500,
        rating: 4.8,
        deliveryTime: "25-35 min",
        imageUrl: "/vibrant-jollof-rice.png",
      },
      {
        id: 102,
        name: "Fresh Tomatoes",
        description: "Organic, locally grown tomatoes",
        price: 800,
        rating: 4.5,
        deliveryTime: "30-45 min",
        imageUrl: "/ripe-tomatoes.png",
      },
      {
        id: 103,
        name: "Paracetamol",
        description: "Pain reliever and fever reducer",
        price: 350,
        rating: 4.9,
        deliveryTime: "15-25 min",
        imageUrl: "/medicine-still-life.png",
      },
      {
        id: 104,
        name: "Mango Smoothie",
        description: "Fresh mango blended with yogurt",
        price: 1200,
        rating: 4.7,
        deliveryTime: "20-30 min",
        imageUrl: "/mango-smoothie.png",
      },
      {
        id: 105,
        name: "Chicken Suya",
        description: "Spicy grilled chicken skewers",
        price: 2000,
        rating: 4.6,
        deliveryTime: "25-40 min",
        imageUrl: "/grilled-chicken-skewers.png",
      },
    ]

    // Filter by query if provided
    let results = mockProducts
    if (params.query) {
      const query = params.query.toLowerCase()
      results = results.filter(
        (product) => product.name.toLowerCase().includes(query) || product.description.toLowerCase().includes(query),
      )
    }

    // Filter by categories if provided
    if (params.categories && params.categories.length > 0) {
      // In a real app, products would have category IDs
      // For mock data, we'll just filter randomly based on the product ID
      results = results.filter((product) => {
        // Simulate category matching
        return params.categories.some((categoryId) => product.id % categoryId === 0)
      })
    }

    // Filter by price range if provided
    if (params.priceRange && params.priceRange.length === 2) {
      const [min, max] = params.priceRange
      results = results.filter((product) => product.price >= min && product.price <= max)
    }

    // Filter by minimum rating if provided
    if (typeof params.minRating === "number") {
      results = results.filter((product) => product.rating >= params.minRating)
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    return results
  },
}

// Cart related API calls
export const cartAPI = {
  /**
   * Get user cart
   * @returns {Promise<Object>} Cart data
   */
  getCart: async (userId) => {
    return fetchAPI(`/api/user/order/fetch-cart/${userId}`)
  },

  /**
   * Add item to cart
   * @param {Object} cartItem - Cart item data
   * @returns {Promise<Object>} Updated cart
   */
  addToCart: async (cartItem, userId) => {
    return fetchAPI(`/api/user/order/add-to-cart/${userId}`, {
      method: "POST",
      body: JSON.stringify(cartItem),
    })
  },

  /**
   * Update cart item
   * @param {string|number} itemId - Item ID
   * @param {Object} updateData - Update data
   * @returns {Promise<Object>} Updated cart
   */
  updateCartItem: async (itemId, updateData) => {
    return fetchAPI(`/api/user/order/upd-cart/${itemId}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    })
  },

  /**
   * Remove item from cart
   * @param {string|number} itemId - Item ID
   * @returns {Promise<Object>} Updated cart
   */
  removeFromCart: async (itemId) => {
    return fetchAPI(`/api/user/order/del-cart/${itemId}`, {
      method: "DELETE",
    })
  },

  /**
   * Clear cart
   * @returns {Promise<Object>} Empty cart
   */
  clearCart: async () => {
    return fetchAPI("/cart/clear", {
      method: "POST",
    })
  },

  /**
   * Apply coupon to cart
   * @param {string} couponCode - Coupon code
   * @returns {Promise<Object>} Updated cart with discount
   */
  applyCoupon: async (couponCode) => {
    return fetchAPI("/cart/coupon", {
      method: "POST",
      body: JSON.stringify({ couponCode }),
    })
  },

  /**
   * Remove coupon from cart
   * @returns {Promise<Object>} Updated cart without discount
   */
  removeCoupon: async () => {
    return fetchAPI("/cart/coupon", {
      method: "DELETE",
    })
  },
}

// Order related API calls
export const orderAPI = {
  /**
   * Get user orders
   * @returns {Promise<Array>} List of orders
   */
  getOrders: async (userId) => {
    return fetchAPI(`/api/user/order/orders-by-user/${userId}`)
  },

  /**
   * Get order details
   * @param {string|number} orderId - Order ID
   * @returns {Promise<Object>} Order details
   */
  getOrderDetails: async (orderId) => {
    return fetchAPI(`/api/user/order/fetch-order/${orderId}`)
  },

  /**
   * Create new order
   * @param {Object} orderData - Order data
   * @returns {Promise<Object>} Created order
   */
  createOrder: async (orderData) => {
    return fetchAPI("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    })
  },

  /**
   * Rate an order
   * @param {string|number} orderId - Order ID
   * @param {Object} ratingData - Rating data
   * @returns {Promise<Object>} Updated order
   */
  rateOrder: async (orderId, ratingData) => {
    return fetchAPI(`/api/user/order/submit-rating/${orderId}`, {
      method: "POST",
      body: JSON.stringify(ratingData),
    })
  },
}

// User related API calls
export const userAPI = {
  /**
   * Update user profile
   * @param {Object} profileData - Profile data
   * @returns {Promise<Object>} Updated user profile
   */
  updateProfile: async (profileData, userId) => {
    return fetchAPI(`/api/user/account/update-account/${userId}`, {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  },

  /**
   * Get user orders
   * @returns {Promise<Array>} List of orders
   */
  getOrders: async (userId) => {
    return fetchAPI(`/api/user/order/orders-by-user/${userId}`)
  },

  /**
   * Get user addresses
   * @returns {Promise<Array>} List of addresses
   */
  getAddresses: async (userId) => {
    return fetchAPI(`/api/user/account/fetch-user-addresses/${userId}`)
  },

  /**
   * Add new address
   * @param {Object} addressData - Address data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created address
   */
  addAddress: async (addressData, userId) => {
    console.log("userAPI.addAddress called with:", { addressData, userId });
    return fetchAPI(`/api/user/account/add-user-address/${userId}`, {
      method: "PUT",
      body: JSON.stringify(addressData),
    })
  },

  /**
   * Update address
   * @param {string|number} addressId - Address ID
   * @param {Object} addressData - Address data
   * @returns {Promise<Object>} Updated address
   */
  updateAddress: async (addressId, addressData) => {
    return fetchAPI(`/api/user/account/addresses/${addressId}`, {
      method: "PUT",
      body: JSON.stringify(addressData),
    })
  },

  /**
   * Delete address
   * @param {string|number} addressId - Address ID
   * @returns {Promise<Object>} Response
   */
  deleteAddress: async (addressId) => {
    return fetchAPI(`/api/user/account/delete-address/${addressId}`, {
      method: "DELETE",
    })
  },

  /**
   * Get wallet balance
   * @returns {Promise<Object>} Wallet data
   */
  getWalletBalance: async () => {
    return fetchAPI(`/api/user/payment/fetch-balance/${userId}`)
  },


    /**
   * Get wallet transactions
   * @returns {Promise<Array>} List of transactions
   */
  getWalletTransactions: async (userId) => {
    try {
      return fetchAPI(`/api/user/payment/get-wallet-transactions/${userId}`)
    } catch (error) {
      console.error("Failed to get wallet transactions:", error)
    }
  },

  /**
   * Top up wallet
   * @param {Object} topUpData - Top up data
   * @returns {Promise<Object>} Updated wallet data
   */
  
  topUpWallet: async (topUpData) => {
    return fetchAPI("/api/user/payment/top-up-wallet", {
      method: "POST",
      body: JSON.stringify(topUpData),
    })
  },

  /**
   * Get nutritional preferences
   * @returns {Promise<Array>} Nutritional preferences
   */
  getNutritionalPreferences: async (userId) => {
    return fetchAPI(`/api/user/order/get-health-profile/${userId}`)
  },

  /**
   * Check nutritional preferences
   * @returns {Promise<Array>} Nutritional preferences
   */
  checkNutritionalPreferences: async (userId) => {
    return fetchAPI(`/api/user/order/check-health-profile/${userId}`)
  },

  /**
   * Create nutritional preference
   * @param {Object} preferenceData - Preference data
   * @returns {Promise<Object>} Created preference
   */
  createNutritionalPreference: async (preferenceData, userId) => {
    return fetchAPI(`/api/user/order/create-health-profile/${userId}`, {
      method: "POST",
      body: JSON.stringify(preferenceData),
    })
  },

  /**
   * Get user notifications
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Notifications data
   */
  getNotifications: async (userId) => {
    return fetchAPI(`/api/user/account/notifications/${userId}`)
  },

  /**
   * Mark notifications as read
   * @param {string} userId - User ID
   * @param {Array} notificationIds - Optional array of notification IDs
   * @returns {Promise<Object>} Response
   */
  markNotificationsAsRead: async (userId, notificationIds = null) => {
    return fetchAPI(`/api/user/account/notifications/mark-read/${userId}`, {
      method: "POST",
      body: JSON.stringify({ notificationIds }),
    })
  },

  /**
   * Get wallet data (balance and transactions)
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Wallet data
   */
  getWalletData: async (userId) => {
    return fetchAPI(`/api/user/account/wallet/${userId}`)
  },
}

// Nutritional preferences API calls
export const nutritionalAPI = {
  /**
   * Get user nutritional preferences
   * @returns {Promise<Object>} Nutritional preferences
   */
  getPreferences: async () => {
    return fetchAPI("/nutritional-preferences")
  },

  /**
   * Update nutritional preferences
   * @param {Object} preferencesData - Preferences data
   * @returns {Promise<Object>} Updated preferences
   */
  updatePreferences: async (preferencesData) => {
    return fetchAPI("/nutritional-preferences", {
      method: "PUT",
      body: JSON.stringify(preferencesData),
    })
  },

  /**
   * Create nutritional preferences
   * @param {Object} preferencesData - Preferences data
   * @returns {Promise<Object>} Created preferences
   */
  createPreferences: async (preferencesData) => {
    return fetchAPI("/nutritional-preferences", {
      method: "POST",
      body: JSON.stringify(preferencesData),
    })
  },
}

// Payment related API calls
export const paymentAPI = {
  /**
   * Get available payment methods
   * @returns {Promise<Array>} List of payment methods
   */
  getPaymentMethods: async () => {
    try {
      const response = await fetchAPI("/payment/methods")
      return response.methods || []
    } catch (error) {
      console.error("Failed to get payment methods:", error)
      // Return mock data for now
      return [
        {
          id: "conzooming-wallet",
          name: "Conzooming wallet",
          description: "Pay with your Conzooming wallet balance",
          type: "wallet",
          isAvailable: true,
        },
        {
          id: "paystack",
          name: "Paystack",
          description: "Pay with card via Paystack",
          type: "card",
          isAvailable: true,
        },
      ]
    }
  },

  /**
   * Get wallet balance
   * @returns {Promise<number>} Wallet balance
   */
  getWalletBalance: async (userId) => {
    try {
      const response = await fetchAPI(`/api/user/payment/fetch-balance/${userId}`)
      return response.currentBalance || 0
    } catch (error) {
      console.error("Failed to get wallet balance:", error)
      // Return mock data for now
      return 5000 // Mock balance of ₦5,000
    }
  },

  /**
   * Get wallet transactions
   * @returns {Promise<Array>} List of transactions
   */
  getWalletTransactions: async (userId) => {
    try {
      const response = await fetchAPI(`/api/user/payment/get-wallet-transactions/${userId}`)
      return response.transactions || []
    } catch (error) {
      console.error("Failed to get wallet transactions:", error)
      // Return mock data for now
      return [
        {
          id: 1,
          type: "credit",
          amount: 5000,
          description: "Wallet top-up",
          date: new Date().toISOString(),
        },
        {
          id: 2,
          type: "debit",
          amount: 1500,
          description: "Payment for order #12345",
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        },
        {
          id: 3,
          type: "credit",
          amount: 2000,
          description: "Refund for order #12340",
          date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        },
      ]
    }
  },

  /**
   * Top up wallet
   * @param {number} amount - Amount to top up
   * @returns {Promise<Object>} Top up response
   */
  topUpWallet: async (amount) => {
    return fetchAPI("/payment/wallet/topup", {
      method: "POST",
      body: JSON.stringify({ amount }),
    })
  },

  /**
   * Initialize payment
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Payment initialization response
   */
  initializePayment: async (paymentData) => {
    console.log("Initializing payment:", paymentData)
    try {
      const response = await fetchAPI("/user/payment/init-payment-and-order", {
        method: "POST",
        body: JSON.stringify(paymentData),
      })

      return {
        success: true,
        paymentId: response.paymentId || `payment_${Date.now()}`,
        reference: response.reference || `ref_${Date.now()}`,
        message: "Payment initialized successfully",
        ...response,
      }
    } catch (error) {
      console.error("Payment initialization failed:", error)
      return {
        success: false,
        message: error.message || "Payment initialization failed",
      }
    }
  },

  /**
   * Process payment (for wallet payments)
   * @param {Object} paymentData - Payment data
   * @returns {Promise<Object>} Payment processing response
   */
  processPayment: async (payment) => {
    console.log("Processing payment:", payment)

    try {
      const response = await fetchAPI("/payment/process", {
        method: "POST",
        body: JSON.stringify(payment),
      })

      return {
        success: true,
        paymentId: response.paymentId || `payment_${Date.now()}`,
        transactionId: response.transactionId || `txn_${Date.now()}`,
        message: "Payment processed successfully",
        ...response,
      }
    } catch (error) {
      console.error("Payment processing failed:", error)
      return {
        success: false,
        message: error.message || "Payment processing failed",
      }
    }
  },

  /**
   * Verify payment
   * @param {string} reference - Payment reference
   * @returns {Promise<Object>} Payment verification response
   */
  verifyPayment: async (reference) => {
    return fetchAPI(`/payment/verify/${reference}`)
  },
}

// Meal plan API calls
export const mealPlanAPI = {
  /**
   * Get user meal plans
   * @returns {Promise<Array>} List of meal plans
   */
  getUserMealPlans: async (userId) => {
    return fetchAPI(`/api/user/order/list-meal-plans/${userId}`)
  },

  /**
   * Get meal plan details
   * @param {string|number} planId - Plan ID
   * @returns {Promise<Object>} Meal plan details
   */
  getMealPlanDetails: async (planId) => {
    return fetchAPI(`/meal-plans/${planId}`)
  },

  /**
   * Create new meal plan
   * @param {Object} planData - Plan data
   * @returns {Promise<Object>} Created meal plan
   */
  createMealPlan: async (planData) => {
    return fetchAPI("/api/user/order/user-create-meal-plan", {
      method: "POST",
      body: JSON.stringify(planData),
    })
  },

  /**
   * Update meal plan
   * @param {string|number} planId - Plan ID
   * @param {Object} planData - Plan data
   * @returns {Promise<Object>} Updated meal plan
   */
  updateMealPlan: async (planId, planData) => {
    return fetchAPI(`/meal-plans/${planId}`, {
      method: "PUT",
      body: JSON.stringify(planData),
    })
  },

  /**
   * Delete meal plan
   * @param {string|number} planId - Plan ID
   * @returns {Promise<Object>} Response
   */
  deleteMealPlan: async (planId) => {
    return fetchAPI(`/meal-plans/${planId}`, {
      method: "DELETE",
    })
  },
}

// Export the createNutritionalPreference function directly
export const createNutritionalPreference = async (preferenceData, userId) => {
  console.log("CREATE NUTRITIONAL PREFERENCE called with:", { preferenceData, userId });
  return fetchAPI(`/api/user/order/create-health-profile/${userId}`, {
    method: "POST",
    body: JSON.stringify(preferenceData),
  })
}
