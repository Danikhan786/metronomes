// app/auth/error/page.tsx
"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"
import { Suspense } from "react"

function AuthErrorPageContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (errorCode: string | null) => {
    switch (errorCode) {
      case "Configuration":
        return "There is a problem with the server configuration."
      case "AccessDenied":
        return "You do not have permission to sign in."
      case "Verification":
        return "The verification token has expired or has already been used."
      case "Default":
      default:
        return "An error occurred during authentication. Please try again."
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mt-6 text-2xl sm:text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600 px-4">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <Link
              href="/auth/signin"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 min-h-[44px] items-center"
            >
              Try Again
            </Link>

            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors duration-200 min-h-[44px] items-center"
            >
              Go Home
            </Link>
          </div>

          {error && (
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mx-4">
              <p className="text-xs text-gray-500 text-center">
                Error Code: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{error}</code>
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mx-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Need Help?</h3>
            <p className="text-xs text-blue-700 mb-3">
              If you're having trouble signing in, try these steps:
            </p>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Check your internet connection</li>
              <li>• Make sure you're using a supported browser</li>
              <li>• Try signing in from a different device</li>
              <li>• Contact support if the problem persists</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <AuthErrorPageContent />
    </Suspense>
  )
}
