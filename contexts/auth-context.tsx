"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { 
  User,
  UserCredential, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { auth, googleProvider, db } from "@/lib/firebase";
import { useToast } from "@/components/ui/toast";

interface UserProfile {
  displayName?: string;
  username?: string;
  photoURL?: string;
  bio?: string;
}

interface UserData extends UserProfile {
  uid: string;
  email: string;
  following?: Record<string, boolean>;
  followers?: Record<string, boolean>;
  postsCount?: number;
  lastLogin?: number;
  createdAt?: number;
}

interface AuthContextType {
  currentUser: User | null;
  userData: UserData | null;
  loading: boolean;
  signUp: (email: string, password: string, profileData: UserProfile) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
  checkIsFollowing: (userId: string) => Promise<boolean>;
  refreshUserData: () => Promise<void>;
  showAuthToast: (message: string, type: "success" | "error" | "info" | "warning") => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  // Create or update a user profile in the database
  const createUserProfile = async (user: User, additionalData?: UserProfile) => {
    try {
      const userRef = ref(db, `users/${user.uid}`);
      
      // Check if user already exists
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // Create new user profile if it doesn't exist
        const newUserData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          username: additionalData?.username || user.displayName || user.email?.split('@')[0] || "",
          bio: additionalData?.bio || "",
          createdAt: Date.now(),
          lastLogin: Date.now(),
          postsCount: 0,
          followers: {},
          following: {},
          // Add any additional profile data
          ...(additionalData || {})
        };
        
        await set(userRef, newUserData);
        setUserData(newUserData as UserData);
      } else {
        // Update last login time if user exists
        const existingData = snapshot.val();
        const updatedData = {
          ...existingData,
          lastLogin: Date.now(),
          // If we have additional data, update the profile
          ...(additionalData || {}),
        };
        
        await set(userRef, updatedData);
        setUserData(updatedData);
      }
    } catch (error) {
      console.error("Error creating/updating user profile:", error);
    }
  };
  
  // Refresh user data from the database
  const refreshUserData = async () => {
    if (!currentUser) return;
    
    try {
      const userRef = ref(db, `users/${currentUser.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        setUserData(snapshot.val());
      }
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  };

  const showAuthToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    show(message, type, 3000);
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, profileData: UserProfile) => {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update user profile with display name
    if (credential.user) {
      await updateProfile(credential.user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL || null,
      });
      
      // Create user profile in database with additional data
      await createUserProfile(credential.user, profileData);
    }
    
    return credential;
  };

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    
    // Update user profile in database
    if (credential.user) {
      await createUserProfile(credential.user);
    }
    
    return credential;
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const credential = await signInWithPopup(auth, googleProvider);
    
    // Update user profile in database
    if (credential.user) {
      await createUserProfile(credential.user);
    }
    
    return credential;
  };

  // Update user profile
  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!currentUser) throw new Error("No authenticated user");
    
    try {
      // Update auth profile if display name or photo URL are provided
      if (profileData.displayName || profileData.photoURL) {
        await updateProfile(currentUser, {
          displayName: profileData.displayName || currentUser.displayName,
          photoURL: profileData.photoURL || currentUser.photoURL,
        });
      }
      
      // Update database profile
      const userRef = ref(db, `users/${currentUser.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const updatedData = {
          ...snapshot.val(),
          ...profileData,
          lastUpdated: Date.now()
        };
        
        await set(userRef, updatedData);
        setUserData(updatedData);
        return updatedData;
      }
    } catch (error) {
      console.error("Error updating user profile:", error);
      throw error;
    }
  };
  
  // Follow another user
  const followUser = async (userId: string) => {
    if (!currentUser) throw new Error("No authenticated user");
    if (userId === currentUser.uid) throw new Error("Cannot follow yourself");
    
    try {
      // Add to current user's following
      const followingRef = ref(db, `users/${currentUser.uid}/following/${userId}`);
      await set(followingRef, true);
      
      // Add to target user's followers
      const followerRef = ref(db, `users/${userId}/followers/${currentUser.uid}`);
      await set(followerRef, true);
      
      // Create notification for target user
      const notificationData = {
        type: 'follow',
        senderId: currentUser.uid,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      const notificationRef = ref(db, `notifications/${userId}/${Date.now()}`);
      await set(notificationRef, notificationData);
      
      // Update local user data
      await refreshUserData();
    } catch (error) {
      console.error("Error following user:", error);
      throw error;
    }
  };
  
  // Unfollow a user
  const unfollowUser = async (userId: string) => {
    if (!currentUser) throw new Error("No authenticated user");
    
    try {
      // Remove from current user's following
      const followingRef = ref(db, `users/${currentUser.uid}/following/${userId}`);
      await set(followingRef, null);
      
      // Remove from target user's followers
      const followerRef = ref(db, `users/${userId}/followers/${currentUser.uid}`);
      await set(followerRef, null);
      
      // Update local user data
      await refreshUserData();
    } catch (error) {
      console.error("Error unfollowing user:", error);
      throw error;
    }
  };
  
  // Check if current user is following another user
  const checkIsFollowing = async (userId: string): Promise<boolean> => {
    if (!currentUser) return false;
    
    try {
      const followingRef = ref(db, `users/${currentUser.uid}/following/${userId}`);
      const snapshot = await get(followingRef);
      return snapshot.exists() && snapshot.val() === true;
    } catch (error) {
      console.error("Error checking following status:", error);
      return false;
    }
  };
  
  // Sign out
  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch user data from the database
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          setUserData(snapshot.val());
        } else {
          // Create user profile if it doesn't exist
          await createUserProfile(user);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    updateUserProfile,
    followUser,
    unfollowUser,
    checkIsFollowing,
    refreshUserData,
    showAuthToast
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
