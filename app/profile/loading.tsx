"use client";
 
import { ProfileSkeleton } from "@/components/ui/skeletons";
import AppLayout from "@/components/layout/app-layout";
 
export default function Loading() {
  return (
    <AppLayout>
      <div className="container max-w-4xl py-8 px-4">
        <ProfileSkeleton />
      </div>
    </AppLayout>
  );
}
