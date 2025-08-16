"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function DownloadAppPage() {
  const [showToast, setShowToast] = useState(false);
  
  const handleDownloadClick = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5000);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 p-6">
      <motion.div 
        className="max-w-4xl w-full bg-white rounded-2xl shadow-xl p-8 sm:p-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="mx-auto w-32 h-32 rounded-full bg-green-100 flex items-center justify-center mb-8">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500"
              animate={{ 
                y: [0, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            >
              <path d="M12 2v8"></path>
              <path d="m16 6-4-4-4 4"></path>
              <rect width="20" height="8" x="2" y="14" rx="2"></rect>
              <path d="M6 18h.01"></path>
              <path d="M10 18h.01"></path>
            </motion.svg>
          </div>
        </motion.div>

        <motion.h1 
          className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] mb-4"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          Get the Zetagram App
        </motion.h1>

        <motion.p 
          className="text-lg text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Our mobile app is coming soon! Be the first to know when it&apos;s available for download.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <motion.div 
            className="bg-gray-50 p-6 rounded-xl border border-gray-100"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="flex items-center justify-center mb-4">
              <motion.svg 
                className="text-gray-800 w-12 h-12"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ 
                  rotate: [0, 5, 0, -5, 0],
                }}
                transition={{ 
                  duration: 5, 
                  repeat: Infinity,
                }}
              >
                <path d="M12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z"></path>
                <path d="M12 19v2"></path>
                <path d="M12 3V1"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M19 12h2"></path>
                <path d="M3 12h2"></path>
                <path d="m17.66 6.34 1.41-1.41"></path>
                <path d="m4.93 19.07 1.41-1.41"></path>
              </motion.svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">iOS App</h3>
            <p className="text-gray-600 mb-4">Available soon on the App Store for iPhone and iPad.</p>
            <motion.button
              className="w-full py-3 flex items-center justify-center gap-2 bg-black text-white rounded-lg font-medium"
              onClick={handleDownloadClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16.8 2.7c1-.6 1.9-.9 3.2-1v2.1c-.4.1-.7.3-1.1.5-1.5.9-2.9 2.7-2.9 5.3 0 2.3 1.2 4.2 3.3 5.3-1 2.5-2.4 5.3-4.3 7.1-1 .9-1.9 1-3.1.4-1-.5-1.9-1.5-3-1.5-1.2 0-2.1.9-3.1 1.5-.9.5-1.6.5-2.5-.4-.9-1-1.7-2.3-2.3-3.7-.7-1.6-1.1-3.4-1.1-5.4 0-4 2-6.9 5-6.9 1.2 0 2.4.5 3.3.5.9 0 2.1-.5 3.3-.5 1.1 0 2.1.3 3.3 1z"></path>
              </svg>
              App Store
            </motion.button>
          </motion.div>

          <motion.div 
            className="bg-gray-50 p-6 rounded-xl border border-gray-100"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
          >
            <div className="flex items-center justify-center mb-4">
              <motion.svg 
                className="text-gray-800 w-12 h-12"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                animate={{ 
                  scale: [1, 1.1, 1],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                <path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"></path>
                <polygon points="12 15 17 21 7 21 12 15"></polygon>
              </motion.svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Android App</h3>
            <p className="text-gray-600 mb-4">Available soon on Google Play for Android devices.</p>
            <motion.button
              className="w-full py-3 flex items-center justify-center gap-2 bg-[#4ECDC4] text-white rounded-lg font-medium"
              onClick={handleDownloadClick}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.018 13.298l-3.919 2.218-3.515-3.493 3.543-3.521 3.891 2.202a1.49 1.49 0 0 1 0 2.594zM1.337.924a1.486 1.486 0 0 0-.112.568v21.017c0 .217.045.419.124.6l11.155-11.087L1.337.924zm12.207 10.065l3.258-3.238L3.45.195a1.466 1.466 0 0 0-.946-.179l11.04 10.973zm0 2.067l-11 10.933c.298.036.612-.016.906-.183l13.324-7.54-3.23-3.21z"></path>
              </svg>
              Google Play
            </motion.button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mb-12 p-6 bg-gray-50 rounded-xl border border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Get notified when we launch</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-transparent focus:outline-none"
            />
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button className="w-full sm:w-auto bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white px-6 py-2">
                Notify Me
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="border-t border-gray-100 pt-6"
        >
          <Link href="/" className="text-[#FF6B6B] hover:text-[#4ECDC4] font-medium transition-colors flex items-center justify-center">
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
              animate={{ x: [0, -5, 0] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </motion.svg>
            Back to Home
          </Link>
        </motion.div>
      </motion.div>

      {/* Toast notification */}
      <AnimatedToast 
        show={showToast} 
        message="Coming soon! The app will be available for download shortly." 
        onClose={() => setShowToast(false)} 
      />

      {/* Animated background elements */}
      <motion.div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-[#FF6B6B]/10 to-[#4ECDC4]/10 blur-xl"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>
    </main>
  );
}

// Animated Toast component
function AnimatedToast({ show, message, onClose }: { show: boolean; message: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-400"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <p className="flex-1 text-sm">{message}</p>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="text-white/70 hover:text-white"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </motion.button>
    </motion.div>
  );
}
