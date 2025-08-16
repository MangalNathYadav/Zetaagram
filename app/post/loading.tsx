"use client";

import AppLayout from "@/components/layout/app-layout";
import { PostCardSkeleton } from "@/components/ui/skeletons";

export default function Loading() {
  return (
    <AppLayout>
      <div className="container max-w-2xl py-8 px-4">
        <PostCardSkeleton />
      </div>
    </AppLayout>
  );
}
