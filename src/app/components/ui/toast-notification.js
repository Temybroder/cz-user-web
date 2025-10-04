"use client"

import { useEffect } from "react"
import { X, CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react"

export function ToastNotification({ toast, removeToast }) {
  useEffect(() => {
    // Auto remove after duration
    if (toast.duration) {
      const timer = setTimeout(() => {
        removeToast(toast.id)
      }, toast.duration)

      return () => clearTimeout(timer)
    }
  }, [toast.duration, toast.id, removeToast])

  const getToastStyles = () => {
    switch (toast.type) {
      case "success":
        return {
          bg: "bg-green-50 border-green-200",
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          text: "text-green-800",
        }
      case "error":
        return {
          bg: "bg-red-50 border-red-200",
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          text: "text-red-800",
        }
      case "warning":
        return {
          bg: "bg-yellow-50 border-yellow-200",
          icon: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
          text: "text-yellow-800",
        }
      default:
        return {
          bg: "bg-blue-50 border-blue-200",
          icon: <Info className="w-5 h-5 text-blue-600" />,
          text: "text-blue-800",
        }
    }
  }

  const styles = getToastStyles()

  return (
    <div
      className={`${styles.bg} border rounded-lg p-4 shadow-lg flex items-start gap-3 min-w-[300px] max-w-md animate-in slide-in-from-right-full`}
    >
      {styles.icon}
      <p className={`${styles.text} flex-1 text-sm font-medium`}>{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastContainer({ toasts, removeToast }) {
  if (!toasts || toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastNotification key={toast.id} toast={toast} removeToast={removeToast} />
      ))}
    </div>
  )
}
