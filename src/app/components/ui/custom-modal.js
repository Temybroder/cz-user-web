"use client"

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Dialog,
  DialogFooter,
} from "@/app/components/ui/dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * CustomModal component providing a consistent modal design
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @param {string} props.title - Modal title
 * @param {string} props.description - Modal description
 * @param {React.ReactNode} props.icon - Icon to display above the title
 * @param {React.ReactNode} props.children - Modal content
 * @param {React.ReactNode} props.footer - Modal footer content
 * @param {string} props.className - Additional class names for the modal
 * @param {boolean} props.hideCloseButton - Whether to hide the close button
 * @returns {JSX.Element} The custom modal component
 */
export function CustomModal({
  isOpen,
  onClose,
  title,
  description,
  icon,
  children,
  footer,
  className,
  hideCloseButton = false,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn("sm:max-w-md border-none shadow-xl rounded-xl", className)}>
        <div className="flex flex-col items-center">
          {!hideCloseButton && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          )}

          {icon && (
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-full">{icon}</div>
            </div>
          )}

          <DialogHeader className="text-center">
            {title && <DialogTitle className="text-xl font-bold">{title}</DialogTitle>}
            {description && <DialogDescription className="mt-1">{description}</DialogDescription>}
          </DialogHeader>
        </div>

        <div className="mt-4">{children}</div>

        {footer && <DialogFooter>{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  )
}
