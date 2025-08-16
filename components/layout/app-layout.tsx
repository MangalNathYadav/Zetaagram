"use client";

import React from "react";
import BottomNavigation from "./bottom-navigation";
import { Header } from "./header";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideNavigation?: boolean;
  className?: string;
}

const AppLayout = ({ 
  children, 
  hideHeader = false, 
  hideNavigation = false,
  className 
}: AppLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {!hideHeader && <Header />}
      <main className={cn(
        "flex-1 container max-w-4xl mx-auto px-4 pb-16 md:pb-4",
        className
      )}>
        {children}
      </main>
      {!hideNavigation && <BottomNavigation />}
    </div>
  );
};

export default AppLayout;
