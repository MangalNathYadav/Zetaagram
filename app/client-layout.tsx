"use client";

import { PageTransition } from "@/components/ui/page-transition";
import { AuthProvider } from "@/contexts/auth-context";
import { Toaster } from "@/components/ui/toaster";

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <PageTransition>
        {children}
      </PageTransition>
      <div className="hide-scrollbar">
        {/* This class helps hide scrollbar on story list */}
      </div>
      <div id="portal-root" />
      <Toaster />
    </AuthProvider>
  );
}
