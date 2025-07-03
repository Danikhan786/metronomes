'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-2xl font-bold">Something went wrong!</h2>
              <p className="mt-2 text-sm text-gray-600">
                {error.message || "An unexpected error occurred"}
              </p>
              <button
                onClick={() => reset()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}