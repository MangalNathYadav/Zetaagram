"use client";

import { LoadingProvider } from "@/contexts/loading-context";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";
import LoadingOverlay from "@/components/ui/loading-overlay";
import { motion } from "framer-motion";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <LoadingProvider>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
        <div className="hide-scrollbar">
          {/* This class helps hide scrollbar on story list */}
        </div>
        <div id="portal-root" />
        <LoadingOverlay />
        <Toaster />
      </LoadingProvider>
    </AuthProvider>
  );
}
