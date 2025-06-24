import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { createAppleAuth } from "@/lib/apple-auth"
import AppleProvider from "next-auth/providers/apple"
import { withAuth } from "next-auth/middleware"
import { DefaultSession, DefaultUser } from "next-auth"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    AppleProvider({
      clientId: process.env.APPLE_ID_CLIENT_ID!,
      clientSecret: process.env.APPLE_ID_PRIVATE_KEY!,
      authorization: {
        params: {
          scope: "name email",
          response_mode: "form_post",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.provider = account.provider
      }
      if (user) {
        token.id = user.id
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user.id = token.id as string
      session.user.emailVerified = token.emailVerified as Date | null
      return session
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "apple") {
        // Handle Apple-specific sign-in logic
        try {
          const appleAuth = createAppleAuth()
          
          // If we have an authorization code, exchange it for tokens
          if (account.code) {
            const redirectUri = `${process.env.NEXTAUTH_URL}/api/auth/callback/apple`
            const tokens = await appleAuth.exchangeCodeForTokens(
              account.code,
              redirectUri
            )
            
            // Store the refresh token for later use
            account.refresh_token = tokens.refresh_token
            account.access_token = tokens.access_token
          }
          
          // Verify the ID token if available
          if (account.id_token) {
            const userInfo = await appleAuth.verifyIdToken(account.id_token)
            
            // Update user information if needed
            if (userInfo.email && !user.email) {
              user.email = userInfo.email
            }
            
            if (userInfo.name && !user.name) {
              user.name = `${userInfo.name.firstName || ""} ${userInfo.name.lastName || ""}`.trim()
            }
          }
          
          return true
        } catch (error) {
          console.error("Apple sign-in error:", error)
          return false
        }
      }
      
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }

export const config = { matcher: ["/dashboard/:path*"] }

declare module "next-auth" {
  interface Session {
    user: { id: string; email: string; name?: string | null; image?: string | null; emailVerified?: Date | null } & DefaultSession["user"];
  }
  interface User extends DefaultUser { emailVerified?: Date | null }
} 