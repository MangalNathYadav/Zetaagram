import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface StoryCircleProps {
  username: string;
  imageUrl: string;
  hasNewStory?: boolean;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

const StoryCircle = ({
  username,
  imageUrl,
  hasNewStory = false,
  size = "md",
  onClick,
}: StoryCircleProps) => {
  const sizeMap = {
    sm: { outer: 56, inner: 52, text: "text-xs" },
    md: { outer: 64, inner: 60, text: "text-xs" },
    lg: { outer: 80, inner: 76, text: "text-sm" },
  };

  const { outer, inner, text } = sizeMap[size];

  return (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center space-y-1"
    >
      <div className={cn(
        "rounded-full flex items-center justify-center",
        hasNewStory ? "bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 p-[2px]" : "p-[2px]"
      )}>
        <div className="bg-white dark:bg-gray-900 rounded-full p-[2px]">
          <div className="relative rounded-full overflow-hidden" style={{ width: inner, height: inner }}>
            <Image 
              src={imageUrl} 
              alt={username}
              width={inner}
              height={inner}
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <span className={cn("truncate max-w-[70px]", text)}>
        {username}
      </span>
    </button>
  );
};

export default StoryCircle;
