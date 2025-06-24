"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import AppleSignInButton from "@/components/auth/apple-signin-button"

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <div className="px-0 sm:px-0">
          <div className="bg-white shadow rounded-lg p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
              <AppleSignInButton variant="outline" size="sm" />
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h2 className="text-lg font-medium text-gray-900 mb-2">
                  Welcome, {session.user?.name || session.user?.email}!
                </h2>
                <p className="text-gray-600 text-sm">
                  You have successfully signed in with Apple.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-blue-900 mb-3">
                    User Information
                  </h3>
                  <div className="space-y-2 text-sm text-blue-800">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium">Email:</span>
                      <span className="break-all">{session.user?.email || "Not provided"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium">Name:</span>
                      <span>{session.user?.name || "Not provided"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium">Email Verified:</span>
                      <span>{session.user?.emailVerified ? "Yes" : "No"}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium">User ID:</span>
                      <span className="break-all text-xs">{session.user?.id}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-medium text-green-900 mb-3">
                    Session Information
                  </h3>
                  <div className="space-y-2 text-sm text-green-800">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium">Provider:</span>
                      <span>Apple</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium">Status:</span>
                      <span className="text-green-600 font-medium">Authenticated</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
                      <span className="font-medium">Session ID:</span>
                      <span className="break-all text-xs">{session.user?.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-yellow-900 mb-2">
                  Next Steps
                </h3>
                <p className="text-yellow-800 text-sm leading-relaxed">
                  This is a protected page. You can now implement your application's features here.
                  The user is authenticated and their information is available in the session.
                </p>
              </div>

              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-purple-900 mb-2">
                  📱 Mobile Features
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-purple-800">
                  <div>
                    <h4 className="font-medium mb-2">Responsive Design</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Optimized for all screen sizes</li>
                      <li>• Touch-friendly buttons</li>
                      <li>• Mobile-first layout</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Apple Integration</h4>
                    <ul className="space-y-1 text-xs">
                      <li>• Native Apple Sign-In</li>
                      <li>• Secure token handling</li>
                      <li>• Cross-device sync</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 