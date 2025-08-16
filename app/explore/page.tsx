"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import AppLayout from "@/components/layout/app-layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// These would come from Firebase in the real implementation
const DUMMY_POSTS = Array.from({ length: 30 }).map((_, i) => ({
  id: `post-${i}`,
  username: `user_${Math.floor(Math.random() * 100)}`,
  userImage: `/avatars/avatar-${(i % 5) + 1}.png`,
  imageUrl: `https://picsum.photos/seed/${i + 100}/500/500`,
  likes: Math.floor(Math.random() * 1000),
  comments: Math.floor(Math.random() * 50),
  caption: "This is a sample post caption.",
  timestamp: new Date(Date.now() - (i * 3600000)).toISOString(),
}));

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
      type: "spring",
      stiffness: 100,
      damping: 15,
    }
  }
} as const;

export default function ExplorePage() {
  const [posts, setPosts] = useState<typeof DUMMY_POSTS>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  
  const POSTS_PER_PAGE = 12;

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Initial load
  useEffect(() => {
    const fetchInitialPosts = () => {
      // Simulate API fetch
      setTimeout(() => {
        setPosts(DUMMY_POSTS.slice(0, POSTS_PER_PAGE));
        setLoading(false);
        setPage(1);
      }, 1500);
    };

    fetchInitialPosts();
  }, []);

  // Load more when scrolling to bottom
  useEffect(() => {
    if (inView && !loading && hasMore && !searchMode) {
      loadMorePosts();
    }
  }, [inView]);

  const loadMorePosts = () => {
    setLoading(true);
    
    // Simulate API fetch with delay
    setTimeout(() => {
      const nextPosts = DUMMY_POSTS.slice(
        page * POSTS_PER_PAGE,
        (page + 1) * POSTS_PER_PAGE
      );
      
      if (nextPosts.length === 0) {
        setHasMore(false);
        setLoading(false);
        return;
      }
      
      setPosts(prevPosts => [...prevPosts, ...nextPosts]);
      setPage(prevPage => prevPage + 1);
      setLoading(false);
    }, 1500);
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setSearchMode(false);
      // Reset to initial posts
      setLoading(true);
      setPosts(DUMMY_POSTS.slice(0, POSTS_PER_PAGE));
      setPage(1);
      setHasMore(true);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setSearchMode(true);
    
    // Simulate search with delay
    setTimeout(() => {
      const filteredPosts = DUMMY_POSTS.filter(
        post => post.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
               post.caption.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setPosts(filteredPosts);
      setHasMore(false);
      setLoading(false);
    }, 1000);
  };

  return (
    <AppLayout>
      {/* Search form */}
      <div className="sticky top-16 z-10 py-3 bg-gray-50 dark:bg-gray-950">
        <form onSubmit={handleSearch} className="flex items-center relative">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users or posts..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSearchMode(false);
              setPosts(DUMMY_POSTS.slice(0, POSTS_PER_PAGE));
              setPage(1);
              setHasMore(true);
            }}
            className={`ml-2 text-sm text-primary ${!searchQuery ? 'hidden' : ''}`}
          >
            Clear
          </button>
        </form>
      </div>

      {/* Grid of images */}
      {loading && posts.length === 0 ? (
        <div className="grid grid-cols-3 gap-1 mt-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="aspect-square">
              <Skeleton className="w-full h-full" />
            </div>
          ))}
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-3 gap-1 mt-4"
          variants={staggerVariants}
          initial="hidden"
          animate="visible"
        >
          {posts.map((post) => (
            <motion.div
              key={post.id}
              variants={itemVariants}
              className="aspect-square relative"
            >
              <Link href={`/post/${post.id}`}>
                <Image
                  src={post.imageUrl}
                  alt={`Post by ${post.username}`}
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
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Loading indicator at bottom */}
      {!searchMode && hasMore && (
        <div ref={ref} className="py-4 flex justify-center">
          {loading && (
            <div className="space-y-4 w-full max-w-md">
              <div className="flex justify-center">
                <div className="w-6 h-6 border-2 border-t-2 border-gray-500 border-t-primary rounded-full animate-spin"></div>
              </div>
              <p className="text-center text-sm text-gray-500">Loading more posts...</p>
            </div>
          )}
        </div>
      )}

      {/* End of results message */}
      {!hasMore && posts.length > 0 && (
        <div className="py-8 text-center text-gray-500">
          <p>You&apos;ve seen all posts</p>
        </div>
      )}

      {/* No results */}
      {!loading && posts.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-lg font-medium mb-2">No results found</p>
          <p className="text-gray-500">Try a different search term</p>
        </div>
      )}
    </AppLayout>
  );
}
