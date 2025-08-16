"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import AppLayout from "@/components/layout/app-layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Send } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/auth-context";
import { db } from "@/lib/firebase";
import { ref, onValue, push, set, off, get, query, orderByChild, equalTo } from "firebase/database";
import { useRouter } from "next/navigation";

// Types for chats and messages
interface Chat {
  id: string;
  participants: Record<string, boolean>;
  lastMessage: string;
  lastMessageTimestamp: number;
  lastMessageSender: string;
  unreadCount?: Record<string, number>;
}

interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: number;
  read: Record<string, boolean>;
}

interface User {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  username?: string;
}

export default function ChatPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [chatUsers, setChatUsers] = useState<Record<string, User>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Load chats for current user
  useEffect(() => {
    if (!currentUser) return;

    const userChatsRef = ref(db, 'userChats');
    const userChatsQuery = query(
      userChatsRef,
      orderByChild('participants/' + currentUser.uid),
      equalTo(true)
    );

    const chatsListener = onValue(userChatsQuery, async (snapshot) => {
      const chatsData = snapshot.val();
      if (!chatsData) {
        setChats([]);
        setLoading(false);
        return;
      }

      // Get user details for all participants
      const userDetails: Record<string, User> = {};
      const usersPromises: Promise<void>[] = [];

      Object.entries(chatsData).forEach(([chatId, chatData]: [string, any]) => {
        Object.keys(chatData.participants || {}).forEach((userId) => {
          if (userId !== currentUser.uid && !userDetails[userId]) {
            const userPromise = get(ref(db, `users/${userId}`))
              .then((userSnap) => {
                if (userSnap.exists()) {
                  userDetails[userId] = { uid: userId, ...userSnap.val() };
                }
              })
              .catch(console.error);
            
            usersPromises.push(userPromise);
          }
        });
      });

      await Promise.all(usersPromises);
      setChatUsers(userDetails);

      // Format chats
      const formattedChats = Object.keys(chatsData).map((chatId) => ({
        id: chatId,
        ...chatsData[chatId]
      })).sort((a, b) => (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0));

      setChats(formattedChats);
      
      // If no chat is selected yet, select the most recent one
      if (!selectedChat && formattedChats.length > 0) {
        setSelectedChat(formattedChats[0].id);
      }

      setLoading(false);
    });

    return () => {
      off(userChatsQuery, 'value', chatsListener);
    };
  }, [currentUser, selectedChat]);

  // Load messages for selected chat
  useEffect(() => {
    if (!selectedChat || !currentUser) return;

    const messagesRef = ref(db, `messages/${selectedChat}`);
    
    const messagesListener = onValue(messagesRef, (snapshot) => {
      const messagesData = snapshot.val();
      if (!messagesData) {
        setMessages([]);
        return;
      }

      const messagesList = Object.keys(messagesData).map((msgId) => ({
        id: msgId,
        ...messagesData[msgId]
      })).sort((a, b) => a.timestamp - b.timestamp);

      setMessages(messagesList);
      
      // Mark messages as read
      Object.entries(messagesData).forEach(([msgId, msgData]: [string, any]) => {
        if (msgData.senderId !== currentUser.uid && (!msgData.read || !msgData.read[currentUser.uid])) {
          set(ref(db, `messages/${selectedChat}/${msgId}/read/${currentUser.uid}`), true);
        }
      });

      // Update unread count in the chat
      set(ref(db, `userChats/${selectedChat}/unreadCount/${currentUser.uid}`), 0);
    });

    // Scroll to bottom when messages change
    scrollToBottom();

    return () => {
      off(messagesRef, 'value', messagesListener);
    };
  }, [selectedChat, currentUser]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Search for users
  useEffect(() => {
    if (!searchQuery.trim() || !showSearch || !currentUser) return;

    const handleSearch = async () => {
      const usersRef = ref(db, 'users');
      const snapshot = await get(usersRef);
      
      if (!snapshot.exists()) return;

      const usersData = snapshot.val();
      const query = searchQuery.toLowerCase();
      
      const filteredUsers = Object.keys(usersData)
        .filter(uid => {
          const user = usersData[uid];
          return uid !== currentUser.uid && (
            (user.username && user.username.toLowerCase().includes(query)) ||
            (user.displayName && user.displayName.toLowerCase().includes(query)) ||
            (user.email && user.email.toLowerCase().includes(query))
          );
        })
        .map(uid => ({
          uid,
          ...usersData[uid]
        }));

      setSearchResults(filteredUsers);
    };

    handleSearch();
  }, [searchQuery, showSearch, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

    try {
      // Create a new message
      const messagesRef = ref(db, `messages/${selectedChat}`);
      const newMessageRef = push(messagesRef);
      
      const message = {
        chatId: selectedChat,
        senderId: currentUser.uid,
        content: newMessage,
        timestamp: Date.now(),
        read: {
          [currentUser.uid]: true
        }
      };
      
      await set(newMessageRef, message);

      // Update the last message in the chat
      await set(ref(db, `userChats/${selectedChat}/lastMessage`), newMessage);
      await set(ref(db, `userChats/${selectedChat}/lastMessageTimestamp`), Date.now());
      await set(ref(db, `userChats/${selectedChat}/lastMessageSender`), currentUser.uid);

      // Update unread count for other participants
      const chatSnapshot = await get(ref(db, `userChats/${selectedChat}/participants`));
      if (chatSnapshot.exists()) {
        const participants = chatSnapshot.val();
        
        Object.keys(participants).forEach(async (userId) => {
          if (userId !== currentUser.uid) {
            const currentUnread = await get(ref(db, `userChats/${selectedChat}/unreadCount/${userId}`));
            const unreadCount = currentUnread.exists() ? currentUnread.val() + 1 : 1;
            
            await set(ref(db, `userChats/${selectedChat}/unreadCount/${userId}`), unreadCount);
          }
        });
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const createOrOpenChat = async (userId: string) => {
    if (!currentUser) return;
    
    // Check if chat already exists
    const userChatsRef = ref(db, 'userChats');
    const snapshot = await get(userChatsRef);
    
    if (snapshot.exists()) {
      const chatsData = snapshot.val();
      
      // Look for an existing chat between these two users
      const existingChat = Object.entries(chatsData).find(([_, chatData]: [string, any]) => {
        const participants = chatData.participants || {};
        return participants[currentUser.uid] && participants[userId];
      });

      if (existingChat) {
        setSelectedChat(existingChat[0]);
        setShowSearch(false);
        setSearchQuery("");
        return;
      }
    }
    
    // Create a new chat
    const newChatRef = push(userChatsRef);
    const chatId = newChatRef.key;
    
    if (!chatId) return;
    
    const chatData = {
      participants: {
        [currentUser.uid]: true,
        [userId]: true
      },
      createdAt: Date.now(),
      lastMessage: "",
      lastMessageTimestamp: Date.now()
    };
    
    await set(newChatRef, chatData);
    
    // Get user details if not already loaded
    if (!chatUsers[userId]) {
      const userSnapshot = await get(ref(db, `users/${userId}`));
      if (userSnapshot.exists()) {
        setChatUsers(prev => ({
          ...prev,
          [userId]: { uid: userId, ...userSnapshot.val() }
        }));
      }
    }
    
    setSelectedChat(chatId);
    setShowSearch(false);
    setSearchQuery("");
  };

  const getOtherParticipant = (chat: Chat): User | undefined => {
    if (!currentUser || !chat.participants) return undefined;
    
    const otherUserId = Object.keys(chat.participants).find(id => id !== currentUser.uid);
    return otherUserId ? chatUsers[otherUserId] : undefined;
  };

  if (!currentUser) {
    return (
      <AppLayout hideHeader>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Sign in required</h2>
            <p className="text-gray-500 mb-4">Please sign in to use chat</p>
            <Button onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout hideHeader>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Chats sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r dark:border-gray-800 flex flex-col">
          <div className="p-4 border-b dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Messages</h2>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  setShowSearch(prev => !prev);
                  if (!showSearch) {
                    setSearchQuery("");
                    setSearchResults([]);
                  }
                }}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>
            {showSearch && (
              <div className="mb-4">
                <Input
                  placeholder="Search for users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {showSearch ? (
              // Search results
              <div>
                {searchResults.length === 0 && searchQuery && (
                  <div className="p-4 text-center text-gray-500">
                    No users found
                  </div>
                )}
                {searchResults.map((user) => (
                  <motion.div
                    key={user.uid}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => createOrOpenChat(user.uid)}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10">
                        {user.photoURL ? (
                          <AvatarImage src={user.photoURL} alt={user.displayName || user.email} />
                        ) : (
                          <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || '?'}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="ml-3">
                        <div className="font-medium">{user.displayName || user.email}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              // Chat list
              <div>
                {loading ? (
                  // Skeleton loaders
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 border-b dark:border-gray-800">
                      <div className="flex items-center">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="ml-3 flex-1">
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-3 w-40" />
                        </div>
                        <Skeleton className="h-3 w-10" />
                      </div>
                    </div>
                  ))
                ) : chats.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No messages yet
                  </div>
                ) : (
                  chats.map((chat) => {
                    const otherUser = getOtherParticipant(chat);
                    const isSelected = selectedChat === chat.id;
                    const unreadCount = chat.unreadCount?.[currentUser.uid] || 0;
                    
                    return (
                      <motion.div
                        key={chat.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`p-4 border-b dark:border-gray-800 cursor-pointer ${
                          isSelected ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-900'
                        }`}
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10">
                            {otherUser?.photoURL ? (
                              <AvatarImage src={otherUser.photoURL} alt={otherUser.displayName || otherUser.email} />
                            ) : (
                              <AvatarFallback>
                                {otherUser?.displayName?.charAt(0) || otherUser?.email?.charAt(0) || '?'}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="ml-3 flex-1">
                            <div className="font-medium">
                              {otherUser?.displayName || otherUser?.email || 'Unknown User'}
                            </div>
                            <div className="text-sm text-gray-500 truncate">
                              {chat.lastMessageSender === currentUser.uid ? 'You: ' : ''}
                              {chat.lastMessage || 'No messages yet'}
                            </div>
                          </div>
                          <div className="text-xs text-gray-500">
                            {chat.lastMessageTimestamp ? 
                              formatDistanceToNow(new Date(chat.lastMessageTimestamp), { addSuffix: false }) : ''}
                          </div>
                          {unreadCount > 0 && (
                            <div className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {unreadCount}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </div>

        {/* Chat area */}
        <div className="hidden md:flex md:w-2/3 lg:w-3/4 flex-col">
          {selectedChat ? (
            <>
              {/* Chat header */}
              {(() => {
                const selectedChatData = chats.find(c => c.id === selectedChat);
                const otherUser = selectedChatData ? getOtherParticipant(selectedChatData) : undefined;
                
                return (
                  <div className="p-4 border-b dark:border-gray-800 flex items-center">
                    <Avatar className="h-10 w-10">
                      {otherUser?.photoURL ? (
                        <AvatarImage src={otherUser.photoURL} alt={otherUser.displayName || otherUser.email} />
                      ) : (
                        <AvatarFallback>{otherUser?.displayName?.charAt(0) || otherUser?.email?.charAt(0) || '?'}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="ml-3">
                      <div className="font-medium">{otherUser?.displayName || otherUser?.email || 'Unknown User'}</div>
                      <div className="text-xs text-gray-500">{otherUser?.email || ''}</div>
                    </div>
                  </div>
                );
              })()}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="text-gray-400 mb-2">No messages yet</div>
                    <div className="text-sm text-gray-500">Send a message to start the conversation</div>
                  </div>
                ) : (
                  messages.map((message) => {
                    const isCurrentUser = message.senderId === currentUser.uid;
                    const sender = isCurrentUser ? currentUser : chatUsers[message.senderId];
                    
                    return (
                      <div
                        key={message.id}
                        className={`mb-4 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8 mr-2 mt-1">
                            {sender?.photoURL ? (
                              <AvatarImage src={sender.photoURL} />
                            ) : (
                              <AvatarFallback>
                                {sender?.displayName?.charAt(0) || '?'}
                              </AvatarFallback>
                            )}
                          </Avatar>
                        )}
                        <div
                          className={`px-4 py-2 rounded-xl max-w-[80%] ${
                            isCurrentUser
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          <p>{message.content}</p>
                          <div
                            className={`text-xs mt-1 ${
                              isCurrentUser ? 'text-primary-foreground/80' : 'text-gray-500'
                            }`}
                          >
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message input */}
              <div className="p-4 border-t dark:border-gray-800">
                <form
                  className="flex items-center"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                >
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 mr-2"
                  />
                  <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
              <p className="text-gray-500 mb-4">Send private messages to other users</p>
              <Button onClick={() => setShowSearch(true)}>Start a Conversation</Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
