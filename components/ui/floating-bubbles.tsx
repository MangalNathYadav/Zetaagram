"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface BubbleProps {
  size: number;
  color: string;
  delay: number;
  duration: number;
  x: number;
  y: number;
  children?: ReactNode;
}

function Bubble({ size, color, delay, duration, x, y, children }: BubbleProps) {
  return (
    <motion.div
      className="absolute rounded-full flex items-center justify-center"
      style={{ 
        width: size, 
        height: size, 
        background: color,
        boxShadow: `0 8px 32px -15px ${color}`
      }}
      initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0.8, 0],
        x: [0, x/2, x],
        y: [0, y/3, y],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
}

export function FloatingBubbles() {
  const bubbles = [
    { size: 50, color: "rgba(255, 107, 107, 0.7)", delay: 0, duration: 15, x: -80, y: -120, icon: "❤️" },
    { size: 40, color: "rgba(78, 205, 196, 0.7)", delay: 2, duration: 18, x: 90, y: -150, icon: "💬" },
    { size: 30, color: "rgba(251, 191, 36, 0.7)", delay: 1, duration: 12, x: -100, y: 100, icon: "📷" },
    { size: 25, color: "rgba(167, 139, 250, 0.7)", delay: 3, duration: 20, x: 70, y: 130, icon: "👍" },
    { size: 45, color: "rgba(96, 165, 250, 0.7)", delay: 4, duration: 16, x: -60, y: -80, icon: "🔔" },
    { size: 35, color: "rgba(248, 113, 113, 0.7)", delay: 2.5, duration: 14, x: 110, y: -50, icon: "🎵" },
    { size: 28, color: "rgba(52, 211, 153, 0.7)", delay: 5, duration: 17, x: -120, y: 60, icon: "🔎" },
    { size: 22, color: "rgba(251, 146, 60, 0.7)", delay: 3.5, duration: 13, x: 85, y: 90, icon: "⭐" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble, index) => (
        <Bubble 
          key={index}
          size={bubble.size}
          color={bubble.color}
          delay={bubble.delay}
          duration={bubble.duration}
          x={bubble.x}
          y={bubble.y}
        >
          <span className="text-base">{bubble.icon}</span>
        </Bubble>
      ))}
    </div>
  );
}
