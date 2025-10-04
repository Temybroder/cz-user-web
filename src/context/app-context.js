"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI, cartAPI, userAPI } from "@/lib/api"
import { authStorage } from "@/lib/auth-storage"
import { useRouter } from "next/navigation"

// Add this debugging code at the top of the file, after the imports
const DEBUG = true
const logDebug = (...args) => {
  if (DEBUG) {
    console.log(...args)
  }
}

// Create context with default values
  const AppContext = createContext({
  user: null,
  isLoading: true,
  authChecked: false,
  cart: { items: [], totalAmount: 0, totalItems: 0 },
  addresses: [],
  selectedAddress: null,
  nutritionalPreference: null,
  useNutritionalPreference: false,
  registerUser: async () => {},
  requestOTP: async () => {},
  verifyOTP: async () => {},
  verifyLoginOTP: async () => {},
  verifyRegistrationOTP: async () => {},
  logout: async () => {},
  isAuthenticated: () => false,
})

/**
 * App context provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} The app context provider
 */
export function AppProvider({ children }) {
  logDebug("AppProvider rendering")
  const router = useRouter()

  // User state
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(null)

  // Cart state
  const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 })

  // Nutritional preference state
  const [nutritionalPreference, setNutritionalPreference] = useState(null)
  const [useNutritionalPreference, setUseNutritionalPreference] = useState(false)

  // Error state
  const [error, setError] = useState(null)

  // Fetch current user on mount with timeout fallback
  useEffect(() => {
    let isMounted = true
    let timeoutId = null

    // Set a timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      if (isMounted && isLoading) {
        console.log("Loading timeout reached, forcing render")
        setIsLoading(false)
        setAuthChecked(true)
      }
    }, 5000) // 5 second timeout

    const fetchCurrentUser = async () => {
      try {
        console.log("Checking authentication status...")

        // Check if user is authenticated (has valid tokens)
        if (!authStorage.isAuthenticated()) {
          console.log("No valid tokens found")
          if (!isMounted) return
          setUser(null)
          setIsLoading(false)
          setAuthChecked(true)
          return
        }

        console.log("Fetching current user...")
        const userData = await authAPI.getCurrentUser()
        console.log("User data received:", userData ? "User found" : "No user")

        if (!isMounted) return

        setUser(userData)

        // Only fetch additional data if user exists
        if (userData) {
          try {
            console.log("Fetching user addresses...", userData, " OR USER MIGHT BE ", user)
         
            // const addressesData = await userAPI.getAddresses(userId)
            const addressesData = userData.address
            console.log("Addresses received:", addressesData.length)

            if (!isMounted) return

            setAddresses(addressesData)

            if (addressesData.length > 0) {
              const defaultAddress = addressesData.find((addr) => addr.isDefault) || addressesData[0]
              setSelectedAddress(defaultAddress)
            }
          } catch (addressError) {
            console.error("Failed to fetch addresses:", addressError)
            // Continue even if addresses fail
          }

          try {
            console.log("Fetching nutritional preferences...")
            const preferences = await userAPI.getNutritionalPreferences(userData.userId)
            console.log("Preferences received:", preferences ? preferences.length : 0)

            if (!isMounted) return

            if (preferences && preferences.length > 0) {
              setNutritionalPreference(preferences[0])
            }
          } catch (prefError) {
            // 404 is expected for new users without health profile - not an error
            if (prefError.message?.includes("Health profile not found") || prefError.message?.includes("404")) {
              console.log("No health profile found (expected for new users)")
            } else {
              console.error("Failed to fetch nutritional preferences:", prefError)
            }
            // Continue even if preferences fail
          }
        }
      } catch (error) {
        console.error("Failed to fetch user data:", error)

        // If authentication fails, clear tokens
        if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
          console.log("Authentication failed, clearing tokens")
          authStorage.clearTokens()
        }

        setError(error)
      } finally {
        if (isMounted) {
          console.log("Setting loading to false")
          setIsLoading(false)
          setAuthChecked(true)
          clearTimeout(timeoutId) // Clear timeout as we've finished loading
        }
      }
    }

    fetchCurrentUser()

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, []) // Empty dependency array - only run once on mount

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart)
          setCart(parsedCart)
          console.log("Loaded cart from localStorage:", parsedCart)
        } catch (error) {
          console.error("Failed to parse saved cart:", error)
        }
      }
    }
  }, [])

  // Fetch cart on mount and when user changes
  useEffect(() => {
    let isMounted = true

    const fetchCart = async () => {
      // Skip if no user or still loading
      if (!user || isLoading) return

      try {
        console.log("Fetching cart...")
        const cartData = await cartAPI.getCart(user.userId)
        console.log("Cart received:", cartData ? "Cart found" : "No cart")

        if (!isMounted) return

        setCart({
          items: cartData.items || [],
          totalAmount: cartData.totalAmount || 0,
          totalItems: cartData.items ? cartData.items.length : 0,
        })
      } catch (error) {
        // 404 is expected for new users without a cart - not an error
        if (error.message?.includes("Cart not found") || error.message?.includes("404")) {
          console.log("No cart found (expected for new users)")
          if (!isMounted) return
          setCart({ items: [], totalAmount: 0, totalItems: 0 })
        } else {
          console.error("Failed to fetch cart:", error)
        }
      }
    }

    fetchCart()

    return () => {
      isMounted = false
    }
  }, [user, isLoading])

  /**
   * Register a new user (initialize registration)
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration response including pinId
   */
  const registerUser = async (userData) => {
    console.log("Context: registerUser called with", userData)
    try {
      const response = await authAPI.initRegisterCustomer(userData)
      console.log("Registration initialized successfully:", response)
      return response
    } catch (error) {
      console.error("Failed to register user:", error)
      throw error
    }
  }


 /**
   * Complete user registration with OTP
   * @param {string} phoneNumber - User phone number
   * @param {string} pinId - PIN ID received from registerUser
   * @param {string} otp - One-time password
   * @param {string} userId - User ID from registration
   * @returns {Promise<Object>} User data
   */
  const verifyRegistrationOTP = async (phoneNumber, pinId, otp, userId) => {
    console.log("Context: verifyRegistrationOTP called with", { phoneNumber, pinId, otp, userId })
    try {
      const response = await authAPI.registerCustomer(phoneNumber, pinId, otp, userId)
      console.log("Registration completed successfully:", response)

      // Update user state
      if (response.user) {
        setUser(response.user)
      }

      return response
    } catch (error) {
      console.error("Failed to complete registration:", error)
      throw error
    }
  }



  /**
   * Request OTP for phone number (login flow)
   * @param {string} fullPhonePayload - User phone number object
   * @returns {Promise<Object>} OTP response data including pinId
   */
  const requestOTP = async (fullPhonePayload) => {
    logDebug("Context: requestOTP called with", fullPhonePayload)
    try {
      const response = await authAPI.initCustomerLogin(fullPhonePayload)
      logDebug("OTP requested successfully:", response)
      return response
    } catch (error) {
      console.error("Failed to request OTP:", error)
      throw error
    }
  }



 /**
   * Verify OTP 
   * @param {string} phoneNumber - User phone number
   * @param {string} otp - One-time password
   * @param {string} pinId - PIN ID received from requestOTP
   * @returns {Promise<Object>} User data
   */
  const verifyOTP = async (phoneNumber, otp, pinId) => {
    logDebug("Context: verifyOTP called with", { phoneNumber, otp, pinId })
    try {
      const response = await authAPI.loginCustomer(phoneNumber, otp, pinId)
      logDebug("OTP verified successfully:", response)

      // Update user state
      if (response.user) {
        setUser(response.user)
      }

      return response
    } catch (error) {
      console.error("OTP verification failed:", error)
      throw error
    }
  }


  /**
   * Verify OTP and authenticate user (login flow)
   * @param {string} fullPhonePayload - User phone number object
   * @param {string} otp - One-time password
   * @param {string} pinId - PIN ID received from requestOTP
   * @returns {Promise<Object>} User data
   */
  const verifyLoginOTP = async (fullPhonePayload, otp, pinId) => {
    logDebug("Context: verifyOTP called with", { fullPhonePayload, otp, pinId })
    try {
      const response = await authAPI.loginCustomer(fullPhonePayload, otp, pinId)
      logDebug("OTP verified successfully:", response)

      // Update user state
      if (response.user) {
        setUser(response.user)
      }

      return response
    } catch (error) {
      console.error("OTP verification failed:", error)
      throw error
    }
  }


  /**
   * Logout function
   */
  const logout = async () => {
    console.log("Context: logout called")
    try {
      await authAPI.logout()
      setUser(null)
      setCart({ items: [], totalAmount: 0, totalItems: 0 })
      setAddresses([])
      setSelectedAddress(null)
      setNutritionalPreference(null)
      router.push("/")
    } catch (error) {
      console.error("Logout failed:", error)
      // Even if logout fails, clear local state
      setUser(null)
      setCart({ items: [], totalAmount: 0, totalItems: 0 })
      authStorage.clearTokens()
      router.push("/")
    }
  }

  // Context value
  const contextValue = {
    user,
    isLoading,
    authChecked,
    cart,
    addresses,
    selectedAddress,
    nutritionalPreference,
    useNutritionalPreference,
    error,
    registerUser,
    requestOTP,
    verifyOTP,
    verifyLoginOTP,
    verifyRegistrationOTP,
    logout,
    isAuthenticated: () => !!user && authStorage.isAuthenticated(),
    requireAuth: (callback, redirectPath = "/") => {
      return (...args) => {
        if (!user || !authStorage.isAuthenticated()) {
          return false
        }
        return callback(...args)
      }
    },
    addToCart: async (product, quantity = 1, options = {}) => {
      try {
        // Check if user is authenticated
        if (!user || !authStorage.isAuthenticated()) {
          throw new Error("Please login to add items to cart")
        }

        console.log("Adding to cart:", { product, quantity, options })

        // For now, we'll use local state management since the API might not be fully implemented
        // Create a cart item
        const cartItem = {
          id: `${product.id}_${Date.now()}`, // Unique ID for cart item
          productId: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: quantity,
          options: options,
          imageUrl: product.imageUrl,
          vendorId: product.vendorId,
        }

        // Update cart state
        setCart((prevCart) => {
          const existingItemIndex = prevCart.items.findIndex(
            (item) => item.productId === product.id && JSON.stringify(item.options) === JSON.stringify(options),
          )

          let updatedItems
          if (existingItemIndex >= 0) {
            // Update existing item quantity
            updatedItems = prevCart.items.map((item, index) =>
              index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
            )
          } else {
            // Add new item
            updatedItems = [...prevCart.items, cartItem]
          }

          const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

          const newCart = {
            items: updatedItems,
            totalAmount,
            totalItems,
          }

          // Persist to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(newCart))
          }

          return newCart
        })

        console.log("Item added to cart successfully")
        return { success: true }
      } catch (error) {
        console.error("Add to cart failed:", error)
        throw error
      }
    },
    removeFromCart: async (itemId) => {
      try {
        if (!user || !authStorage.isAuthenticated()) {
          throw new Error("Please login to modify your cart")
        }

        console.log("Context: Removing cart item", itemId)

        // Update local cart state immediately
        setCart((prevCart) => {
          const updatedItems = prevCart.items.filter((item) => item.id !== itemId)
          const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

          const newCart = {
            items: updatedItems,
            totalAmount,
            totalItems,
          }

          // Persist to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(newCart))
          }

          return newCart
        })

        // Try to update on backend (optional, can fail silently for now)
        try {
          await cartAPI.removeFromCart(itemId)
        } catch (apiError) {
          console.warn("Backend cart removal failed, but local state updated:", apiError)
        }

        return { success: true }
      } catch (error) {
        console.error("Remove from cart failed:", error)
        throw error
      }
    },
    updateCartItem: async (itemId, quantity) => {
      try {
        if (!user || !authStorage.isAuthenticated()) {
          throw new Error("Please login to modify your cart")
        }

        console.log("Context: Updating cart item", itemId, "to quantity", quantity)

        // Update local cart state immediately for better UX
        setCart((prevCart) => {
          const updatedItems = prevCart.items.map((item) =>
            item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item,
          )
          const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
          const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

          const newCart = {
            items: updatedItems,
            totalAmount,
            totalItems,
          }

          // Persist to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem('cart', JSON.stringify(newCart))
          }

          return newCart
        })

        // Try to update on backend (optional, can fail silently for now)
        try {
           const updatePayload = {
                      quantity: quantity,
                      userId: user.userId
                    }

          await cartAPI.updateCartItem(itemId, updatePayload)
        } catch (apiError) {
          console.warn("Backend cart update failed, but local state updated:", apiError)
        }

        return { success: true }
      } catch (error) {
        console.error("Update cart item failed:", error)
        throw error
      }
    },
    clearCart: async () => {
      try {
        if (!user || !authStorage.isAuthenticated()) {
          throw new Error("Please login to modify your cart")
        }

        await cartAPI.clearCart()
        setCart({ items: [], totalAmount: 0, totalItems: 0 })
      } catch (error) {
        console.error("Clear cart failed:", error)
        throw error
      }
    },
    setSelectedAddress,
    addAddress: async (addressData) => {
      try {
        if (!user || !authStorage.isAuthenticated()) {
          throw new Error("Please login to add an address")
        }

        const userId = user.userId || user._id
        console.log("Adding address for user:", userId, "with data:", addressData)

        const response = await userAPI.addAddress(addressData, userId)
        console.log("Address API response:", response)

        // Extract the address from the response
        const newAddress = response.address || response

        // Ensure addresses is an array before spreading
        setAddresses((prev) => {
          const currentAddresses = Array.isArray(prev) ? prev : []
          return [...currentAddresses, newAddress]
        })

        if (addressData.isDefault || addresses.length === 0) {
          setSelectedAddress(newAddress)
        }

        return newAddress
      } catch (error) {
        console.error("Add address failed:", error)
        throw error
      }
    },
    updateAddress: async (addressId, addressData) => {
      try {
        if (!user || !authStorage.isAuthenticated()) {
          throw new Error("Please login to update your address")
        }

        const updatedAddress = await userAPI.updateAddress(addressId, addressData)

        setAddresses((prev) => prev.map((addr) => (addr.id === addressId ? updatedAddress : addr)))

        if (selectedAddress && selectedAddress.id === addressId) {
          setSelectedAddress(updatedAddress)
        }

        // If this address is being set as default, update other addresses
        if (addressData.isDefault) {
          setAddresses((prev) =>
            prev.map((addr) => ({
              ...addr,
              isDefault: addr.id === addressId,
            })),
          )
        }

        return updatedAddress
      } catch (error) {
        console.error("Update address failed:", error)
        throw error
      }
    },
    deleteAddress: async (addressId) => {
      try {
        if (!user || !authStorage.isAuthenticated()) {
          throw new Error("Please login to delete your address")
        }

        await userAPI.deleteAddress(addressId)

        const updatedAddresses = addresses.filter((addr) => addr.id !== addressId)
        setAddresses(updatedAddresses)

        // If the deleted address was selected, select another one
        if (selectedAddress && selectedAddress.id === addressId) {
          const defaultAddress = updatedAddresses.find((addr) => addr.isDefault) || updatedAddresses[0]
          setSelectedAddress(defaultAddress || null)
        }
      } catch (error) {
        console.error("Delete address failed:", error)
        throw error
      }
    },
    toggleNutritionalPreference: () => {
      setUseNutritionalPreference((prev) => !prev)
    },
    createNutritionalPreference: async (preferenceData) => {
      try {
        if (!user || !authStorage.isAuthenticated()) {
          throw new Error("Please login to create nutritional preferences")
        }

        const newPreference = await userAPI.createNutritionalPreference(preferenceData, user.userId)
        setNutritionalPreference(newPreference)
        return newPreference
      } catch (error) {
        console.error("Create nutritional preference failed:", error)
        throw error
      }
    },
  }

  logDebug("AppContext providing value:", {
    hasUser: !!contextValue.user,
    hasRequestOTP: !!contextValue.requestOTP,
    hasVerifyOTP: !!contextValue.verifyOTP,
    hasVerifyRegistrationOTP: !!contextValue.verifyRegistrationOTP,
    isAuthenticated: contextValue.isAuthenticated(),
  })

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

/**
 * Custom hook to use the app context
 * @returns {Object} App context
 */
export function useAppContext() {
  const context = useContext(AppContext)
  logDebug("useAppContext called, returning:", {
    hasUser: !!context.user,
    hasRequestOTP: !!context.requestOTP,
    hasVerifyOTP: !!context.verifyLoginOTP,
    hasVerifyRegistrationOTP: !!context.verifyRegistrationOTP,
    isAuthenticated: context.isAuthenticated(),
  })

  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }

  return context
}


























// "use client"

// import { createContext, useContext, useState, useEffect } from "react"
// import { authAPI, cartAPI, userAPI } from "@/lib/api"
// import { authStorage } from "@/lib/auth-storage"
// import { useRouter } from "next/navigation"

// // Add this debugging code at the top of the file, after the imports
// const DEBUG = true
// const logDebug = (...args) => {
//   if (DEBUG) {
//     console.log(...args)
//   }
// }

// // Create context with default values
//   const AppContext = createContext({
//   user: null,
//   isLoading: true,
//   authChecked: false,
//   cart: { items: [], totalAmount: 0, totalItems: 0 },
//   addresses: [],
//   selectedAddress: null,
//   nutritionalPreference: null,
//   useNutritionalPreference: false,
//   registerUser: async () => {},
//   requestOTP: async () => {},
//   verifyOTP: async () => {},
//   verifyLoginOTP: async () => {},
//   verifyRegistrationOTP: async () => {},
//   logout: async () => {},
//   isAuthenticated: () => false,
// })

// /**
//  * App context provider component
//  * @param {Object} props - Component props
//  * @param {React.ReactNode} props.children - Child components
//  * @returns {JSX.Element} The app context provider
//  */
// export function AppProvider({ children }) {
//   logDebug("AppProvider rendering")
//   const router = useRouter()

//   // User state
//   const [user, setUser] = useState(null)
//   const [isLoading, setIsLoading] = useState(true)
//   const [authChecked, setAuthChecked] = useState(false)
//   const [addresses, setAddresses] = useState([])
//   const [selectedAddress, setSelectedAddress] = useState(null)

//   // Cart state
//   const [cart, setCart] = useState({ items: [], totalAmount: 0, totalItems: 0 })

//   // Nutritional preference state
//   const [nutritionalPreference, setNutritionalPreference] = useState(null)
//   const [useNutritionalPreference, setUseNutritionalPreference] = useState(false)

//   // Error state
//   const [error, setError] = useState(null)

//   // Fetch current user on mount with timeout fallback
//   useEffect(() => {
//     let isMounted = true
//     let timeoutId = null

//     // Set a timeout to prevent infinite loading
//     timeoutId = setTimeout(() => {
//       if (isMounted && isLoading) {
//         console.log("Loading timeout reached, forcing render")
//         setIsLoading(false)
//         setAuthChecked(true)
//       }
//     }, 5000) // 5 second timeout

//     const fetchCurrentUser = async () => {
//       try {
//         console.log("Checking authentication status...")

//         // Check if user is authenticated (has valid tokens)
//         if (!authStorage.isAuthenticated()) {
//           console.log("No valid tokens found")
//           if (!isMounted) return
//           setUser(null)
//           setIsLoading(false)
//           setAuthChecked(true)
//           return
//         }

//         console.log("Fetching current user...")
//         const userData = await authAPI.getCurrentUser()
//         console.log("User data received:", userData ? "User found" : "No user")

//         if (!isMounted) return

//         setUser(userData)

//         // Only fetch additional data if user exists
//         if (userData) {
//           try {
//             console.log("Fetching user addresses...")
//             const addressesData = await userAPI.getAddresses()
//             console.log("Addresses received:", addressesData.length)

//             if (!isMounted) return

//             setAddresses(addressesData)

//             if (addressesData.length > 0) {
//               const defaultAddress = addressesData.find((addr) => addr.isDefault) || addressesData[0]
//               setSelectedAddress(defaultAddress)
//             }
//           } catch (addressError) {
//             console.error("Failed to fetch addresses:", addressError)
//             // Continue even if addresses fail
//           }

//           try {
//             console.log("Fetching nutritional preferences...")
//             const preferences = await userAPI.getNutritionalPreferences()
//             console.log("Preferences received:", preferences ? preferences.length : 0)

//             if (!isMounted) return

//             if (preferences && preferences.length > 0) {
//               setNutritionalPreference(preferences[0])
//             }
//           } catch (prefError) {
//             console.error("Failed to fetch nutritional preferences:", prefError)
//             // Continue even if preferences fail
//           }
//         }
//       } catch (error) {
//         console.error("Failed to fetch user data:", error)

//         // If authentication fails, clear tokens
//         if (error.message?.includes("401") || error.message?.includes("Unauthorized")) {
//           console.log("Authentication failed, clearing tokens")
//           authStorage.clearTokens()
//         }

//         setError(error)
//       } finally {
//         if (isMounted) {
//           console.log("Setting loading to false")
//           setIsLoading(false)
//           setAuthChecked(true)
//           clearTimeout(timeoutId) // Clear timeout as we've finished loading
//         }
//       }
//     }

//     fetchCurrentUser()

//     return () => {
//       isMounted = false
//       clearTimeout(timeoutId)
//     }
//   }, [])

//   // Fetch cart on mount and when user changes
//   useEffect(() => {
//     let isMounted = true

//     const fetchCart = async () => {
//       // Skip if no user or still loading
//       if (!user || isLoading) return

//       try {
//         console.log("Fetching cart...")
//         const cartData = await cartAPI.getCart()
//         console.log("Cart received:", cartData ? "Cart found" : "No cart")

//         if (!isMounted) return

//         setCart({
//           items: cartData.items || [],
//           totalAmount: cartData.totalAmount || 0,
//           totalItems: cartData.items ? cartData.items.length : 0,
//         })
//       } catch (error) {
//         console.error("Failed to fetch cart:", error)
//         // Don't set error state here, just log it
//       }
//     }

//     fetchCart()

//     return () => {
//       isMounted = false
//     }
//   }, [user, isLoading])

//   /**
//    * Register a new user (initialize registration)
//    * @param {Object} userData - User registration data
//    * @returns {Promise<Object>} Registration response including pinId
//    */
//   const registerUser = async (userData) => {
//     console.log("Context: registerUser called with", userData)
//     try {
//       const response = await authAPI.initRegisterCustomer(userData)
//       console.log("Registration initialized successfully:", response)
//       return response
//     } catch (error) {
//       console.error("Failed to register user:", error)
//       throw error
//     }
//   }

//   /**
//    * Complete user registration with OTP
//    * @param {string} phoneNumber - User phone number
//    * @param {string} pinId - PIN ID received from registerUser
//    * @param {string} otp - One-time password
//    * @param {string} userId - User ID from registration
//    * @returns {Promise<Object>} User data
//    */
//   const verifyRegistrationOTP = async (phoneNumber, pinId, otp, userId) => {
//     console.log("Context: verifyRegistrationOTP called with", { phoneNumber, pinId, otp, userId })
//     try {
//       const response = await authAPI.registerCustomer(phoneNumber, pinId, otp, userId)
//       console.log("Registration completed successfully:", response)

//       // Update user state
//       if (response.user) {
//         setUser(response.user)
//       }

//       return response
//     } catch (error) {
//       console.error("Failed to complete registration:", error)
//       throw error
//     }
//   }



//   /**
//    * Request OTP for phone number (login flow)
//    * @param {string} fullPhonePayload - User phone number object
//    * @returns {Promise<Object>} OTP response data including pinId
//    */
//   const requestOTP = async (fullPhonePayload) => {
//     logDebug("Context: requestOTP called with", fullPhonePayload)
//     try {
//       const response = await authAPI.initCustomerLogin(fullPhonePayload)
//       logDebug("OTP requested successfully:", response)
//       return response
//     } catch (error) {
//       console.error("Failed to request OTP:", error)
//       throw error
//     }
//   }



//  /**
//    * Verify OTP 
//    * @param {string} phoneNumber - User phone number
//    * @param {string} otp - One-time password
//    * @param {string} pinId - PIN ID received from requestOTP
//    * @returns {Promise<Object>} User data
//    */
//   const verifyOTP = async (phoneNumber, otp, pinId) => {
//     logDebug("Context: verifyOTP called with", { phoneNumber, otp, pinId })
//     try {
//       const response = await authAPI.loginCustomer(phoneNumber, otp, pinId)
//       logDebug("OTP verified successfully:", response)

//       // Update user state
//       if (response.user) {
//         setUser(response.user)
//       }

//       return response
//     } catch (error) {
//       console.error("OTP verification failed:", error)
//       throw error
//     }
//   }


//   /**
//    * Verify OTP and authenticate user (login flow)
//    * @param {string} fullPhonePayload - User phone number object
//    * @param {string} otp - One-time password
//    * @param {string} pinId - PIN ID received from requestOTP
//    * @returns {Promise<Object>} User data
//    */
//   const verifyLoginOTP = async (fullPhonePayload, otp, pinId) => {
//     logDebug("Context: verifyOTP called with", { fullPhonePayload, otp, pinId })
//     try {
//       const response = await authAPI.loginCustomer(fullPhonePayload, otp, pinId)
//       logDebug("OTP verified successfully:", response)

//       // Update user state
//       if (response.user) {
//         setUser(response.user)
//       }

//       return response
//     } catch (error) {
//       console.error("OTP verification failed:", error)
//       throw error
//     }
//   }



//   /**
//    * Logout function
//    */
//   const logout = async () => {
//     console.log("Context: logout called")
//     try {
//       await authAPI.logout()
//       setUser(null)
//       setCart({ items: [], totalAmount: 0, totalItems: 0 })
//       setAddresses([])
//       setSelectedAddress(null)
//       setNutritionalPreference(null)
//       router.push("/")
//     } catch (error) {
//       console.error("Logout failed:", error)
//       // Even if logout fails, clear local state
//       setUser(null)
//       setCart({ items: [], totalAmount: 0, totalItems: 0 })
//       authStorage.clearTokens()
//       router.push("/")
//     }
//   }

//   // Context value
//   const contextValue = {
//     user,
//     isLoading,
//     authChecked,
//     cart,
//     addresses,
//     selectedAddress,
//     nutritionalPreference,
//     useNutritionalPreference,
//     error,
//     registerUser,
//     requestOTP,
//     verifyOTP,
//     verifyLoginOTP,
//     verifyRegistrationOTP,
//     logout,
//     isAuthenticated: () => !!user && authStorage.isAuthenticated(),
//     requireAuth: (callback, redirectPath = "/") => {
//       return (...args) => {
//         if (!user || !authStorage.isAuthenticated()) {
//           return false
//         }
//         return callback(...args)
//       }
//     },
//     addToCart: async (product, quantity = 1, options = {}) => {
//       try {
//         // Check if user is authenticated
//         if (!user || !authStorage.isAuthenticated()) {
//           throw new Error("Please login to add items to cart")
//         }

//         console.log("Adding to cart:", { product, quantity, options })

//         // For now, we'll use local state management since the API might not be fully implemented
//         // Create a cart item
//         const cartItem = {
//           id: `${product.id}_${Date.now()}`, // Unique ID for cart item
//           productId: product.id,
//           name: product.name,
//           description: product.description,
//           price: product.price,
//           quantity: quantity,
//           options: options,
//           imageUrl: product.imageUrl,
//           vendorId: product.vendorId,
//         }

//         // Update cart state
//         setCart((prevCart) => {
//           const existingItemIndex = prevCart.items.findIndex(
//             (item) => item.productId === product.id && JSON.stringify(item.options) === JSON.stringify(options),
//           )

//           let updatedItems
//           if (existingItemIndex >= 0) {
//             // Update existing item quantity
//             updatedItems = prevCart.items.map((item, index) =>
//               index === existingItemIndex ? { ...item, quantity: item.quantity + quantity } : item,
//             )
//           } else {
//             // Add new item
//             updatedItems = [...prevCart.items, cartItem]
//           }

//           const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
//           const totalItems = updatedItems.reduce((sum, item) => sum + item.quantity, 0)

//           return {
//             items: updatedItems,
//             totalAmount,
//             totalItems,
//           }
//         })

//         console.log("Item added to cart successfully")
//         return { success: true }
//       } catch (error) {
//         console.error("Add to cart failed:", error)
//         throw error
//       }
//     },
//     removeFromCart: async (itemId) => {
//       try {
//         if (!user || !authStorage.isAuthenticated()) {
//           throw new Error("Please login to modify your cart")
//         }

//         await cartAPI.removeFromCart(itemId)

//         // Update local cart state
//         setCart((prevCart) => {
//           const updatedItems = prevCart.items.filter((item) => item.id !== itemId)
//           const totalAmount = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

//           return {
//             items: updatedItems,
//             totalAmount,
//             totalItems: updatedItems.length,
//           }
//         })
//       } catch (error) {
//         console.error("Remove from cart failed:", error)
//         throw error
//       }
//     },
//     updateCartItem: async (itemId, quantity) => {
//       try {
//         if (!user || !authStorage.isAuthenticated()) {
//           throw new Error("Please login to modify your cart")
//         }

//         const response = await cartAPI.updateCartItem(itemId, { quantity })

//         setCart({
//           items: response.items || [],
//           totalAmount: response.totalAmount || 0,
//           totalItems: response.items ? response.items.length : 0,
//         })

//         return response
//       } catch (error) {
//         console.error("Update cart item failed:", error)
//         throw error
//       }
//     },
//     clearCart: async () => {
//       try {
//         if (!user || !authStorage.isAuthenticated()) {
//           throw new Error("Please login to modify your cart")
//         }

//         await cartAPI.clearCart()
//         setCart({ items: [], totalAmount: 0, totalItems: 0 })
//       } catch (error) {
//         console.error("Clear cart failed:", error)
//         throw error
//       }
//     },
//     setSelectedAddress,
//     addAddress: async (addressData) => {
//       try {
//         if (!user || !authStorage.isAuthenticated()) {
//           throw new Error("Please login to add an address")
//         }

//         const newAddress = await userAPI.addAddress(addressData)
//         setAddresses((prev) => [...prev, newAddress])

//         if (addressData.isDefault || addresses.length === 0) {
//           setSelectedAddress(newAddress)
//         }

//         return newAddress
//       } catch (error) {
//         console.error("Add address failed:", error)
//         throw error
//       }
//     },
//     updateAddress: async (addressId, addressData) => {
//       try {
//         if (!user || !authStorage.isAuthenticated()) {
//           throw new Error("Please login to update your address")
//         }

//         const updatedAddress = await userAPI.updateAddress(addressId, addressData)

//         setAddresses((prev) => prev.map((addr) => (addr.id === addressId ? updatedAddress : addr)))

//         if (selectedAddress && selectedAddress.id === addressId) {
//           setSelectedAddress(updatedAddress)
//         }

//         // If this address is being set as default, update other addresses
//         if (addressData.isDefault) {
//           setAddresses((prev) =>
//             prev.map((addr) => ({
//               ...addr,
//               isDefault: addr.id === addressId,
//             })),
//           )
//         }

//         return updatedAddress
//       } catch (error) {
//         console.error("Update address failed:", error)
//         throw error
//       }
//     },
//     deleteAddress: async (addressId) => {
//       try {
//         if (!user || !authStorage.isAuthenticated()) {
//           throw new Error("Please login to delete your address")
//         }

//         await userAPI.deleteAddress(addressId)

//         const updatedAddresses = addresses.filter((addr) => addr.id !== addressId)
//         setAddresses(updatedAddresses)

//         // If the deleted address was selected, select another one
//         if (selectedAddress && selectedAddress.id === addressId) {
//           const defaultAddress = updatedAddresses.find((addr) => addr.isDefault) || updatedAddresses[0]
//           setSelectedAddress(defaultAddress || null)
//         }
//       } catch (error) {
//         console.error("Delete address failed:", error)
//         throw error
//       }
//     },
//     toggleNutritionalPreference: () => {
//       setUseNutritionalPreference((prev) => !prev)
//     },
//     createNutritionalPreference: async (preferenceData) => {
//       try {
//         if (!user || !authStorage.isAuthenticated()) {
//           throw new Error("Please login to create nutritional preferences")
//         }

//         const newPreference = await userAPI.createNutritionalPreference(preferenceData)
//         setNutritionalPreference(newPreference)
//         return newPreference
//       } catch (error) {
//         console.error("Create nutritional preference failed:", error)
//         throw error
//       }
//     },
//   }

//   return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
// }

// /**
//  * Custom hook to use the app context
//  * @returns {Object} App context
//  */
// export function useAppContext() {
//   const context = useContext(AppContext)
//   logDebug("useAppContext called, returning:", {
//     hasUser: !!context.user,
//     hasRequestOTP: !!context.requestOTP,
//     hasVerifyOTP: !!context.verifyLoginOTP,
//     hasVerifyRegistrationOTP: !!context.verifyRegistrationOTP,
//     isAuthenticated: context.isAuthenticated(),
//   })

//   if (context === undefined) {
//     throw new Error("useAppContext must be used within an AppProvider")
//   }

//   return context
// }
