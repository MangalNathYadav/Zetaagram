"use client";

import { db } from './firebase';
import { ref, push, set, get, update, remove, query, orderByChild, equalTo, limitToLast } from 'firebase/database';
import { fileToBase64, optimizeImage } from './imageUtils';
import { Post, Story, Comment } from './types';

/**
 * Firebase Database Service for interacting with Realtime Database
 */

/**
 * Creates a new post in the database
 * @param userId - The ID of the user creating the post
 * @param caption - The caption for the post
 * @param imageFile - The image file for the post
 * @returns A promise that resolves to the ID of the created post
 */
export const createPost = async (
  userId: string,
  caption: string,
  imageFile: File
): Promise<string> => {
  try {
    // Optimize and convert image to Base64
    const base64Image = await optimizeImage(imageFile);
    
    const timestamp = new Date().toISOString();
    
    // Create post reference
    const postsRef = ref(db, 'posts');
    const newPostRef = push(postsRef);
    
    const postData = {
      userId,
      caption,
      imageUrl: base64Image,
      likes: 0,
      comments: 0,
      timestamp,
      likedBy: {},
      commentsData: {}
    };
    
    await set(newPostRef, postData);
    
    // Update user's posts list
    const userPostsRef = ref(db, `users/${userId}/posts/${newPostRef.key}`);
    await set(userPostsRef, true);
    
    return newPostRef.key as string;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post");
  }
};

/**
 * Fetches posts for the user's feed
 * @param userId - The current user's ID
 * @param limit - Maximum number of posts to fetch
 * @returns A promise that resolves to an array of posts
 */
export const fetchFeedPosts = async (userId: string, limit = 20) => {
  try {
    // Get user's following list
    const followingRef = ref(db, `users/${userId}/following`);
    const followingSnapshot = await get(followingRef);
    const followingList = followingSnapshot.val() || {};
    
    // Include user's own posts in feed
    const userIds = [...Object.keys(followingList), userId];
    
    // Fetch posts for each user
    const allPosts: Post[] = [];
    
    for (const id of userIds) {
      const userPostsRef = ref(db, `users/${id}/posts`);
      const userPostsSnapshot = await get(userPostsRef);
      const userPosts = userPostsSnapshot.val() || {};
      
      // Get actual post data for each post ID
      for (const postId of Object.keys(userPosts)) {
        const postRef = ref(db, `posts/${postId}`);
        const postSnapshot = await get(postRef);
        const post = postSnapshot.val();
        
        if (post) {
          // Get user data for the post
          const userRef = ref(db, `users/${post.userId}`);
          const userSnapshot = await get(userRef);
          const userData = userSnapshot.val() || {};
          
          allPosts.push({
            id: postId,
            ...post,
            username: userData.username || 'Unknown',
            userImage: userData.photoURL || null
          });
        }
      }
    }
    
    // Sort posts by timestamp (newest first) and apply limit
    return allPosts
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
      
  } catch (error) {
    console.error("Error fetching feed posts:", error);
    throw new Error("Failed to load feed");
  }
};

/**
 * Fetches stories for the user's feed
 * @param userId - The current user's ID
 * @returns A promise that resolves to an array of stories
 */
export const fetchStories = async (userId: string) => {
  try {
    // Get user's following list
    const followingRef = ref(db, `users/${userId}/following`);
    const followingSnapshot = await get(followingRef);
    const followingList = followingSnapshot.val() || {};
    
    // Include user's own stories in feed
    const userIds = [...Object.keys(followingList), userId];
    
    // Define the cutoff time (24 hours ago)
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - 24);
    
    const allStories: Story[] = [];
    
    for (const id of userIds) {
      // Get user data
      const userRef = ref(db, `users/${id}`);
      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val() || {};
      
      // Get stories for this user
      const userStoriesRef = ref(db, `stories/${id}`);
      const userStoriesSnapshot = await get(userStoriesRef);
      const userStories = userStoriesSnapshot.val() || {};
      
      // Filter for stories within the last 24 hours
      const recentStories = Object.entries(userStories)
        .filter(([_, rawStoryData]) => {
          const storyData = rawStoryData as { timestamp: string };
          const storyTime = new Date(storyData.timestamp);
          return storyTime > cutoffTime;
        });
      
      if (recentStories.length > 0) {
        allStories.push({
          id,
          userId: id,
          username: userData.username || 'Unknown',
          imageUrl: userData.photoURL || null,
          createdAt: Date.now(),
          hasNewStory: true
        });
      }
    }
    
    return allStories;
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw new Error("Failed to load stories");
  }
};

/**
 * Creates a new story
 * @param userId - The ID of the user creating the story
 * @param imageFile - The image file for the story
 * @returns A promise that resolves to the ID of the created story
 */
export const createStory = async (
  userId: string,
  imageFile: File
): Promise<string> => {
  try {
    // Optimize and convert image to Base64
    const base64Image = await optimizeImage(imageFile);
    
    const timestamp = new Date().toISOString();
    
    // Create story reference
    const storiesRef = ref(db, `stories/${userId}`);
    const newStoryRef = push(storiesRef);
    
    const storyData = {
      imageUrl: base64Image,
      timestamp,
      viewedBy: {}
    };
    
    await set(newStoryRef, storyData);
    
    return newStoryRef.key as string;
  } catch (error) {
    console.error("Error creating story:", error);
    throw new Error("Failed to create story");
  }
};

/**
 * Marks a story as viewed by a user
 * @param storyOwnerId - The ID of the user who created the story
 * @param storyId - The ID of the story
 * @param viewerId - The ID of the user who viewed the story
 */
export const markStoryAsViewed = async (
  storyOwnerId: string,
  storyId: string,
  viewerId: string
) => {
  try {
    const viewedByRef = ref(db, `stories/${storyOwnerId}/${storyId}/viewedBy/${viewerId}`);
    await set(viewedByRef, true);
  } catch (error) {
    console.error("Error marking story as viewed:", error);
  }
};

/**
 * Likes or unlikes a post
 * @param postId - The ID of the post
 * @param userId - The ID of the user liking/unliking the post
 * @param isLiked - Whether the post is currently liked by the user
 */
export const toggleLikePost = async (
  postId: string,
  userId: string,
  isLiked: boolean
) => {
  try {
    // Update the likedBy field for this user
    const likedByRef = ref(db, `posts/${postId}/likedBy/${userId}`);
    
    if (isLiked) {
      // Unlike: Remove user from likedBy
      await remove(likedByRef);
    } else {
      // Like: Add user to likedBy
      await set(likedByRef, true);
    }
    
    // Count the total likes and update the post
    const likedByAllRef = ref(db, `posts/${postId}/likedBy`);
    const likedBySnapshot = await get(likedByAllRef);
    const likedByData = likedBySnapshot.val() || {};
    const likesCount = Object.keys(likedByData).length;
    
    // Update the likes count
    const likesRef = ref(db, `posts/${postId}/likes`);
    await set(likesRef, likesCount);
    
    return likesCount;
  } catch (error) {
    console.error("Error toggling like:", error);
    throw new Error("Failed to update like");
  }
};

/**
 * Adds a comment to a post
 * @param postId - The ID of the post
 * @param userId - The ID of the user commenting
 * @param text - The comment text
 * @returns A promise that resolves to the ID of the created comment
 */
export const addComment = async (
  postId: string,
  userId: string,
  text: string
): Promise<string> => {
  try {
    const timestamp = new Date().toISOString();
    
    // Create comment reference
    const commentsRef = ref(db, `posts/${postId}/commentsData`);
    const newCommentRef = push(commentsRef);
    
    const commentData = {
      userId,
      text,
      timestamp
    };
    
    await set(newCommentRef, commentData);
    
    // Update the comment count
    const allCommentsRef = ref(db, `posts/${postId}/commentsData`);
    const allCommentsSnapshot = await get(allCommentsRef);
    const commentsCount = Object.keys(allCommentsSnapshot.val() || {}).length;
    
    const countRef = ref(db, `posts/${postId}/comments`);
    await set(countRef, commentsCount);
    
    return newCommentRef.key as string;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw new Error("Failed to add comment");
  }
};

/**
 * Fetches comments for a post
 * @param postId - The ID of the post
 * @returns A promise that resolves to an array of comments
 */
export const fetchComments = async (postId: string) => {
  try {
    // Get comments data
    const commentsRef = ref(db, `posts/${postId}/commentsData`);
    const commentsSnapshot = await get(commentsRef);
    const commentsData = commentsSnapshot.val() || {};
    
    const comments = await Promise.all(
      Object.entries(commentsData).map(async ([commentId, rawCommentData]) => {
        const commentData = rawCommentData as { text: string; timestamp: string | number; userId: string };
        // Get user data for the comment
        const userRef = ref(db, `users/${commentData.userId}`);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.val() || {};
        
        return {
          id: commentId,
          text: commentData.text,
          timestamp: commentData.timestamp,
          userId: commentData.userId,
          username: userData.username || 'Unknown',
          userImage: userData.photoURL || null
        };
      })
    );
    
    // Sort comments by timestamp (newest first)
    return comments.sort((a, b) => 
      new Date(typeof b.timestamp === 'string' || typeof b.timestamp === 'number' ? b.timestamp : Date.now()).getTime() -
      new Date(typeof a.timestamp === 'string' || typeof a.timestamp === 'number' ? a.timestamp : Date.now()).getTime()
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to load comments");
  }
};
