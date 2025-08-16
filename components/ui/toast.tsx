"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number; // in milliseconds
  onClose?: () => void;
  isVisible: boolean;
}

const toastTypeStyles = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
  warning: "bg-yellow-500",
};

export function Toast({
  message,
  type = "info",
  duration = 3000,
  onClose,
  isVisible,
}: ToastProps) {
  const [visible, setVisible] = useState(isVisible);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 200); // Wait for exit animation to complete
  }, [onClose]);

  useEffect(() => {
    setVisible(isVisible);
    
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, handleClose]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className={`fixed bottom-5 right-5 z-50 flex items-center min-w-[300px] p-4 rounded-lg shadow-lg text-white ${toastTypeStyles[type]}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
          role="alert"
          aria-live="assertive"
        >
          <div className="flex-1">{message}</div>
          <button 
            onClick={handleClose} 
            className="ml-3 p-1 rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close notification"
          >
            <X size={18} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Create a container for toasts to live outside the component hierarchy
export function ToastContainer() {
  return <div id="toast-container" className="fixed bottom-5 right-5 z-50" />;
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Array<{ id: string; props: ToastProps }>>([]);

  const show = useCallback((message: string, type: ToastType = "info", duration: number = 3000) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    setToasts((prevToasts) => [
      ...prevToasts,
      {
        id,
        props: {
          message,
          type,
          duration,
          isVisible: true,
          onClose: () => {
            setToasts((prevToasts) => prevToasts.filter(toast => toast.id !== id));
          }
        }
      }
    ]);

    return id;
  }, []);

  const close = useCallback((id: string) => {
    setToasts((prevToasts) => 
      prevToasts.map(toast => 
        toast.id === id 
          ? { ...toast, props: { ...toast.props, isVisible: false } }
          : toast
      )
    );
  }, []);

  const Toasts = useCallback(() => (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map(({ id, props }) => (
          <Toast key={id} {...props} />
        ))}
      </AnimatePresence>
    </div>
  ), [toasts]);

  return { show, close, Toasts };
};
