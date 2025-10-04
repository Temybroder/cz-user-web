"use client"

import { motion } from "framer-motion"

export default function Loader({ fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-50">
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              width: "80px",
              height: "80px",
              background: "conic-gradient(from 0deg, #e50000, #ff5252, #ffb800, transparent)",
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Inner pulsing circle */}
          <motion.div
            className="absolute inset-0 rounded-full bg-white flex items-center justify-center"
            style={{
              width: "80px",
              height: "80px",
              margin: "2px",
            }}
            animate={{
              scale: [1, 0.95, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {/* Center dot */}
            <motion.div
              className="rounded-full"
              style={{
                width: "12px",
                height: "12px",
                background: "linear-gradient(135deg, #e50000, #ff5252)",
              }}
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.7, 1],
              }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            width: "48px",
            height: "48px",
            background: "conic-gradient(from 0deg, #e50000, #ff5252, #ffb800, transparent)",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner pulsing circle */}
        <motion.div
          className="absolute inset-0 rounded-full bg-white flex items-center justify-center"
          style={{
            width: "48px",
            height: "48px",
            margin: "2px",
          }}
        >
          {/* Center dot */}
          <motion.div
            className="rounded-full"
            style={{
              width: "8px",
              height: "8px",
              background: "linear-gradient(135deg, #e50000, #ff5252)",
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [1, 0.7, 1],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </div>
  )
}
