// app/auth/error/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import { signIn } from "next-auth/react"
import Link from "next/link"

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "OAuthAccountNotLinked":
        return "This email is already associated with another account. Please sign in with the original provider or use a different email."
      case "AccessDenied":
        return "Access denied. Please try signing in again."
      case "Verification":
        return "Verification failed. Please check your email and try again."
      default:
        return "An error occurred during sign in. Please try again."
    }
  }

  const handleTryAgain = () => {
    signIn(undefined, { callbackUrl })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Sign In Error
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            <strong>Error:</strong> {error}
          </div>

          <div className="space-y-4">
            <button
              onClick={handleTryAgain}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Try Again
            </button>
            
            <Link
              href="/auth/signin"
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Sign In
            </Link>
          </div>

          {error === "OAuthAccountNotLinked" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 mb-2">
                💡 Solution
              </h3>
              <p className="text-xs text-blue-700 mb-3">
                This error occurs when you try to sign in with a different provider (Google/Apple) 
                but there's already an account with the same email address.
              </p>
              <div className="space-y-2">
                <p className="text-xs text-blue-700">
                  <strong>Option 1:</strong> Use the same provider you used before (Apple or Google)
                </p>
                <p className="text-xs text-blue-700">
                  <strong>Option 2:</strong> Clear your test data and try again
                </p>
                <a
                  href="/clear-data"
                  className="inline-block text-xs text-blue-600 hover:text-blue-500 underline"
                >
                  Clear Test Data →
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
