"use client";
 
import { FeedSkeleton } from "@/components/ui/skeletons";
import AppLayout from "@/components/layout/app-layout";
 
export default function Loading() {
  return (
    <AppLayout>
      <div className="container max-w-2xl py-4 px-4">
        <FeedSkeleton />
      </div>
    </AppLayout>
  );
}
