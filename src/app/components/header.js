

"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useAppContext } from "@/context/app-context"
import {
  MapPin,
  Search,
  ShoppingCart,
  User,
  LogOut,
  Heart,
  Package,
  Wallet,
  Settings,
  UserPlus,
  HelpCircle,
  Bell,
} from "lucide-react"
import { Button } from "@/app/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Badge } from "@/app/components/ui/badge"
import AddressModal from "@/app/components/modals/address-modal"
import LoginModal from "@/app/components/modals/login-modal"
import SearchModal from "@/app/components/search/search-modal"

export default function Header() {
  const { user, cart, addresses, selectedAddress, setSelectedAddress, logout } = useAppContext()
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?._id) return

      try {
        const { userAPI } = await import("@/lib/api")
        const response = await userAPI.getNotifications(user._id)

        if (response.success) {
          setNotifications(response.data || [])
          setUnreadCount(response.unreadCount || 0)
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error)
      }
    }

    if (user) {
      fetchNotifications()
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  // Mark notifications as read when dropdown opens
  const handleNotificationsOpen = async (open) => {
    setIsNotificationsOpen(open)

    if (open && unreadCount > 0 && user?._id) {
      try {
        const { userAPI } = await import("@/lib/api")
        await userAPI.markNotificationsAsRead(user._id)

        // Update local state
        setNotifications(notifications.map(n => ({ ...n, status: 0 })))
        setUnreadCount(0)
      } catch (error) {
        console.error("Failed to mark notifications as read:", error)
      }
    }
  }

  // Format notification time
  const formatNotificationTime = (date) => {
    const now = new Date()
    const notifDate = new Date(date)
    const diffMs = now - notifDate
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) return "Just now"
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`

    const diffHours = Math.floor(diffMins / 60)
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`

    const diffDays = Math.floor(diffHours / 24)
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`

    return notifDate.toLocaleDateString()
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address)
    setIsAddressModalOpen(false)
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user) return "CN"
    console.log("=========++++++++++++++++++++++++++++ ", user)
    const names = `${user.firstName} ${user.lastName}`.split(" ")
    return names.map((name) => name.charAt(0).toUpperCase()).join("")
  }

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full bg-white transition-all duration-300 ${
          scrolled ? "shadow-md py-2" : "py-4"
        }`}
      >
        <div className="container flex items-center justify-between px-4 mx-auto sm:px-6">
          {/* Logo - Updated positioning and dimensions */}
          <Link href="/" className="flex items-center">
            <div className="relative h-[60px] w-[180px] flex items-center">
              <Image
                src="/images/logo.png"
                alt="Conzooming"
                width={180}
                height={60}
              />
            </div>
          </Link>

          {/* Address Selector */}
          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="flex items-center gap-1 px-3 py-2 ml-4 text-sm transition-colors bg-gray-50 rounded-full md:ml-6 hover:bg-gray-100 group"
          >
            <MapPin className="w-4 h-4 text-red-500" />
            <span className="hidden max-w-[150px] truncate sm:inline-block group-hover:text-red-500 transition-colors">
              {selectedAddress ? selectedAddress.name : "Enter delivery address"}
            </span>
            <span className="inline-block sm:hidden">Address</span>
          </button>

          {/* Search */}
          <div className="hidden flex-1 max-w-md mx-4 md:block">
            <button
              className="relative w-full flex items-center px-4 py-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setIsSearchModalOpen(true)}
            >
              <Search className="w-5 h-5 text-gray-400" />
              <span className="ml-2 text-gray-500">Search for consumables</span>
            </button>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-2 md:gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchModalOpen(true)}>
              <Search className="w-5 h-5" />
              <span className="sr-only">Search</span>
            </Button>

            {/* Notifications */}
            {user && (
              <DropdownMenu onOpenChange={handleNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span className="font-semibold">Notifications</span>
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {unreadCount} new
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <div className="max-h-[300px] overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                            notification.status === 1 ? "border-l-2 border-orange-500 bg-orange-50/30" : ""
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${
                              notification.status === 1 ? "bg-orange-100" : "bg-gray-100"
                            }`}>
                              <Package className={`w-4 h-4 ${
                                notification.status === 1 ? "text-orange-500" : "text-gray-500"
                              }`} />
                            </div>
                            <div className="flex-1">
                              <p className={`text-sm ${
                                notification.status === 1 ? "font-semibold text-gray-900" : "font-medium text-gray-700"
                              }`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatNotificationTime(notification.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-500">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Cart */}
               <Link href="/orders">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {user && cart.totalItems > 0 && (
                  <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full -top-1 -right-1 bg-red-500 font-medium">
                    {cart.totalItems > 99 ? "99+" : cart.totalItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
            
            {/* <Link href="/orders">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="w-5 h-5" />
                {cart.totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 bg-red-500 text-white text-xs">
                    {cart.totalItems}
                  </Badge>
                )}
                <span className="sr-only">Cart</span>
              </Button>
            </Link> */}

            {/* User Profile */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative flex items-center gap-2 h-10 px-2">
                    <Avatar className="w-8 h-8 border-2 border-amber-500">
                      <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt={user.firstName} />
                      <AvatarFallback className="bg-gradient-to-r from-amber-400 to-red-500 text-white">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium leading-none">{user.firstName}</p>
                      <p className="text-xs text-gray-500 leading-none mt-1">My Account</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2 border-b">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{user.email || user.phoneNumber}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center cursor-pointer">
                      <User className="w-4 h-4 mr-2" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/orders" className="flex items-center cursor-pointer">
                      <Package className="w-4 h-4 mr-2" />
                      <span>Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" className="flex items-center cursor-pointer">
                      <Heart className="w-4 h-4 mr-2" />
                      <span>Favorites</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/wallet" className="flex items-center cursor-pointer">
                      <Wallet className="w-4 h-4 mr-2" />
                      <span>Wallet</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center cursor-pointer">
                      <Settings className="w-4 h-4 mr-2" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/refer" className="flex items-center cursor-pointer">
                      <UserPlus className="w-4 h-4 mr-2" />
                      <span>Refer a Friend</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="flex items-center cursor-pointer">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      <span>Help Center</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={logout}
                    className="flex items-center cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="default"
                size="sm"
                className="bg-gradient-to-r from-red-500 to-amber-500 hover:from-red-600 hover:to-amber-600 text-white border-none"
                onClick={() => setIsLoginModalOpen(true)}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={addresses}
        selectedAddress={selectedAddress}
        onSelectAddress={handleAddressSelect}
      />

      {/* Login Modal */}
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchModalOpen} onClose={() => setIsSearchModalOpen(false)} />
    </>
  )
}

