"use client";

import { Skeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <div className="flex flex-col items-center space-y-2 mb-8">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-4 w-60" />
        </div>
        
        <div className="space-y-4 w-full">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full mt-6" />
        </div>
        
        <div className="flex justify-between pt-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    </div>
  );
}
