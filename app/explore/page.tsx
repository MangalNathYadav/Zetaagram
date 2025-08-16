"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AppLayout from "@/components/layout/app-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search, MessageCircle, Heart, User as UserIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";
import { ref, get, query, limitToLast, orderByChild } from "firebase/database";
import PostModal from "@/components/PostModal";

// Type definitions
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

interface User {
  uid: string;
  username: string;
  displayName: string;
  email?: string;
  photoURL?: string;
  bio?: string;
  followers?: number;
  following?: number;
}

// Search result type that can contain both posts and users
interface SearchResult {
  posts: Post[];
  users: User[];
}

const staggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    }
  }
} as const;

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [searchType, setSearchType] = useState<'all' | 'posts' | 'users'>('all');
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useAuth();
  
  const POSTS_PER_PAGE = 12;

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Fetch user data for a post
  const fetchUserDataForPost = async (userId: string) => {
    try {
      const userRef = ref(db, `users/${userId}`);
      const userSnapshot = await get(userRef);
      
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        return {
          username: userData.username || userData.displayName || "Anonymous",
          userImage: userData.photoURL || null
        };
      }
      return { username: "Anonymous", userImage: null };
    } catch (error) {
      console.error("Error fetching user data:", error);
      return { username: "Anonymous", userImage: null };
    }
  };

  // Initial load
  useEffect(() => {
    fetchInitialPosts();
  }, []);

  const fetchInitialPosts = async () => {
    try {
      setLoading(true);
      
      // Query to get most recent posts
      const postsRef = ref(db, "posts");
      let postsSnapshot;
      
      try {
        // Try to get posts with ordering by timestamp - may fail if index doesn't exist
        const postsQuery = query(
          postsRef,
          orderByChild("timestamp"),
          limitToLast(POSTS_PER_PAGE)
        );
        postsSnapshot = await get(postsQuery);
      } catch (error) {
        // Fallback: get posts without ordering
        console.log("Using fallback: fetching posts without timestamp index");
        postsSnapshot = await get(postsRef);
      }
      
      if (postsSnapshot.exists()) {
        const postsData = postsSnapshot.val();
        const postsArray: Post[] = [];
        
        // Process posts in reverse chronological order
        // For fallback method, manually sort posts by timestamp
        const postEntries = Object.entries(postsData)
          .sort((a, b) => {
            const postA = a[1] as any;
            const postB = b[1] as any;
            return postB.timestamp && postA.timestamp ? 
              postB.timestamp.localeCompare(postA.timestamp) : 0;
          })
          .slice(0, POSTS_PER_PAGE);
        
        // Set the timestamp of the last post for pagination
        if (postEntries.length > 0) {
          const oldestPost = postEntries[postEntries.length - 1][1] as any;
          setLastTimestamp(oldestPost.timestamp);
        }
        
        // Fetch user data for each post
        for (const [id, post] of postEntries) {
          const typedPost = post as any;
          const userData = await fetchUserDataForPost(typedPost.userId);
          
          postsArray.push({
            ...typedPost,
            id,
            username: userData.username,
            userImage: userData.userImage
          });
        }
        
        setPosts(postsArray);
      } else {
        setPosts([]);
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && !loading && hasMore && !searchMode) {
      loadMorePosts();
    }
  }, [inView, loading, hasMore, searchMode]);

  const loadMorePosts = async () => {
    if (!lastTimestamp) return;
    
    try {
      setLoading(true);
      
      // Query to get older posts before the last one we loaded
      const postsRef = ref(db, "posts");
      let postsSnapshot;
      
      try {
        // Try to get posts with ordering by timestamp - may fail if index doesn't exist
        const postsQuery = query(
          postsRef,
          orderByChild("timestamp"),
          limitToLast(POSTS_PER_PAGE)
        );
        postsSnapshot = await get(postsQuery);
      } catch (error) {
        // Fallback: get all posts without ordering
        console.log("Using fallback: fetching more posts without timestamp index");
        postsSnapshot = await get(postsRef);
      }
      
      if (postsSnapshot.exists()) {
        const postsData = postsSnapshot.val();
        const filteredPosts = Object.entries(postsData)
          .filter(([_, post]) => {
            const typedPost = post as any;
            return typedPost.timestamp < lastTimestamp;
          })
          .sort((a, b) => {
            const postA = a[1] as any;
            const postB = b[1] as any;
            return postB.timestamp && postA.timestamp ? 
              postB.timestamp.localeCompare(postA.timestamp) : 0;
          })
          .slice(0, POSTS_PER_PAGE);
        
        if (filteredPosts.length === 0) {
          setHasMore(false);
          setLoading(false);
          return;
        }
        
        // Set the timestamp of the last post for next pagination
        if (filteredPosts.length > 0) {
          const oldestPost = filteredPosts[filteredPosts.length - 1][1] as any;
          setLastTimestamp(oldestPost.timestamp);
        }
        
        const newPostsArray: Post[] = [];
        
        // Fetch user data for each post
        for (const [id, post] of filteredPosts) {
          const typedPost = post as any;
          const userData = await fetchUserDataForPost(typedPost.userId);
          
          newPostsArray.push({
            ...typedPost,
            id,
            username: userData.username,
            userImage: userData.userImage
          });
        }
        
        setPosts(prevPosts => [...prevPosts, ...newPostsArray]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    
    // Auto-search after typing stops for 500ms (debounce)
    if (e.target.value.trim()) {
      const handler = setTimeout(() => {
        performSearch(e.target.value);
      }, 500);
      
      return () => clearTimeout(handler);
    }
  };

  // Search for users in Firebase
  const searchUsers = async (searchText: string) => {
    if (!searchText.trim()) return [];
    
    try {
      let snapshot;
      
      try {
        // First try: Query with orderByChild on username
        const usersQueryByUsername = query(
          ref(db, 'users'), 
          orderByChild('username')
        );
        snapshot = await get(usersQueryByUsername);
      } catch (error) {
        console.log("Username query failed, trying direct access:", error);
        
        try {
          // Second try: Direct access to users node
          snapshot = await get(ref(db, 'users'));
        } catch (secondError) {
          console.error("Both query methods failed:", secondError);
          return [];
        }
      }
      
      if (!snapshot || !snapshot.exists()) {
        return [];
      }
      
      const usersData = snapshot.val();
      
      // Filter users by username or display name
      const filteredUsers = Object.keys(usersData)
        .filter(uid => uid !== currentUser?.uid) // Don't include current user
        .map(uid => ({
          uid,
          ...usersData[uid]
        }))
        .filter(user => 
          user.username?.toLowerCase().includes(searchText.toLowerCase()) || 
          user.displayName?.toLowerCase().includes(searchText.toLowerCase())
        );
      
      return filteredUsers;
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  };

  // Combined search function for both posts and users
  const performSearch = async (searchText: string = searchQuery) => {
    if (!searchText.trim()) {
      setSearchMode(false);
      fetchInitialPosts();
      setUsers([]);
      return;
    }
    
    setSearchMode(true);
    setLoading(true);
    
    // Search for posts
    const filteredPosts = posts.filter(post => 
      post.caption?.toLowerCase().includes(searchText.toLowerCase()) ||
      post.username?.toLowerCase().includes(searchText.toLowerCase())
    );
    
    // Search for users
    const foundUsers = await searchUsers(searchText);
    
    // Update state with search results
    setPosts(searchType === 'users' ? [] : filteredPosts);
    setUsers(searchType === 'posts' ? [] : foundUsers);
    setHasMore(false);
    setLoading(false);
  };
  
  const searchPosts = () => {
    performSearch();
  };

  // User card component for search results
  const UserCard = ({ user }: { user: User }) => (
    <Link href={`/profile/${user.uid}`}>
      <motion.div 
        variants={itemVariants}
        className="flex items-center p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      >
        <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3">
          {user.photoURL ? (
            <Image 
              src={user.photoURL}
              alt={user.username || user.displayName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <UserIcon className="text-blue-500 dark:text-blue-300" />
            </div>
          )}
        </div>
        <div>
          <p className="font-medium">{user.username || user.displayName}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user.bio || `@${user.username}`}</p>
        </div>
      </motion.div>
    </Link>
  );

  return (
    <AppLayout className="max-w-6xl" hideHeader>
      {/* Search and header */}
      <div className="sticky top-0 z-10 pt-4 pb-2 bg-white dark:bg-gray-950">
        <div className="flex items-center mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search posts, users, or tags"
              className="pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-800"
              value={searchQuery}
              onChange={handleSearch}
              onKeyDown={(e) => e.key === 'Enter' && searchPosts()}
            />
          </div>
          <button
            onClick={searchPosts}
            className="ml-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full font-medium"
          >
            Search
          </button>
        </div>
        
        {/* Search filters */}
        {searchMode && (
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => { setSearchType('all'); performSearch(); }}
              className={`px-4 py-2 rounded-full ${
                searchType === 'all' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => { setSearchType('posts'); performSearch(); }}
              className={`px-4 py-2 rounded-full ${
                searchType === 'posts' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => { setSearchType('users'); performSearch(); }}
              className={`px-4 py-2 rounded-full ${
                searchType === 'users' 
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              People
            </button>
          </div>
        )}
        
        {/* Filters - can be expanded later */}
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          <button className="px-4 py-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium whitespace-nowrap">
            Latest
          </button>
          <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium whitespace-nowrap">
            Popular
          </button>
          <button className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium whitespace-nowrap">
            Following
          </button>
        </div>
      </div>
      
      {/* Search results - Users section (only visible in search mode) */}
      {searchMode && (searchType === 'all' || searchType === 'users') && users.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">People</h3>
          <motion.div
            className="space-y-3"
            variants={staggerVariants}
            initial="hidden"
            animate="visible"
          >
            {users.slice(0, 5).map((user) => (
              <UserCard key={user.uid} user={user} />
            ))}
            
            {users.length > 5 && searchType !== 'users' && (
              <button 
                className="w-full py-2 text-sm text-blue-500 hover:text-blue-600 font-medium"
                onClick={() => { setSearchType('users'); performSearch(); }}
              >
                View all {users.length} people
              </button>
            )}
          </motion.div>
        </div>
      )}
      
      {/* No results message */}
      {searchMode && users.length === 0 && posts.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-16">
          <Search className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
            No results found
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            We couldn't find any matches for "{searchQuery}"
          </p>
        </div>
      )}
      
      {/* Posts grid */}
      {(posts.length > 0 || !searchMode) && (searchType === 'all' || searchType === 'posts') && (
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 md:gap-2"
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
          <motion.div
            key={post.id}
            className="relative aspect-square rounded-md overflow-hidden"
            variants={itemVariants}
            onClick={() => {
              setSelectedPost(post);
              setIsModalOpen(true);
            }}
          >
            <div className="group relative w-full h-full cursor-pointer">
              <Image
                src={post.imageUrl}
                alt={post.caption}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                className="object-cover transition-all duration-200 group-hover:brightness-75"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200" />
              
              {/* Post info on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex items-center space-x-3 text-white">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 mr-1 fill-white" />
                    <span className="font-bold">{post.likes}</span>
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-1" />
                    <span className="font-bold">{post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {/* Loading skeletons */}
        {loading && Array.from({ length: 8 }).map((_, i) => (
          <div key={`skeleton-${i}`} className="relative aspect-square rounded-md overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>
        ))}
      </motion.div>
      )}
      
      {/* Load more indicator */}
      {hasMore && !loading && (
        <div
          ref={inViewRef}
          className="flex justify-center items-center p-4 mt-4"
        >
          <div className="w-8 h-8 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* No posts message */}
      {!loading && posts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-4">
            <Search className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No posts found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            {searchMode
              ? `No posts matching "${searchQuery}"`
              : "Start following users to see posts in your explore feed"}
          </p>
        </div>
      )}
      
      {/* Post Modal */}
      <PostModal
        post={selectedPost}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentUserId={currentUser?.uid}
      />
    </AppLayout>
  );
}
