"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/layout/animated-section";
import { PhoneMockup } from "@/components/ui/phone-mockup";
import { FloatingBubbles } from "@/components/ui/floating-bubbles";

export function HeroSection() {
  return (
    <div className="relative isolate min-h-screen">
      {/* Background gradient */}
      <motion.div
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        aria-hidden="true"
        animate={{ 
          opacity: [0.3, 0.4, 0.3],
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity,
          repeatType: "reverse" 
        }}
      >
        <motion.div
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#FF6B6B] to-[#4ECDC4] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          style={{
            clipPath:
              'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
          }}
          animate={{ rotate: ["30deg", "35deg", "30deg"] }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
        />
      </motion.div>

      <div className="mx-auto max-w-7xl px-6 pt-10 pb-24 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl lg:pt-8">
          <AnimatedSection animation="slideUp" delay={0.1}>
            <div className="mt-24 sm:mt-32 lg:mt-16">
              <a href="#" className="inline-flex space-x-6">
                <motion.span 
                  className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold leading-6 text-primary ring-1 ring-inset ring-primary/10"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join Now
                </motion.span>
                <motion.span 
                  className="inline-flex items-center space-x-2 text-sm font-medium leading-6 text-gray-600"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <span>Connect with friends</span>
                  <motion.span 
                    aria-hidden="true"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >→</motion.span>
                </motion.span>
              </a>
            </div>
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp" delay={0.3}>
            <motion.h1 
              className="mt-10 text-4xl font-bold tracking-tight sm:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Zetagram
            </motion.h1>
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp" delay={0.5}>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Share moments, connect with friends, and discover amazing stories. Join millions of users on Zetagram, where every post tells a story and every connection matters.
            </p>
          </AnimatedSection>
          
          <AnimatedSection animation="slideUp" delay={0.7}>
            <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-x-6">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] text-white" asChild>
                  <Link href="/signup">
                    Create Account
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto" asChild>
                  <Link href="/login">
                    Sign In <motion.span 
                      aria-hidden="true"
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >→</motion.span>
                  </Link>
                </Button>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
        
        <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
          <AnimatedSection animation="scale" delay={0.9} className="relative max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
            <motion.div 
              className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] rounded-full filter blur-3xl opacity-30"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.4, 0.3]
              }}
              transition={{ 
                duration: 5, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            ></motion.div>
            
            <motion.div 
              className="absolute -bottom-10 -right-10 w-64 h-64 bg-gradient-to-r from-[#4ECDC4] to-purple-500 rounded-full filter blur-3xl opacity-20"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            ></motion.div>

            <div className="relative flex items-center justify-center">
              {/* Add floating dots decoration */}
              <motion.div
                className="absolute -z-10 top-1/4 -left-16 grid grid-cols-3 gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 0.8 }}
              >
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-400"
                    animate={{
                      opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: i * 0.1,
                    }}
                  />
                ))}
              </motion.div>

              {/* Add floating geometric shapes */}
              <motion.div
                className="absolute -z-10 top-0 -right-10"
                initial={{ opacity: 0, rotate: -20 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 1.6, duration: 1 }}
              >
                <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                  <motion.path
                    d="M0 20L30 0L60 20L30 40L0 20Z"
                    fill="rgba(255, 107, 107, 0.2)"
                    stroke="rgba(255, 107, 107, 0.5)"
                    strokeWidth="1"
                    animate={{
                      rotate: [0, 10, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                </svg>
              </motion.div>

              <motion.div
                className="absolute -z-10 bottom-10 -left-12"
                initial={{ opacity: 0, rotate: 20 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 1.7, duration: 1 }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <motion.circle
                    cx="20"
                    cy="20"
                    r="15"
                    fill="rgba(78, 205, 196, 0.2)"
                    stroke="rgba(78, 205, 196, 0.5)"
                    strokeWidth="1"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  />
                </svg>
              </motion.div>

              {/* Phone Mockup Component with Enhanced Animations */}
              <motion.div
                className="relative z-10"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.1 }}
              >
                <div className="relative">
                  {/* Import our custom phone mockup component */}
                  <PhoneMockup screen="app-screen" className="relative z-20" />
                  
                  {/* Add floating bubbles around the phone */}
                  <div className="absolute inset-0 -z-10">
                    <FloatingBubbles />
                  </div>
                  
                  {/* Add animated particles */}
                  <motion.div
                    className="absolute -z-10 top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.8, duration: 0.8 }}
                  >
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]"
                        style={{
                          left: `${Math.random() * 100}%`,
                          top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                          scale: [0, 1, 0],
                          opacity: [0, 0.7, 0],
                          x: [0, (Math.random() - 0.5) * 100],
                          y: [0, (Math.random() - 0.5) * 100],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 5,
                          repeat: Infinity,
                          repeatType: "loop",
                          delay: i * 0.3,
                        }}
                      />
                    ))}
                  </motion.div>
                  
                  {/* Add connecting lines effect */}
                  <svg className="absolute -z-10 top-1/2 left-1/2 w-[500px] h-[500px] -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                    <motion.circle
                      cx="250"
                      cy="250"
                      r="200"
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="0.5"
                      strokeDasharray="5,5"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        rotate: 360
                      }}
                      transition={{ 
                        opacity: { delay: 2, duration: 1 },
                        rotate: { duration: 120, repeat: Infinity, ease: "linear" }
                      }}
                    />
                    <motion.circle
                      cx="250"
                      cy="250"
                      r="150"
                      fill="none"
                      stroke="url(#lineGradient)"
                      strokeWidth="0.5"
                      strokeDasharray="3,3"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: 1,
                        rotate: -360
                      }}
                      transition={{ 
                        opacity: { delay: 2.2, duration: 1 },
                        rotate: { duration: 100, repeat: Infinity, ease: "linear" }
                      }}
                    />
                    <defs>
                      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF6B6B" />
                        <stop offset="100%" stopColor="#4ECDC4" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  );
}
