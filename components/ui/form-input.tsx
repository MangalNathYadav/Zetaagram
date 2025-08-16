"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, Mail, AtSign, Lock, CreditCard, Home, 
  MapPin, Calendar, Phone, Info 
} from "lucide-react";

type IconName = 
  | "user"
  | "mail"
  | "at-sign"
  | "lock"
  | "credit-card"
  | "home"
  | "map-pin"
  | "calendar"
  | "phone"
  | "info";

interface FormInputProps {
  label: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  icon?: IconName;
}

export function FormInput({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  disabled = false,
  icon,
}: FormInputProps) {
  const [focused, setFocused] = useState(false);
  
  const getIcon = (iconName: IconName) => {
    const iconProps = { size: 16, className: "text-gray-500" };
    
    switch (iconName) {
      case "user":
        return <User {...iconProps} />;
      case "mail":
        return <Mail {...iconProps} />;
      case "at-sign":
        return <AtSign {...iconProps} />;
      case "lock":
        return <Lock {...iconProps} />;
      case "credit-card":
        return <CreditCard {...iconProps} />;
      case "home":
        return <Home {...iconProps} />;
      case "map-pin":
        return <MapPin {...iconProps} />;
      case "calendar":
        return <Calendar {...iconProps} />;
      case "phone":
        return <Phone {...iconProps} />;
      case "info":
      default:
        return <Info {...iconProps} />;
    }
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={name || label.toLowerCase().replace(/\s+/g, '-')}
        className="text-sm font-medium"
      >
        {label}
      </Label>
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            {getIcon(icon)}
          </div>
        )}
        
        <Input
          id={name || label.toLowerCase().replace(/\s+/g, '-')}
          name={name || label.toLowerCase().replace(/\s+/g, '-')}
          type={type}
          value={value}
          onChange={onChange}
          className={`
            ${icon ? "pl-10" : ""} 
            ${error ? "border-red-500 focus:ring-red-500" : ""}
            transition-all duration-200
            ${focused ? "border-blue-500 ring-2 ring-blue-100" : ""}
          `}
          placeholder={placeholder}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        
        {!error && value && !disabled && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="2"/>
              <path d="M5 8L7 10L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </motion.div>
        )}
      </div>
      
      {error && (
        <motion.p 
          className="text-sm text-red-500 mt-1"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
