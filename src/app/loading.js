import { Suspense } from "react"
import AnimatedLoader from "@/app/components/ui/animated-loader"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <AnimatedLoader />
      </Suspense>
    </div>
  )
}
