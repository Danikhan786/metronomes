import { adminDb } from './firebase-admin';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Account {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token?: string | null;
  access_token?: string | null;
  expires_at?: number | null;
  token_type?: string | null;
  scope?: string | null;
  id_token?: string | null;
  session_state?: string | null;
}

interface Session {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Date;
}

interface VerificationToken {
  identifier: string;
  token: string;
  expires: Date;
}

export function FirebaseAdapter() {
  return {
    async createUser(data: Partial<User>) {
      const userRef = adminDb.collection('users').doc();
      const user = {
        id: userRef.id,
        name: data.name,
        email: data.email,
        emailVerified: data.emailVerified,
        image: data.image,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await userRef.set(user);
      return user;
    },

    async getUser(id: string) {
      const userDoc = await adminDb.collection('users').doc(id).get();
      if (!userDoc.exists) return null;
      
      const userData = userDoc.data();
      return {
        id: userDoc.id,
        name: userData?.name,
        email: userData?.email,
        emailVerified: userData?.emailVerified?.toDate(),
        image: userData?.image,
        createdAt: userData?.createdAt?.toDate(),
        updatedAt: userData?.updatedAt?.toDate(),
      };
    },

    async getUserByEmail(email: string) {
      const usersRef = adminDb.collection('users');
      const snapshot = await usersRef.where('email', '==', email).limit(1).get();
      
      if (snapshot.empty) return null;
      
      const userDoc = snapshot.docs[0];
      const userData = userDoc.data();
      
      return {
        id: userDoc.id,
        name: userData?.name,
        email: userData?.email,
        emailVerified: userData?.emailVerified?.toDate(),
        image: userData?.image,
        createdAt: userData?.createdAt?.toDate(),
        updatedAt: userData?.updatedAt?.toDate(),
      };
    },

    async getUserByAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
      const accountsRef = adminDb.collection('accounts');
      const snapshot = await accountsRef
        .where('provider', '==', provider)
        .where('providerAccountId', '==', providerAccountId)
        .limit(1)
        .get();
      
      if (snapshot.empty) return null;
      
      const accountDoc = snapshot.docs[0];
      const accountData = accountDoc.data();
      
      // Get the user
      const userDoc = await adminDb.collection('users').doc(accountData.userId).get();
      if (!userDoc.exists) return null;
      
      const userData = userDoc.data();
      return {
        id: userDoc.id,
        name: userData?.name,
        email: userData?.email,
        emailVerified: userData?.emailVerified?.toDate(),
        image: userData?.image,
        createdAt: userData?.createdAt?.toDate(),
        updatedAt: userData?.updatedAt?.toDate(),
      };
    },

    async updateUser(data: Partial<User> & { id: string }) {
      const userRef = adminDb.collection('users').doc(data.id);
      const updateData: any = {
        updatedAt: new Date(),
      };
      
      if (data.name !== undefined) updateData.name = data.name;
      if (data.email !== undefined) updateData.email = data.email;
      if (data.emailVerified !== undefined) updateData.emailVerified = data.emailVerified;
      if (data.image !== undefined) updateData.image = data.image;
      
      await userRef.update(updateData);
      
      const updatedDoc = await userRef.get();
      const userData = updatedDoc.data();
      
      return {
        id: updatedDoc.id,
        name: userData?.name,
        email: userData?.email,
        emailVerified: userData?.emailVerified?.toDate(),
        image: userData?.image,
        createdAt: userData?.createdAt?.toDate(),
        updatedAt: userData?.updatedAt?.toDate(),
      };
    },

    async deleteUser(userId: string) {
      // Delete user and all related data
      const batch = adminDb.batch();
      
      // Delete user
      batch.delete(adminDb.collection('users').doc(userId));
      
      // Delete accounts
      const accountsSnapshot = await adminDb.collection('accounts')
        .where('userId', '==', userId)
        .get();
      accountsSnapshot.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
      });
      
      // Delete sessions
      const sessionsSnapshot = await adminDb.collection('sessions')
        .where('userId', '==', userId)
        .get();
      sessionsSnapshot.docs.forEach((doc: any) => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
    },

    async linkAccount(data: Account) {
      const accountRef = adminDb.collection('accounts').doc();
      
      // Filter out undefined values to avoid Firestore errors
      const accountData: any = {
        id: accountRef.id,
        userId: data.userId,
        type: data.type,
        provider: data.provider,
        providerAccountId: data.providerAccountId,
      };
      
      // Only add optional fields if they have values
      if (data.refresh_token !== undefined) accountData.refresh_token = data.refresh_token;
      if (data.access_token !== undefined) accountData.access_token = data.access_token;
      if (data.expires_at !== undefined) accountData.expires_at = data.expires_at;
      if (data.token_type !== undefined) accountData.token_type = data.token_type;
      if (data.scope !== undefined) accountData.scope = data.scope;
      if (data.id_token !== undefined) accountData.id_token = data.id_token;
      if (data.session_state !== undefined) accountData.session_state = data.session_state;
      
      await accountRef.set(accountData);
      return accountData;
    },

    async unlinkAccount({ provider, providerAccountId }: { provider: string; providerAccountId: string }) {
      const accountsRef = adminDb.collection('accounts');
      const snapshot = await accountsRef
        .where('provider', '==', provider)
        .where('providerAccountId', '==', providerAccountId)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        await snapshot.docs[0].ref.delete();
      }
    },

    async createSession(data: { sessionToken: string; userId: string; expires: Date }) {
      const sessionRef = adminDb.collection('sessions').doc();
      const session = {
        id: sessionRef.id,
        sessionToken: data.sessionToken,
        userId: data.userId,
        expires: data.expires,
      };
      
      await sessionRef.set(session);
      return session;
    },

    async getSessionAndUser(sessionToken: string) {
      const sessionsRef = adminDb.collection('sessions');
      const snapshot = await sessionsRef
        .where('sessionToken', '==', sessionToken)
        .limit(1)
        .get();
      
      if (snapshot.empty) return null;
      
      const sessionDoc = snapshot.docs[0];
      const sessionData = sessionDoc.data();
      
      // Get the user
      const userDoc = await adminDb.collection('users').doc(sessionData.userId).get();
      if (!userDoc.exists) return null;
      
      const userData = userDoc.data();
      
      return {
        session: {
          id: sessionDoc.id,
          sessionToken: sessionData.sessionToken,
          userId: sessionData.userId,
          expires: sessionData.expires.toDate(),
        },
        user: {
          id: userDoc.id,
          name: userData?.name,
          email: userData?.email,
          emailVerified: userData?.emailVerified?.toDate(),
          image: userData?.image,
          createdAt: userData?.createdAt?.toDate(),
          updatedAt: userData?.updatedAt?.toDate(),
        },
      };
    },

    async updateSession(data: Partial<Session> & { sessionToken: string }) {
      const sessionsRef = adminDb.collection('sessions');
      const snapshot = await sessionsRef
        .where('sessionToken', '==', data.sessionToken)
        .limit(1)
        .get();
      
      if (snapshot.empty) return null;
      
      const sessionDoc = snapshot.docs[0];
      const updateData: any = {};
      
      if (data.expires !== undefined) updateData.expires = data.expires;
      if (data.userId !== undefined) updateData.userId = data.userId;
      
      await sessionDoc.ref.update(updateData);
      
      const updatedDoc = await sessionDoc.ref.get();
      const sessionData = updatedDoc.data();
      
      if (!sessionData) return null;
      
      return {
        id: updatedDoc.id,
        sessionToken: sessionData.sessionToken,
        userId: sessionData.userId,
        expires: sessionData.expires.toDate(),
      };
    },

    async deleteSession(sessionToken: string) {
      const sessionsRef = adminDb.collection('sessions');
      const snapshot = await sessionsRef
        .where('sessionToken', '==', sessionToken)
        .limit(1)
        .get();
      
      if (!snapshot.empty) {
        await snapshot.docs[0].ref.delete();
      }
    },

    async createVerificationToken(data: VerificationToken) {
      const verificationTokenRef = adminDb.collection('verificationTokens').doc();
      const verificationToken = {
        identifier: data.identifier,
        token: data.token,
        expires: data.expires,
      };
      
      await verificationTokenRef.set(verificationToken);
      return verificationToken;
    },

    async useVerificationToken({ identifier, token }: { identifier: string; token: string }) {
      const verificationTokensRef = adminDb.collection('verificationTokens');
      const snapshot = await verificationTokensRef
        .where('identifier', '==', identifier)
        .where('token', '==', token)
        .limit(1)
        .get();
      
      if (snapshot.empty) return null;
      
      const tokenDoc = snapshot.docs[0];
      const tokenData = tokenDoc.data();
      
      // Delete the token after use
      await tokenDoc.ref.delete();
      
      return {
        identifier: tokenData.identifier,
        token: tokenData.token,
        expires: tokenData.expires.toDate(),
      };
    },
  };
} 