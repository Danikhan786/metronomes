"use client"

import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AppleSignInButton from "@/components/auth/apple-signin-button"
import GoogleSignInButton from "@/components/auth/google-signin-button"
import { Apple, LogIn } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  useEffect(() => {
    // Check if user is already signed in
    getSession().then((session) => {
      if (session) {
        router.push("/")
      } else {
        setIsLoading(false)
      }
    })
  }, [router])

  const handleAppleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await signIn("apple", {
        callbackUrl: "/",
        redirect: true,
      })
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Sign in error:", error)
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError(null)
    try {
      await signIn("google", {
        callbackUrl: "/",
        redirect: true,
      })
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Google sign in error:", error)
      setIsGoogleLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-black mb-4">
            <Apple className="h-8 w-8 text-white" />
          </div> */}
          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 px-4">
            Use your Apple ID or Google account to continue
          </p>
        </div>

        <div className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <AppleSignInButton
              onClick={handleAppleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="w-full"
              size="lg"
            />
            <GoogleSignInButton
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className="w-full"
              size="lg"
            />

            <div className="text-center px-4">
              <p className="text-xs text-gray-500 leading-relaxed">
                By signing in, you agree to our{" "}
                <a href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                  Privacy Policy
                </a>
              </p>
            </div>

            <div className="text-center">
              <a
                href="/clear-data"
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Having trouble? Clear test data
              </a>
            </div>
          </div>
        </div>

        {/* Mobile-specific features */}
        {/* <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mx-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">
              📱 Mobile Optimized
            </h3>
            <p className="text-xs text-blue-700">
              This sign-in experience is optimized for mobile devices and works seamlessly across all screen sizes.
            </p>
          </div>
        </div> */}
      </div>
    </div>
  )
} 