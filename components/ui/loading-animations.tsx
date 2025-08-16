"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type LoadingSpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
  center?: boolean;
  text?: string;
};

export const LoadingSpinner = ({ 
  size = "md", 
  className, 
  center = false, 
  text 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className={cn(
      "flex items-center gap-2", 
      center && "justify-center w-full", 
      className
    )}>
      <Loader2 
        className={cn("animate-spin text-primary", sizeClasses[size])} 
      />
      {text && <span className="text-sm text-muted-foreground">{text}</span>}
    </div>
  );
};

type PageTransitionProps = {
  children: React.ReactNode;
  className?: string;
};

export const PageTransition = ({ children, className }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="rounded-md border p-4 w-full">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 rounded-full bg-gray-200 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-[200px] bg-gray-200 animate-pulse rounded" />
          <div className="h-4 w-[150px] bg-gray-200 animate-pulse rounded" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-4 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 bg-gray-200 animate-pulse rounded" />
        <div className="h-4 w-[75%] bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="mt-4 h-[200px] bg-gray-200 animate-pulse rounded" />
      <div className="mt-4 flex justify-between">
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
        <div className="h-8 w-16 bg-gray-200 animate-pulse rounded" />
      </div>
    </div>
  );
};

export const FadeIn = ({ children, className }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

type ButtonLoadingProps = {
  loading: boolean;
  children: React.ReactNode;
};

export const ButtonLoading = ({ loading, children }: ButtonLoadingProps) => {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex items-center justify-center"
        >
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const StaggeredFadeIn = ({ 
  children, 
  className 
}: {
  children: React.ReactNode[];
  className?: string;
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, i) => (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: i * 0.1,
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
};
