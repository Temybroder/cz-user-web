// Add this Toast component to render your notifications
// Save this as: @/app/components/ui/toast.tsx

"use client"

import { useEffect } from "react"
import { X, CheckCircle, XCircle, Info } from "lucide-react"

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
}

const toastStyles = {
  success: "bg-green-500 text-white",
  error: "bg-red-500 text-white",
  info: "bg-blue-500 text-white",
}

export function Toast({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type] || Info
        return (
          <ToastItem
            key={toast.id}
            toast={toast}
            Icon={Icon}
            onRemove={removeToast}
          />
        )
      })}
    </div>
  )
}

function ToastItem({ toast, Icon, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id)
    }, toast.duration || 3000)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg pointer-events-auto animate-in slide-in-from-right ${
        toastStyles[toast.type] || toastStyles.info
      }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span className="font-medium">{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        className="ml-2 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}