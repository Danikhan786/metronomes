import { db } from './firebase';
import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, deleteDoc, orderBy, limit } from 'firebase/firestore';

// User operations
export const getUserById = async (userId: string) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (userDoc.exists()) {
      return { id: userDoc.id, ...userDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', email), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
};

export const updateUser = async (userId: string, data: any) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
};

// Session operations
export const getSessionByToken = async (sessionToken: string) => {
  try {
    const sessionsRef = collection(db, 'sessions');
    const q = query(sessionsRef, where('sessionToken', '==', sessionToken), limit(1));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
};

// Account operations
export const getAccountByProvider = async (provider: string, providerAccountId: string) => {
  try {
    const accountsRef = collection(db, 'accounts');
    const q = query(
      accountsRef, 
      where('provider', '==', provider),
      where('providerAccountId', '==', providerAccountId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting account:', error);
    return null;
  }
};

// Verification token operations
export const getVerificationToken = async (identifier: string, token: string) => {
  try {
    const tokensRef = collection(db, 'verificationTokens');
    const q = query(
      tokensRef,
      where('identifier', '==', identifier),
      where('token', '==', token),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return { id: doc.id, ...doc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting verification token:', error);
    return null;
  }
};

export const deleteVerificationToken = async (tokenId: string) => {
  try {
    await deleteDoc(doc(db, 'verificationTokens', tokenId));
    return true;
  } catch (error) {
    console.error('Error deleting verification token:', error);
    return false;
  }
}; 