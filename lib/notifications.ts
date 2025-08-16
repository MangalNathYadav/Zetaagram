"use client";

import { db } from './firebase';
import { ref, push, set, get, query, orderByChild, limitToLast, remove } from 'firebase/database';
import { Notification, UserProfile } from './types';

/**
 * Creates a new notification
 * @param recipientId - The ID of the user receiving the notification
 * @param type - The type of notification ('like', 'comment', 'follow')
 * @param senderId - The ID of the user who triggered the notification
 * @param postId - Optional: ID of the related post
 * @param commentId - Optional: ID of the related comment
 */
export const createNotification = async (
  recipientId: string,
  type: 'like' | 'comment' | 'follow',
  senderId: string,
  postId?: string,
  commentId?: string
): Promise<void> => {
  // Don't notify yourself
  if (recipientId === senderId) return;
  
  try {
    const notificationsRef = ref(db, `notifications/${recipientId}`);
    const newNotificationRef = push(notificationsRef);
    
    
    const timestamp = Date.now();
    const notificationData: Omit<Notification, 'id'> = {
      type,
      senderId,
      timestamp,
      read: false
    };
    if (postId) notificationData.postId = postId;
    if (commentId) notificationData.commentId = commentId;
    await set(newNotificationRef, notificationData);
    await set(newNotificationRef, notificationData);
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

/**
 * Fetches notifications for the current user
 * @param userId - The ID of the current user
 * @param limit - Maximum number of notifications to fetch
 * @returns Promise resolving to an array of notification objects
 */
export const fetchNotifications = async (userId: string, limit = 50) => {
  try {
    // Create a query to get notifications sorted by timestamp
    const notificationsRef = ref(db, `notifications/${userId}`);
    const notificationsQuery = query(
      notificationsRef,
      orderByChild('timestamp'),
      limitToLast(limit)
    );
    const notificationsSnapshot = await get(notificationsQuery);
    const notificationsData = notificationsSnapshot.val() || {};
    // Convert to array and add user data
    const notifications = await Promise.all(
      Object.entries(notificationsData).map(async ([id, rawData]) => {
        const data = rawData as Notification;
        // Get sender data
        const senderRef = ref(db, `users/${data.senderId}`);
        const senderSnapshot = await get(senderRef);
        const senderData = senderSnapshot.val() || {};
        // Get post data if it exists
        let postData = null;
        if (data.postId) {
          const postRef = ref(db, `posts/${data.postId}`);
          const postSnapshot = await get(postRef);
          postData = postSnapshot.val();
        }
        return {
          ...data,
          senderName: senderData.username || 'Unknown',
          senderPhoto: senderData.photoURL || null,
          postData,
          notificationId: id
        };
      })
    );
    // Sort notifications by timestamp (newest first)
    return notifications.sort((a, b) =>
      new Date(typeof b.timestamp === 'number' ? b.timestamp : Date.now()).getTime() -
      new Date(typeof a.timestamp === 'number' ? a.timestamp : Date.now()).getTime()
    );
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
};
/**
 * Marks a notification as read
 * @param userId - The ID of the user who owns the notification
 * @param notificationId - The ID of the notification to mark as read
 */
export async function markNotificationAsRead(userId: string, notificationId: string) {
  try {
    const notificationRef = ref(db, `notifications/${userId}/${notificationId}`);
    await set(notificationRef, { read: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }

}

/**
 * Deletes a notification
 * @param userId - The ID of the user who owns the notification
 * @param notificationId - The ID of the notification to delete
 */
export const deleteNotification = async (userId: string, notificationId: string) => {
  try {
    const notificationRef = ref(db, `notifications/${userId}/${notificationId}`);
    await remove(notificationRef);
  } catch (error) {
    console.error("Error deleting notification:", error);
  }
};

/**
 * Gets the count of unread notifications
 * @param userId - The ID of the user
 * @returns Promise resolving to the count of unread notifications
 */
export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    const notificationsRef = ref(db, `notifications/${userId}`);
    const notificationsSnapshot = await get(notificationsRef);
    const notificationsData = notificationsSnapshot.val() || {};
    
    // Count unread notifications
    let unreadCount = 0;
    Object.values(notificationsData).forEach((rawNotification) => {
      const notification = rawNotification as Notification;
      if (!notification.read) unreadCount++;
    });
    
    return unreadCount;
  } catch (error) {
    console.error("Error counting unread notifications:", error);
    return 0;
  }
};
