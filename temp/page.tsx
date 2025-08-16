"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {Settings, Grid, Bookmark, Tag, Edit, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const { currentUser, userData, checkIsFollowing, followUser, unfollowUser, showAuthToast } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;
  
  // Page transition animation variants
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  // Define proper types for profile data and posts
  interface ProfileData {
    uid: string;
    displayName: string;
    username: string;
    email: string;
    bio?: string;
    profileImageUrl?: string;
    photoURL?: string; // Added to fix error
    website?: string;
    location?: string;
    createdAt: number;
  }
  
  interface Post {
    id: string;
    userId: string;
    text?: string;
    imageUrl?: string;
    createdAt: number;
    likes?: Record<string, boolean>;
    comments?: Record<string, unknown>;
  }

  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followLoading, setFollowLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  
  // Check if it's the current user's profile
  const isCurrentUser = !userId || (currentUser && (userId === currentUser.uid || userId === 'me'));
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);
  
  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!currentUser || followLoading || isCurrentUser) return;
    
    try {
      setFollowLoading(true);
      if (!profileData) return;
      const targetUserId = profileData.uid;
      if (isFollowing) {
        await unfollowUser(targetUserId);
        setIsFollowing(false);
        setFollowerCount(prev => prev - 1);
        showAuthToast(`Unfollowed ${profileData.username}`, "success");
      } else {
        await followUser(targetUserId);
        setIsFollowing(true);
        setFollowerCount(prev => prev + 1);
        showAuthToast(`Now following ${profileData.username}`, "success");
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
      showAuthToast("Failed to update follow status", "error");
    } finally {
      setFollowLoading(false);
    }
  };
  
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        
        // Determine the user ID to fetch
        let targetUserId = userId;
        
        // If viewing own profile or 'me' route
        if (isCurrentUser && currentUser) {
          targetUserId = currentUser.uid;
        }
        
        if (!targetUserId) {
          throw new Error("No user ID provided");
        }
        
        // Get user data from Firebase
        const userRef = ref(db, `users/${targetUserId}`);
        const userSnapshot = await get(userRef);
        
        if (!userSnapshot.exists()) {
          throw new Error("User not found");
        }
        
        const userData = userSnapshot.val();
        setProfileData(userData);
        
        // Count followers
        const followersData = userData.followers || {};
        setFollowerCount(Object.keys(followersData).length);
        
        // Count following
        const followingData = userData.following || {};
        setFollowingCount(Object.keys(followingData).length);
        
        // Check if current user is following this profile
        if (currentUser && !isCurrentUser) {
          const followStatus = await checkIsFollowing(targetUserId);
          setIsFollowing(followStatus);
        }
        
        // Get user posts
        const userPosts = [];
        if (userData.posts) {
          for (const postId of Object.keys(userData.posts)) {
            const postRef = ref(db, `posts/${postId}`);
            const postSnapshot = await get(postRef);
            
            if (postSnapshot.exists()) {
              userPosts.push({
                id: postId,
                ...postSnapshot.val()
              });
            }
          }
        }
        
        // Sort posts by timestamp (newest first)
        userPosts.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        setPosts(userPosts);
        setPostsCount(userPosts.length);
      } catch (error) {
        console.error("Error loading profile:", error);
        showAuthToast("Failed to load profile data", "error");
      } finally {
        setLoading(false);
      }
    };
    
    if (currentUser) {
      loadProfileData();
    }
  }, [currentUser, userId, isCurrentUser, checkIsFollowing, showAuthToast]);
  
  if (loading) {
    return (
      <AppLayout hideHeader>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-6 md:pt-8 pb-20 max-w-4xl mx-auto px-4"
        >
          {/* Back button skeleton */}
          <div className="flex items-center justify-between px-4 mb-6">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          
          {/* Modern Profile Card Skeleton */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6 mb-8 animate-pulse">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden">
                  <Skeleton className="w-full h-full absolute rounded-full" />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-600/30 rounded-full animate-pulse" />
                </div>
                
                {/* Mobile Stats Skeleton */}
                <div className="md:hidden mt-4 w-full">
                  <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={i === 2 ? "border-x border-gray-200 dark:border-gray-700 px-6" : ""}>
                        <Skeleton className="h-5 w-10 mx-auto mb-1" />
                        <Skeleton className="h-3 w-14 mx-auto" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Profile Info Skeleton */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <Skeleton className="h-7 w-40 mb-2" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-32 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </div>
                
                {/* Desktop Stats Skeleton */}
                <div className="hidden md:flex gap-8 py-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center space-x-1">
                      <Skeleton className="h-5 w-8" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
                
                <div className="space-y-3 pt-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Tabs skeleton - with animated gradient */}
          <div className="relative rounded-xl mb-8 overflow-hidden">
            <Skeleton className="h-14 w-full rounded-xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" 
                 style={{ backgroundSize: '200% 100%', animation: 'shimmer 2s infinite' }} />
          </div>
          
          {/* Posts grid skeleton with staggered animation */}
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="aspect-square relative"
              >
                <Skeleton className="w-full h-full rounded-lg" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-lg" />
              </motion.div>
            ))}
          </div>
          
          {/* Add a subtle loading message at bottom */}
          <div className="flex justify-center mt-8">
            <div className="flex items-center text-sm text-gray-400 dark:text-gray-500">
              <Loader2 size={14} className="animate-spin mr-2" />
              <span>Loading profile data...</span>
            </div>
          </div>
        </motion.div>
      </AppLayout>
    );
  }
  
  if (!profileData) {
    return (
      <AppLayout hideHeader>
        <div className="flex flex-col items-center justify-center py-20">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The user you are looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => router.push('/explore')}>
            Explore
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout hideHeader>
      <motion.div 
        className="pt-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* Back button - Only show when viewing someone else's profile */}
        {!isCurrentUser && (
          <motion.div 
            className="mb-4 px-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.back()}
              className="flex items-center gap-1"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back
            </Button>
          </motion.div>
        )}
        
        {/* Modern Profile Header */}
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {/* Profile Card */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border p-6 mb-8"
            initial={{ scale: 0.98 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          >
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar Section */}
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg ring-4 ring-purple-100 dark:ring-purple-900/30">
                  {profileData?.photoURL ? (
                    <motion.img 
                      src={profileData.photoURL} 
                      alt={profileData?.username || "Profile"} 
                      className="w-full h-full object-cover"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-5xl font-light">
                      {(profileData?.displayName || profileData?.username || "U").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                {/* Mobile Stats - Only visible on mobile */}
                <div className="md:hidden mt-4 w-full">
                  <div className="flex justify-between bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 text-center">
                    <div>
                      <div className="font-bold text-lg">{postsCount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Posts</div>
                    </div>
                    <div className="border-x border-gray-200 dark:border-gray-700 px-6">
                      <div className="font-bold text-lg">{followerCount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{followingCount}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Following</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold flex items-center">
                      {profileData?.username || ""}
                      {/* Blue checkmark for verified users - you can add logic for verified status */}
                      <svg className="ml-1 w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                      </svg>
                    </h1>
                    {profileData?.displayName && (
                      <p className="text-gray-600 dark:text-gray-300">{profileData.displayName}</p>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    {isCurrentUser ? (
                      <>
                        <Button 
                          variant="default" 
                          onClick={() => router.push('/settings')}
                          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                        >
                          <Edit size={16} className="mr-1.5" />
                          Edit Profile
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="border-gray-200 hover:bg-gray-100" 
                          onClick={() => router.push('/settings')}
                        >
                          <Settings size={16} />
                        </Button>
                      </>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          variant={isFollowing ? "outline" : "default"}
                          disabled={followLoading}
                          onClick={handleFollowToggle}
                          className={isFollowing 
                            ? "border-gray-300 hover:bg-gray-100 font-medium" 
                            : "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                          }
                        >
                          {followLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <>{isFollowing ? "Following" : "Follow"}</>
                          )}
                        </Button>
                        <Button variant="outline" className="border-gray-300">
                          Message
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Desktop Stats - Only visible on desktop */}
                <div className="hidden md:flex gap-8 py-3">
                  <div>
                    <span className="font-bold">{postsCount}</span>
                    <span className="text-gray-500 dark:text-gray-400"> posts</span>
                  </div>
                  <div>
                    <span className="font-bold">{followerCount}</span>
                    <span className="text-gray-500 dark:text-gray-400"> followers</span>
                  </div>
                  <div>
                    <span className="font-bold">{followingCount}</span>
                    <span className="text-gray-500 dark:text-gray-400"> following</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {profileData?.bio && (
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                      {profileData.bio}
                    </p>
                  )}
                  {profileData?.website && (
                    <a 
                      href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
                      target="_blank"
                      rel="noopener noreferrer" 
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                      </svg>
                      {profileData.website.replace(/(^\w+:|^)\/\//, '')}
                    </a>
                  )}
                  {profileData?.location && (
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      {profileData.location}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Content tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Tabs defaultValue="posts" className="max-w-4xl mx-auto" onValueChange={setActiveTab}>
            <TabsList className="w-full flex justify-center border-b mb-6 bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="posts" 
                className="flex-1 items-center py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 bg-transparent hover:bg-gray-50"
              >
                <div className="flex items-center justify-center">
                  <Grid size={18} className="mr-2" /> 
                  <span className="font-medium">Posts</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="saved" 
                className="flex-1 items-center py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 bg-transparent hover:bg-gray-50"
              >
                <div className="flex items-center justify-center">
                  <Bookmark size={18} className="mr-2" /> 
                  <span className="font-medium">Saved</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="tagged" 
                className="flex-1 items-center py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-500 bg-transparent hover:bg-gray-50"
              >
                <div className="flex items-center justify-center">
                  <Tag size={18} className="mr-2" /> 
                  <span className="font-medium">Tagged</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts">
              {posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 md:gap-4">
                  {posts.map((post, index) => (
                    <motion.div 
                      key={post.id} 
                      className="aspect-square relative cursor-pointer rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all"
                      onClick={() => router.push(`/post/${post.id}`)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      {post.imageUrl && post.imageUrl.startsWith('data:') ? (
                        <img 
                          src={post.imageUrl} 
                          alt="Post" 
                          className="w-full h-full object-cover"
                        />
                      ) : post.imageUrl ? (
                        <Image
                          src={post.imageUrl as string}
                          alt="Post"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 33vw, 250px"
                        />
                      ) : null}
                      
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                        <div className="text-white flex items-center space-x-4">
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            <span>{post.likes ? Object.keys(post.likes).length : 0}</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            <span>{post.comments ? Object.keys(post.comments).length : 0}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="flex flex-col items-center justify-center py-16"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                    <Grid size={28} className="text-gray-400" />
                  </div>
                  <h3 className="font-medium text-lg mb-1">No Posts Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                    {isCurrentUser 
                      ? "When you share photos, they will appear here."
                      : `${profileData.username} hasn't shared any posts yet.`}
                  </p>
                  {isCurrentUser && (
                    <Button 
                      onClick={() => router.push('/create')}
                      className="mt-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      Create Post
                    </Button>
                  )}
                </motion.div>
              )}
            </TabsContent>
            
            <TabsContent value="saved">
              <motion.div 
                className="flex flex-col items-center justify-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Bookmark size={28} className="text-gray-400" />
                </div>
                <h3 className="font-medium text-lg mb-1">No Saved Posts</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                  {isCurrentUser 
                    ? "Save posts to find them later."
                    : "This section is only visible to you."}
                </p>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="tagged">
              <motion.div 
                className="flex flex-col items-center justify-center py-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Tag size={28} className="text-gray-400" />
                </div>
                <h3 className="font-medium text-lg mb-1">No Tagged Posts</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                  {isCurrentUser 
                    ? "When people tag you in photos, they'll appear here."
                    : `${profileData.username} hasn't been tagged in any posts.`}
                </p>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
