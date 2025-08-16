"use client";

import { motion, useAnimation, useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { AppScreen } from "./app-screen";

interface PhoneMockupProps {
  screen: string;
  className?: string;
}

export function PhoneMockup({ screen, className = "" }: PhoneMockupProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, amount: 0.3 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  // Animation variants
  const phoneFrameVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        when: "beforeChildren" as const,
        staggerChildren: 0.2
      }
    }
  };  const floatingIconVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.4,
        type: "spring" as const,
        stiffness: 150
      }
    }
  };
  
  return (
    <div className={`relative ${className}`} ref={ref}>
      {/* 3D rotation effect container */}
      <motion.div 
        animate={{ 
          rotateY: [0, 5, 0, -5, 0], 
          rotateX: [0, -3, 0, 3, 0] 
        }}
        transition={{ 
          duration: 10, 
          repeat: Infinity, 
          repeatType: "loop" as const,
          ease: "easeInOut" as const 
        }}
        style={{ 
          perspective: "1000px", 
          transformStyle: "preserve-3d"
        }}
      >
        {/* Phone frame */}
        <motion.div
          className="relative mx-auto w-[300px] h-[600px] rounded-[40px] bg-black shadow-xl border-[10px] border-black overflow-hidden"
          variants={phoneFrameVariants}
          initial="hidden"
          animate={controls}
          style={{ 
            boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
            transformStyle: "preserve-3d"
          }}
          whileHover={{ 
            scale: 1.05,
            rotateY: 0,
            transition: { duration: 0.3 } 
          }}
        >
          {/* Power button */}
          <motion.div
            className="absolute right-[-10px] top-[120px] w-[3px] h-[40px] bg-gray-700 rounded-r-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          />
          
          {/* Volume buttons */}
          <motion.div
            className="absolute left-[-10px] top-[100px] w-[3px] h-[30px] bg-gray-700 rounded-l-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          />
          
          <motion.div
            className="absolute left-[-10px] top-[140px] w-[3px] h-[30px] bg-gray-700 rounded-l-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          />
          
          {/* Status bar */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-6 bg-black flex justify-between items-center px-6 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div 
              className="text-[10px] text-white"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              12:34
            </motion.div>
            <motion.div className="flex items-center gap-1">
              <motion.div 
                className="w-2 h-2 rounded-full bg-white"
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.div 
                className="w-2 h-2 rounded-full bg-white"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.2 }}
              />
              <motion.div 
                className="w-2 h-2 rounded-full bg-white"
                animate={{ opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.4 }}
              />
            </motion.div>
          </motion.div>

          {/* Notch with animated indicator */}
          <motion.div 
            className="absolute top-0 left-1/2 w-[120px] h-[25px] bg-black rounded-b-[14px] -translate-x-1/2 z-10 flex items-center justify-center"
            initial={{ y: -25 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.8, duration: 0.5, type: "spring" as const }}
          >
            <motion.div 
              className="w-[8px] h-[8px] rounded-full mr-2"
              animate={{ 
                backgroundColor: ["#4ECDC4", "#FF6B6B", "#4ECDC4"],
                boxShadow: [
                  "0 0 0px #4ECDC4",
                  "0 0 8px #FF6B6B",
                  "0 0 0px #4ECDC4"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <motion.div 
              className="w-[4px] h-[4px] rounded-full bg-gray-400"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            />
          </motion.div>

          {/* Screen with animated content */}
          <motion.div 
            className="w-full h-full bg-white overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 1.1 }}
          >
            {screen.endsWith('.html') ? (
              <motion.iframe
                src={screen}
                className="w-full h-full border-0"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
              />
            ) : screen === 'app-screen' ? (
              <motion.div
                className="w-full h-full"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <AppScreen />
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.4 }}
              >
                <Image 
                  src={screen} 
                  alt="Zetagram app screen" 
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Phone reflections and highlights */}
      <motion.div 
        className="absolute top-[10%] left-[15%] w-[30%] h-[20%] bg-white/10 blur-md rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1.5
        }}
      />
      
      <motion.div 
        className="absolute bottom-[30%] right-[10%] w-[25%] h-[15%] bg-gradient-to-r from-cyan-500/20 to-white/10 blur-md rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ 
          duration: 7,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 2
        }}
      />

      {/* Floating notification icons with enhanced animations */}
      <motion.div
        className="absolute -right-5 top-[30%] w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-red-500 shadow-lg flex items-center justify-center text-white"
        variants={floatingIconVariants}
        initial="hidden"
        animate={controls}
        transition={{ delay: 1.2 }}
        whileHover={{ 
          scale: 1.2, 
          rotate: 10,
          boxShadow: "0 10px 25px -5px rgba(236, 72, 153, 0.4)" 
        }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.span 
          className="text-2xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ❤️
        </motion.span>
        <motion.div 
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-[10px] font-bold"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2, type: "spring" as const }}
        >
          3
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute -left-4 top-[20%] w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 shadow-lg flex items-center justify-center text-white"
        variants={floatingIconVariants}
        initial="hidden"
        animate={controls}
        transition={{ delay: 1.4 }}
        whileHover={{ 
          scale: 1.2, 
          rotate: -10,
          boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)" 
        }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div className="relative">
          <motion.span 
            className="text-2xl"
            animate={{ 
              y: [0, -3, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          >
            💬
          </motion.span>
          <motion.div 
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-[8px] font-bold"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            2
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="absolute -left-6 bottom-[35%] w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg flex items-center justify-center text-white overflow-hidden"
        variants={floatingIconVariants}
        initial="hidden"
        animate={controls}
        transition={{ delay: 1.6 }}
        whileHover={{ 
          scale: 1.2,
          rotate: 15,
          boxShadow: "0 10px 25px -5px rgba(251, 191, 36, 0.4)" 
        }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-amber-300/30 to-transparent"
          animate={{ 
            x: [0, 10, 0], 
            y: [0, -5, 0],
            opacity: [0.5, 0.8, 0.5] 
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.span 
          className="text-xl relative z-10"
          animate={{ 
            rotate: [0, 10, 0, -10, 0],
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          📷
        </motion.span>
      </motion.div>

      {/* Enhanced decorative elements */}
      <motion.div
        className="absolute -z-10 -bottom-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] opacity-20 blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 5, 0],
          y: [0, -5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </div>
  );
}
