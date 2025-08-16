"use client";

import { useState, useEffect } from "react";

type ValidationRule = {
  validator: (value: string) => boolean;
  message: string;
};

interface ValidationRules {
  [key: string]: ValidationRule[];
}

export function useFormValidation(initialValues: Record<string, string>, validationRules: ValidationRules) {
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form errors when values change
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    // Only validate fields that have been touched
    Object.keys(touched).forEach((fieldName) => {
      if (touched[fieldName] && validationRules[fieldName]) {
        const fieldValue = values[fieldName];
        
        // Check each validation rule
        for (const rule of validationRules[fieldName]) {
          if (!rule.validator(fieldValue)) {
            newErrors[fieldName] = rule.message;
            break;
          }
        }
      }
    });
    
    setErrors(newErrors);
  }, [values, touched, validationRules]);

  // Handle field change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Handle field blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Validate all fields
  const validateAll = () => {
    const newErrors: Record<string, string> = {};
    const allTouched: Record<string, boolean> = {};
    
    // Mark all fields as touched
    Object.keys(values).forEach(fieldName => {
      allTouched[fieldName] = true;
    });
    
    setTouched(allTouched);
    
    // Validate all fields
    Object.keys(validationRules).forEach((fieldName) => {
      const fieldValue = values[fieldName];
      
      for (const rule of validationRules[fieldName]) {
        if (!rule.validator(fieldValue)) {
          newErrors[fieldName] = rule.message;
          break;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (callback: () => void) => {
    return (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      if (validateAll()) {
        callback();
      }
      
      setIsSubmitting(false);
    };
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    validateAll,
    setValues
  };
}
