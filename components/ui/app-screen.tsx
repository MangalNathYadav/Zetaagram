"use client";

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export function AppScreen() {
  const [activeStory, setActiveStory] = useState(-1);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [showStoryView, setShowStoryView] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(-1);
  const controls = useAnimation();
  
  // Automatically cycle through notifications
  useEffect(() => {
    const notifications = ["New message!", "Someone liked your post!", "New follower!"];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      setCurrentNotification(currentIndex);
      currentIndex = (currentIndex + 1) % notifications.length;
      
      setTimeout(() => {
        setCurrentNotification(-1);
      }, 2000);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Automatically start animations when component mounts
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    });
  }, [controls]);

  const notifications = [
    "New message!",
    "Someone liked your post!",
    "New follower!"
  ];

  const toggleLike = (index: number) => {
    if (likedPosts.includes(index)) {
      setLikedPosts(likedPosts.filter(i => i !== index));
    } else {
      setLikedPosts([...likedPosts, index]);
    }
  };

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-hidden">
      {/* Notification popup */}
      <AnimatePresence>
        {currentNotification >= 0 && (
          <motion.div 
            className="absolute top-16 left-0 right-0 mx-auto w-4/5 bg-black bg-opacity-80 text-white rounded-lg p-3 z-20 flex items-center gap-2 shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] flex items-center justify-center">
              {currentNotification === 0 && <span>💬</span>}
              {currentNotification === 1 && <span>❤️</span>}
              {currentNotification === 2 && <span>👤</span>}
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">Zetagram</div>
              <div className="text-xs">{notifications[currentNotification]}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Story view overlay */}
      <AnimatePresence>
        {showStoryView && (
          <motion.div 
            className="absolute inset-0 z-30 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="h-1 w-full bg-gray-800 flex">
              <motion.div 
                className="h-full bg-white" 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5 }}
                onAnimationComplete={() => setShowStoryView(false)}
              />
            </div>
            <div className="flex justify-between items-center p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]" />
                <div className="text-white text-sm">User {activeStory + 1}</div>
              </div>
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowStoryView(false)}
                className="text-white text-xl"
              >
                ✕
              </motion.button>
            </div>
            <div className="h-[calc(100%-80px)] flex items-center justify-center">
              <motion.div
                className="w-full h-full bg-gradient-to-br from-[#FF6B6B]/30 to-[#4ECDC4]/30"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex h-full items-center justify-center">
                  <motion.div 
                    className="text-5xl"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, 5, 0, -5, 0] 
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    ✨
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App header */}
      <motion.div 
        className="bg-white w-full h-14 flex items-center justify-between px-4 shadow-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          Zetagram
        </motion.div>
        <div className="flex items-center gap-4">
          <motion.button 
            className="relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-lg">🔔</span>
            <motion.div 
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[8px]"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              3
            </motion.div>
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <span className="text-lg">✉️</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Stories */}
      <motion.div 
        className="flex gap-2 px-2 py-3 bg-white mt-1 overflow-x-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button 
          className="flex flex-col items-center gap-1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-0.5">
            <motion.div 
              className="w-full h-full rounded-full bg-white flex items-center justify-center"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.3 }}
            >
              <motion.span 
                className="text-xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ➕
              </motion.span>
            </motion.div>
          </div>
          <span className="text-xs">Your Story</span>
        </motion.button>

        {Array.from({ length: 5 }).map((_, i) => (
          <motion.button 
            key={i} 
            className="flex flex-col items-center gap-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveStory(i);
              setShowStoryView(true);
            }}
          >
            <motion.div 
              className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] p-0.5"
              animate={{ 
                boxShadow: ["0 0 0 0 rgba(255, 107, 107, 0)", "0 0 0 4px rgba(255, 107, 107, 0.3)", "0 0 0 0 rgba(255, 107, 107, 0)"] 
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            >
              <div className="w-full h-full rounded-full bg-gray-200 overflow-hidden">
                <motion.div 
                  className="w-full h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  {i % 2 === 0 ? "👤" : "🏞️"}
                </motion.div>
              </div>
            </motion.div>
            <span className="text-xs">User {i + 1}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Posts */}
      <div className="mt-1">
        {Array.from({ length: 2 }).map((_, i) => (
          <motion.div 
            key={i} 
            className="bg-white mb-1 pb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center gap-2 p-2">
              <motion.div 
                className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center" 
                whileHover={{ scale: 1.1 }}
              >
                {i % 2 === 0 ? "👤" : "👩"}
              </motion.div>
              <div className="font-medium">User {i + 1}</div>
              <motion.button 
                className="ml-auto text-sm text-gray-500"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                •••
              </motion.button>
            </div>
            <motion.div 
              className="w-full aspect-square bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-5xl"
              whileHover={{ filter: "brightness(1.1)" }}
              whileTap={{ scale: 0.98 }}
            >
              {i === 0 ? "🏞️" : "🎭"}
            </motion.div>
            <div className="flex items-center gap-4 px-4 pt-2">
              <motion.button 
                className="text-xl"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleLike(i)}
              >
                {likedPosts.includes(i) ? (
                  <motion.span
                    initial={{ scale: 1 }}
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.5 }}
                  >
                    ❤️
                  </motion.span>
                ) : "🤍"}
              </motion.button>
              <motion.button 
                className="text-xl"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                💬
              </motion.button>
              <motion.button 
                className="text-xl"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                📤
              </motion.button>
              <motion.button 
                className="text-xl ml-auto"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                🔖
              </motion.button>
            </div>
            <div className="px-4 pt-1 text-sm">
              <motion.span 
                className="font-bold"
                animate={likedPosts.includes(i) ? { color: ["#000", "#FF6B6B", "#000"] } : {}}
                transition={{ duration: 1 }}
              >
                {123 + (likedPosts.includes(i) ? 1 : 0)} likes
              </motion.span>
              <motion.p 
                className="line-clamp-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 + i * 0.2 }}
              >
                <span className="font-bold">User {i + 1}</span> Sharing my amazing moments! #zetagram
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom navigation */}
      <motion.div 
        className="absolute bottom-0 w-full h-14 bg-white flex items-center justify-around px-6 border-t border-gray-100"
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        transition={{ delay: 1, type: "spring" }}
      >
        {["🏠", "🔍", "➕", "❤️", "👤"].map((icon, i) => (
          <motion.button
            key={i}
            className="w-10 h-10 rounded-full flex items-center justify-center"
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.9 }}
            animate={i === 0 ? { 
              boxShadow: ["0 0 0 0 rgba(255,107,107,0)", "0 0 0 3px rgba(255,107,107,0.3)", "0 0 0 0 rgba(255,107,107,0)"] 
            } : {}}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <motion.span 
              className="text-xl"
              animate={i === 2 ? { rotate: [0, 10, 0, -10, 0] } : {}}
              transition={{ duration: 5, repeat: Infinity }}
            >
              {icon}
            </motion.span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
