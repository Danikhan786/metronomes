"use client"

import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AppleSignInButton from "@/components/auth/apple-signin-button"
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
      const result = await signIn("apple", {
        callbackUrl: "/",
        redirect: false,
      })
      if (result?.error) {
        setError("Sign in failed. Please try again.")
      } else if (result?.ok) {
        router.push("/")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Sign in error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError(null)
    try {
      const result = await signIn("google", {
        callbackUrl: "/",
        redirect: false,
      })
      if (result?.error) {
        setError("Google sign in failed. Please try again.")
      } else if (result?.ok) {
        router.push("/")
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      console.error("Google sign in error:", error)
    } finally {
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
            <button
              onClick={handleGoogleSignIn}
              disabled={isLoading || isGoogleLoading}
              className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 font-medium shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${isGoogleLoading ? "animate-pulse" : ""}`}
              style={{ minHeight: 48 }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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
              {isGoogleLoading ? "Signing in..." : "Sign in with Google"}
            </button>

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