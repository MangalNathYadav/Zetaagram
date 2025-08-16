"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/layout/animated-section";

const features = [
  {
    name: 'Share Your Story',
    description: 'Share photos, videos, and moments that matter with your followers. Create stunning stories that disappear in 24 hours.',
    icon: '📸',
  },
  {
    name: 'Connect & Chat',
    description: 'Connect with friends, family, and like-minded people. Send direct messages and stay in touch with real-time chat.',
    icon: '💬',
  },
  {
    name: 'Discover Content',
    description: 'Explore trending posts, follow hashtags, and discover content from creators around the world.',
    icon: '🔍',
  },
  {
    name: 'Privacy First',
    description: 'Control who sees your content with advanced privacy settings. Your data security is our top priority.',
    icon: '🔒',
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    }
  }
} as const;

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { 
    y: 0, 
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 80,
    }
  }
} as const;

export function FeaturesSection() {
  return (
    <div className="py-24 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Background elements */}
        <div className="absolute left-0 right-0 -z-10 overflow-hidden">
          <motion.div
            className="absolute -z-10 top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-[#FF6B6B]/20 to-[#4ECDC4]/20 rounded-full filter blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
              x: [0, -20, 0]
            }}
            transition={{ 
              duration: 10, 
              repeat: Infinity,
              repeatType: "reverse" 
            }}
          />
          <motion.div
            className="absolute -z-10 bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-purple-500/20 to-[#4ECDC4]/20 rounded-full filter blur-3xl"
            animate={{ 
              scale: [1, 1.3, 1],
              opacity: [0.15, 0.25, 0.15],
              x: [0, 30, 0]
            }}
            transition={{ 
              duration: 15, 
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          />
        </div>

        <AnimatedSection animation="slideUp" className="mx-auto max-w-3xl text-center relative">
          {/* Decorative elements */}
          <motion.div 
            className="absolute -top-10 -left-10 text-5xl opacity-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            ⭐
          </motion.div>
          <motion.div 
            className="absolute -bottom-16 -right-10 text-5xl opacity-20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.2 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            🌟
          </motion.div>
          
          <motion.div
            className="inline-block mb-6 py-1.5 px-4 bg-gradient-to-r from-[#FF6B6B]/10 to-[#4ECDC4]/10 rounded-full"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-base font-semibold leading-7 bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Features
            </motion.h2>
          </motion.div>
          
          <motion.p 
            className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Connect, Share, Discover
          </motion.p>
          <motion.p 
            className="mt-6 text-lg leading-8 text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Experience social networking reimagined. Zetagram brings you powerful features to share your life, 
            connect with others, and discover amazing content.
          </motion.p>
        </AnimatedSection>

        <div className="relative mt-16 sm:mt-20 lg:mt-24">
          {/* Decorative line connecting features */}
          <motion.div 
            className="absolute left-1/2 top-8 bottom-8 w-0.5 bg-gradient-to-b from-[#FF6B6B]/30 via-[#4ECDC4]/30 to-transparent -z-10 hidden lg:block"
            initial={{ height: 0 }}
            whileInView={{ height: "80%" }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          />

          {/* Features grid with enhanced style */}
          <motion.div 
            className="mx-auto max-w-5xl"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
          >
            <div className="grid grid-cols-1 gap-y-12 gap-x-8 lg:grid-cols-2">
              {features.map((feature, index) => (
                <motion.div 
                  key={feature.name} 
                  variants={item} 
                  custom={index}
                  className={`relative ${index % 2 === 0 ? 'lg:pr-8' : 'lg:pl-8'}`}
                >
                  {/* Decorative connector for desktop */}
                  {index < features.length - 1 && (
                    <motion.div 
                      className={`absolute hidden lg:block ${
                        index % 2 === 0 ? 'top-1/2 -right-4 w-8 h-0.5' : 'top-1/2 -left-4 w-8 h-0.5'
                      } bg-gradient-to-r from-transparent ${
                        index % 2 === 0 ? 'to-[#FF6B6B]/30' : 'from-[#4ECDC4]/30'
                      }`}
                      initial={{ width: 0 }}
                      whileInView={{ width: 32 }}
                      transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                      viewport={{ once: true }}
                    />
                  )}

                  <motion.div
                    whileHover={{ 
                      y: -10,
                      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                      transition: { type: "spring", stiffness: 300 }
                    }}
                    className="relative h-full"
                  >
                    <div className="overflow-hidden rounded-2xl h-full bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300">
                      {/* Gradient overlay on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/5 to-[#4ECDC4]/5 opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Feature icon with animated background */}
                      <div className="px-6 py-8">
                        <motion.div 
                          className="inline-flex mb-6 relative"
                          whileHover={{ scale: 1.05 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF6B6B]/20 to-[#4ECDC4]/20 blur-md"
                            animate={{ 
                              scale: [1, 1.2, 1],
                              opacity: [0.7, 1, 0.7],
                            }}
                            transition={{ 
                              duration: 3, 
                              repeat: Infinity,
                              repeatType: "reverse",
                              delay: index * 0.2
                            }}
                          />
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B6B] to-[#4ECDC4] flex items-center justify-center relative">
                            <motion.span 
                              className="text-3xl text-white"
                              whileHover={{ 
                                scale: 1.2,
                                rotate: [0, 10, 0],
                              }}
                              transition={{ duration: 0.5 }}
                            >
                              {feature.icon}
                            </motion.span>
                          </div>
                        </motion.div>

                        <motion.h3 
                          className="mt-4 text-xl font-bold text-gray-900"
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          {feature.name}
                        </motion.h3>
                        
                        <motion.p 
                          className="mt-3 text-base text-gray-600"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                          viewport={{ once: true }}
                        >
                          {feature.description}
                        </motion.p>
                        
                        {/* Learn more link */}
                        <motion.div 
                          className="mt-5 flex items-center text-sm font-medium text-primary"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                          viewport={{ once: true }}
                          whileHover={{ x: 5 }}
                        >
                          Learn more
                          <motion.span 
                            className="ml-1"
                            animate={{ x: [0, 4, 0] }}
                            transition={{ 
                              duration: 1.5, 
                              repeat: Infinity,
                              repeatType: "loop"
                            }}
                          >
                            →
                          </motion.span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
