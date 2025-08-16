"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { SocialAuthButtons } from "@/components/ui/social-auth-buttons";
import { AuthLayout } from "@/components/layout/auth-layout";
import { useAuth } from "@/contexts/auth-context";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      bounce: 0.3,
      duration: 0.7,
      delayChildren: 0.1,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
};

const buttonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 400, damping: 15 } },
  hover: { 
    scale: 1.03,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { type: "spring" as const, stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.97 }
};

const socialButtonVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: { 
      delay: 0.3 + i * 0.1,
      type: "spring" as const,
      stiffness: 300,
      damping: 20
    }
  }),
  hover: { 
    scale: 1.03, 
    backgroundColor: "rgba(249, 250, 251, 1)",
    transition: { type: "spring" as const, stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.97 }
};

const dividerVariants = {
  hidden: { opacity: 0, width: "0%" },
  visible: { 
    opacity: 1, 
    width: "100%",
    transition: { delay: 0.3, duration: 0.5, type: "tween" as const }
  }
};

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});
  
  const { signIn, signInWithGoogle, showAuthToast } = useAuth();
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      showAuthToast("Successfully logged in with Google!", "success");
      router.push("/home");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to login with Google";
      showAuthToast(errorMessage, "error");
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: string) => {
    if (provider === "google") {
      handleGoogleSignIn();
    } else {
      showAuthToast(`${provider} login coming soon!`, "info");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setErrors({});
    
    // Validate form
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    try {
      await signIn(email, password);
      showAuthToast("Successfully logged in!", "success");
      router.push("/home");
    } catch (error: unknown) {
      console.error("Login error:", error);
      
      // Handle different Firebase auth errors
      const firebaseError = error as { code?: string; message?: string };
      if (firebaseError.code === "auth/user-not-found" || firebaseError.code === "auth/wrong-password") {
        setErrors({ email: "Invalid email or password" });
      } else if (firebaseError.code === "auth/invalid-email") {
        setErrors({ email: "Invalid email format" });
      } else if (firebaseError.code === "auth/too-many-requests") {
        setErrors({ password: "Too many failed login attempts. Try again later." });
      } else {
        showAuthToast(firebaseError.message || "Failed to login", "error");
      }
      
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Log in to your account to continue"
      illustrationSide="left"
    >
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div variants={itemVariants}>
            <FormInput
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              placeholder="your.email@example.com"
              disabled={isLoading}
              icon="mail"
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
            </div>
            
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </motion.button>
            </div>
            
            {errors.password && (
              <motion.p 
                className="text-sm text-red-500 mt-1"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
              >
                {errors.password}
              </motion.p>
            )}
          </motion.div>          <motion.div 
            className="flex items-center justify-between flex-wrap gap-2"
            variants={itemVariants}
          >
            <div className="flex items-center">
              <motion.input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                disabled={isLoading}
                whileTap={{ scale: 0.9 }}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Link 
                href="#" 
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot password?
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:from-[#FF5A5A] hover:to-[#3DBCB3] text-white h-11 rounded-md font-medium"
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <span>Log in</span>
              )}
            </motion.button>
          </motion.div>
        </form>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <motion.div 
                className="w-full border-t border-gray-300"
                variants={dividerVariants}
              ></motion.div>
            </div>
            <div className="relative flex justify-center text-sm">
              <motion.span 
                className="px-2 bg-white text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Or continue with
              </motion.span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-3 mt-3">
            <motion.button
              type="button"
              onClick={() => handleSocialAuth('google')}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              disabled={isLoading}
              variants={socialButtonVariants}
              custom={0}
              whileHover="hover"
              whileTap="tap"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                  <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                  <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                  <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                  <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                </g>
              </svg>
              Continue with Google
            </motion.button>
            
            <motion.button
              type="button"
              onClick={() => handleSocialAuth('facebook')}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              disabled={isLoading}
              variants={socialButtonVariants}
              custom={1}
              whileHover="hover"
              whileTap="tap"
            >
              <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
              </svg>
              Continue with Facebook
            </motion.button>
            
            <motion.button
              type="button"
              onClick={() => handleSocialAuth('apple')}
              className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              disabled={isLoading}
              variants={socialButtonVariants}
              custom={2}
              whileHover="hover"
              whileTap="tap"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zm3.556-2.995c.831-1.014 1.39-2.428 1.234-3.831-1.193.052-2.65.805-3.506 1.818-.77.896-1.443 2.33-1.26 3.7 1.331.104 2.692-.688 3.532-1.687z" />
              </svg>
              Continue with Apple
            </motion.button>
          </div>
        </div>
        
        <motion.div 
          className="mt-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <motion.span whileHover={{ scale: 1.05 }}>
              <Link href="/signup" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                Sign up
              </Link>
            </motion.span>
          </p>
        </motion.div>
      </motion.div>
    </AuthLayout>
  );
}
