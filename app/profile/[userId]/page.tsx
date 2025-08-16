"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {Settings, Grid, Bookmark, Tag, Edit } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { db } from "@/lib/firebase";

export default function ProfilePage() {
  const { currentUser, userData, checkIsFollowing, followUser, unfollowUser, showAuthToast } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;
  
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
        <div className="pt-8">
          {/* Profile header skeleton */}
          <div className="flex flex-col items-center md:flex-row md:items-start">
            <Skeleton className="w-28 h-28 rounded-full mb-6 md:mb-0 md:mr-8" />
            <div className="flex flex-col w-full">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-9 w-24" />
              </div>
              <div className="flex space-x-6 mb-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-20" />
              </div>
              <Skeleton className="h-4 w-full max-w-md mb-2" />
              <Skeleton className="h-4 w-48 max-w-md" />
            </div>
          </div>
          
          {/* Tabs skeleton */}
          <Skeleton className="h-10 w-full mt-8 mb-4" />
          
          {/* Posts grid skeleton */}
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 9 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full" />
            ))}
          </div>
        </div>
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
      <div className="pt-8">
        {/* Profile header */}
        <div className="flex flex-col items-center md:flex-row md:items-start">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white mb-6 md:mb-0 md:mr-8">
            {profileData?.photoURL ? (
              <img 
                src={profileData.photoURL} 
                alt={profileData?.username || "Profile"} 
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl">{(profileData?.displayName || profileData?.username || "U").charAt(0).toUpperCase()}</span>
            )}
          </div>
          
          <div className="flex flex-col w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
              <h1 className="text-xl font-bold mb-2 md:mb-0">{profileData?.username || ""}</h1>
              <div className="flex space-x-2">
                {isCurrentUser ? (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => router.push('/settings')}
                      className="flex items-center"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-9 w-9" 
                      onClick={() => router.push('/settings')}
                    >
                      <Settings size={16} />
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    size="sm"
                    disabled={followLoading}
                    onClick={handleFollowToggle}
                    className={isFollowing ? "border-gray-200" : "bg-blue-500"}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
            </div>
            <div className="flex space-x-6 mb-4">
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
            <div>
              {profileData?.displayName && (
                <p className="font-medium">{profileData.displayName}</p>
              )}
              {profileData?.bio && (
                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {profileData.bio}
                </p>
              )}
              {profileData?.website && (
                <a 
                  href={profileData.website.startsWith('http') ? profileData.website : `https://${profileData.website}`}
                  target="_blank"
                  rel="noopener noreferrer" 
                  className="text-sm text-blue-500 hover:underline"
                >
                  {profileData.website}
                </a>
              )}
            </div>
          </div>
        </div>
        
        {/* Content tabs */}
        <Tabs defaultValue="posts" className="mt-8" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="posts" className="flex items-center">
              <Grid size={16} className="mr-2" /> Posts
            </TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center">
              <Bookmark size={16} className="mr-2" /> Saved
            </TabsTrigger>
            <TabsTrigger value="tagged" className="flex items-center">
              <Tag size={16} className="mr-2" /> Tagged
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts">
            {posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className="aspect-square relative cursor-pointer"
                    onClick={() => router.push(`/post/${post.id}`)}
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                  <Grid size={28} className="text-gray-400" />
                </div>
                <h3 className="font-medium text-lg mb-1">No Posts Yet</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                  {isCurrentUser 
                    ? "When you share photos, they will appear here."
                    : `${profileData.username} hasn&apos;t shared any posts yet.`}
                </p>
                {isCurrentUser && (
                  <Button 
                    onClick={() => router.push('/create')}
                    className="mt-6"
                  >
                    Create Post
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="saved">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Bookmark size={28} className="text-gray-400" />
              </div>
              <h3 className="font-medium text-lg mb-1">No Saved Posts</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                {isCurrentUser 
                  ? "Save posts to find them later."
                  : "This section is only visible to you."}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="tagged">
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                <Tag size={28} className="text-gray-400" />
              </div>
              <h3 className="font-medium text-lg mb-1">No Tagged Posts</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
                {isCurrentUser 
                  ? "When people tag you in photos, they'll appear here."
                  : `${profileData.username} hasn't been tagged in any posts.`}
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
