"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function TestRedirectPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    console.log("Session status:", status)
    console.log("Session data:", session)
    
    if (status === "authenticated") {
      console.log("User is authenticated, redirecting to main page...")
      router.push("/")
    }
  }, [status, session, router])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Testing Redirect</h1>
        <p className="mb-2">Status: {status}</p>
        {session && (
          <div className="text-left">
            <p>User: {session.user?.name || session.user?.email}</p>
            <p>ID: {session.user?.id}</p>
          </div>
        )}
        <button 
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Manual Redirect to Main Page
        </button>
      </div>
    </div>
  )
} 