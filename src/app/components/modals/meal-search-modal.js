"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { Search, X } from "lucide-react"
import MealSearchResults from "@/app/components/meal-search-results"

export default function MealSearchModal({ isOpen, onClose, day, mealClass, mealIndex, onMealUpdate }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
      setSearchResults([])
      setShowResults(false)
    }
  }, [isOpen])

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setShowResults(true)

    try {
      // Mock search results - in real app, this would be an API call
      const mockResults = [
        {
          id: 1,
          name: "Fried rice",
          vendor: "The place",
          price: 2500,
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 2,
          name: "Fried rice and chicken",
          vendor: "KFC",
          price: 2500,
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 3,
          name: "Nigerian fried rice",
          vendor: "Food Embassy",
          price: 2500,
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 4,
          name: "Fried rice",
          vendor: "Mega Chicken",
          price: 2500,
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 5,
          name: "Fried rice and chicken",
          vendor: "The place",
          price: 2500,
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 6,
          name: "Nigerian fried rice",
          vendor: "KFC",
          price: 2500,
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
        {
          id: 7,
          name: "Shawarma",
          vendor: "Food Embassy",
          price: 2500,
          imageUrl: "/placeholder.svg?height=200&width=300",
        },
      ]

      // Filter results based on search query
      const filteredResults = mockResults.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

      setSearchResults(filteredResults)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  if (showResults) {
    return (
      <MealSearchResults
        isOpen={isOpen}
        onClose={onClose}
        searchQuery={searchQuery}
        results={searchResults}
        day={day}
        mealClass={mealClass}
        mealIndex={mealIndex}
        onMealUpdate={onMealUpdate}
        onBackToSearch={() => setShowResults(false)}
      />
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white rounded-3xl border-0 shadow-2xl">
        <div className="text-center p-6">
          <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-full" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>

          <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>

          <DialogTitle className="text-2xl font-bold text-gray-900 mb-6">Food search</DialogTitle>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search for food"
              className="pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 text-lg"
            />
          </div>

          <Button
            onClick={handleSearch}
            disabled={!searchQuery.trim() || isSearching}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-2xl shadow-lg font-semibold text-lg"
          >
            {isSearching ? "Searching..." : "Show results"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}





























// "use client"

// import { useState, useEffect } from "react"
// import { Dialog, DialogContent, DialogTitle } from "@/app/components/ui/dialog"
// import { Input } from "@/app/components/ui/input"
// import { Button } from "@/app/components/ui/button"
// import { Search, X } from "lucide-react"
// import MealSearchResults from "@/app/components/meal-search-results"

// export default function MealSearchModal({ isOpen, onClose, day, mealClass, mealIndex, onMealUpdate }) {
//   const [searchQuery, setSearchQuery] = useState("")
//   const [searchResults, setSearchResults] = useState([])
//   const [isSearching, setIsSearching] = useState(false)
//   const [showResults, setShowResults] = useState(false)

//   useEffect(() => {
//     if (!isOpen) {
//       setSearchQuery("")
//       setSearchResults([])
//       setShowResults(false)
//     }
//   }, [isOpen])

//   const handleSearch = async () => {
//     if (!searchQuery.trim()) return

//     setIsSearching(true)
//     setShowResults(true)

//     try {
//       // Mock search results - in real app, this would be an API call
//       const mockResults = [
//         {
//           id: 1,
//           name: "Fried rice",
//           vendor: "The place",
//           price: 2500,
//           imageUrl: "/placeholder.svg?height=200&width=300",
//         },
//         {
//           id: 2,
//           name: "Fried rice and chicken",
//           vendor: "KFC",
//           price: 2500,
//           imageUrl: "/placeholder.svg?height=200&width=300",
//         },
//         {
//           id: 3,
//           name: "Nigerian fried rice",
//           vendor: "Food Embassy",
//           price: 2500,
//           imageUrl: "/placeholder.svg?height=200&width=300",
//         },
//         {
//           id: 4,
//           name: "Fried rice",
//           vendor: "Mega Chicken",
//           price: 2500,
//           imageUrl: "/placeholder.svg?height=200&width=300",
//         },
//         {
//           id: 5,
//           name: "Fried rice and chicken",
//           vendor: "The place",
//           price: 2500,
//           imageUrl: "/placeholder.svg?height=200&width=300",
//         },
//         {
//           id: 6,
//           name: "Nigerian fried rice",
//           vendor: "KFC",
//           price: 2500,
//           imageUrl: "/placeholder.svg?height=200&width=300",
//         },
//         {
//           id: 7,
//           name: "Shawarma",
//           vendor: "Food Embassy",
//           price: 2500,
//           imageUrl: "/placeholder.svg?height=200&width=300",
//         },
//       ]

//       // Filter results based on search query
//       const filteredResults = mockResults.filter((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))

//       setSearchResults(filteredResults)
//     } catch (error) {
//       console.error("Search failed:", error)
//     } finally {
//       setIsSearching(false)
//     }
//   }

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch()
//     }
//   }

//   if (showResults) {
//     return (
//       <MealSearchResults
//         isOpen={isOpen}
//         onClose={onClose}
//         searchQuery={searchQuery}
//         results={searchResults}
//         day={day}
//         mealClass={mealClass}
//         mealIndex={mealIndex}
//         onMealUpdate={onMealUpdate}
//         onBackToSearch={() => setShowResults(false)}
//       />
//     )
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md bg-white rounded-3xl border-0 shadow-2xl">
//         <div className="text-center p-6">
//           <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-full" onClick={onClose}>
//             <X className="w-4 h-4" />
//           </Button>

//           <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
//             <Search className="w-8 h-8 text-white" />
//           </div>

//           <DialogTitle className="text-2xl font-bold text-gray-900 mb-6">Food search</DialogTitle>

//           <div className="relative mb-6">
//             <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
//             <Input
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Search for food"
//               className="pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 text-lg"
//             />
//           </div>

//           <Button
//             onClick={handleSearch}
//             disabled={!searchQuery.trim() || isSearching}
//             className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-4 rounded-2xl shadow-lg font-semibold text-lg"
//           >
//             {isSearching ? "Searching..." : "Show results"}
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
