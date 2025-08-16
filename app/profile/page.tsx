"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, Grid, Bookmark, Tag } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";

// In a real implementation, these would come from Firebase
const DUMMY_USER = {
  id: "user1",
  username: "johndoe",
  displayName: "John Doe",
  photoURL: "/avatars/avatar-1.png",
  bio: "Photography enthusiast | Travel lover | Coffee addict",
  website: "www.example.com",
  followers: 1342,
  following: 567,
  posts: 86,
};

const DUMMY_POSTS = Array.from({ length: 12 }).map((_, i) => ({
  id: `post-${i}`,
  imageUrl: `https://picsum.photos/seed/${i + 200}/500/500`,
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 50),
}));

export default function ProfilePage() {
  const { currentUser } = useAuth();
  const params = useParams();
  const username = params.username;
  
  const [user, setUser] = useState<typeof DUMMY_USER | null>(null);
  const [posts, setPosts] = useState<typeof DUMMY_POSTS>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts");
  const [following, setFollowing] = useState(false);
  
  // Check if it's the current user's profile
  const isCurrentUser = !username || (currentUser && username === currentUser.uid);
  
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setUser(DUMMY_USER);
      setPosts(DUMMY_POSTS);
      setLoading(false);
    }, 1500);
  }, [username]);
  
  const handleFollow = () => {
    setFollowing(!following);
    // In a real app, this would call Firebase to follow/unfollow the user
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-6">
        {/* Profile Header */}
        {loading ? (
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 mb-8">
            <Skeleton className="h-24 w-24 md:h-32 md:w-32 rounded-full" />
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="space-y-2">
                <Skeleton className="h-6 w-40 mx-auto md:mx-0" />
                <Skeleton className="h-4 w-60 mx-auto md:mx-0" />
              </div>
              <div className="flex justify-center md:justify-start space-x-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </div>
        ) : user ? (
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-8 mb-8">
            <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden">
              <Image 
                src={user.photoURL} 
                alt={user.displayName} 
                fill
                className="object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div>
                <div className="flex items-center justify-center md:justify-start flex-wrap gap-2 md:gap-4">
                  <h1 className="text-xl font-semibold">{user.username}</h1>
                  
                  {isCurrentUser ? (
                    <Button variant="outline" size="sm" className="ml-auto md:ml-0">
                      <Settings className="h-4 w-4 mr-2" /> Edit Profile
                    </Button>
                  ) : (
                    <Button 
                      onClick={handleFollow}
                      variant={following ? "outline" : "default"}
                      size="sm"
                    >
                      {following ? "Following" : "Follow"}
                    </Button>
                  )}
                </div>
                
                <div className="flex justify-center md:justify-start space-x-6 my-4">
                  <div>
                    <span className="font-semibold">{user.posts}</span>{" "}
                    <span className="text-gray-500">posts</span>
                  </div>
                  <div>
                    <span className="font-semibold">{user.followers.toLocaleString()}</span>{" "}
                    <span className="text-gray-500">followers</span>
                  </div>
                  <div>
                    <span className="font-semibold">{user.following.toLocaleString()}</span>{" "}
                    <span className="text-gray-500">following</span>
                  </div>
                </div>
              </div>
              
              <div className="text-left">
                <p className="font-semibold">{user.displayName}</p>
                <p className="whitespace-pre-wrap">{user.bio}</p>
                {user.website && (
                  <a 
                    href={`https://${user.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {user.website}
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p>User not found</p>
          </div>
        )}

        {/* Profile Content Tabs */}
        {!loading && user && (
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="grid grid-cols-3 md:grid-cols-4">
              <TabsTrigger value="posts" className="flex items-center">
                <Grid className="h-4 w-4 mr-2" /> Posts
              </TabsTrigger>
              {isCurrentUser && (
                <TabsTrigger value="saved" className="flex items-center">
                  <Bookmark className="h-4 w-4 mr-2" /> Saved
                </TabsTrigger>
              )}
              <TabsTrigger value="tagged" className="flex items-center">
                <Tag className="h-4 w-4 mr-2" /> Tagged
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="posts" className="mt-6">
              {posts.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {posts.map((post) => (
                    <div key={post.id} className="aspect-square relative">
                      <Image
                        src={post.imageUrl}
                        alt="Post"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 33vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                        <div className="opacity-0 hover:opacity-100 flex items-center space-x-3 text-white">
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="white" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                            {post.likes}
                          </div>
                          <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            {post.comments}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="inline-flex justify-center items-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <Grid className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Posts Yet</h3>
                  {isCurrentUser ? (
                    <p className="text-gray-500 max-w-md mx-auto">
                      When you share photos, they will appear on your profile.
                    </p>
                  ) : (
                    <p className="text-gray-500 max-w-md mx-auto">
                      This user hasn't posted any photos yet.
                    </p>
                  )}
                </div>
              )}
            </TabsContent>
            
            {isCurrentUser && (
              <TabsContent value="saved" className="mt-6">
                <div className="text-center py-12">
                  <div className="inline-flex justify-center items-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                    <Bookmark className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Saved Posts</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Save photos and videos that you want to see again.
                  </p>
                </div>
              </TabsContent>
            )}
            
            <TabsContent value="tagged" className="mt-6">
              <div className="text-center py-12">
                <div className="inline-flex justify-center items-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                  <Tag className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Tagged Posts</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  When people tag you in photos, they'll appear here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AppLayout>
  );
}
