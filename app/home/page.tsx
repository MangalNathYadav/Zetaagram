"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/app-layout";
import StoryCircle from "@/components/ui/story-circle";
import PostCard from "@/components/ui/post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchFeedPosts, fetchStories } from "@/lib/database";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    }
  }
} as const;

export default function HomePage() {
  const { currentUser, logout, showAuthToast } = useAuth();
  const router = useRouter();
  // Define proper types for stories and posts
  interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  createdAt: number;
  username: string;
  hasNewStory?: boolean;
  }
  
  interface Post {
  id: string;
  userId: string;
  username: string;
  userImage?: string;
  caption?: string;
  timestamp: number;
  text?: string;
  imageUrl?: string;
  createdAt: number;
  likes?: Record<string, boolean>;
  comments?: Record<string, unknown>;
  }
  
  const [stories, setStories] = useState<Story[]>([]);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load stories
        const storiesData = await fetchStories(currentUser.uid);
        setStories(storiesData);
        
        // Load posts
        const postsData = await fetchFeedPosts(currentUser.uid);
        setPosts(postsData);
      } catch (error) {
        console.error("Error loading data:", error);
        showAuthToast("Failed to load feed", "error");
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [currentUser, router, showAuthToast]);

  const handleLogout = async () => {
    try {
      await logout();
      showAuthToast("You have been logged out successfully", "success");
      router.push("/");
    } catch (error) {
      showAuthToast("Failed to logout", "error");
    }
  };

  if (!currentUser) {
    // Show nothing while redirecting
    return null;
  }

  return (
    <AppLayout hideHeader={true}>
      <div className="py-4">
        {/* Stories */}
        <div className="mb-6">
          <div className="flex overflow-x-auto pb-2 hide-scrollbar">
            <div className="flex space-x-4 px-1">
              {stories.map((story) => (
                <StoryCircle
                  key={story.id}
                  username={story.username}
                  imageUrl={story.imageUrl}
                  hasNewStory={story.hasNewStory}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Create post */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white">
              {currentUser.photoURL ? (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <span>{currentUser.displayName?.charAt(0).toUpperCase() || "U"}</span>
              )}
            </div>
            <button 
              onClick={() => router.push('/create')}
              className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-full py-2 px-4 text-left text-sm text-gray-500 dark:text-gray-400"
            >
              Share what&apos;s on your mind...
            </button>
          </div>
        </div>

        {/* Posts */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="ml-3 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
                <Skeleton className="h-80 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="space-y-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts?.map((post) => (
              <motion.div key={post.id} variants={itemVariants}>
                <PostCard post={{
                  ...post,
                  username: post.username || "",
                  userImage: post.userImage || "",
                  caption: post.caption || post.text || "",
                  timestamp: String(post.timestamp || post.createdAt || Date.now()),
                  imageUrl: post.imageUrl || "",
                  likes: post.likes ? Object.keys(post.likes).length : 0,
                  comments: post.comments ? Object.keys(post.comments).length : 0
                }} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* User profile section (visible on desktop) */}
        <div className="hidden md:block fixed top-24 right-8 w-64 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white">
                {currentUser.photoURL ? (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{currentUser.displayName?.charAt(0).toUpperCase() || "U"}</span>
                )}
              </div>
              <div>
                <p className="font-medium">{currentUser.displayName || "User"}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{currentUser.email}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 border-t border-gray-100 dark:border-gray-700 pt-3">
              <div className="text-center">
                <p className="font-bold">0</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold">0</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold">0</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
              </div>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="w-full mt-4"
              size="sm"
            >
              Log out
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
