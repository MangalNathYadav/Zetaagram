"use client";

import React, { useState, useRef, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Image as ImageIcon, X, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

// This would be in a separate file in the real implementation
const createPost = async (postData: {
  userId: string;
  username: string;
  userImage: string;
  caption: string;
  imageBase64: string;
}) => {
  // Simulate API call to Firebase
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Creating post with data:", postData);
      resolve({ success: true, postId: "new-post-123" });
    }, 2000);
  });
};

export default function CreatePostPage() {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Simulate upload progress
  React.useEffect(() => {
    if (isLoading && uploadProgress < 90) {
      const timer = setTimeout(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isLoading, uploadProgress]);

  const handleImageSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Image too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please select an image to post",
        variant: "destructive",
      });
      return;
    }

    if (!caption.trim()) {
      toast({
        title: "Caption required",
        description: "Please add a caption to your post",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(0);
      
      // In a real app, this would call Firebase to create a post
      const result = await createPost({
        userId: currentUser?.uid || "anonymous",
        username: currentUser?.displayName || "anonymous",
        userImage: currentUser?.photoURL || "",
        caption,
        imageBase64: selectedImage,
      });
      
      setUploadProgress(100);
      
      toast({
        title: "Post created!",
        description: "Your post has been published successfully",
      });
      
      // Redirect to home page after successful post
      setTimeout(() => {
        router.push("/home");
      }, 1000);
      
    } catch (error) {
      console.error("Error creating post:", error);
      toast({
        title: "Failed to create post",
        description: "Please try again later",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-lg mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b dark:border-gray-700">
            <h1 className="text-xl font-semibold text-center">Create New Post</h1>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Image upload area */}
            {!selectedImage ? (
              <div 
                className="p-8 flex flex-col items-center justify-center border-dashed border-2 border-gray-300 dark:border-gray-600 rounded-lg m-4 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600 dark:text-gray-300 mb-2">Click to upload an image</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF up to 5MB</p>
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative m-4">
                <img 
                  src={selectedImage} 
                  alt="Selected" 
                  className="w-full h-auto rounded-lg object-cover max-h-96"
                />
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
            
            {/* Caption input */}
            <div className="px-4 pb-4">
              <Textarea
                placeholder="Write a caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full resize-none"
                rows={4}
                disabled={isLoading}
              />
            </div>
            
            {/* Submit button */}
            <div className="px-4 pb-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || !selectedImage}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : "Processing..."}
                  </>
                ) : (
                  "Share Post"
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AppLayout>
  );
}
