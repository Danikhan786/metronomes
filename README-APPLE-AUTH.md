# Apple Authentication Setup for Next.js 14

This guide provides a complete implementation of Apple Sign-In for your Next.js 14 application using NextAuth.js.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install next-auth @auth/prisma-adapter prisma @prisma/client jose --legacy-peer-deps
```

### 2. Environment Variables

Create a `.env.local` file in your project root:

```env
# Apple Authentication
APPLE_ID_CLIENT_ID=com.yourcompany.yourapp.web
APPLE_ID_TEAM_ID=YOUR_TEAM_ID
APPLE_ID_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_CONTENT\n-----END PRIVATE KEY-----"
APPLE_ID_KEY_ID=YOUR_KEY_ID

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret

# Database (for Prisma)
DATABASE_URL="file:./dev.db"
```

### 3. Database Setup

```bash
# Initialize Prisma
npx prisma init

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push
```

### 4. Apple Developer Console Setup

#### Step 1: Create App ID
1. Go to [Apple Developer Console](https://developer.apple.com/account/)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Click "Identifiers" → "+" → "App IDs"
4. Select "App" and click "Continue"
5. Fill in:
   - **Description**: Your app name
   - **Bundle ID**: `com.yourcompany.yourapp` (use this as `APPLE_ID_CLIENT_ID`)
6. Scroll down to "Capabilities" and enable "Sign In with Apple"
7. Click "Continue" → "Register"

#### Step 2: Create Service ID
1. In "Identifiers", click "+" → "Services IDs"
2. Fill in:
   - **Description**: Your service name
   - **Identifier**: `com.yourcompany.yourapp.web` (for web)
3. Enable "Sign In with Apple"
4. Click "Configure" next to "Sign In with Apple"
5. Add your domain and redirect URLs:
   - **Primary App ID**: Select your App ID
   - **Domains and Subdomains**: `yourdomain.com`
   - **Return URLs**: 
     - `https://yourdomain.com/api/auth/callback/apple`
     - `http://localhost:3000/api/auth/callback/apple` (for development)
6. Click "Save" → "Continue" → "Register"

#### Step 3: Create Private Key
1. In "Keys", click "+" → "Keys"
2. Fill in:
   - **Key Name**: "Apple Sign In Key"
   - **Key ID**: Note this (use as `APPLE_ID_KEY_ID`)
3. Enable "Sign In with Apple"
4. Click "Configure" → Select your App ID → "Save"
5. Click "Continue" → "Register"
6. **Download the key file** (`.p8` format)
7. **Note the Key ID** (use as `APPLE_ID_KEY_ID`)

#### Step 4: Get Team ID
1. In Apple Developer Console, click your name in the top right
2. Note your "Team ID" (use as `APPLE_ID_TEAM_ID`)

### 5. Convert Private Key

Convert your `.p8` file to the format needed for environment variables:

```bash
# On macOS/Linux
cat AuthKey_YOUR_KEY_ID.p8 | base64

# Or manually format as:
# -----BEGIN PRIVATE KEY-----
# [Your key content]
# -----END PRIVATE KEY-----
```

## 📁 File Structure

```
├── app/
│   ├── api/auth/[...nextauth]/route.ts    # NextAuth configuration
│   ├── auth/
│   │   ├── signin/page.tsx                # Custom sign-in page
│   │   └── error/page.tsx                 # Error page
│   ├── dashboard/page.tsx                 # Protected dashboard
│   └── layout.tsx                         # Root layout with provider
├── components/
│   ├── auth/
│   │   └── apple-signin-button.tsx        # Sign-in button component
│   └── providers/
│       └── session-provider.tsx           # Session provider
├── lib/
│   ├── apple-auth.ts                      # Apple authentication utilities
│   └── prisma.ts                          # Database client
├── types/
│   └── auth.ts                            # TypeScript definitions
├── prisma/
│   └── schema.prisma                      # Database schema
├── middleware.ts                          # Route protection
└── env.example                            # Environment variables template
```

## 🔧 Configuration Details

### NextAuth Configuration (`app/api/auth/[...nextauth]/route.ts`)

```typescript
import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import AppleProvider from "next-auth/providers/apple"

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
      session.user.id = token.id as string
      session.user.emailVerified = token.emailVerified as Date | null
      return session
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
})
```

### Apple Authentication Utilities (`lib/apple-auth.ts`)

The `AppleAuth` class provides:
- JWT client secret generation
- Token exchange
- Token refresh
- ID token verification
- User info retrieval

### Database Schema (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
model User {
  id            String   @id @default(cuid())
  name          String?
  email         String?  @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}
model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}
model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}
```

## 🎨 Usage Examples

### Basic Sign-In Button

```tsx
import AppleSignInButton from "@/components/auth/apple-signin-button"

export default function MyPage() {
  return (
    <div>
      <AppleSignInButton />
    </div>
  )
}
```

### Custom Sign-In Button

```tsx
<AppleSignInButton
  variant="outline"
  size="lg"
  className="w-full"
/>
```

### Protected Route

```tsx
"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function ProtectedPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    router.push("/auth/signin")
    return null
  }

  return (
    <div>
      <h1>Welcome, {session.user?.name}!</h1>
      <p>This is a protected page.</p>
    </div>
  )
}
```

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit `.env.local` to version control
- Use strong, unique secrets for `NEXTAUTH_SECRET`
- Rotate private keys regularly

### 2. Token Management
- Store refresh tokens securely
- Implement token refresh logic
- Validate ID tokens on the server side

### 3. Error Handling
- Implement proper error boundaries
- Log authentication errors securely
- Provide user-friendly error messages

### 4. HTTPS
- Always use HTTPS in production
- Configure secure cookies
- Set appropriate security headers

## 🧪 Testing

### Development Testing
1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/auth/signin`
3. Click "Sign in with Apple"
4. Complete the Apple authentication flow
5. Verify you're redirected to the dashboard

### Production Testing
1. Deploy your application
2. Update environment variables with production values
3. Test the complete authentication flow
4. Verify session persistence
5. Test error scenarios

## 🐛 Common Issues & Solutions

### Issue: "Invalid client" error
**Solution**: Verify your `APPLE_ID_CLIENT_ID` matches your App ID exactly.

### Issue: "Invalid redirect URI" error
**Solution**: Ensure your redirect URI is added to Apple Developer Console:
- `https://yourdomain.com/api/auth/callback/apple`
- `http://localhost:3000/api/auth/callback/apple` (development)

### Issue: "Invalid signature" error
**Solution**: 
1. Verify your private key format
2. Check that `APPLE_ID_KEY_ID` matches your key
3. Ensure `APPLE_ID_TEAM_ID` is correct

### Issue: Session not persisting
**Solution**:
1. Check `NEXTAUTH_SECRET` is set
2. Verify database connection
3. Check session strategy configuration

### Issue: CORS errors
**Solution**: Ensure your domain is properly configured in Apple Developer Console.

## 📱 Platform Considerations

### Web vs iOS/macOS
- **Web**: Uses OAuth 2.0 flow with redirect
- **iOS/macOS**: Can use native ASAuthorizationAppleIDProvider
- **Cross-platform**: Consider implementing both approaches

### Private Email Addresses
- Apple may provide private email addresses
- Handle email changes gracefully
- Store user preferences for email visibility

### Name Display
- Apple only provides name on first sign-in
- Store name locally for subsequent sessions
- Handle name updates appropriately

## 🔄 Token Refresh

The implementation includes automatic token refresh:

```typescript
// In your API routes
import { createAppleAuth } from "@/lib/apple-auth"

export async function POST(req: Request) {
  const appleAuth = createAppleAuth()
  
  // Refresh token when needed
  const newTokens = await appleAuth.refreshToken(refreshToken)
  
  // Update stored tokens
  // ... implementation
}
```

## 📊 Monitoring & Analytics

### Recommended Metrics
- Authentication success/failure rates
- Token refresh frequency
- User session duration
- Error rates by type

### Logging
```typescript
// Add to your NextAuth callbacks
callbacks: {
  async signIn({ user, account, profile }) {
    console.log("User signed in:", { userId: user.id, provider: account?.provider })
    return true
  },
  async signOut({ token }) {
    console.log("User signed out:", { userId: token.id })
  },
}
```

## 🚀 Deployment

### Vercel
1. Add environment variables in Vercel dashboard
2. Deploy your application
3. Update Apple Developer Console with production domain

### Other Platforms
1. Set environment variables
2. Configure database connection
3. Update Apple Developer Console
4. Test authentication flow

## 📚 Additional Resources

- [Apple Sign In Documentation](https://developer.apple.com/sign-in-with-apple/)
- [NextAuth.js Documentation](https://next-auth.js.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Apple Developer Guidelines](https://developer.apple.com/app-store/review/guidelines/#sign-in-with-apple)

## 🤝 Support

For issues specific to this implementation:
1. Check the common issues section above
2. Verify your Apple Developer Console configuration
3. Review environment variable setup
4. Check browser console for errors

For Apple Sign In issues:
- [Apple Developer Forums](https://developer.apple.com/forums/)
- [Apple Developer Documentation](https://developer.apple.com/documentation/sign_in_with_apple) 