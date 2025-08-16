"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Dialog,
  DialogContent,
  DialogOverlay
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, User, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { db } from "@/lib/firebase";
import { ref, update, get } from "firebase/database";

interface Post {
  id: string;
  userId: string;
  caption: string;
  imageUrl: string;
  likes: number;
  comments: number;
  timestamp: string;
  username?: string;
  userImage?: string;
}

interface PostModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId?: string;
}

export default function PostModal({ post, isOpen, onClose, currentUserId }: PostModalProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post?.likes || 0);
  const [isLiking, setIsLiking] = useState(false);
  
  // Check if the current user has liked this post, but only if they're logged in
  useEffect(() => {
    // Initialize likes count from post data
    if (post?.likes) {
      setLikeCount(post.likes);
    }
    
    // If user is logged in, check if they've liked this post
    if (post?.id && currentUserId) {
      const checkUserLike = async () => {
        try {
          const likeRef = ref(db, `likes/${post.id}/${currentUserId}`);
          const likeSnapshot = await get(likeRef);
          setLiked(likeSnapshot.exists());
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      };
      
      checkUserLike();
    }
  }, [post?.id, post?.likes, currentUserId]);
  
  // Handle liking a post - simplified to allow anyone to like
  const handleLike = () => {
    // Toggle like state locally without requiring user authentication
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    
    // If user is logged in, we can also update in database
    if (post?.id && currentUserId) {
      try {
        const updates: Record<string, any> = {};
        updates[`likes/${post.id}/${currentUserId}`] = !liked ? true : null;
        updates[`posts/${post.id}/likes`] = liked ? (likeCount - 1) : (likeCount + 1);
        
        update(ref(db), updates).catch(error => {
          console.error("Error updating like in database:", error);
        });
      } catch (error) {
        console.error("Error preparing like update:", error);
      }
    }
  };
  
  // Navigate to user profile
  const navigateToProfile = () => {
    if (!post?.userId) return;
    router.push(`/profile/${post.userId}`);
    onClose();
  };
  
  // Navigate to post detail page
  const navigateToPost = () => {
    if (!post?.id) return;
    router.push(`/post/${post.id}`);
    onClose();
  };
  
  // If no post, don't render
  if (!post) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-black/80" />
      <DialogContent className="sm:max-w-[90vw] md:max-w-[80vw] lg:max-w-[1000px] max-h-[90vh] p-0 border-none bg-white dark:bg-gray-900 overflow-hidden rounded-lg">
        <div className="flex flex-col md:flex-row h-full">
          {/* Image Section */}
          <div className="relative w-full md:w-3/5 h-[300px] md:h-full bg-black">
            <Image 
              src={post.imageUrl} 
              alt={post.caption}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-contain"
              priority
            />
          </div>
          
          {/* Content Section */}
          <div className="w-full md:w-2/5 flex flex-col h-full max-h-[500px] md:max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div 
                className="flex items-center cursor-pointer"
                onClick={navigateToProfile}
              >
                <Avatar className="h-8 w-8 mr-2">
                  {post.userImage ? (
                    <AvatarImage
                      src={post.userImage}
                      alt={post.username || "User"}
                    />
                  ) : (
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
                <span className="font-medium hover:underline">{post.username || "Anonymous"}</span>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full" 
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Caption */}
            <div className="p-4 border-b">
              <p className="text-sm">{post.caption}</p>
              <p className="text-xs text-gray-500 mt-2">
                {post.timestamp && formatDistanceToNow(new Date(post.timestamp), { addSuffix: true })}
              </p>
            </div>
            
            {/* Actions */}
            <div className="flex items-center p-4 border-t mt-auto">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${liked ? 'text-red-500' : ''}`}
                onClick={handleLike}
              >
                <Heart className={`h-6 w-6 ${liked ? 'fill-red-500' : ''}`} />
              </Button>
              
              <div className="ml-auto">
                <span className="font-medium mr-1">{likeCount}</span>
                <span className="text-gray-600">likes</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
