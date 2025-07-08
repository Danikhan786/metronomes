"use client"

import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface GoogleSignInButtonProps {
  onClick?: () => void
  disabled?: boolean
  className?: string
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export default function GoogleSignInButton({
  onClick,
  disabled = false,
  className,
  size = "default",
  variant = "outline"
}: GoogleSignInButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    if (onClick) {
      onClick()
      return
    }

    setIsLoading(true)
    try {
      await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      })
    } catch (error) {
      console.error("Google sign in error:", error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={cn(
        "w-full flex items-center justify-center gap-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-100",
        className
      )}
      size={size}
      variant={variant}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_17_40)">
          <path d="M23.766 12.2765C23.766 11.4608 23.6989 10.6717 23.5738 9.90918H12.24V14.0511H18.7116C18.4296 15.5565 17.5667 16.8132 16.3121 17.6613V20.139H20.155C22.2222 18.2308 23.766 15.4916 23.766 12.2765Z" fill="#4285F4"/>
          <path d="M12.24 24C15.2976 24 17.8847 23.0057 20.155 20.139L16.3121 17.6613C15.0995 18.4892 13.5537 19.0008 12.24 19.0008C9.27998 19.0008 6.80498 16.9647 5.91209 14.3236H1.93213V16.8723C4.19236 20.4376 7.91598 24 12.24 24Z" fill="#34A853"/>
          <path d="M5.91209 14.3236C5.68209 13.7978 5.54836 13.2272 5.54836 12.6316C5.54836 12.036 5.68209 11.4654 5.91209 10.9396V8.39105H1.93213C1.176 9.7896 0.75 11.3492 0.75 12.9999C0.75 14.6507 1.176 16.2103 1.93213 17.6088L5.91209 14.3236Z" fill="#FBBC05"/>
          <path d="M12.24 6.99908C13.6932 6.99908 15.0012 7.50436 16.0112 8.46227L20.2292 4.24427C17.8847 2.11964 15.2976 1 12.24 1C7.91598 1 4.19236 4.56236 1.93213 8.39105L5.91209 10.9396C6.80498 8.29855 9.27998 6.99908 12.24 6.99908Z" fill="#EA4335"/>
        </g>
        <defs>
          <clipPath id="clip0_17_40">
            <rect width="24" height="24" fill="white"/>
          </clipPath>
        </defs>
      </svg>
      {isLoading ? "Signing in..." : "Sign in with Google"}
    </Button>
  )
} 