/**
 * Custom type definitions for the application
 */

// For database.ts
export interface Post {
  id: string;
  userId: string;
  username: string;
  userImage?: string;
  text?: string;
  imageUrl?: string;
  caption?: string;
  timestamp: number;
  createdAt: number;
  likes?: Record<string, boolean>;
  comments?: Record<string, unknown>;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  imageUrl: string;
  createdAt: number;
  hasNewStory?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  timestamp: number;
  username?: string;
  userProfileImage?: string;
}

// For notifications.ts
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'message';
  senderId?: string;  // For backward compatibility
  fromUserId?: string;
  recipientId?: string; // For backward compatibility
  toUserId?: string;
  postId?: string;
  chatId?: string;
  commentId?: string;
  timestamp?: number; // For backward compatibility
  createdAt?: number;
  read: boolean;
  fromUserName?: string;
  fromUserImage?: string;
}

export interface UserProfile {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  photoURL?: string;
  profileImageUrl?: string;
  bio?: string;
  website?: string;
}
