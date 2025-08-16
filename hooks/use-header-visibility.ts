"use client";

import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";

/**
 * Hook to determine if the header should be shown based on user authentication
 * and the current path
 */
export function useHeaderVisibility() {
  const { currentUser } = useAuth();
  const pathname = usePathname();
  
  // Pages where header should always be shown, regardless of auth state
  const alwaysShowHeaderPaths = [
    "/", // Landing page
    "/login",
    "/signup",
    "/download",
    "/help-center",
    "/community"
  ];
  
  // Pages where header should be hidden for authenticated users
  const hideHeaderForAuthPaths = [
    "/home",
    "/explore",
    "/chat",
    "/profile",
    "/post",
    "/create",
    "/notifications",
    "/search"
  ];
  
  // Check if the current path matches or starts with any of the paths in the array
  const matchesPath = (path: string, pathsArray: string[]) => {
    return pathsArray.some(p => 
      path === p || 
      (p !== "/" && path.startsWith(p + "/"))
    );
  };
  
  // Header should be shown if:
  // 1. The path is in the alwaysShowHeaderPaths list, OR
  // 2. User is not authenticated AND the path is not in hideHeaderForAuthPaths
  const shouldShowHeader = 
    matchesPath(pathname, alwaysShowHeaderPaths) || 
    (!currentUser && !matchesPath(pathname, hideHeaderForAuthPaths));
  
  return shouldShowHeader;
}
