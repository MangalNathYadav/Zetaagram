"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toggleLikePost } from "@/lib/database";
import { createNotification } from "@/lib/notifications";
import { useAuth } from "@/contexts/auth-context";

interface Post {
  id: string;
  userId: string;
  username: string;
  userImage: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp: string;
  likedBy?: Record<string, boolean>;
}

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { currentUser } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [showFullCaption, setShowFullCaption] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if post is liked by current user
  useEffect(() => {
    if (currentUser && post.likedBy) {
      setLiked(!!post.likedBy[currentUser.uid]);
    }
  }, [currentUser, post.likedBy]);

  const handleLike = async () => {
    if (!currentUser || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      // Optimistic update
      const newLikedState = !liked;
      setLiked(newLikedState);
      setLikesCount(prevCount => newLikedState ? prevCount + 1 : prevCount - 1);
      
      // Update Firebase
      const updatedLikesCount = await toggleLikePost(post.id, currentUser.uid, liked);
      setLikesCount(updatedLikesCount);
      
      // Send notification if liking (not when unliking)
      if (newLikedState && currentUser.uid !== post.userId) {
        await createNotification(
          post.userId,
          'like',
          currentUser.uid,
          post.id
        );
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert on error
      setLiked(liked);
      setLikesCount(post.likes);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const captionLength = 125;
  const shouldTruncate = post.caption.length > captionLength && !showFullCaption;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm"
    >
      {/* Post header */}
      <div className="p-4 flex items-center justify-between">
        <Link href={`/profile/${post.username}`} className="flex items-center group">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={post.userImage} alt={post.username} />
            <AvatarFallback>{post.username[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-medium group-hover:underline">{post.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
            </p>
          </div>
        </Link>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Post image */}
      <div className="relative aspect-square">
        {post.imageUrl.startsWith('data:') ? (
          // For base64 images
          <img
            src={post.imageUrl}
            alt={`Post by ${post.username}`}
            className="w-full h-full object-cover"
          />
        ) : (
          // For URL images
          <Image
            src={post.imageUrl}
            alt={`Post by ${post.username}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
            priority
          />
        )}
      </div>

      {/* Post actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex space-x-4">
            <Button 
              onClick={handleLike} 
              variant="ghost" 
              size="icon" 
              className="h-9 w-9 rounded-full"
            >
              <Heart 
                className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`} 
                strokeWidth={liked ? 0 : 2}
              />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <MessageCircle className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <Share2 className="h-6 w-6" />
            </Button>
          </div>
          <Button 
            onClick={handleSave}
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-full"
          >
            <Bookmark 
              className={`h-6 w-6 ${saved ? "fill-current" : ""}`} 
              strokeWidth={saved ? 0 : 2}
            />
          </Button>
        </div>

        {/* Likes count */}
        <p className="font-medium">{likesCount.toLocaleString()} likes</p>

        {/* Caption */}
        <div className="mt-1">
          <span className="font-medium mr-2">{post.username}</span>
          {shouldTruncate ? (
            <>
              {post.caption.slice(0, captionLength)}...{" "}
              <button 
                onClick={() => setShowFullCaption(true)} 
                className="text-gray-500 dark:text-gray-400"
              >
                more
              </button>
            </>
          ) : (
            post.caption
          )}
        </div>

        {/* View comments link */}
        {post.comments > 0 && (
          <Link 
            href={`/post/${post.id}`}
            className="block mt-2 text-sm text-gray-500 dark:text-gray-400"
          >
            View all {post.comments} comments
          </Link>
        )}

        {/* Add comment form placeholder */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
            <Button variant="ghost" size="sm" className="text-primary font-medium">
              Post
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PostCard;
