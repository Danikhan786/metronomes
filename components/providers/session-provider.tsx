"use client"

import { SessionProvider } from "next-auth/react"
import { ReactNode, useEffect, useState } from "react"
import { getUserSession } from "@/lib/auth-utils"

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check for Laravel session on initial load
    const checkLaravelSession = async () => {
      try {
        const session = await getUserSession();
        
        // If we have a Laravel session but no NextAuth session,
        // we could handle that here (e.g., by creating a NextAuth session)
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking Laravel session:", error);
        setIsLoading(false);
      }
    };
    
    checkLaravelSession();
  }, []);
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>;
  }
  
  return <SessionProvider>{children}</SessionProvider>
} 
