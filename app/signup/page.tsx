"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOffIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
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
  },
  exit: {
    opacity: 0,
    x: '-100vw',
    transition: { ease: "easeInOut" as const }
  }
};

const formVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 24,
      staggerChildren: 0.07
    }
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: { ease: "easeInOut" as const }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
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

const progressVariants = {
  hidden: { width: 0 },
  visible: (strength: number) => ({
    width: `${(strength / 5) * 100}%`,
    transition: { duration: 0.5, type: "tween" as const }
  })
};

interface FormData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const { signUp, signInWithGoogle, showAuthToast } = useAuth();
  const router = useRouter();
  
  // Password strength indicator
  const getPasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 1;
    
    // Uppercase check
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Lowercase check
    if (/[a-z]/.test(password)) strength += 1;
    
    // Number check
    if (/[0-9]/.test(password)) strength += 1;
    
    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    return strength;
  };
  
  const passwordStrength = getPasswordStrength(formData.password);
  
  const getStrengthLabel = (strength: number): { label: string; color: string } => {
    switch (strength) {
      case 0:
        return { label: "Very Weak", color: "bg-red-500" };
      case 1:
        return { label: "Weak", color: "bg-red-500" };
      case 2:
        return { label: "Fair", color: "bg-yellow-500" };
      case 3:
        return { label: "Good", color: "bg-yellow-500" };
      case 4:
        return { label: "Strong", color: "bg-green-500" };
      case 5:
        return { label: "Very Strong", color: "bg-green-500" };
      default:
        return { label: "", color: "" };
    }
  };
  
  const strengthInfo = getStrengthLabel(passwordStrength);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear the specific error when field is changed
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };
  
  const validateStep1 = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    
    return true;
  };
  
  const validateStep2 = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength < 3) {
      newErrors.password = "Password is too weak";
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    
    if (!agreedToTerms) {
      newErrors.confirmPassword = "You must agree to the Terms of Service";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    
    return true;
  };
  
  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };
  
  const handleBack = () => {
    setStep(1);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      handleNext();
      return;
    }
    
    if (!validateStep2()) {
      return;
    }
    
    // Show loading state
    setIsLoading(true);
    
    try {
      // Create user account with Firebase
      const user = await signUp(formData.email, formData.password, {
        displayName: formData.fullName,
        username: formData.username
      });
      
      showAuthToast("Account created successfully!", "success");
      router.push("/home");
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle different Firebase auth errors
      if (error.code === "auth/email-already-in-use") {
        setErrors({ email: "Email is already in use" });
        setStep(1); // Go back to first step to fix email
      } else if (error.code === "auth/invalid-email") {
        setErrors({ email: "Invalid email format" });
        setStep(1);
      } else if (error.code === "auth/weak-password") {
        setErrors({ password: "Password is too weak" });
      } else {
        showAuthToast(error.message || "Failed to create account", "error");
      }
      
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 1 ? "Create Account" : "Almost Done"}
      subtitle={step === 1 ? "Sign up to get started with Zetagram" : "Set up your login credentials"}
      illustrationSide="right"
    >
      <motion.div
        className="w-full max-w-md"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            className="flex justify-between mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex space-x-1">
              <motion.div 
                className={`h-1 w-8 rounded-full ${step === 1 ? "bg-blue-500" : "bg-gray-300"}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div 
                className={`h-1 w-8 rounded-full ${step === 2 ? "bg-blue-500" : "bg-gray-300"}`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
            <motion.span 
              className="text-xs text-gray-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Step {step} of 2
            </motion.span>
          </motion.div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={errors.fullName}
                  placeholder="John Doe"
                  disabled={isLoading}
                  icon="user"
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="your.email@example.com"
                  disabled={isLoading}
                  icon="mail"
                />
              </motion.div>
            </motion.div>
          )}

          {/* Step 2: Credentials */}
          {step === 2 && (
            <motion.div
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <FormInput
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  error={errors.username}
                  placeholder="cooluser123"
                  disabled={isLoading}
                  icon="at-sign"
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                    placeholder="Choose a strong password"
                    disabled={isLoading}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </motion.button>
                </div>
                
                {formData.password && (
                  <motion.div 
                    className="mt-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">Password strength:</span>
                      <motion.span 
                        className="text-xs font-medium"
                        style={{ color: strengthInfo.color.replace('bg-', 'text-') }}
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" as const, stiffness: 300, damping: 10 }}
                      >
                        {strengthInfo.label}
                      </motion.span>
                    </div>
                    <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${strengthInfo.color}`}
                        variants={progressVariants}
                        initial="hidden" 
                        animate="visible"
                        custom={passwordStrength}
                      />
                    </div>
                  </motion.div>
                )}
                
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
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pr-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                  </motion.button>
                </div>
                
                {errors.confirmPassword && (
                  <motion.p 
                    className="text-sm text-red-500 mt-1"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                  >
                    {errors.confirmPassword}
                  </motion.p>
                )}
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-center">
                <motion.input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isLoading}
                  whileTap={{ scale: 0.9 }}
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <motion.span whileHover={{ scale: 1.05 }}>
                    <Link href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                      Terms of Service
                    </Link>
                  </motion.span>
                  {' '}and{' '}
                  <motion.span whileHover={{ scale: 1.05 }}>
                    <Link href="#" className="text-blue-600 hover:text-blue-800 hover:underline">
                      Privacy Policy
                    </Link>
                  </motion.span>
                </label>
              </motion.div>
            </motion.div>
          )}
          
          <motion.div 
            className="flex justify-between gap-3"
            variants={itemVariants}
          >
            {step === 2 ? (
              <motion.button
                type="button"
                onClick={handleBack}
                disabled={isLoading}
                className="px-3 sm:px-4 flex-shrink-0 border border-gray-300 rounded-md text-gray-700 font-medium h-10 flex items-center"
                whileHover={{ scale: 1.03, backgroundColor: "#f9fafb" }}
                whileTap={{ scale: 0.97 }}
              >
                <ChevronLeftIcon size={16} className="sm:mr-1" />
                <span className="hidden sm:inline">Back</span>
              </motion.button>
            ) : (
              <div></div> // Empty div to maintain spacing with flex justify-between
            )}
            
            <motion.button
              type={step === 2 ? "submit" : "button"}
              onClick={step === 1 ? handleNext : undefined}
              className={`flex-1 ${step === 1 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gradient-to-r from-[#FF6B6B] to-[#4ECDC4] hover:from-[#FF5A5A] hover:to-[#3DBCB3]'} text-white px-3 sm:px-6 h-10 rounded-md font-medium flex items-center justify-center`}
              disabled={isLoading}
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-sm sm:text-base">{step === 1 ? "Processing..." : "Creating account..."}</span>
                </div>
              ) : (
                <>
                  {step === 1 ? (
                    <>
                      <span>Next</span>
                      <motion.div
                        initial={{ x: 0 }}
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.8 }}
                      >
                        <ChevronRightIcon size={16} className="ml-1" />
                      </motion.div>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
        
        {step === 1 && (
          <>
            <motion.div 
              className="mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <motion.div 
                    className="w-full border-t border-gray-300"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  ></motion.div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <motion.span 
                    className="px-2 bg-white text-gray-500"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Or sign up with
                  </motion.span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-3 mt-3">
                <motion.button
                  type="button"
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      await signInWithGoogle();
                      showAuthToast("Successfully signed up with Google!", "success");
                      router.push("/home");
                    } catch (error: any) {
                      showAuthToast(error.message || "Failed to sign up with Google", "error");
                      setIsLoading(false);
                    }
                  }}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  disabled={isLoading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.7,
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={{ scale: 1.03, backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                      <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                      <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                      <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
                    </g>
                  </svg>
                  Sign up with Google
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={() => showAuthToast("Facebook signup coming soon!", "info")}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  disabled={isLoading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.8,
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={{ scale: 1.03, backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                    <path d="M9.19795 21.5H13.198V13.4901H16.8021L17.198 9.50977H13.198V7.5C13.198 6.94772 13.6457 6.5 14.198 6.5H17.198V2.5H14.198C11.4365 2.5 9.19795 4.73858 9.19795 7.5V9.50977H7.19795L6.80206 13.4901H9.19795V21.5Z" />
                  </svg>
                  Sign up with Facebook
                </motion.button>
                
                <motion.button
                  type="button"
                  onClick={() => showAuthToast("Apple signup coming soon!", "info")}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                  disabled={isLoading}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.9,
                    type: "spring" as const,
                    stiffness: 300,
                    damping: 20
                  }}
                  whileHover={{ scale: 1.03, backgroundColor: "#f9fafb" }}
                  whileTap={{ scale: 0.97 }}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zm3.556-2.995c.831-1.014 1.39-2.428 1.234-3.831-1.193.052-2.65.805-3.506 1.818-.77.896-1.443 2.33-1.26 3.7 1.331.104 2.692-.688 3.532-1.687z" />
                  </svg>
                  Sign up with Apple
                </motion.button>
              </div>
            </motion.div>
            
            <motion.div 
              className="mt-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <motion.span whileHover={{ scale: 1.05 }}>
                  <Link href="/login" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">
                    Log in
                  </Link>
                </motion.span>
              </p>
            </motion.div>
          </>
        )}
      </motion.div>
    </AuthLayout>
  );
}
