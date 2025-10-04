"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAppContext } from "@/context/app-context"
import LoginModal from "@/app/components/modals/login-modal"
import { Sparkles, Heart, Leaf } from "lucide-react"

export default function NutritionalPreferenceToggle() {
  const { user, useNutritionalPreference, toggleNutritionalPreference, nutritionalPreference } = useAppContext()
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    if (!user) {
      setIsLoginModalOpen(true)
      return
    }

    if (!nutritionalPreference) {
      // Redirect to create nutritional preference
      window.location.href = "/nutritional-preferences/create"
      return
    }

    setIsAnimating(true)
    toggleNutritionalPreference()
    setTimeout(() => setIsAnimating(false), 600)
  }

  if (!nutritionalPreference && !user) {
    return null
  }

  return (
    <>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div
          className={`relative overflow-hidden rounded-2xl backdrop-blur-md border transition-all duration-500 cursor-pointer group ${
            useNutritionalPreference
              ? "bg-gradient-to-r from-emerald-500/90 via-teal-500/90 to-cyan-500/90 border-white/30 shadow-2xl"
              : "bg-white/20 border-white/40 hover:bg-white/30"
          }`}
          onClick={handleToggle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Animated background particles */}
          <AnimatePresence>
            {useNutritionalPreference && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white/30 rounded-full"
                    initial={{ x: Math.random() * 100 + "%", y: "100%" }}
                    animate={{
                      y: "-20%",
                      x: Math.random() * 100 + "%",
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>

          <div className="relative px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Icon */}
              <motion.div
                className={`p-3 rounded-xl ${
                  useNutritionalPreference
                    ? "bg-white/20"
                    : "bg-gradient-to-br from-orange-500/20 to-red-500/20"
                }`}
                animate={{
                  scale: isAnimating ? [1, 1.1, 1] : 1,
                  rotate: isAnimating ? [0, 10, -10, 0] : 0,
                }}
              >
                {useNutritionalPreference ? (
                  <Heart className="w-6 h-6 text-white fill-white" />
                ) : (
                  <Leaf className="w-6 h-6 text-orange-500" />
                )}
              </motion.div>

              {/* Text */}
              <div>
                <motion.p
                  className={`text-sm font-bold ${
                    useNutritionalPreference ? "text-white" : "text-white"
                  }`}
                  layout
                >
                  {nutritionalPreference
                    ? "Smart Food Filtering"
                    : "Create Nutritional Profile"}
                </motion.p>
                <motion.p
                  className={`text-xs ${
                    useNutritionalPreference ? "text-white/90" : "text-white/80"
                  }`}
                  layout
                >
                  {nutritionalPreference
                    ? useNutritionalPreference
                      ? "Showing foods matched to your dietary needs"
                      : "Filter products based on your preferences"
                    : "Personalize your food recommendations"}
                </motion.p>
              </div>
            </div>

            {/* Toggle Switch */}
            {nutritionalPreference && (
              <div className="relative flex items-center gap-3">
                {/* Status Badge */}
                <AnimatePresence>
                  {useNutritionalPreference && (
                    <motion.div
                      className="flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Sparkles className="w-3 h-3 text-white" />
                      <span className="text-xs font-medium text-white">Active</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Switch */}
                <div
                  className={`relative w-16 h-8 rounded-full transition-all duration-300 ${
                    useNutritionalPreference
                      ? "bg-white/30"
                      : "bg-gray-400/30"
                  }`}
                >
                  <motion.div
                    className={`absolute top-1 left-1 w-6 h-6 rounded-full shadow-lg flex items-center justify-center ${
                      useNutritionalPreference
                        ? "bg-white"
                        : "bg-white/70"
                    }`}
                    animate={{
                      x: useNutritionalPreference ? 32 : 0,
                      scale: isAnimating ? [1, 1.2, 1] : 1,
                    }}
                    transition={{ duration: 0.3, type: "spring", stiffness: 500, damping: 30 }}
                  >
                    {isAnimating && (
                      <motion.div
                        className="absolute inset-0 rounded-full"
                        initial={{ scale: 0, opacity: 1 }}
                        animate={{ scale: 3, opacity: 0 }}
                        transition={{ duration: 0.6 }}
                        style={{
                          background: useNutritionalPreference
                            ? "radial-gradient(circle, rgba(16,185,129,0.4) 0%, rgba(16,185,129,0) 70%)"
                            : "radial-gradient(circle, rgba(156,156,156,0.4) 0%, rgba(156,156,156,0) 70%)",
                        }}
                      />
                    )}
                  </motion.div>
                </div>
              </div>
            )}
          </div>

          {/* Hover glow effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
            initial={{ x: "-100%" }}
            animate={{ x: isHovered ? "100%" : "-100%" }}
            transition={{ duration: 0.6 }}
          />
        </div>

        {/* Enhanced tooltip */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 z-10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-gray-900 text-white text-xs py-2 px-4 rounded-lg shadow-xl whitespace-nowrap">
                {useNutritionalPreference
                  ? "Click to show all products"
                  : nutritionalPreference
                  ? "Click to filter by your preferences"
                  : "Create your profile to get started"}
                <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </>
  )
}
