"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Search, Send, ArrowLeft, Paperclip, User, MessageCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { auth, db, storage } from "@/lib/firebase";
import { 
  ref, 
  get, 
  set, 
  push, 
  remove, 
  onValue,
  query,
  orderByChild,
  update,
  serverTimestamp as firebaseServerTimestamp,
  runTransaction 
} from "firebase/database";
import { 
  ref as storageRef, 
  uploadBytes, 
  getDownloadURL 
} from "firebase/storage";
// Commented out the useAuthState hook to avoid import error
// import { useAuthState } from "react-firebase-hooks/auth";
import { formatDistanceToNow } from "date-fns";
import { z } from "zod";

// Types
interface User {
  uid: string;
  username: string;
  displayName: string;
  email: string;
  profileImageUrl?: string;
}

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
  imageUrl?: string;
  read?: Record<string, boolean>;
}

interface Chat {
  id: string;
  participants: Record<string, boolean>;
  lastMessage?: string;
  lastTimestamp?: number;
  unreadCount?: Record<string, number>;
}

export default function ChatPage() {
  // Replace useAuthState with useState and useEffect to simulate authentication
  const [user, setUser] = useState(auth.currentUser);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatUsers, setChatUsers] = useState<Record<string, User>>({});
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Creating a mock user with required User interface properties
  const currentUser: User = {
    uid: user?.uid || 'mock-uid',
    username: 'username',
    displayName: user?.displayName || 'Display Name',
    email: user?.email || 'email@example.com',
    profileImageUrl: user?.photoURL || undefined
  };
  
  // Fetch all chats for current user
  useEffect(() => {
    if (!currentUser?.uid) return;
    
    setLoading(true);
    setError(null);
    const userChatsRef = ref(db, 'userChats');
    
    let unsubscribe: () => void;
    
    try {
      unsubscribe = onValue(userChatsRef, 
        (snapshot) => {
          if (!snapshot.exists()) {
            setChats([]);
            setLoading(false);
            return;
          }

          // Get user details for all participants
          const userDetails: Record<string, User> = {};
          const usersPromises: Promise<void>[] = [];

          Object.entries(snapshot.val()).forEach((entry) => {
            const [chatId, rawChatData] = entry;
            const chatData = rawChatData as Record<string, unknown>;
            const participants = chatData.participants as Record<string, boolean> || {};
            
            // Only process chats where current user is a participant
            if (participants && participants[currentUser.uid]) {
              Object.keys(participants).forEach((userId) => {
                if (userId !== currentUser.uid && !userDetails[userId]) {
                  const userPromise = get(ref(db, `users/${userId}`))
                    .then((userSnap) => {
                      if (userSnap.exists()) {
                        userDetails[userId] = { uid: userId, ...userSnap.val() as Omit<User, 'uid'> };
                      }
                    })
                    .catch(error => {
                      console.error(`Error fetching user ${userId}:`, error);
                    });
                  
                  usersPromises.push(userPromise);
                }
              });
            }
          });

          // Once we have all user details, we can render the chats
          Promise.all(usersPromises)
            .then(() => {
              const userChats: Chat[] = [];
              
              Object.entries(snapshot.val()).forEach((entry) => {
                const [chatId, rawChatData] = entry;
                const chatData = rawChatData as Record<string, unknown>;
                const participants = chatData.participants as Record<string, boolean> || {};
                
                // Only include chats where current user is a participant
                if (participants && participants[currentUser.uid]) {
                  const otherUserId = Object.keys(participants).find(id => id !== currentUser.uid);
                  
                  // Include even if we don't have other user details (could be a new user)
                  userChats.push({
                    id: chatId,
                    participants: participants,
                    lastMessage: chatData.lastMessage as string,
                    lastTimestamp: chatData.lastTimestamp as number,
                    unreadCount: chatData.unreadCount as Record<string, number>
                  });
                }
              });
              
              // Sort chats by last message timestamp
              userChats.sort((a, b) => (b.lastTimestamp || 0) - (a.lastTimestamp || 0));
              
              setChats(userChats);
              setChatUsers(userDetails);
              setLoading(false);
            })
            .catch(error => {
              console.error("Error processing user data:", error);
              setError("Failed to load chat users. Please refresh the page.");
              setLoading(false);
            });
        }, 
        (error) => {
          console.error("Error loading chats:", error);
          setError("Failed to load your chats. Please check your connection and try again.");
          setLoading(false);
        }
      );
    } catch (error) {
      console.error("Error setting up chat listener:", error);
      setError("Failed to connect to chat service. Please refresh the page.");
      setLoading(false);
      return () => {}; // Return empty function as fallback
    }
    
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser?.uid]);

  // Fetch messages when selecting a chat
  useEffect(() => {
    if (!selectedChat) return;
    
    setLoading(true);
    setError(null);
    const messagesRef = ref(db, `messages/${selectedChat}`);
    
    try {
      const unsubscribe = onValue(
        messagesRef, 
        (snapshot) => {
          if (!snapshot.exists()) {
            setMessages([]);
            setLoading(false);
            return;
          }
          
          const messagesData = snapshot.val();

          const messagesList = Object.keys(messagesData).map((msgId) => ({
            id: msgId,
            ...messagesData[msgId]
          })).sort((a, b) => a.timestamp - b.timestamp);

          setMessages(messagesList);
          setLoading(false);
          
          // Mark messages as read in a batch update
          const updates: Record<string, any> = {};
          
          Object.entries(messagesData).forEach((entry) => {
            const [msgId, rawMsgData] = entry;
            const msgData = rawMsgData as Record<string, unknown>;
            if (msgData.senderId !== currentUser.uid && (!msgData.read || !(msgData.read as Record<string, boolean>)[currentUser.uid])) {
              updates[`messages/${selectedChat}/${msgId}/read/${currentUser.uid}`] = true;
            }
          });
          
          // Update unread count in the chat
          updates[`userChats/${selectedChat}/unreadCount/${currentUser.uid}`] = 0;
          
          // Only update if there are changes to make
          if (Object.keys(updates).length > 0) {
            update(ref(db), updates).catch(error => {
              console.error("Error marking messages as read:", error);
            });
          }

          // Scroll to bottom when messages change
          scrollToBottom();
        },
        (error) => {
          console.error("Error fetching messages:", error);
          setError("Couldn't load messages. Please check your connection.");
          setLoading(false);
        }
      );
      
      return () => unsubscribe();
    } catch (error) {
      console.error("Error setting up messages listener:", error);
      setError("Failed to connect to message service.");
      setLoading(false);
      return () => {}; // Return empty function as fallback
    }
  }, [selectedChat, currentUser?.uid]);
  
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };
  
  const sendMessage = async () => {
    if (!currentUser || !selectedChat || (!newMessage.trim() && !selectedFile)) return;
    
    try {
      setError(null); // Clear any previous errors
      let imageUrl = "";
      
      // Upload image if selected
      if (selectedFile) {
        try {
          setUploadingImage(true);
          const imageRef = storageRef(storage, `chat_images/${selectedChat}/${Date.now()}_${selectedFile.name}`);
          const snapshot = await uploadBytes(imageRef, selectedFile);
          imageUrl = await getDownloadURL(snapshot.ref);
          setSelectedFile(null);
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
          setError("Failed to upload image. Please try again.");
          setUploadingImage(false);
          return;
        }
        setUploadingImage(false);
      }
      
      // Get other user ID
      const currentChat = chats.find(chat => chat.id === selectedChat);
      if (!currentChat) {
        setError("Chat not found. Please refresh the page.");
        return;
      }
      
      const otherUserId = Object.keys(currentChat.participants || {})
        .find(id => id !== currentUser.uid) || '';
      
      if (!otherUserId) {
        setError("Could not identify chat participant.");
        return;
      }
      
      try {
        // Create new message
        const newMessageRef = push(ref(db, `messages/${selectedChat}`));
        const messageId = newMessageRef.key;
        
        if (!messageId) {
          setError("Failed to generate message ID. Please try again.");
          return;
        }
        
        // Prepare message data
        const messageData = {
          text: newMessage.trim() || "",
          senderId: currentUser.uid,
          timestamp: Date.now(),
          ...(imageUrl ? { imageUrl } : {}),
          read: {
            [currentUser.uid]: true
          }
        };
        
        // Prepare chat updates
        const chatUpdates = {
          lastMessage: imageUrl ? "Sent an image" : newMessage.trim(),
          lastTimestamp: Date.now(),
        };
        
        // Use a multi-location update for better atomicity
        const updates: Record<string, any> = {};
        updates[`messages/${selectedChat}/${messageId}`] = messageData;
        updates[`userChats/${selectedChat}/lastMessage`] = chatUpdates.lastMessage;
        updates[`userChats/${selectedChat}/lastTimestamp`] = chatUpdates.lastTimestamp;
        
        // Increment unread count for other user
        if (otherUserId) {
          // Make sure the unreadCount node exists with a default value first
          const unreadCountRef = ref(db, `userChats/${selectedChat}/unreadCount/${otherUserId}`);
          const unreadSnapshot = await get(unreadCountRef);
          const currentCount = unreadSnapshot.exists() ? unreadSnapshot.val() : 0;
          
          updates[`userChats/${selectedChat}/unreadCount/${otherUserId}`] = currentCount + 1;
        }
        
        // Submit all updates in one operation
        await update(ref(db), updates);
        
        // Clear input and scroll
        setNewMessage("");
        scrollToBottom();
      } catch (messageError: any) {
        console.error("Error sending message:", messageError);
        
        // More detailed error messages based on error code
        if (messageError.code === "PERMISSION_DENIED") {
          setError("You don't have permission to send messages in this chat.");
        } else if (messageError.code === "NETWORK_ERROR") {
          setError("Network error. Please check your connection and try again.");
        } else {
          setError("Failed to send message. Please try again.");
        }
      }
    } catch (error) {
      console.error("Error in sendMessage:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };
  
  const searchUsers = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
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
          
          // Final fallback: Access recent chats to find users
          console.log("Using fallback: searching from existing chats");
          const userChatsRef = ref(db, 'userChats');
          snapshot = await get(userChatsRef);
          
          if (snapshot.exists()) {
            // Extract user IDs from chats
            const userIds = new Set<string>();
            const chatsData = snapshot.val();
            
            Object.values(chatsData).forEach((chat: any) => {
              if (chat?.participants) {
                Object.keys(chat.participants).forEach(uid => {
                  if (uid !== currentUser.uid) userIds.add(uid);
                });
              }
            });
            
            // Get user details for each ID
            const userResults = [];
            for (const uid of userIds) {
              const userRef = ref(db, `users/${uid}`);
              const userSnapshot = await get(userRef);
              if (userSnapshot.exists()) {
                const userData = userSnapshot.val();
                if (userData.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                    userData.displayName?.toLowerCase().includes(searchQuery.toLowerCase())) {
                  userResults.push({ uid, ...userData });
                }
              }
            }
            
            setSearchResults(userResults);
            return;
          }
        }
      }
      
      if (!snapshot || !snapshot.exists()) {
        setSearchResults([]);
        return;
      }
      
      const usersData = snapshot.val();
      
      // Filter users by username or display name
      const filteredUsers = Object.keys(usersData)
        .filter(uid => uid !== currentUser.uid) // Don't include current user
        .map(uid => ({
          uid,
          ...usersData[uid]
        }))
        .filter(user => 
          user.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          user.displayName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    }
  };
  
  const startChat = async (userId: string) => {
    if (!currentUser || !userId) return;
    
    try {
      setError(null);
      
      // First check if chat already exists between these users
      const userChatsRef = ref(db, 'userChats');
      let existingChatId = null;
      
      try {
        const snapshot = await get(userChatsRef);
        
        if (snapshot.exists()) {
          const chatsData = snapshot.val();
          
          // Find existing chat between these users
          Object.entries(chatsData).forEach(([chatId, chatData]: [string, any]) => {
            if (chatData.participants && 
                chatData.participants[currentUser.uid] && 
                chatData.participants[userId]) {
              existingChatId = chatId;
            }
          });
        }
      } catch (error) {
        console.error("Error checking existing chats:", error);
        // Continue to create new chat even if checking fails
      }
      
      // If chat exists, select it
      if (existingChatId) {
        setSelectedChat(existingChatId);
        setShowSearch(false);
        setSearchQuery("");
        return;
      }
      
      // Create a new chat
      const newChatRef = push(userChatsRef);
      const chatId = newChatRef.key;
      
      if (!chatId) {
        setError("Failed to generate chat ID. Please try again.");
        return;
      }
      
      try {
        // Build a minimal structure for the new chat
        const updates: Record<string, any> = {};
        
        // Set up participants structure
        updates[`userChats/${chatId}/participants/${currentUser.uid}`] = true;
        updates[`userChats/${chatId}/participants/${userId}`] = true;
        updates[`userChats/${chatId}/lastTimestamp`] = Date.now();
        updates[`userChats/${chatId}/createdBy`] = currentUser.uid;
        
        // Apply all updates at once
        await update(ref(db), updates);
        
        // Select the new chat
        setSelectedChat(chatId);
        setShowSearch(false);
        setSearchQuery("");
      } catch (error) {
        console.error("Error creating chat:", error);
        setError("Couldn't create chat. Please try again later.");
      }
    } catch (error) {
      console.error("Unexpected error in startChat:", error);
      setError("An unexpected error occurred. Please try again.");
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };
  
  const resetError = () => {
    setError(null);
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim() || selectedFile) {
        sendMessage();
      }
    }
  };
  
  const getOtherUserFromChat = (chat: Chat): User | undefined => {
    const otherUserId = Object.keys(chat.participants).find(id => id !== currentUser.uid);
    return otherUserId ? chatUsers[otherUserId] : undefined;
  };
  
  const formatMessageTime = (timestamp: number): string => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
        {/* Chat List */}
        <div className={`w-full md:w-1/3 border-r border-gray-200 dark:border-gray-800 ${selectedChat ? 'hidden md:block' : ''}`}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-semibold">Messages</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
          
          {showSearch ? (
            <div className="p-4">
              <div className="mb-4">
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchUsers(e.target.value);
                  }}
                  className="w-full"
                />
              </div>
              
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <Card 
                    key={user.uid} 
                    className="p-3 flex items-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => startChat(user.uid)}
                  >
                    <Avatar className="h-10 w-10 mr-3">
                      {user.profileImageUrl ? (
                        <img 
                          src={user.profileImageUrl} 
                          alt={user.displayName} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.displayName}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                    </div>
                  </Card>
                ))}
                
                {searchQuery && searchResults.length === 0 && (
                  <p className="text-center text-gray-500 my-4">No users found</p>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading chats...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col justify-center items-center h-full p-6">
                  <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Error</h3>
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                  <button 
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              ) : chats.length > 0 ? (
                chats.map((chat) => {
                  const otherUser = getOtherUserFromChat(chat);
                  const unreadCount = (chat.unreadCount?.[currentUser.uid] || 0) > 0;
                  
                  return (
                    <div
                      key={chat.id}
                      className={`flex items-center p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                        selectedChat === chat.id ? 'bg-gray-100 dark:bg-gray-800' : ''
                      } ${unreadCount ? 'font-semibold' : ''}`}
                      onClick={() => setSelectedChat(chat.id)}
                    >
                      <Avatar className="h-12 w-12 mr-4">
                        {otherUser?.profileImageUrl ? (
                          <img 
                            src={otherUser.profileImageUrl} 
                            alt={otherUser.displayName} 
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-6 w-6" />
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <p className="truncate font-medium">{otherUser?.displayName || 'Unknown User'}</p>
                          {chat.lastTimestamp && (
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(new Date(chat.lastTimestamp), { addSuffix: false })}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                          {chat.lastMessage || 'Start a conversation'}
                        </p>
                      </div>
                      {chat.unreadCount && chat.unreadCount[currentUser.uid] > 0 && (
                        <span className="ml-2 bg-blue-600 text-white rounded-full text-xs px-2 py-1">
                          {chat.unreadCount[currentUser.uid]}
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col justify-center items-center h-full p-4 text-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-6 mb-6">
                    <MessageCircle className="h-12 w-12 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No conversations yet</h3>
                  <p className="text-gray-500 mb-6 max-w-xs">
                    Connect with friends and start a conversation to see your messages here
                  </p>
                  <Button 
                    onClick={() => setShowSearch(true)}
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    Start a new chat
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Chat Messages */}
        {selectedChat ? (
          <div className="flex flex-col w-full md:w-2/3 h-full">
            {/* Chat Header */}
            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-800">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden mr-2"
                onClick={() => setSelectedChat(null)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              
              {(() => {
                const chat = chats.find((c) => c.id === selectedChat);
                if (!chat) return <p>Loading...</p>;
                
                const otherUser = getOtherUserFromChat(chat);
                return (
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      {otherUser?.profileImageUrl ? (
                        <img 
                          src={otherUser.profileImageUrl} 
                          alt={otherUser.displayName} 
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6" />
                      )}
                    </Avatar>
                    <div>
                      <p className="font-medium">{otherUser?.displayName || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">@{otherUser?.username}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loadingMessages ? (
                <div className="flex justify-center items-center h-full">
                  <p>Loading messages...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col justify-center items-center h-full p-4 text-center">
                  <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Error</h3>
                  <p className="text-center text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                  <button 
                    onClick={resetError}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : messages.length > 0 ? (
                messages.map((message) => {
                  const isCurrentUser = message.senderId === currentUser.uid;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          isCurrentUser
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-200 dark:bg-gray-800 rounded-bl-none'
                        }`}
                      >
                        {message.imageUrl && (
                          <img
                            src={message.imageUrl}
                            alt="Message attachment"
                            className="rounded-lg mb-2 max-h-60 object-contain"
                          />
                        )}
                        {message.text && <p>{message.text}</p>}
                        <div className="text-xs mt-1 text-right">
                          {formatMessageTime(message.timestamp)}
                          {isCurrentUser && message.read && Object.keys(message.read).length > 1 && (
                            <span className="ml-1">✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col justify-center items-center h-full text-center">
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-4 mb-4">
                    <MessageCircle className="h-10 w-10 text-blue-500" />
                  </div>
                  <p className="text-lg font-medium mb-1">Start a conversation</p>
                  <p className="text-gray-500 max-w-xs">
                    Send a message to begin chatting with this person
                  </p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              {selectedFile && (
                <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-800 rounded flex items-center">
                  <p className="text-sm flex-1 truncate">{selectedFile.name}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedFile(null)}
                    className="ml-2"
                  >
                    &times;
                  </Button>
                </div>
              )}
              
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10"
                  onClick={triggerFileInput}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  className="hidden"
                />
                
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type a message..."
                  className="min-h-[50px] max-h-[150px] flex-1 mx-2 resize-none"
                />
                
                <Button
                  type="button"
                  onClick={sendMessage}
                  className="h-10 w-10"
                  variant="ghost"
                  size="icon"
                  disabled={(!newMessage.trim() && !selectedFile) || uploadingImage}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-col justify-center items-center w-2/3 h-full p-4 text-center">
            {error ? (
              <div className="flex flex-col justify-center items-center">
                <div className="bg-red-100 dark:bg-red-900/30 p-8 rounded-full mb-6">
                  <AlertCircle className="h-16 w-16 text-red-500 dark:text-red-400" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Something went wrong</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
                  {error}
                </p>
                <Button 
                  onClick={resetError}
                  className="mt-2 bg-blue-500 hover:bg-blue-600"
                >
                  Try again
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8 mb-6">
                  <MessageCircle className="h-16 w-16 text-blue-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Your messages</h3>
                <p className="text-gray-500 mb-2 max-w-md">
                  Select a conversation from the sidebar or start a new one
                </p>
                <Button 
                  onClick={() => setShowSearch(true)} 
                  className="mt-4 bg-blue-500 hover:bg-blue-600"
                  size="lg"
                >
                  New message
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
