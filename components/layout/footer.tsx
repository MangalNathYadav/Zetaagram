"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";
import { useEffect, useState } from "react";
import { AnimatedSection } from "@/components/layout/animated-section";

const navigation = {
  company: [
    { name: "About", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
  product: [
    { name: "Features", href: "#" },
    { name: "Pricing", href: "#" },
    { name: "Updates", href: "#" },
    { name: "FAQ", href: "#" },
  ],
  resources: [
    { name: "Blog", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Community", href: "#" },
    { name: "Support", href: "#" },
  ],
  social: [
    {
      name: "Twitter",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      ),
      color: "#1DA1F2",
    },
    {
      name: "Instagram",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "#E1306C",
    },
    {
      name: "GitHub",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "#333",
    },
    {
      name: "YouTube",
      href: "#",
      icon: (props: any) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
      color: "#FF0000",
    },
  ],
};

// Animation variants
const containerVariant = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    }
  }
} as const;

const itemVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
} as const;

const footerWaveVariant = {
  start: {
    d: "M0,128L40,122.7C80,117,160,107,240,112C320,117,400,139,480,149.3C560,160,640,160,720,138.7C800,117,880,75,960,74.7C1040,75,1120,117,1200,138.7C1280,160,1360,160,1400,160L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z",
  },
  end: {
    d: "M0,96L40,106.7C80,117,160,139,240,144C320,149,400,139,480,122.7C560,107,640,85,720,90.7C800,96,880,128,960,138.7C1040,149,1120,139,1200,128C1280,117,1360,107,1400,101.3L1440,96L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z",
  },
} as const;

// Newsletter form component
const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const controls = useAnimationControls();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email) {
      controls.start({
        scale: [1, 1.05, 1],
        transition: { duration: 0.5 }
      });
      
      setTimeout(() => {
        setIsSubmitted(true);
      }, 600);
    }
  };
  
  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div 
        className="relative"
        animate={controls}
      >
        {!isSubmitted ? (
          <>
            <h3 className="text-base font-semibold leading-7 text-white mb-4">
              Stay updated with Zetagram
            </h3>
            <form onSubmit={handleSubmit} className="relative">
              <motion.input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-full bg-white/10 border border-white/20 py-2.5 px-5 pr-20 text-white placeholder:text-white/50 focus:ring-2 focus:ring-[#FF6B6B]/50 focus:border-transparent focus:outline-none"
                required
                whileFocus={{ 
                  scale: 1.02,
                  boxShadow: "0 0 0 2px rgba(255,107,107,0.3)"
                }}
              />
              <motion.button 
                type="submit" 
                className="absolute right-1.5 top-1.5 rounded-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] py-1 px-4 text-sm font-semibold text-white hover:from-[#ff8585] hover:to-[#6bddcf]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join
              </motion.button>
            </form>
          </>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/10 rounded-lg p-4 border border-white/20 text-center"
          >
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl mb-2"
            >
              ✅
            </motion.div>
            <h3 className="text-base font-semibold text-white mb-1">Thank you for subscribing!</h3>
            <p className="text-sm text-white/70">We'll keep you updated with the latest news.</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-[#111827] to-[#1f2937] text-white overflow-hidden">
      {/* Decorative wave shape */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg 
          className="relative w-full h-24 text-background"
          viewBox="0 0 1440 320" 
          fill="currentColor" 
          preserveAspectRatio="none"
        >
          <motion.path
            variants={footerWaveVariant}
            initial="start"
            animate="end"
            transition={{ 
              duration: 10, 
              repeat: Infinity, 
              repeatType: "reverse",
              ease: "easeInOut" 
            }}
          />
        </svg>
      </div>

      {/* Animated particles */}
      <motion.div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/10"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8">
        {/* Logo and newsletter section */}
        <div className="pb-12 border-b border-white/10">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            <div className="col-span-1 lg:col-span-2">
              <AnimatedSection animation="slideUp" delay={0.1}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex flex-col space-y-4"
                >
                  <Link href="/" className="flex items-center">
                    <motion.div 
                      className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]"
                      whileHover={{ scale: 1.05 }}
                      animate={{ 
                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                      }}
                      transition={{ 
                        duration: 5, 
                        repeat: Infinity,
                        ease: "easeInOut" 
                      }}
                    >
                      Zetagram
                    </motion.div>
                  </Link>
                  <p className="text-sm text-white/70 max-w-md">
                    Share moments, connect with friends, and discover amazing stories. 
                    Join millions on Zetagram, where every post tells a story.
                  </p>
                </motion.div>
              </AnimatedSection>
            </div>
            <div className="col-span-1 lg:col-span-3">
              <AnimatedSection animation="slideUp" delay={0.3}>
                <NewsletterForm />
              </AnimatedSection>
            </div>
          </div>
        </div>

        {/* Links section */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <AnimatedSection animation="slideUp" delay={0.2}>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold mb-4 text-white/90 relative inline-block">
                Company
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]" 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </h3>
              <motion.ul 
                className="mt-4 space-y-3"
                variants={containerVariant}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {navigation.company.map((item, i) => (
                  <motion.li key={item.name} variants={itemVariant}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={item.href} className="text-sm text-white/70 hover:text-white transition-colors relative group">
                        {item.name}
                        <motion.span 
                          className="absolute -bottom-0.5 left-0 h-0.5 bg-[#FF6B6B]"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                    </motion.div>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection animation="slideUp" delay={0.3}>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold mb-4 text-white/90 relative inline-block">
                Product
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]" 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                />
              </h3>
              <motion.ul 
                className="mt-4 space-y-3"
                variants={containerVariant}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {navigation.product.map((item, i) => (
                  <motion.li key={item.name} variants={itemVariant}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={item.href} className="text-sm text-white/70 hover:text-white transition-colors relative group">
                        {item.name}
                        <motion.span 
                          className="absolute -bottom-0.5 left-0 h-0.5 bg-[#4ECDC4]"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                    </motion.div>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </AnimatedSection>

          <AnimatedSection animation="slideUp" delay={0.4}>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm font-semibold mb-4 text-white/90 relative inline-block">
                Resources
                <motion.span 
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]" 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </h3>
              <motion.ul 
                className="mt-4 space-y-3"
                variants={containerVariant}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
              >
                {navigation.resources.map((item, i) => (
                  <motion.li key={item.name} variants={itemVariant}>
                    <motion.div
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Link href={item.href} className="text-sm text-white/70 hover:text-white transition-colors relative group">
                        {item.name}
                        <motion.span 
                          className="absolute -bottom-0.5 left-0 h-0.5 bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4]"
                          initial={{ width: 0 }}
                          whileHover={{ width: '100%' }}
                          transition={{ duration: 0.3 }}
                        />
                      </Link>
                    </motion.div>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </AnimatedSection>
        </div>

        {/* Social icons section */}
        <AnimatedSection animation="slideUp" delay={0.5}>
          <motion.div 
            className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <motion.p 
              className="text-sm text-white/50 order-2 md:order-1"
              whileHover={{ color: "#FFF" }}
            >
              &copy; 2025 Zetagram, Inc. All rights reserved.
            </motion.p>
            
            <motion.div 
              className="flex space-x-6 order-1 md:order-2"
              variants={containerVariant}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {navigation.social.map((item, i) => (
                <motion.div
                  key={item.name}
                  variants={itemVariant}
                >
                  <motion.div
                    whileHover={{ 
                      scale: 1.2,
                      y: -5,
                      filter: "drop-shadow(0 0 8px " + item.color + "80)" 
                    }}
                    whileTap={{ scale: 0.9 }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      duration: 0.4,
                      delay: 0.2 + i * 0.1 
                    }}
                    className="relative group"
                  >
                    <Link href={item.href} className="text-white/70 hover:text-white">
                      <span className="sr-only">{item.name}</span>
                      <item.icon 
                        className="h-6 w-6" 
                        aria-hidden="true" 
                      />
                      <motion.div
                        className="absolute -inset-2 rounded-full bg-white/5 z-[-1]"
                        initial={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatedSection>
      </div>
    </footer>
  );
}
