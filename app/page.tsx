"use client";

import { HeroSection } from "@/components/sections/hero";
import { FeaturesSection } from "@/components/sections/features";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnimatedSection } from "@/components/layout/animated-section";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { ToastDemo } from "@/components/toast-demo";

export default function Home() {
  // Smooth scroll behavior for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        
        const id = anchor.getAttribute('href')?.substring(1);
        const element = document.getElementById(id as string);
        
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80, // Adjust for header height
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <motion.div 
      className="bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header />
      <motion.main>
        <HeroSection />
        <FeaturesSection />
        <ToastDemo />
      </motion.main>
      <Footer />
      
      {/* Scroll to top button */}
      <AnimatedSection animation="fadeIn" delay={1}>
        <motion.button
          className="fixed bottom-8 right-8 p-3 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white shadow-lg z-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </motion.button>
      </AnimatedSection>
    </motion.div>
  );
}
