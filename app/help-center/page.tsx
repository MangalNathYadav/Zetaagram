"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HelpCenterPage() {
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
          <div className="mx-auto w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center mb-8">
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
              className="text-blue-500"
              animate={{ 
                rotate: [0, 10, -10, 0],
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity, 
                repeatType: "reverse" 
              }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
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
          Help Center Coming Soon
        </motion.h1>

        <motion.p 
          className="text-lg text-gray-600 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          We&apos;re building a comprehensive help center to answer all your questions. In the meantime, feel free to contact us directly.
        </motion.p>

        <motion.div
          className="max-w-md mx-auto mb-10 bg-gray-50 rounded-lg p-6 border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Support</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Name</label>
              <input 
                type="text" 
                placeholder="Your name" 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-transparent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Email</label>
              <input 
                type="email" 
                placeholder="Your email" 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-transparent focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-left">Message</label>
              <textarea 
                placeholder="How can we help you?" 
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-transparent focus:outline-none resize-none h-24"
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white">
                Send Message
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-6 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {[
            { text: "FAQs", icon: "📝" },
            { text: "User Guides", icon: "📚" },
            { text: "Video Tutorials", icon: "🎬" },
            { text: "Community Support", icon: "👥" }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-gray-50 rounded-lg p-4 flex items-center gap-3 text-gray-700"
              whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.4 }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
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

      {/* Animated background elements */}
      <motion.div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-[#4ECDC4]/10 to-[#FF6B6B]/10 blur-xl"
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
