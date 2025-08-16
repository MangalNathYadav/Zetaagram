"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState, useEffect, ReactNode } from "react";
import { Loader2 } from "lucide-react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
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
    }, 300); // Reduced from 500ms for better UX
    
    return () => clearTimeout(timer);
  }, [pathname, children]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isLoading ? 0 : 1,
          y: isLoading ? 20 : 0
        }}
        transition={{ 
          duration: 0.4, 
          delay: isLoading ? 0 : 0.2 
        }}
      >
        {displayChildren}
      </motion.div>
    </>
  );
}
