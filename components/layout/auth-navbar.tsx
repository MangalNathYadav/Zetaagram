"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import "@/styles/auth-buttons.css";

interface AuthNavbarProps {
  transparent?: boolean;
}

export function AuthNavbar({ transparent = false }: AuthNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 
    transition-all duration-300 ease-in-out
    ${isScrolled || !transparent 
      ? "bg-white/95 backdrop-blur-sm shadow-md py-3" 
      : "bg-transparent py-5"}
  `;

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Community", href: "/community" },
    { name: "Help Center", href: "/help-center" },
    { name: "Download", href: "/download" },
  ];

  const isActive = (path: string) => pathname === path;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20
      }
    }
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { 
      opacity: 1, 
      height: "auto",
      transition: {
        duration: 0.3,
        when: "beforeChildren" as const,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        when: "afterChildren" as const,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  };

  const mobileItemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (i: number) => ({ 
      x: 0, 
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
        delay: i * 0.05
      }
    }),
    exit: { 
      x: -20, 
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <nav className={navbarClasses}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring" as const,
              stiffness: 400,
              damping: 15
            }}
          >
            <Link href="/">
              <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]">
                Zetagram
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <motion.div 
              className="flex items-center space-x-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={itemVariants}>
                  <Link
                    href={link.href}
                    className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                      isActive(link.href)
                        ? "text-primary"
                        : isScrolled || !transparent
                        ? "text-gray-800"
                        : "text-gray-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div variants={itemVariants}>
                <div className="flex items-center space-x-3">
                  {pathname !== "/login" && (
                    <Link href="/login">
                      <Button variant="outline" size="sm" className="outline-button">
                        Login
                      </Button>
                    </Link>
                  )}
                  {pathname !== "/signup" && (
                    <Link href="/signup">
                      <Button variant="default" size="sm" className="gradient-button">
                        Sign Up
                      </Button>
                    </Link>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={toggleMenu}
              className={`p-2 rounded-md focus:outline-none ${
                isScrolled || !transparent
                  ? "text-gray-800"
                  : "text-gray-700"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isMenuOpen ? "close" : "menu"}
                  initial={{ opacity: 0, rotate: isMenuOpen ? -90 : 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: isMenuOpen ? 90 : -90 }}
                  transition={{ duration: 0.2 }}
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              className="fixed inset-x-0 top-[62px] z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className="mx-4 mt-2 rounded-xl bg-white/95 backdrop-blur-sm shadow-xl overflow-hidden border border-gray-100"
                variants={mobileMenuVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="py-2">
                  {navLinks.map((link, i) => (
                    <motion.div 
                      key={link.name} 
                      variants={mobileItemVariants}
                      custom={i}
                    >
                      <Link
                        href={link.href}
                        className={`block py-3 px-4 text-sm font-medium transition-colors duration-200 hover:bg-gray-50 ${
                          isActive(link.href) 
                            ? "text-primary border-l-4 border-primary pl-3" 
                            : "text-gray-800"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                  
                  <motion.div 
                    className="flex flex-col space-y-2 mt-2 pt-3 border-t border-gray-100 px-4 pb-3"
                    variants={mobileItemVariants}
                    custom={navLinks.length}
                  >
                    {pathname !== "/login" && (
                      <Link href="/login" className="w-full">
                        <Button variant="outline" size="sm" className="justify-center w-full outline-button">
                          Login
                        </Button>
                      </Link>
                    )}
                    {pathname !== "/signup" && (
                      <Link href="/signup" className="w-full">
                        <Button variant="default" size="sm" className="justify-center w-full gradient-button">
                          Sign Up
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
