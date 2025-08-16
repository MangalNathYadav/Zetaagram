"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Home, 
  Search, 
  PlusSquare, 
  MessageSquare, 
  User
} from "lucide-react";

const navItems = [
  { path: "/home", icon: Home, label: "Home" },
  { path: "/explore", icon: Search, label: "Explore" },
  { path: "/create", icon: PlusSquare, label: "New Post" },
  { path: "/chat", icon: MessageSquare, label: "Chat" },
  { path: "/profile", icon: User, label: "Profile" },
] as const;

const BottomNavigation = () => {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white dark:bg-gray-950 dark:border-gray-800 md:hidden z-50">
      <nav className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const IconComponent = item.icon;
          
          return (
            <Link href={item.path} key={item.path} className="relative group">
              <div className="flex flex-col items-center">
                <div className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -inset-1 rounded-full bg-primary/10"
                      transition={{ type: "spring", duration: 0.5 }}
                    />
                  )}
                  <IconComponent 
                    size={20} 
                    className={`relative ${isActive ? "text-primary" : "text-gray-500"}`}
                  />
                </div>
                <span className={`text-xs mt-1 ${isActive ? "text-primary font-medium" : "text-gray-500"}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default BottomNavigation;
