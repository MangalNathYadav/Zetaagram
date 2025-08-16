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

// This would come from Firebase in the real implementation
const DUMMY_CHATS = [
  {
    id: "chat1",
    userId: "user1",
    username: "janedoe",
    displayName: "Jane Doe",
    photoURL: "/avatars/avatar-2.png",
    lastMessage: "Hey, how are you doing?",
    timestamp: new Date(Date.now() - 1000000).toISOString(),
    unread: 2,
  },
  {
    id: "chat2",
    userId: "user2",
    username: "alex23",
    displayName: "Alex Johnson",
    photoURL: "/avatars/avatar-3.png",
    lastMessage: "Did you see the new update?",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    unread: 0,
  },
  {
    id: "chat3",
    userId: "user3",
    username: "sarahm",
    displayName: "Sarah Miller",
    photoURL: "/avatars/avatar-4.png",
    lastMessage: "Thanks for your help yesterday!",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    unread: 0,
  },
];

// Dummy messages for a selected chat
const DUMMY_MESSAGES = [
  {
    id: "msg1",
    senderId: "user1",
    content: "Hey, how are you doing?",
    timestamp: new Date(Date.now() - 360000).toISOString(),
  },
  {
    id: "msg2",
    senderId: "currentUser",
    content: "I'm good! Just working on some new features for the app.",
    timestamp: new Date(Date.now() - 300000).toISOString(),
  },
  {
    id: "msg3",
    senderId: "user1",
    content: "That sounds interesting! What kind of features?",
    timestamp: new Date(Date.now() - 240000).toISOString(),
  },
  {
    id: "msg4",
    senderId: "currentUser",
    content: "Mainly focusing on improving the chat experience and adding support for sharing posts in messages.",
    timestamp: new Date(Date.now() - 180000).toISOString(),
  },
  {
    id: "msg5",
    senderId: "user1",
    content: "That sounds great! Can't wait to see it.",
    timestamp: new Date(Date.now() - 60000).toISOString(),
  },
];

// Dummy search results
const DUMMY_USERS = [
  {
    id: "user4",
    username: "mike_j",
    displayName: "Mike Johnson",
    photoURL: "/avatars/avatar-5.png",
  },
  {
    id: "user5",
    username: "emma_w",
    displayName: "Emma Wilson",
    photoURL: "/avatars/avatar-1.png",
  },
  {
    id: "user6",
    username: "david_s",
    displayName: "David Smith",
    photoURL: "/avatars/avatar-2.png",
  },
];

export default function ChatPage() {
  const { currentUser } = useAuth();
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  const [chats, setChats] = useState<typeof DUMMY_CHATS>([]);
  const [messages, setMessages] = useState<typeof DUMMY_MESSAGES>([]);
  const [selectedChat, setSelectedChat] = useState<typeof DUMMY_CHATS[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof DUMMY_USERS>([]);
  const [searchMode, setSearchMode] = useState(false);
  
  // Load chats on mount
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setChats(DUMMY_CHATS);
      setLoading(false);
    }, 1500);
  }, []);
  
  // Load messages when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      setLoading(true);
      // Simulate API fetch
      setTimeout(() => {
        setMessages(DUMMY_MESSAGES);
        setLoading(false);
        // Update chat to mark as read
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === selectedChat.id ? { ...chat, unread: 0 } : chat
          )
        );
      }, 1000);
    }
  }, [selectedChat]);
  
  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Search for users
  useEffect(() => {
    if (searchQuery.trim() && searchMode) {
      // Simulate API search
      setTimeout(() => {
        setSearchResults(DUMMY_USERS.filter(
          user => user.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 user.displayName.toLowerCase().includes(searchQuery.toLowerCase())
        ));
      }, 500);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery, searchMode]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !selectedChat) return;
    
    const newMessage = {
      id: `msg${messages.length + 1}`,
      senderId: "currentUser",
      content: messageText,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, newMessage]);
    setMessageText("");
    
    // Update last message in chat list
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === selectedChat.id 
          ? { 
              ...chat, 
              lastMessage: messageText,
              timestamp: new Date().toISOString(),
            } 
          : chat
      )
    );
  };
  
  const handleStartNewChat = (user: typeof DUMMY_USERS[0]) => {
    // Check if chat already exists
    const existingChat = chats.find(chat => chat.userId === user.id);
    
    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      // Create new chat
      const newChat = {
        id: `chat${chats.length + 1}`,
        userId: user.id,
        username: user.username,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastMessage: "",
        timestamp: new Date().toISOString(),
        unread: 0,
      };
      
      setChats([newChat, ...chats]);
      setSelectedChat(newChat);
    }
    
    setSearchMode(false);
    setSearchQuery("");
  };

  return (
    <AppLayout>
      <div className="flex h-[calc(100vh-180px)]">
        {/* Chat List */}
        <div className={`border-r dark:border-gray-700 ${selectedChat ? 'hidden md:block w-full md:w-80' : 'w-full md:w-80'}`}>
          {/* Search header */}
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Messages</h2>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setSearchMode(true)}
              >
                <Search className="h-4 w-4" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
            
            {searchMode && (
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                    autoFocus
                  />
                </div>
                
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    {searchResults.length > 0 
                      ? `${searchResults.length} results found`
                      : searchQuery.trim() 
                        ? "No results found" 
                        : "Start typing to search"
                    }
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setSearchMode(false);
                      setSearchQuery("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Search results */}
          {searchMode && searchResults.length > 0 && (
            <div className="overflow-y-auto h-full">
              {searchResults.map(user => (
                <div 
                  key={user.id}
                  className="flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                  onClick={() => handleStartNewChat(user)}
                >
                  <Avatar className="h-12 w-12 mr-3">
                    <AvatarImage src={user.photoURL} alt={user.displayName} />
                    <AvatarFallback>{user.displayName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.displayName}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Chat list */}
          {!searchMode && (
            <div className="overflow-y-auto h-full">
              {loading && !selectedChat ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center p-4 border-b dark:border-gray-700">
                    <Skeleton className="h-12 w-12 rounded-full mr-3" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                ))
              ) : chats.length > 0 ? (
                chats.map(chat => (
                  <div 
                    key={chat.id}
                    className={`flex items-center p-4 border-b dark:border-gray-700 cursor-pointer ${
                      selectedChat?.id === chat.id 
                        ? 'bg-gray-100 dark:bg-gray-800' 
                        : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12 mr-3">
                        <AvatarImage src={chat.photoURL} alt={chat.displayName} />
                        <AvatarFallback>{chat.displayName[0]}</AvatarFallback>
                      </Avatar>
                      {chat.unread > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                          {chat.unread}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate">{chat.displayName}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: false })}
                        </p>
                      </div>
                      <p className={`text-sm truncate ${chat.unread > 0 ? 'font-semibold' : 'text-gray-500'}`}>
                        {chat.lastMessage || "No messages yet"}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <p>No messages yet</p>
                  <p className="text-sm mt-2">Search for users to start chatting</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Chat Content */}
        <div className={`flex-1 flex flex-col ${!selectedChat && 'hidden md:flex'}`}>
          {selectedChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b dark:border-gray-700 flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden mr-2"
                  onClick={() => setSelectedChat(null)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </Button>
                
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={selectedChat.photoURL} alt={selectedChat.displayName} />
                  <AvatarFallback>{selectedChat.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{selectedChat.displayName}</p>
                  <p className="text-xs text-gray-500">@{selectedChat.username}</p>
                </div>
              </div>
              
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[70%] ${i % 2 === 0 ? 'bg-gray-100 dark:bg-gray-800' : 'bg-primary text-white'} rounded-xl p-3`}>
                        <Skeleton className="h-10 w-40" />
                      </div>
                    </div>
                  ))
                ) : messages.length > 0 ? (
                  messages.map(message => {
                    const isCurrentUser = message.senderId === "currentUser";
                    return (
                      <div 
                        key={message.id}
                        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[70%] rounded-xl p-3 ${
                            isCurrentUser 
                              ? 'bg-primary text-white' 
                              : 'bg-gray-100 dark:bg-gray-800'
                          }`}
                        >
                          <p>{message.content}</p>
                          <p className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">No messages yet. Start the conversation!</p>
                  </div>
                )}
                <div ref={messageEndRef} />
              </div>
              
              {/* Message input */}
              <div className="p-4 border-t dark:border-gray-700">
                <form onSubmit={handleSendMessage} className="flex items-center">
                  <Input
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 mr-2"
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={!messageText.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
              <p className="text-gray-500 text-center mb-4">
                Send private messages to your friends.
              </p>
              <Button onClick={() => setSearchMode(true)}>
                Start a Conversation
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
