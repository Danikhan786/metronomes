"use client"

import { useMobile } from "@/hooks/use-mobile"
import AppleSignInButton from "./apple-signin-button"

interface MobileAuthButtonProps {
  className?: string
}

export default function MobileAuthButton({ className = "" }: MobileAuthButtonProps) {
  const { isMobile, isTablet } = useMobile()

  // Different positioning based on device type
  const getPositionClasses = () => {
    if (isMobile) {
      return "fixed top-2 right-2 z-50"
    } else if (isTablet) {
      return "absolute top-4 right-4 z-10"
    } else {
      return "absolute top-4 right-4 z-10"
    }
  }

  const getButtonSize = (): "sm" | "md" | "lg" => {
    if (isMobile) {
      return "sm"
    } else {
      return "sm"
    }
  }

  return (
    <div className={`${getPositionClasses()} ${className}`}>
      <AppleSignInButton 
        variant="outline" 
        size={getButtonSize()}
        className={isMobile ? "shadow-lg" : ""}
      />
    </div>
  )
} 