"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { UserProfile } from "@/lib/types";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ChevronLeft, Camera, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

// Form validation schema for profile
const profileFormSchema = z.object({
  displayName: z.string().min(1, "Display name is required").max(50, "Display name must be less than 50 characters"),
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9._]+$/, "Username can only contain letters, numbers, periods and underscores"),
  bio: z.string().max(150, "Bio must be less than 150 characters").optional(),
  website: z.string().max(100, "Website URL must be less than 100 characters").optional(),
  location: z.string().max(30, "Location must be less than 30 characters").optional(),
});

export default function EditProfilePage() {
  const { currentUser, userData, updateUserProfile, showAuthToast } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  // Initialize form with current user data
  const form = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: "",
      username: "",
      bio: "",
      website: "",
      location: "",
    },
  });

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Populate form when user data is available
  useEffect(() => {
    if (userData) {
      form.reset({
        displayName: userData.displayName || "",
        username: userData.username || "",
        bio: userData.bio || "",
        website: userData.website || "",
        location: userData.location || "",
      });

      if (userData.photoURL) {
        setProfileImagePreview(userData.photoURL);
      }
    }
  }, [userData, form]);

  // Handle profile image change - now directly converting to base64 for RTDB
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showAuthToast("Image must be less than 2MB", "error");
        return;
      }
      
      setProfileImageFile(file);

      // Create preview and prepare for base64 storage in RTDB
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    if (!currentUser) return;

    try {
      setIsSubmitting(true);

      // Use base64 image data directly in RTDB
      let photoURL = userData?.photoURL;
      if (profileImagePreview && profileImagePreview !== photoURL) {
        // Base64 image is already in profileImagePreview
        photoURL = profileImagePreview;
      }

      // Update profile data with properly typed profile data
      const profileUpdate: Partial<UserProfile> = {
        displayName: values.displayName,
        username: values.username,
        bio: values.bio,
        photoURL,
      };

      // Add website and location fields
      if (typeof values.website === 'string') {
        profileUpdate.website = values.website;
      }
      
      if (typeof values.location === 'string') {
        profileUpdate.location = values.location;
      }

      // Update lastUpdated timestamp
      profileUpdate.lastUpdated = Date.now();

      // Update user profile in database and auth context
      await updateUserProfile(profileUpdate);
      showAuthToast("Profile updated successfully", "success");
      router.back();
    } catch (error) {
      console.error("Error updating profile:", error);
      showAuthToast("Failed to update profile", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AppLayout hideHeader>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="container max-w-md py-4 md:py-8 px-2"
      >
        {/* Back Button - Mobile Friendly */}
        <motion.div 
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
          className="flex items-center mb-6"
        >
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="flex items-center gap-1 hover:bg-transparent p-0 group"
          >
            <ChevronLeft className="w-5 h-5 group-hover:translate-x-[-2px] transition-transform" />
            <span className="ml-1 group-hover:text-blue-600 transition-colors">Back to profile</span>
          </Button>
        </motion.div>
        
        {/* Main Content */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
        >
          <Card className="shadow-md border-0 overflow-hidden bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-2 bg-gradient-to-r from-gray-50 to-white">
              <CardTitle className="text-xl font-bold text-gray-800">Edit Profile</CardTitle>
              <CardDescription className="text-gray-500">
                Update your profile information and how others see you
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Profile Image - Enhanced Modern Version */}
                  <div className="flex flex-col items-center space-y-4 mb-8">
                    <motion.div 
                      className="relative group"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg ring-2 ring-white">
                        {profileImagePreview ? (
                          <motion.img 
                            src={profileImagePreview} 
                            alt={userData?.displayName || "Profile"} 
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white text-4xl">
                            {userData?.displayName?.charAt(0).toUpperCase() || userData?.username?.charAt(0).toUpperCase() || "T"}
                          </div>
                        )}
                      </div>
                      
                      <Label 
                        htmlFor="profileImage" 
                        className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-full cursor-pointer shadow-xl hover:shadow-2xl transition-all hover:scale-110 border-2 border-white"
                      >
                        <Camera size={18} />
                      </Label>
                      
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-all duration-200"
                        whileHover={{ scale: 1.05 }}
                      >
                        <p className="text-sm font-medium">Change Photo</p>
                      </motion.div>
                      
                      <Input 
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </motion.div>
                    <motion.p 
                      className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      Click to update profile photo
                    </motion.p>
                  </div>

                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="username" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your unique username for your account.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about yourself..." 
                            className="resize-none" 
                            {...field} 
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormDescription>
                          Write a short bio about yourself.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormDescription>
                          Your personal or professional website.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormDescription>
                          Where you're based.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="pt-4 flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <Loader2 size={18} className="animate-spin mr-2" />
                          <span>Saving...</span>
                        </div>
                      ) : (
                        <span>Save Changes</span>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
