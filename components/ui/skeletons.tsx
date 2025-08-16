"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-slate-200 dark:bg-slate-800",
        className
      )}
    />
  );
}

// Post Skeleton
export function PostCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="ml-3 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>

      {/* Image */}
      <Skeleton className="w-full aspect-square" />

      {/* Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
        
        {/* Caption */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="space-y-4 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-9 w-28" />
          </div>
          <div className="flex gap-4 justify-center sm:justify-start">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-4 w-44" />
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1">
        {Array(9).fill(null).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}

// Story Skeleton
export function StorySkeleton() {
  return (
    <div className="flex space-x-4 pb-4 overflow-x-auto hide-scrollbar">
      {Array(6).fill(null).map((_, i) => (
        <div key={i} className="flex flex-col items-center space-y-1">
          <div className="rounded-full p-1 bg-gradient-to-tr from-yellow-400 to-pink-600">
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-14" />
        </div>
      ))}
    </div>
  );
}

// Feed Skeleton
export function FeedSkeleton() {
  return (
    <div className="space-y-6">
      <StorySkeleton />
      {Array(3).fill(null).map((_, i) => (
        <PostCardSkeleton key={i} />
      ))}
    </div>
  );
}
