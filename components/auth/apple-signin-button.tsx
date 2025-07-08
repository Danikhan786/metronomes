"use client"

import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"
import { Apple } from "lucide-react"

interface AppleSignInButtonProps {
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  onClick?: () => void | Promise<void>
  disabled?: boolean
}

export default function AppleSignInButton({
  className = "",
  variant = "default",
  size = "md",
  onClick,
  disabled = false,
}: AppleSignInButtonProps) {
  const { data: session, status } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    if (onClick) {
      await onClick()
      return
    }
    
    setIsLoading(true)
    try {
      await signIn("apple", {
        callbackUrl: "/",
      })
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = async () => {
    setIsLoading(true)
    try {
      await signOut({
        callbackUrl: "/",
      })
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background touch-manipulation"

  const variantClasses = {
    default: "bg-black text-white hover:bg-gray-800 active:bg-gray-900",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
    ghost: "hover:bg-accent hover:text-accent-foreground active:bg-accent/80",
  }

  const sizeClasses = {
    sm: "h-9 px-3 text-sm min-h-[36px]",
    md: "h-10 px-4 py-2 min-h-[40px]",
    lg: "h-11 px-8 min-h-[44px]",
  }

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  if (status === "loading") {
    return (
      <button
        className={`${buttonClasses} opacity-50`}
        disabled
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
        <span className="hidden sm:inline">Loading...</span>
        <span className="sm:hidden">...</span>
      </button>
    )
  }

  if (session) {
    return (
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
          Welcome, {session.user?.name || session.user?.email}
        </span>
        <button
          onClick={handleSignOut}
          disabled={isLoading || disabled}
          className={buttonClasses}
        >
          {/* {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
          ) : (
            // <Apple className="mr-2 h-4 w-4" />
          )} */}
          <span className="hidden sm:inline">Sign Out</span>
          <span className="sm:hidden">Out</span>
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isLoading || disabled}
      className={buttonClasses}
    >
      {isLoading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      ) : (
        <Apple className="mr-2 h-4 w-4" />
      )}
      <span className="hidden sm:inline">Sign in with Apple</span>
      <span className="sm:hidden">Apple</span>
    </button>
  )
} 