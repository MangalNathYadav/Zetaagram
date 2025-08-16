"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import BottomNavigation from "./bottom-navigation";
import { Header } from "./header";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

interface AppLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
  hideNavigation?: boolean;
  className?: string;
  forceHeader?: boolean;
}

const AppLayout = ({ 
  children, 
  hideHeader = false, 
  hideNavigation = false,
  className,
  forceHeader = false
}: AppLayoutProps) => {
  const { currentUser } = useAuth();
  const pathname = usePathname();
  const [shouldShowHeader, setShouldShowHeader] = useState<boolean>(false);
  
  // Pages where header should be hidden for authenticated users
  const noHeaderPagesWhenAuthenticated = [
    '/explore',
    '/create',
    '/chat',
    '/profile'
  ];
  
  useEffect(() => {
    if (forceHeader) {
      setShouldShowHeader(true);
      return;
    }
    
    if (hideHeader) {
      setShouldShowHeader(false);
      return;
    }
    
    // Hide header for authenticated users on specific pages
    if (currentUser && noHeaderPagesWhenAuthenticated.some(route => pathname?.startsWith(route))) {
      setShouldShowHeader(false);
    } else {
      setShouldShowHeader(true);
    }
  }, [currentUser, pathname, hideHeader, forceHeader]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950">
      {shouldShowHeader && <Header />}
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
