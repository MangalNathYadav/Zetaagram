"use client";

import { motion } from "framer-motion";
import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AuthNavbar } from "./auth-navbar";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  illustrationSide?: "left" | "right";
}

export function AuthLayout({ 
  children, 
  title, 
  subtitle, 
  illustrationSide = "left" 
}: AuthLayoutProps) {
  const isMobile = useMediaQuery("(max-width: 1023px)");
  const [mounted, setMounted] = useState(false);
  
  // Handle hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);
  const illustrationVariants = {
    hidden: { opacity: 0, x: illustrationSide === "left" ? -50 : 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        delay: 0.2
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: illustrationSide === "left" ? 50 : -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring" as const,
        stiffness: 100,
        damping: 20,
        delay: 0.3
      }
    }
  };

  const bubbleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i: number) => ({ 
      opacity: 0.6, 
      scale: 1,
      transition: { 
        type: "spring" as const,
        stiffness: 200,
        damping: 15,
        delay: 0.3 + i * 0.1
      } 
    })
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 15,
        delay: 0.4
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        delay: 0.5
      }
    }
  };

  const subtitleVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        delay: 0.6
      }
    }
  };

  const bubbles = Array.from({ length: 6 }, (_, i) => ({
    id: i,
    size: Math.random() * 80 + 40,
    top: `${Math.random() * 80}%`,
    left: `${Math.random() * 80}%`,
  }));

  // Only render once mounted to avoid hydration mismatch with media query
  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Navbar - visible on all screens */}
      <AuthNavbar transparent={true} />

      {/* Add padding for the navbar */}
      <div className="h-16 md:h-20"></div>

      {/* Mobile decorative elements - shown only on mobile */}
      {isMobile && (
        <motion.div 
          className="relative h-32 overflow-hidden mb-4 mt-8"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "8rem" }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 overflow-hidden">
            {bubbles.slice(0, 3).map((bubble, i) => (
              <motion.div
                key={`mobile-${bubble.id}`}
                className="absolute rounded-full bg-gradient-to-r from-blue-300/30 to-indigo-400/30 backdrop-blur-sm"
                style={{
                  width: bubble.size / 2,
                  height: bubble.size / 2,
                  top: `${Math.random() * 80}%`,
                  left: `${Math.random() * 80}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3 + i,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>
          <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-white to-transparent" />
        </motion.div>
      )}

      {/* Order based on illustrationSide - only for desktop */}
      <div className={`hidden lg:flex lg:flex-1 ${illustrationSide === "left" ? "order-1" : "order-2"}`}>
        {/* Illustration Side - desktop only */}
        <motion.div
          className="relative w-full h-full bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50"
          variants={illustrationVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Decorative elements */}
          {bubbles.map((bubble, i) => (
            <motion.div
              key={bubble.id}
              className="absolute rounded-full bg-gradient-to-r from-blue-300/30 to-indigo-400/30 backdrop-blur-sm"
              style={{
                width: bubble.size,
                height: bubble.size,
                top: bubble.top,
                left: bubble.left,
              }}
              variants={bubbleVariants}
              custom={i}
              initial="hidden"
              animate="visible"
            />
          ))}

          <div className="absolute inset-0 flex items-center justify-center p-10">
            <motion.div 
              className="relative max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="w-full h-80 rounded-2xl bg-gradient-to-r from-[#4ECDC4] to-[#FF6B6B] mb-6"></div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Connect with the World</h3>
              <p className="text-gray-600">
                Join Zetagram and start sharing your moments, connecting with friends, and exploring content that matters to you.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Form Side */}
      <div className={`flex flex-1 ${illustrationSide === "left" ? "order-2" : "order-1"}`}>
        <motion.div
          className="flex-1 flex flex-col justify-center py-6 lg:py-12 px-4 sm:px-6 lg:px-20 xl:px-24"
          variants={formVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="mx-auto w-full max-w-md">
            <div className="text-center mb-8 lg:mb-10">
              <motion.h2 
                className="text-2xl lg:text-3xl font-bold text-gray-900"
                variants={titleVariants}
                initial="hidden"
                animate="visible"
              >
                {title}
              </motion.h2>
              <motion.p 
                className="mt-2 text-sm text-gray-600"
                variants={subtitleVariants}
                initial="hidden"
                animate="visible"
              >
                {subtitle}
              </motion.p>
            </div>
            
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
