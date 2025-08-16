"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  // Update children when pathname changes
  useEffect(() => {
    setIsLoading(true);
    
    // Small delay to ensure animation plays
    const timer = setTimeout(() => {
      setDisplayChildren(children);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <>
      {/* Full screen page transition overlay */}
      <motion.div
        className="fixed inset-0 bg-white z-50 pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ 
          opacity: isLoading ? 1 : 0,
          transition: { duration: 0.5 }
        }}
      >
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: isLoading ? 1 : 0,
            scale: isLoading ? 1 : 0.9,
            transition: { duration: 0.3 }
          }}
        >
          <div className="flex flex-col items-center">
            <div className="h-10 w-10 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-full animate-pulse mb-3"></div>
            <div className="h-1 w-24 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-full">
              <motion.div
                className="h-full w-1/3 bg-white rounded-full"
                animate={{
                  x: ["0%", "200%"],
                  transition: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: 1,
                    ease: "easeInOut" as const
                  }
                }}
              />
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Page content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isLoading ? 0 : 1,
          transition: { duration: 0.3, delay: isLoading ? 0 : 0.2 }
        }}
      >
        {displayChildren}
      </motion.div>
    </>
  );
}
