"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import AppLayout from "@/components/layout/app-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Settings, User, Lock, Bell, Shield, LogOut, ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { currentUser, userData, showAuthToast, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("account");

  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
    }
  }, [currentUser, router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error("Error logging out:", error);
      showAuthToast("Failed to log out", "error");
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
            <span className="ml-1 group-hover:text-blue-600 transition-colors">Back</span>
          </Button>
        </motion.div>
        
        {/* Main Content */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
          className="flex flex-col gap-4"
        >
          {/* Settings Card */}
          <Card className="flex flex-col gap-16 shadow-md border-0 overflow-none h-[518px] bg-gradient-to-br mb-50 from-white to-gray-50">
            <CardHeader className="pb-4 pt-6 px-6 bg-gradient-to-r from-gray-50 to-white">
              <CardTitle className="text-xl gap-9 font-bold text-gray-800">Settings</CardTitle>
              <CardDescription className="text-gray-500 mt-1">
                Manage your account settings and preferences
              </CardDescription>
            </CardHeader>
            <div className="border-b border-gray-200 mx-6 mb-4"></div>
            <CardContent className="p-0">
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="flex flex-col w-full space-y-1 p-0 bg-transparent">
                  <motion.div 
                    whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}
                    onClick={() => router.push('/edit-profile')}
                    className="cursor-pointer mt-4"
                  >
                    <div 
                      className="w-full justify-start px-6 py-4 border-b text-left rounded-none flex items-center"
                    >
                      <User className="mr-4 h-5 w-5 text-gray-500" />
                      <span className="font-medium">Edit Profile</span>
                    </div>
                  </motion.div>
                  
                  <motion.div whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}>
                    <TabsTrigger 
                      value="account"
                      className="w-full justify-start px-6 py-4 border-b text-left rounded-none data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <Settings className="mr-4 h-5 w-5 text-gray-500" />
                        <span className="font-medium">Account</span>
                      </div>
                    </TabsTrigger>
                  </motion.div>
                  
                  <motion.div whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}>
                    <TabsTrigger 
                      value="password"
                      className="w-full justify-start px-6 py-4 border-b text-left rounded-none data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <Lock className="mr-4 h-5 w-5 text-gray-500" />
                        <span className="font-medium">Password</span>
                      </div>
                    </TabsTrigger>
                  </motion.div>
                  
                  <motion.div whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}>
                    <TabsTrigger 
                      value="notifications"
                      className="w-full justify-start px-6 py-4 border-b text-left rounded-none data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <Bell className="mr-4 h-5 w-5 text-gray-500" />
                        <span className="font-medium">Notifications</span>
                      </div>
                    </TabsTrigger>
                  </motion.div>
                  
                  <motion.div whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}>
                    <TabsTrigger 
                      value="privacy"
                      className="w-full justify-start px-6 py-4 border-b text-left rounded-none data-[state=active]:bg-blue-50/50 data-[state=active]:text-blue-600 transition-all duration-200"
                    >
                      <div className="flex items-center">
                        <Shield className="mr-4 h-5 w-5 text-gray-500" />
                        <span className="font-medium">Privacy</span>
                      </div>
                    </TabsTrigger>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.8)" }}
                    className="border-b"
                  >
                    <button 
                      onClick={() => {
                        if (confirm("Are you sure you want to log out of Zetaagram? You can always log back in at any time.")) {
                          handleLogout();
                        }
                      }}
                      className="w-full text-left px-6 py-4 flex items-center hover:text-red-500 transition-colors"
                    >
                      <LogOut className="mr-4 h-5 w-5 text-gray-500" />
                      <span className="font-medium">Log out</span>
                    </button>
                  </motion.div>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Content Area */}
          <div className="mt-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Account Tab */}
              <TabsContent value="account">
                <Card className="mb-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Account Settings</CardTitle>
                    <CardDescription className="text-gray-500 mt-1">
                      Manage your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-sm font-medium block mb-1">Email</Label>
                      <div className="p-3 bg-gray-50 rounded-md text-base">{userData?.email}</div>
                    </div>
                    
                    <div className="pt-6 border-t">
                      <h3 className="text-lg font-medium mb-5">Account Management</h3>
                      <div className="space-y-6">
                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                          <div className="space-y-1">
                            <Label className="font-medium">Account Data</Label>
                            <p className="text-sm text-gray-600">
                              Download a copy of your data
                            </p>
                          </div>
                          <Button variant="outline" size="sm">Download</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Password Tab */}
              <TabsContent value="password">
                <Card className="mb-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Password Settings</CardTitle>
                    <CardDescription className="text-gray-500 mt-1">
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pb-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
                      <p className="text-blue-700">
                        Password management will be implemented soon.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card className="mb-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Notification Preferences</CardTitle>
                    <CardDescription className="text-gray-500 mt-1">
                      Control when and how you want to be notified
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-1">
                        <Label className="font-medium">Push Notifications</Label>
                        <p className="text-sm text-gray-600">
                          Receive push notifications on your device
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-1">
                        <Label className="font-medium">Email Notifications</Label>
                        <p className="text-sm text-gray-600">
                          Receive email notifications about account activity
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Privacy Tab */}
              <TabsContent value="privacy">
                <Card className="mb-6">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-xl">Privacy Settings</CardTitle>
                    <CardDescription className="text-gray-500 mt-1">
                      Control your privacy and visibility on the platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-1">
                        <Label className="font-medium">Private Account</Label>
                        <p className="text-sm text-gray-600">
                          Only approved followers can see your posts
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-1">
                        <Label className="font-medium">Activity Status</Label>
                        <p className="text-sm text-gray-600">
                          Show when you're active on the platform
                        </p>
                      </div>
                      <Button variant="default" size="sm">Enabled</Button>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-1">
                        <Label className="font-medium">Blocked Accounts</Label>
                        <p className="text-sm text-gray-600">
                          Manage users that you've blocked
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="space-y-1">
                        <Label className="font-medium">Data Sharing</Label>
                        <p className="text-sm text-gray-600">
                          Control how your data is used for recommendations
                        </p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-5 pb-4">
                    <div className="w-full text-center">
                      <p className="text-xs text-gray-500 mb-3">
                        Your privacy is our priority. Review our <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a> for more information.
                      </p>
                      <Button variant="default" size="sm" className="w-full sm:w-auto">Save Privacy Settings</Button>
                    </div>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </motion.div>
    </AppLayout>
  );
}
