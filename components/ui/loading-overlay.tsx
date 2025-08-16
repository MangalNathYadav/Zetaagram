"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "@/contexts/loading-context";
import { LoadingSpinner } from "./loading-animations";

export function LoadingOverlay() {
  const { isLoading } = useLoading();

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto flex flex-col items-center"
          >
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default LoadingOverlay;
