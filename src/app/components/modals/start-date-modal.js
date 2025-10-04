// "use client"

// import { useState, useEffect } from "react"
// import { X, ChevronLeft, ChevronRight } from "lucide-react"
// import { Button } from "@/app/components/ui/button"
// import { Dialog, DialogContent } from "@/app/components/ui/dialog"

// export default function StartDateModal({ isOpen, onClose, onSelectDate, selectedDate }) {
//   const [currentDate, setCurrentDate] = useState(new Date())
//   const [selectedDay, setSelectedDay] = useState(selectedDate ? new Date(selectedDate) : null)

//   useEffect(() => {
//     if (selectedDate) {
//       setSelectedDay(new Date(selectedDate))
//     }
//   }, [selectedDate])

//   const today = new Date()
//   const currentMonth = currentDate.getMonth()
//   const currentYear = currentDate.getFullYear()

//   const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

//   const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

//   const getDaysInMonth = (month, year) => {
//     return new Date(year, month + 1, 0).getDate()
//   }

//   const getFirstDayOfMonth = (month, year) => {
//     return new Date(year, month, 1).getDay()
//   }

//   const navigateMonth = (direction) => {
//     setCurrentDate((prev) => {
//       const newDate = new Date(prev)
//       newDate.setMonth(prev.getMonth() + direction)
//       return newDate
//     })
//   }

//   const handleDateClick = (day) => {
//     const clickedDate = new Date(currentYear, currentMonth, day)

//     // Don't allow selecting past dates
//     if (clickedDate <= today) return

//     setSelectedDay(clickedDate)
//   }

//   const handleSaveDate = () => {
//     if (selectedDay) {
//       onSelectDate(selectedDay.toISOString())
//     }
//   }

//   const handleToday = () => {
//     const tomorrow = new Date(today)
//     tomorrow.setDate(today.getDate() + 1)
//     setSelectedDay(tomorrow)
//   }

//   const handleClear = () => {
//     setSelectedDay(null)
//   }

//   const renderCalendarDays = () => {
//     const daysInMonth = getDaysInMonth(currentMonth, currentYear)
//     const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
//     const days = []

//     // Empty cells for days before the first day of the month
//     for (let i = 0; i < firstDay; i++) {
//       days.push(<div key={`empty-${i}`} className="h-12"></div>)
//     }

//     // Days of the month
//     for (let day = 1; day <= daysInMonth; day++) {
//       const date = new Date(currentYear, currentMonth, day)
//       const isPast = date <= today
//       const isSelected =
//         selectedDay &&
//         selectedDay.getDate() === day &&
//         selectedDay.getMonth() === currentMonth &&
//         selectedDay.getFullYear() === currentYear

//       days.push(
//         <button
//           key={day}
//           onClick={() => handleDateClick(day)}
//           disabled={isPast}
//           className={`h-12 w-12 rounded-xl font-medium transition-all duration-200 ${
//             isPast
//               ? "text-gray-300 cursor-not-allowed"
//               : isSelected
//                 ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg transform scale-105"
//                 : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
//           }`}
//         >
//           {day}
//         </button>,
//       )
//     }

//     return days
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="max-w-md p-0 bg-white rounded-3xl border-0 shadow-2xl">
//         {/* Header */}
//         <div className="p-6 border-b border-gray-100">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">Start date</h2>
//               <p className="text-gray-500 mt-1">Select your subscription starting date</p>
//             </div>
//             <button
//               onClick={onClose}
//               className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
//             >
//               <X className="w-5 h-5 text-gray-500" />
//             </button>
//           </div>
//         </div>

//         {/* Calendar */}
//         <div className="p-6">
//           {/* Month Navigation */}
//           <div className="flex items-center justify-between mb-6">
//             <button
//               onClick={() => navigateMonth(-1)}
//               className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
//             >
//               <ChevronLeft className="w-5 h-5 text-gray-600" />
//             </button>

//             <h3 className="text-xl font-bold text-gray-900">
//               {monthNames[currentMonth]} {currentYear}
//             </h3>

//             <button
//               onClick={() => navigateMonth(1)}
//               className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
//             >
//               <ChevronRight className="w-5 h-5 text-gray-600" />
//             </button>
//           </div>

//           {/* Day Headers */}
//           <div className="grid grid-cols-7 gap-1 mb-2">
//             {dayNames.map((day) => (
//               <div key={day} className="h-10 flex items-center justify-center">
//                 <span className="text-sm font-medium text-gray-500">{day}</span>
//               </div>
//             ))}
//           </div>

//           {/* Calendar Grid */}
//           <div className="grid grid-cols-7 gap-1 mb-6">{renderCalendarDays()}</div>

//           {/* Quick Actions */}
//           <div className="flex space-x-3 mb-6">
//             <Button
//               variant="outline"
//               onClick={handleToday}
//               className="flex-1 py-2 rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
//             >
//               Tomorrow
//             </Button>
//             <Button
//               variant="outline"
//               onClick={handleClear}
//               className="flex-1 py-2 rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
//             >
//               Clear
//             </Button>
//           </div>

//           {/* Save Button */}
//           <Button
//             onClick={handleSaveDate}
//             disabled={!selectedDay}
//             className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//           >
//             Save date
//           </Button>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }
























"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Dialog, DialogContent, DialogTitle, VisuallyHidden } from "@/app/components/ui/dialog"

export default function StartDateModal({ isOpen, onClose, onSelectDate, selectedDate }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(selectedDate ? new Date(selectedDate) : null)

  useEffect(() => {
    if (selectedDate) {
      setSelectedDay(new Date(selectedDate))
    }
  }, [selectedDate])

  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      newDate.setMonth(prev.getMonth() + direction)
      return newDate
    })
  }

  const handleDateClick = (day) => {
    const clickedDate = new Date(currentYear, currentMonth, day)

    // Don't allow selecting past dates
    if (clickedDate <= today) return

    setSelectedDay(clickedDate)
  }

  const handleSaveDate = () => {
    if (selectedDay) {
      onSelectDate(selectedDay.toISOString())
    }
  }

  const handleToday = () => {
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    setSelectedDay(tomorrow)
  }

  const handleClear = () => {
    setSelectedDay(null)
  }

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear)
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day)
      const isPast = date <= today
      const isSelected =
        selectedDay &&
        selectedDay.getDate() === day &&
        selectedDay.getMonth() === currentMonth &&
        selectedDay.getFullYear() === currentYear

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          disabled={isPast}
          className={`h-12 w-12 rounded-xl font-medium transition-all duration-200 ${
            isPast
              ? "text-gray-300 cursor-not-allowed"
              : isSelected
                ? "bg-gradient-to-br from-orange-400 to-red-500 text-white shadow-lg transform scale-105"
                : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
          }`}
        >
          {day}
        </button>,
      )
    }

    return days
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto p-0 bg-white rounded-3xl border-0 shadow-2xl">
        <VisuallyHidden>
          <DialogTitle>Select Start Date</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Start date</h2>
              <p className="text-gray-500 mt-1">Select your subscription starting date</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            <h3 className="text-xl font-bold text-gray-900">
              {monthNames[currentMonth]} {currentYear}
            </h3>

            <button
              onClick={() => navigateMonth(1)}
              className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="h-10 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-500">{day}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-6">{renderCalendarDays()}</div>

          {/* Quick Actions */}
          <div className="flex space-x-3 mb-6">
            <Button
              variant="outline"
              onClick={handleToday}
              className="flex-1 py-2 rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
            >
              Tomorrow
            </Button>
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex-1 py-2 rounded-xl border-gray-200 hover:bg-gray-50 bg-transparent"
            >
              Clear
            </Button>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveDate}
            disabled={!selectedDay}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            Save date
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
