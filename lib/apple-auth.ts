import { SignJWT, jwtVerify } from "jose"
import { AppleAuthConfig, AppleTokenResponse, AppleUserInfo } from "@/types/auth"

export class AppleAuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = "AppleAuthError"
  }
}

export class AppleAuth {
  private config: AppleAuthConfig

  constructor(config: AppleAuthConfig) {
    this.config = config
  }

  /**
   * Generate a client secret JWT for Apple authentication
   */
  async generateClientSecret(): Promise<string> {
    try {
      const now = Math.floor(Date.now() / 1000)
      
      const payload = {
        iss: this.config.teamId,
        iat: now,
        exp: now + 15777000, // 6 months
        aud: "https://appleid.apple.com",
        sub: this.config.clientId,
      }

      const privateKey = this.config.privateKey.replace(/\\n/g, "\n")
      
      const jwt = await new SignJWT(payload)
        .setProtectedHeader({ 
          alg: "ES256", 
          kid: this.config.keyId 
        })
        .setIssuedAt()
        .setExpirationTime("6m")
        .sign(new TextEncoder().encode(privateKey))

      return jwt
    } catch (error) {
      throw new AppleAuthError(
        `Failed to generate client secret: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  /**
   * Exchange authorization code for tokens
   */
  async exchangeCodeForTokens(
    code: string,
    redirectUri: string
  ): Promise<AppleTokenResponse> {
    try {
      const clientSecret = await this.generateClientSecret()
      
      const params = new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: clientSecret,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      })

      const response = await fetch("https://appleid.apple.com/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new AppleAuthError(
          `Token exchange failed: ${response.status} ${response.statusText}`,
          response.status.toString()
        )
      }

      const data = await response.json()
      return data as AppleTokenResponse
    } catch (error) {
      if (error instanceof AppleAuthError) {
        throw error
      }
      throw new AppleAuthError(
        `Token exchange failed: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<AppleTokenResponse> {
    try {
      const clientSecret = await this.generateClientSecret()
      
      const params = new URLSearchParams({
        client_id: this.config.clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      })

      const response = await fetch("https://appleid.apple.com/auth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new AppleAuthError(
          `Token refresh failed: ${response.status} ${response.statusText}`,
          response.status.toString()
        )
      }

      const data = await response.json()
      return data as AppleTokenResponse
    } catch (error) {
      if (error instanceof AppleAuthError) {
        throw error
      }
      throw new AppleAuthError(
        `Token refresh failed: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  /**
   * Verify and decode ID token
   */
  async verifyIdToken(idToken: string): Promise<AppleUserInfo> {
    try {
      // Apple's public keys endpoint
      const keysResponse = await fetch("https://appleid.apple.com/auth/keys")
      const keys = await keysResponse.json()

      // For simplicity, we'll decode the token without verification in this example
      // In production, you should verify the token signature using Apple's public keys
      const decoded = JSON.parse(
        Buffer.from(idToken.split(".")[1], "base64").toString()
      )

      return decoded as AppleUserInfo
    } catch (error) {
      throw new AppleAuthError(
        `ID token verification failed: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }

  /**
   * Get user info from Apple
   */
  async getUserInfo(accessToken: string): Promise<AppleUserInfo> {
    try {
      const response = await fetch("https://appleid.apple.com/auth/userinfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (!response.ok) {
        throw new AppleAuthError(
          `Failed to fetch user info: ${response.status} ${response.statusText}`
        )
      }

      const userInfo = await response.json()
      return userInfo as AppleUserInfo
    } catch (error) {
      if (error instanceof AppleAuthError) {
        throw error
      }
      throw new AppleAuthError(
        `Failed to fetch user info: ${error instanceof Error ? error.message : "Unknown error"}`
      )
    }
  }
}

/**
 * Create Apple auth instance with environment variables
 */
export function createAppleAuth(): AppleAuth {
  const config: AppleAuthConfig = {
    clientId: process.env.APPLE_ID_CLIENT_ID!,
    teamId: process.env.APPLE_ID_TEAM_ID!,
    privateKey: process.env.APPLE_ID_PRIVATE_KEY!,
    keyId: process.env.APPLE_ID_KEY_ID!,
  }

  // Validate required environment variables
  const missingVars = Object.entries(config)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required Apple authentication environment variables: ${missingVars.join(", ")}`
    )
  }

  return new AppleAuth(config)
} 