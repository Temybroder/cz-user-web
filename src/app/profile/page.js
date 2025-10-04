// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import Image from "next/image"
// import { useAppContext } from "@/context/app-context"
// import { userAPI, orderAPI } from "@/lib/api"
// import { Button } from "@/app/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
// import { Input } from "@/app/components/ui/input"
// import { Label } from "@/app/components/ui/label"
// import { Separator } from "@/app/components/ui/separator"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
// import { User, Package, Heart, Bell, Settings, LogOut, Wallet, Users } from "lucide-react"
// import ProtectedRoute from "@/app/components/protected-route"
// import AnimatedLoader from "@/app/components/ui/animated-loader"
// import AddressModal from "@/app/components/modals/address-modal"

// export default function ProfilePage() {
//   const router = useRouter()
//   const { user, logout, addresses, addAddress, updateAddress, deleteAddress } = useAppContext()
//   const [activeTab, setActiveTab] = useState("profile")
//   const [activeProfileTab, setActiveProfileTab] = useState("personal")
//   const [isEditing, setIsEditing] = useState(false)
//   const [profileData, setProfileData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     bio: "",
//     dateOfBirth: "",
//     gender: "",
//   })
//   const [isLoading, setIsLoading] = useState(false)
//   const [isSaving, setIsSaving] = useState(false)
//   const [orders, setOrders] = useState([])
//   const [isOrdersLoading, setIsOrdersLoading] = useState(true)
//   const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
//   const [selectedAddressId, setSelectedAddressId] = useState(null)

//   useEffect(() => {
//     if (user) {
//       setProfileData({
//         name: user.name || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         bio: user.bio || "",
//         dateOfBirth: user.dateOfBirth || "",
//         gender: user.gender || "",
//       })

//       // Fetch orders
//       const fetchOrders = async () => {
//         try {
//           setIsOrdersLoading(true)
//           const ordersData = await orderAPI.getOrders(user._id)
//           setOrders(ordersData.orders)
//         } catch (error) {
//           console.error("Failed to fetch orders:", error)
//         } finally {
//           setIsOrdersLoading(false)
//         }
//       }

//       fetchOrders()
//     }
//   }, [user])

//   const handleProfileChange = (e) => {
//     const { name, value } = e.target
//     setProfileData((prev) => ({ ...prev, [name]: value }))
//   }

//   const handleProfileSubmit = async (e) => {
//     e.preventDefault()
//     setIsSaving(true)

//     try {
//       await userAPI.updateProfile(profileData, user._id)
//       setIsEditing(false)
//       // Update user in context
//       // This would typically be handled by refetching the user
//     } catch (error) {
//       console.error("Failed to update profile:", error)
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   const handleAddressSelect = (address) => {
//     setIsAddressModalOpen(false)
//   }

//   const handleEditAddress = (addressId) => {
//     setSelectedAddressId(addressId)
//     setIsAddressModalOpen(true)
//   }

//   const renderPersonalInfoTab = () => (
//     <div className="space-y-6">
//       {isEditing ? (
//         <form onSubmit={handleProfileSubmit} className="space-y-4">
//           <div className="space-y-2">
//             <Label htmlFor="name">Full Name</Label>
//             <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="email">Email</Label>
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               value={profileData.email}
//               onChange={handleProfileChange}
//               disabled
//             />
//             <p className="text-xs text-muted-foreground">Email cannot be changed</p>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="phone">Phone Number</Label>
//             <Input id="phone" name="phone" value={profileData.phone} onChange={handleProfileChange} />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="dateOfBirth">Date of Birth</Label>
//             <Input
//               id="dateOfBirth"
//               name="dateOfBirth"
//               type="date"
//               value={profileData.dateOfBirth}
//               onChange={handleProfileChange}
//             />
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="gender">Gender</Label>
//             <select
//               id="gender"
//               name="gender"
//               value={profileData.gender}
//               onChange={handleProfileChange}
//               className="w-full p-2 border rounded-md"
//             >
//               <option value="">Select gender</option>
//               <option value="male">Male</option>
//               <option value="female">Female</option>
//               <option value="non-binary">Non-binary</option>
//               <option value="prefer-not-to-say">Prefer not to say</option>
//             </select>
//           </div>

//           <div className="space-y-2">
//             <Label htmlFor="bio">Bio</Label>
//             <textarea
//               id="bio"
//               name="bio"
//               value={profileData.bio}
//               onChange={handleProfileChange}
//               rows={4}
//               className="w-full p-2 border rounded-md"
//             />
//           </div>

//           <div className="flex gap-2">
//             <Button type="submit" className="gradient-button" disabled={isSaving}>
//               {isSaving ? "Saving..." : "Save Changes"}
//             </Button>
//             <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
//               Cancel
//             </Button>
//           </div>
//         </form>
//       ) : (
//         <div className="space-y-6">
//           <div className="flex justify-between items-center">
//             <h3 className="text-lg font-medium">Personal Information</h3>
//             <Button variant="outline" onClick={() => setIsEditing(true)}>
//               Edit Profile
//             </Button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
//               <p className="mt-1">{profileData.name || "Not provided"}</p>
//             </div>

//             <div>
//               <h4 className="text-sm font-medium text-gray-500">Email</h4>
//               <p className="mt-1">{profileData.email || "Not provided"}</p>
//             </div>

//             <div>
//               <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
//               <p className="mt-1">{profileData.phone || "Not provided"}</p>
//             </div>

//             <div>
//               <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
//               <p className="mt-1">
//                 {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : "Not provided"}
//               </p>
//             </div>

//             <div>
//               <h4 className="text-sm font-medium text-gray-500">Gender</h4>
//               <p className="mt-1">{profileData.gender || "Not provided"}</p>
//             </div>
//           </div>

//           {profileData.bio && (
//             <div>
//               <h4 className="text-sm font-medium text-gray-500">Bio</h4>
//               <p className="mt-1">{profileData.bio}</p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )

//   const renderAddressesTab = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-medium">Saved Addresses</h3>
//         <Button variant="outline" onClick={() => setIsAddressModalOpen(true)}>
//           Add New Address
//         </Button>
//       </div>

//       {addresses.length > 0 ? (
//         <div className="space-y-4">
//           {addresses.map((address) => (
//             <div key={address.id} className="p-4 border rounded-lg">
//               <div className="flex items-start justify-between">
//                 <div>
//                   <h3 className="font-medium">{address.name}</h3>
//                   <p className="text-sm text-gray-500">{address.fullAddress}</p>
//                   {address.isDefault && (
//                     <span className="inline-block px-2 py-1 mt-2 text-xs text-white bg-primary rounded-full">
//                       Default
//                     </span>
//                   )}
//                 </div>
//                 <div className="flex space-x-2">
//                   <Button variant="ghost" size="sm" onClick={() => handleEditAddress(address.id)}>
//                     Edit
//                   </Button>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                     onClick={() => deleteAddress(address.id)}
//                   >
//                     Delete
//                   </Button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="py-8 text-center">
//           <p className="text-gray-500">You haven&apos;t added any addresses yet</p>
//           <Button className="mt-4" onClick={() => setIsAddressModalOpen(true)}>
//             Add Address
//           </Button>
//         </div>
//       )}
//     </div>
//   )

//   const renderPaymentMethodsTab = () => (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-medium">Payment Methods</h3>
//         <Button variant="outline">Add Payment Method</Button>
//       </div>

//       <div className="py-8 text-center">
//         <p className="text-gray-500">You haven&apos;t added any payment methods yet</p>
//         <Button className="mt-4">Add Payment Method</Button>
//       </div>
//     </div>
//   )

//   return (
//     <ProtectedRoute>
//       <div className="container px-4 py-8 mx-auto">
//         <h1 className="text-2xl font-bold">My Account</h1>

//         <div className="flex flex-col mt-6 lg:flex-row lg:space-x-8">
//           {/* Sidebar */}
//           <div className="w-full lg:w-64">
//             <Card>
//               <CardContent className="p-6">
//                 <div className="flex flex-col items-center">
//                   <div className="relative w-24 h-24 overflow-hidden rounded-full bg-gray-100">
//                     {user?.avatarUrl ? (
//                       <Image
//                         src={user.avatarUrl || "/placeholder.svg"}
//                         alt={user?.name || "User"}
//                         fill
//                         className="object-cover"
//                       />
//                     ) : (
//                       <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary">
//                         <User className="w-12 h-12" />
//                       </div>
//                     )}
//                   </div>
//                   <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
//                   <p className="text-sm text-gray-500">{user?.email}</p>
//                 </div>

//                 <Separator className="my-6" />

//                 <nav className="space-y-2">
//                   <Button
//                     variant={activeTab === "profile" ? "default" : "ghost"}
//                     className="w-full justify-start"
//                     onClick={() => setActiveTab("profile")}
//                   >
//                     <User className="w-4 h-4 mr-2" />
//                     Profile
//                   </Button>
//                   <Button
//                     variant={activeTab === "orders" ? "default" : "ghost"}
//                     className="w-full justify-start"
//                     onClick={() => setActiveTab("orders")}
//                   >
//                     <Package className="w-4 h-4 mr-2" />
//                     Orders
//                   </Button>
//                   <Button
//                     variant={activeTab === "wallet" ? "default" : "ghost"}
//                     className="w-full justify-start"
//                     onClick={() => router.push("/wallet")}
//                   >
//                     <Wallet className="w-4 h-4 mr-2" />
//                     Wallet
//                   </Button>
//                   <Button
//                     variant={activeTab === "favorites" ? "default" : "ghost"}
//                     className="w-full justify-start"
//                     onClick={() => setActiveTab("favorites")}
//                   >
//                     <Heart className="w-4 h-4 mr-2" />
//                     Favorites
//                   </Button>
//                   <Button
//                     variant={activeTab === "referrals" ? "default" : "ghost"}
//                     className="w-full justify-start"
//                     onClick={() => router.push("/refer")}
//                   >
//                     <Users className="w-4 h-4 mr-2" />
//                     Refer a Friend
//                   </Button>
//                   <Button
//                     variant={activeTab === "notifications" ? "default" : "ghost"}
//                     className="w-full justify-start"
//                     onClick={() => setActiveTab("notifications")}
//                   >
//                     <Bell className="w-4 h-4 mr-2" />
//                     Notifications
//                   </Button>
//                   <Button
//                     variant={activeTab === "settings" ? "default" : "ghost"}
//                     className="w-full justify-start"
//                     onClick={() => setActiveTab("settings")}
//                   >
//                     <Settings className="w-4 h-4 mr-2" />
//                     Settings
//                   </Button>

//                   <Separator className="my-4" />

//                   <Button
//                     variant="ghost"
//                     className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
//                     onClick={logout}
//                   >
//                     <LogOut className="w-4 h-4 mr-2" />
//                     Logout
//                   </Button>
//                 </nav>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content */}
//           <div className="flex-1 mt-6 lg:mt-0">
//             {activeTab === "profile" && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Profile Information</CardTitle>
//                   <Tabs
//                     defaultValue="personal"
//                     value={activeProfileTab}
//                     onValueChange={setActiveProfileTab}
//                     className="mt-2"
//                   >
//                     <TabsList>
//                       <TabsTrigger value="personal">Personal Info</TabsTrigger>
//                       <TabsTrigger value="addresses">Addresses</TabsTrigger>
//                       <TabsTrigger value="payment">Payment Methods</TabsTrigger>
//                     </TabsList>
//                   </Tabs>
//                 </CardHeader>
//                 <CardContent>
//                   <TabsContent value="personal" className={activeProfileTab === "personal" ? "block" : "hidden"}>
//                     {renderPersonalInfoTab()}
//                   </TabsContent>
//                   <TabsContent value="addresses" className={activeProfileTab === "addresses" ? "block" : "hidden"}>
//                     {renderAddressesTab()}
//                   </TabsContent>
//                   <TabsContent value="payment" className={activeProfileTab === "payment" ? "block" : "hidden"}>
//                     {renderPaymentMethodsTab()}
//                   </TabsContent>
//                 </CardContent>
//               </Card>
//             )}

//             {activeTab === "orders" && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Order History</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   {isOrdersLoading ? (
//                     <div className="py-8 flex justify-center">
//                       <AnimatedLoader />
//                     </div>
//                   ) : orders.length > 0 ? (
//                     <div className="space-y-4">
//                       {orders.map((order) => (
//                         <div key={order.id} className="p-4 border rounded-lg">
//                           <div className="flex items-center justify-between">
//                             <div>
//                               <h3 className="font-medium">Order #{order.orderReferenceCode}</h3>
//                               <p className="text-sm text-gray-500">
//                                 {new Date(order.timeCreated).toLocaleDateString()}
//                               </p>
//                             </div>
//                             <div className="text-right">
//                               <span className="font-medium">
//                                 ₦{order.billing?.pricing?.grandTotal?.toLocaleString()}
//                               </span>
//                               <p className="text-sm text-gray-500">{order.orderStatus}</p>
//                             </div>
//                           </div>
//                           <Button
//                             variant="link"
//                             className="mt-2 p-0 h-auto"
//                             onClick={() => router.push(`/orders/${order.id}`)}
//                           >
//                             View Order Details
//                           </Button>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <div className="py-8 text-center">
//                       <p className="text-gray-500">You haven&apos;t placed any orders yet</p>
//                       <Button className="mt-4" onClick={() => router.push("/")}>
//                         Start Shopping
//                       </Button>
//                     </div>
//                   )}
//                 </CardContent>
//               </Card>
//             )}

//             {activeTab === "favorites" && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Favorites</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="py-8 text-center">
//                     <p className="text-gray-500">You haven&apos;t added any favorites yet</p>
//                     <Button className="mt-4" onClick={() => router.push("/")}>
//                       Explore Restaurants
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {activeTab === "notifications" && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Notifications</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="py-8 text-center">
//                     <p className="text-gray-500">You don&apos;t have any notifications</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}

//             {activeTab === "settings" && (
//               <Card>
//                 <CardHeader>
//                   <CardTitle>Settings</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-lg font-medium">Notification Preferences</h3>
//                       <div className="mt-4 space-y-4">
//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="font-medium">Email Notifications</p>
//                             <p className="text-sm text-gray-500">Receive order updates via email</p>
//                           </div>
//                           <label className="relative inline-flex items-center cursor-pointer">
//                             <input type="checkbox" className="sr-only peer" defaultChecked />
//                             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
//                           </label>
//                         </div>

//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="font-medium">SMS Notifications</p>
//                             <p className="text-sm text-gray-500">Receive order updates via SMS</p>
//                           </div>
//                           <label className="relative inline-flex items-center cursor-pointer">
//                             <input type="checkbox" className="sr-only peer" />
//                             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
//                           </label>
//                         </div>

//                         <div className="flex items-center justify-between">
//                           <div>
//                             <p className="font-medium">Marketing Communications</p>
//                             <p className="text-sm text-gray-500">Receive promotions and offers</p>
//                           </div>
//                           <label className="relative inline-flex items-center cursor-pointer">
//                             <input type="checkbox" className="sr-only peer" defaultChecked />
//                             <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
//                           </label>
//                         </div>
//                       </div>
//                     </div>

//                     <Separator />

//                     <div>
//                       <h3 className="text-lg font-medium">Account Settings</h3>
//                       <div className="mt-4 space-y-4">
//                         <Button variant="outline" className="w-full justify-start text-red-500">
//                           Change Password
//                         </Button>
//                         <Button variant="outline" className="w-full justify-start text-red-500">
//                           Delete Account
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Address Modal */}
//       <AddressModal
//         isOpen={isAddressModalOpen}
//         onClose={() => setIsAddressModalOpen(false)}
//         onSelectAddress={handleAddressSelect}
//         editAddressId={selectedAddressId}
//       />
//     </ProtectedRoute>
//   )
// }



















































"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useAppContext } from "@/context/app-context"
import { userAPI } from "@/lib/api"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Separator } from "@/app/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { User, Package, Heart, Bell, Settings, LogOut, Wallet, Users } from "lucide-react"
import ProtectedRoute from "@/app/components/protected-route"
import AnimatedLoader from "@/app/components/ui/animated-loader"
import AddressModal from "@/app/components/modals/address-modal"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, addresses, addAddress, updateAddress, deleteAddress } = useAppContext()
  const [activeTab, setActiveTab] = useState("profile")
  const [activeProfileTab, setActiveProfileTab] = useState("personal")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    dateOfBirth: "",
    gender: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [orders, setOrders] = useState([])
  const [isOrdersLoading, setIsOrdersLoading] = useState(true)
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState(null)

  useEffect(() => {
    if (user) {
      setProfileData({
        name: `${user.firstName} ${user.lastName}` || "",
        email: user.email || "",
        phone: user.phone.fullPhoneNumber || "",
        bio: user.bio || "",
        dateOfBirth: user.dateOfBirth || "",
        gender: user.gender || "",
      })

      // Fetch orders
      const fetchOrders = async () => {
        try {
          setIsOrdersLoading(true)
          const ordersData = await userAPI.getOrders(user._id)
          setOrders(ordersData)
        } catch (error) {
          console.error("Failed to fetch orders:", error)
        } finally {
          setIsOrdersLoading(false)
        }
      }

      fetchOrders()
    }
  }, [user])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await userAPI.updateProfile(profileData, user._id)
      setIsEditing(false)
      // Update user in context
      // This would typically be handled by refetching the user
    } catch (error) {
      console.error("Failed to update profile:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddressSelect = (address) => {
    setIsAddressModalOpen(false)
  }

  const handleEditAddress = (addressId) => {
    setSelectedAddressId(addressId)
    setIsAddressModalOpen(true)
  }

  const renderPersonalInfoTab = () => (
    <div className="space-y-6">
      {isEditing ? (
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
              disabled
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" disabled value={profileData.phone} onChange={handleProfileChange} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={profileData.dateOfBirth}
              onChange={handleProfileChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              value={profileData.gender}
              onChange={handleProfileChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <textarea
              id="bio"
              name="bio"
              value={profileData.bio}
              onChange={handleProfileChange}
              rows={4}
              className="w-full p-2 border rounded-md"
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="gradient-button" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Personal Information</h3>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit Profile
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
              <p className="mt-1">{profileData.name || "Not provided"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Email</h4>
              <p className="mt-1">{profileData.email || "Not provided"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Phone Number</h4>
              <p className="mt-1">{profileData.phone || "Not provided"}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Date of Birth</h4>
              <p className="mt-1">
                {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString() : "Not provided"}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-500">Gender</h4>
              <p className="mt-1">{profileData.gender || "Not provided"}</p>
            </div>
          </div>

          {profileData.bio && (
            <div>
              <h4 className="text-sm font-medium text-gray-500">Bio</h4>
              <p className="mt-1">{profileData.bio}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderAddressesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Saved Addresses</h3>
        <Button variant="outline" onClick={() => setIsAddressModalOpen(true)}>
          Add New Address
        </Button>
      </div>

      {addresses.length > 0 ? (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div key={address.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-medium">{address.name}</h3>
                  <p className="text-sm text-gray-500">{address.fullAddress}</p>
                  {address.isDefault && (
                    <span className="inline-block px-2 py-1 mt-2 text-xs text-white bg-primary rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleEditAddress(address.id)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteAddress(address.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="text-gray-500">You haven&apos;t added any addresses yet</p>
          <Button className="mt-4" onClick={() => setIsAddressModalOpen(true)}>
            Add Address
          </Button>
        </div>
      )}
    </div>
  )

  const renderPaymentMethodsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Payment Methods</h3>
        <Button variant="outline">Add Payment Method</Button>
      </div>

      <div className="py-8 text-center">
        <p className="text-gray-500">You haven&apos;t added any payment methods yet</p>
        <Button className="mt-4">Add Payment Method</Button>
      </div>
    </div>
  )

  return (
    <ProtectedRoute>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="text-2xl font-bold">My Account</h1>

        <div className="flex flex-col mt-6 lg:flex-row lg:space-x-8">
          {/* Sidebar */}
          <div className="w-full lg:w-64">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative w-24 h-24 overflow-hidden rounded-full bg-gray-100">
                    {user?.avatarUrl ? (
                      <Image
                        src={user.avatarUrl || "/placeholder.svg"}
                        alt={user?.name || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full bg-primary/10 text-primary">
                        <User className="w-12 h-12" />
                      </div>
                    )}
                  </div>
                  <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <Separator className="my-6" />

                <nav className="space-y-2">
                  <Button
                    variant={activeTab === "profile" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                  <Button
                    variant={activeTab === "orders" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("orders")}
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Orders
                  </Button>
                  <Button
                    variant={activeTab === "wallet" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => router.push("/wallet")}
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </Button>
                  <Button
                    variant={activeTab === "favorites" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("favorites")}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Favorites
                  </Button>
                  <Button
                    variant={activeTab === "referrals" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => router.push("/refer")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Refer a Friend
                  </Button>
                  <Button
                    variant={activeTab === "notifications" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("notifications")}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Notifications
                  </Button>
                  <Button
                    variant={activeTab === "settings" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveTab("settings")}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>

                  <Separator className="my-4" />

                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1 mt-6 lg:mt-0">
            {activeTab === "profile" && (
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={activeProfileTab} onValueChange={setActiveProfileTab}>
                    <TabsList>
                      <TabsTrigger value="personal">Personal Info</TabsTrigger>
                      <TabsTrigger value="addresses">Addresses</TabsTrigger>
                      <TabsTrigger value="payment">Payment Methods</TabsTrigger>
                    </TabsList>

                    <TabsContent value="personal">{renderPersonalInfoTab()}</TabsContent>

                    <TabsContent value="addresses">{renderAddressesTab()}</TabsContent>

                    <TabsContent value="payment">{renderPaymentMethodsTab()}</TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}

            {activeTab === "orders" && (
              <Card>
                <CardHeader>
                  <CardTitle>Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {isOrdersLoading ? (
                    <div className="py-8 flex justify-center">
                      <AnimatedLoader />
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <div key={order.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">Order #{order.orderReferenceCode}</h3>
                              <p className="text-sm text-gray-500">
                                {new Date(order.timeCreated).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="font-medium">
                                ₦{order.billing?.pricing?.grandTotal?.toLocaleString()}
                              </span>
                              <p className="text-sm text-gray-500">{order.orderStatus}</p>
                            </div>
                          </div>
                          <Button
                            variant="link"
                            className="mt-2 p-0 h-auto"
                            onClick={() => router.push(`/orders/${order.id}`)}
                          >
                            View Order Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-gray-500">You haven&apos;t placed any orders yet</p>
                      <Button className="mt-4" onClick={() => router.push("/")}>
                        Start Shopping
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {activeTab === "favorites" && (
              <Card>
                <CardHeader>
                  <CardTitle>Favorites</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center">
                    <p className="text-gray-500">You haven&apos;t added any favorites yet</p>
                    <Button className="mt-4" onClick={() => router.push("/")}>
                      Explore Restaurants
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="py-8 text-center">
                    <p className="text-gray-500">You don&apos;t have any notifications</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "settings" && (
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium">Notification Preferences</h3>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive order updates via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">SMS Notifications</p>
                            <p className="text-sm text-gray-500">Receive order updates via SMS</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Marketing Communications</p>
                            <p className="text-sm text-gray-500">Receive promotions and offers</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-medium">Account Settings</h3>
                      <div className="mt-4 space-y-4">
                        <Button variant="outline" className="w-full justify-start text-red-500 bg-transparent">
                          Change Password
                        </Button>
                        <Button variant="outline" className="w-full justify-start text-red-500 bg-transparent">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSelectAddress={handleAddressSelect}
        editAddressId={selectedAddressId}
      />
    </ProtectedRoute>
  )
}
