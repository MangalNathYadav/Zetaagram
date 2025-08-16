"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface LoadingContextType {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  setLoadingWithTimeout: (timeout?: number) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);
  
  // Automatically stop loading after a timeout
  const setLoadingWithTimeout = (timeout = 1500) => {
    startLoading();
    setTimeout(() => {
      stopLoading();
    }, timeout);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, startLoading, stopLoading, setLoadingWithTimeout }}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
