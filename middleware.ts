import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Add custom middleware logic here if needed
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
)

export const config = {
  matcher: [
    // Protect the home page
    "/",
    // Protect all routes under /dashboard
    "/dashboard/:path*",
    // Add other protected routes here
    // "/admin/:path*",
    // "/profile/:path*",
  ],
} 