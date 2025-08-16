"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import AppLayout from "@/components/layout/app-layout";

export default function ProfileRedirectPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    // If logged in, redirect to their profile page
    if (currentUser) {
      router.push(`/profile/${currentUser.uid}`);
    } else {
      // If not logged in, redirect to login
      router.push('/login');
    }
  }, [currentUser, router]);
  
  // Show loading skeleton while redirecting
  return (
    <AppLayout hideHeader>
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <Skeleton className="w-28 h-28 rounded-full mb-6 md:mb-0 md:mr-8" />
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-7 w-40" />
              <Skeleton className="h-9 w-24" />
            </div>
            <div className="flex space-x-6 mb-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
            <Skeleton className="h-4 w-full max-w-md mb-2" />
            <Skeleton className="h-4 w-48 max-w-md" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
