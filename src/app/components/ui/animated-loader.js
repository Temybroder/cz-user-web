"use client"

import { motion } from "framer-motion"

/**
 * Ultra-modern animated loader with sleek design
 * @param {Object} props - Component props
 * @param {boolean} [props.fullScreen=false] - Whether to display fullscreen
 * @param {string} [props.size="default"] - Size of the loader (small, default, large)
 */
export default function AnimatedLoader({ fullScreen = false, size = "default" }) {
  const sizes = {
    small: { outer: 40, inner: 36, dot: 6 },
    default: { outer: 60, inner: 56, dot: 10 },
    large: { outer: 80, inner: 76, dot: 12 },
  }

  const { outer, inner, dot } = sizes[size] || sizes.default

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-50">
        <div className="relative" style={{ width: outer, height: outer }}>
          {/* Outer rotating gradient ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: "conic-gradient(from 0deg, #e50000 0deg, #ff5252 120deg, #ffb800 240deg, transparent 360deg)",
              filter: "blur(1px)",
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Middle ring with slower rotation */}
          <motion.div
            className="absolute rounded-full"
            style={{
              inset: "6px",
              background: "conic-gradient(from 180deg, transparent, #ffb800 180deg, transparent 360deg)",
              opacity: 0.6,
            }}
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Inner white circle */}
          <div
            className="absolute rounded-full bg-white flex items-center justify-center"
            style={{
              inset: "4px",
            }}
          >
            {/* Pulsing center dot */}
            <motion.div
              className="rounded-full"
              style={{
                width: dot,
                height: dot,
                background: "linear-gradient(135deg, #e50000, #ff5252, #ffb800)",
                boxShadow: "0 0 20px rgba(229, 0, 0, 0.4)",
              }}
              animate={{
                scale: [1, 1.4, 1],
                opacity: [1, 0.6, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>

          {/* Orbiting particles */}
          {[0, 120, 240].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: "4px",
                height: "4px",
                background: i === 0 ? "#e50000" : i === 1 ? "#ff5252" : "#ffb800",
                top: "50%",
                left: "50%",
                marginLeft: "-2px",
                marginTop: "-2px",
              }}
              animate={{
                rotate: 360,
                x: [0, Math.cos((angle * Math.PI) / 180) * (outer / 2 - 8)],
                y: [0, Math.sin((angle * Math.PI) / 180) * (outer / 2 - 8)],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-4">
      <div className="relative" style={{ width: outer, height: outer }}>
        {/* Outer rotating gradient ring */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, #e50000 0deg, #ff5252 120deg, #ffb800 240deg, transparent 360deg)",
            filter: "blur(0.5px)",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Inner white circle */}
        <div
          className="absolute rounded-full bg-white flex items-center justify-center"
          style={{
            inset: "3px",
          }}
        >
          {/* Pulsing center dot */}
          <motion.div
            className="rounded-full"
            style={{
              width: dot,
              height: dot,
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
        </div>
      </div>
    </div>
  )
}
