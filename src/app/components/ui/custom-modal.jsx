
"use client"

import { X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  className = ""
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`sm:max-w-[500px] p-0 ${className}`}>
        <div className="absolute right-4 top-4 z-10">
          <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <div className="px-8 py-6">
          {(title || icon) && (
            <DialogHeader className="flex flex-col items-center text-center mb-6">
              {icon && (
                <div className="relative mb-4">
                  <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-amber-500 rounded-full blur-md opacity-75"></div>
                  <div className="relative bg-white dark:bg-gray-800 p-4 rounded-full">
                    {icon}
                  </div>
                </div>
              )}
              {title && (
                <>
                  <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                    {title}
                  </DialogTitle>
                  {description && (
                    <DialogDescription className="mt-2 text-gray-500 dark:text-gray-400">
                      {description}
                    </DialogDescription>
                  )}
                </>
              )}
            </DialogHeader>
          )}

          <div className="px-2">
            {children}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}