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
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signUp: (email: string, password: string, profileData: UserProfile) => Promise<UserCredential>;
  signIn: (email: string, password: string) => Promise<UserCredential>;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
  showAuthToast: (message: string, type: "success" | "error" | "info" | "warning") => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { show } = useToast();

  // Create a user profile in the database
  const createUserProfile = async (user: User, additionalData?: UserProfile) => {
    try {
      const userRef = ref(db, `users/${user.uid}`);
      
      // Check if user already exists
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        // Create new user profile if it doesn't exist
        await set(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          username: additionalData?.username || "",
          createdAt: Date.now(),
          lastLogin: Date.now(),
          // Add any additional profile data
          ...(additionalData || {})
        });
      } else {
        // Update last login time if user exists
        await set(ref(db, `users/${user.uid}/lastLogin`), Date.now());
        
        // If we have additional data and this is a sign-up, update the profile
        if (additionalData) {
          const updates = {
            ...additionalData,
            lastUpdated: Date.now()
          };
          await set(ref(db, `users/${user.uid}`), {
            ...(snapshot.val() || {}),
            ...updates
          });
        }
      }
    } catch (error) {
      console.error("Error creating user profile:", error);
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

  // Sign out
  const logout = () => signOut(auth);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
    signUp,
    signIn,
    signInWithGoogle,
    logout,
    showAuthToast
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
