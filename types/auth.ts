import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      emailVerified?: Date | null
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    emailVerified?: Date | null
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string
    emailVerified?: Date | null
  }
}

export interface AppleAuthConfig {
  clientId: string
  teamId: string
  privateKey: string
  keyId: string
}

export interface AppleTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token: string
  id_token: string
}

export interface AppleUserInfo {
  sub: string // User's unique identifier
  email?: string
  email_verified?: string
  name?: {
    firstName?: string
    lastName?: string
  }
  is_private_email?: string
} 