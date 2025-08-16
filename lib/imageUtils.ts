"use client";

/**
 * Utilities for handling image uploads and Base64 conversion for Firebase Realtime Database
 * Since Firebase RTDB doesn't directly support binary data, we use Base64 encoding
 */

/**
 * Converts a file to a Base64 string
 * @param file - The file to convert to Base64
 * @returns A promise that resolves to the Base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data:image/jpeg;base64, prefix from the base64 string
      const base64 = reader.result as string;
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Converts a Base64 string to a Blob object
 * @param base64 - The Base64 string to convert
 * @returns A Blob created from the Base64 string
 */
export const base64ToBlob = (base64: string): Blob => {
  // Extract content type and base64 data
  const [metaData, base64Data] = base64.split(',');
  const contentType = metaData.match(/:(.*?);/)?.[1] || 'image/jpeg';
  
  // Convert base64 to binary
  const binaryString = atob(base64Data);
  const bytes = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  
  return new Blob([bytes], { type: contentType });
};

/**
 * Optimizes an image by resizing and compressing it before Base64 conversion
 * @param file - The image file to optimize
 * @param maxWidth - Maximum width of the optimized image
 * @param quality - JPEG quality (0-1)
 * @returns A promise that resolves to the optimized Base64 string
 */
export const optimizeImage = (file: File, maxWidth = 1200, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions while maintaining aspect ratio
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with specified quality
        const optimizedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(optimizedBase64);
      };
      
      img.onerror = reject;
    };
    
    reader.onerror = reject;
  });
};

/**
 * Calculates the size of a Base64 string in bytes
 * @param base64 - The Base64 string
 * @returns The size in bytes
 */
export const getBase64Size = (base64: string): number => {
  const base64Data = base64.split(',')[1] || base64;
  return Math.ceil((base64Data.length * 3) / 4);
};

/**
 * Formats file size in a human-readable format
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
