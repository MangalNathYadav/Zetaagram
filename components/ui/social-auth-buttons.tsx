"use client";

import { motion } from "framer-motion";

export function SocialAuthButtons() {
  const socialButtons = [
    {
      name: "Google",
      label: "Google",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#clip0_google)">
            <path d="M19.9895 10.1871C19.9895 9.36767 19.9214 8.76973 19.7742 8.14966H10.1992V11.848H15.8195C15.7062 12.7671 15.0943 14.1512 13.7346 15.0813L13.7155 15.2051L16.7429 17.4969L16.9527 17.5174C18.879 15.7789 19.9895 13.221 19.9895 10.1871Z" fill="#4285F4"/>
            <path d="M10.1993 19.9313C12.9527 19.9313 15.2643 19.0454 16.9527 17.5174L13.7346 15.0813C12.8734 15.6682 11.7176 16.0779 10.1993 16.0779C7.50243 16.0779 5.21352 14.3395 4.39759 11.9366L4.27799 11.9466L1.13003 14.3273L1.08887 14.4391C2.76588 17.6945 6.21061 19.9313 10.1993 19.9313Z" fill="#34A853"/>
            <path d="M4.39748 11.9366C4.18219 11.3166 4.05759 10.6521 4.05759 9.96565C4.05759 9.27909 4.18219 8.61473 4.38615 7.99466L4.38045 7.8626L1.19304 5.44366L1.08875 5.49214C0.397576 6.84305 0.000976562 8.36008 0.000976562 9.96565C0.000976562 11.5712 0.397576 13.0882 1.08875 14.4391L4.39748 11.9366Z" fill="#FBBC05"/>
            <path d="M10.1993 3.85336C12.1142 3.85336 13.406 4.66168 14.1425 5.33718L17.0207 2.59107C15.253 0.985496 12.9527 0 10.1993 0C6.2106 0 2.76588 2.23672 1.08887 5.49214L4.38626 7.99466C5.21352 5.59183 7.50242 3.85336 10.1993 3.85336Z" fill="#EB4335"/>
          </g>
          <defs>
            <clipPath id="clip0_google">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      ),
      bgColor: "bg-white",
      textColor: "text-gray-700",
      borderColor: "border-gray-300",
      hoverColor: "hover:bg-gray-50",
    },
    {
      name: "Apple",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M14.0829 10.0553C14.0908 8.7441 14.7335 7.5296 15.8386 6.8201C15.1611 5.85112 14.0872 5.25291 12.9599 5.15894C11.7587 5.01278 10.5131 5.82913 9.90048 5.82913C9.26822 5.82913 8.23257 5.18139 7.25632 5.20591C5.91845 5.25497 4.69732 5.99339 4.04954 7.15769C2.67349 9.5465 3.71132 13.0759 5.02389 14.975C5.68194 15.9015 6.45913 16.9389 7.47352 16.8981C8.45648 16.8532 8.83509 16.2545 10.0241 16.2545C11.2009 16.2545 11.5549 16.8981 12.5869 16.8715C13.6475 16.8532 14.317 15.9444 14.9504 15.0098C15.4514 14.3091 15.8305 13.5254 16.0709 12.6924C14.7395 12.1175 14.0829 11.1371 14.0829 10.0553Z" fill="currentColor"/>
          <path d="M12.4587 4.01842C13.0298 3.34452 13.3399 2.48836 13.3358 1.6073C12.4706 1.6712 11.6638 2.02137 11.0583 2.59801C10.7663 2.87621 10.5302 3.20595 10.3644 3.56997C10.1986 3.93398 10.1065 4.32597 10.093 4.72426C10.4994 4.72918 10.902 4.64489 11.2724 4.47699C11.6428 4.30909 11.9711 4.06195 12.2337 3.75387L12.4587 4.01842Z" fill="currentColor"/>
        </svg>
      ),
      bgColor: "bg-white",
      textColor: "text-gray-800",
      borderColor: "border-gray-300",
      hoverColor: "hover:bg-gray-50",
    },
    {
      name: "Facebook",
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 10C20 4.47715 15.5229 0 10 0C4.47715 0 0 4.47715 0 10C0 14.9912 3.65684 19.1283 8.4375 19.8785V12.8906H5.89844V10H8.4375V7.79688C8.4375 5.29063 9.93047 3.90625 12.2146 3.90625C13.3084 3.90625 14.4531 4.10156 14.4531 4.10156V6.5625H13.1922C11.95 6.5625 11.5625 7.3334 11.5625 8.125V10H14.3359L13.8926 12.8906H11.5625V19.8785C16.3432 19.1283 20 14.9912 20 10Z" fill="#1877F2"/>
          <path d="M13.8926 12.8906L14.3359 10H11.5625V8.125C11.5625 7.3334 11.95 6.5625 13.1922 6.5625H14.4531V4.10156C14.4531 4.10156 13.3084 3.90625 12.2146 3.90625C9.93047 3.90625 8.4375 5.29063 8.4375 7.79688V10H5.89844V12.8906H8.4375V19.8785C9.47287 20.0405 10.5271 20.0405 11.5625 19.8785V12.8906H13.8926Z" fill="white"/>
        </svg>
      ),
      bgColor: "bg-white",
      textColor: "text-gray-800",
      borderColor: "border-gray-300",
      hoverColor: "hover:bg-gray-50",
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
      {socialButtons.map((button, index) => (
        <motion.button
          key={button.name}
          type="button"
          className={`
            py-2.5 px-2 sm:px-4 flex justify-center items-center 
            ${button.bgColor} ${button.textColor} 
            border ${button.borderColor} rounded-md shadow-sm
            ${button.hoverColor} transition-colors duration-150
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          `}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
        >
          {button.icon}
          <span className="sr-only">Sign in with {button.name}</span>
        </motion.button>
      ))}
    </div>
  );
}
