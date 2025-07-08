"use client"

import { useState } from "react"

export default function ClearDataPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")

  const clearData = async () => {
    setIsLoading(true)
    setMessage("")
    
    try {
      const response = await fetch("/api/clear-data", {
        method: "POST",
      })
      
      if (response.ok) {
        setMessage("Data cleared successfully! You can now test Google sign-in.")
      } else {
        setMessage("Failed to clear data.")
      }
    } catch (error) {
      setMessage("Error clearing data.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-2xl font-extrabold text-gray-900">
            Clear Test Data
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            This will clear all existing user data to resolve the OAuthAccountNotLinked error.
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={clearData}
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {isLoading ? "Clearing..." : "Clear All User Data"}
          </button>

          {message && (
            <div className={`p-4 rounded-md text-sm ${
              message.includes("successfully") 
                ? "bg-green-50 border border-green-200 text-green-700" 
                : "bg-red-50 border border-red-200 text-red-700"
            }`}>
              {message}
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-900 mb-2">
              ⚠️ Warning
            </h3>
            <p className="text-xs text-yellow-700">
              This will delete all user data from Firestore. Only use this for testing purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
} 