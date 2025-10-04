"use client"

import { forwardRef } from "react"
import { Button } from "@/app/components/ui/button"
import { cn } from "@/lib/utils"

/**
 * GradientButton component providing a beautiful gradient button
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant
 * @param {string} props.className - Additional class names
 * @param {React.ReactNode} props.children - Button content
 * @returns {JSX.Element} The gradient button component
 */
export const GradientButton = forwardRef(({ variant, className, ...props }, ref) => {
  const gradientClasses = "bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-600 hover:to-red-700"

  return (
    <Button
      ref={ref}
      variant={variant || "default"}
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        variant !== "outline" && variant !== "ghost" && variant !== "link" && gradientClasses,
        className,
      )}
      {...props}
    />
  )
})

GradientButton.displayName = "GradientButton"
