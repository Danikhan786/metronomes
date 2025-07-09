import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';

export interface SessionCountData {
  userId: string;
  sessionCount: number;
  hasUpgraded: boolean;
  lastUpdated: Date;
}

export async function getSessionCount(userId: string): Promise<SessionCountData | null> {
  try {
    const sessionCountRef = doc(db, 'sessionCounts', userId);
    const sessionCountDoc = await getDoc(sessionCountRef);
    
    if (sessionCountDoc.exists()) {
      const data = sessionCountDoc.data();
      return {
        userId: sessionCountDoc.id,
        sessionCount: data.sessionCount || 0,
        hasUpgraded: data.hasUpgraded || false,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
      };
    }
    
    return null;
  } catch (error) {
    console.error('Error getting session count:', error);
    return null;
  }
}

export async function createSessionCount(userId: string): Promise<SessionCountData> {
  try {
    const sessionCountRef = doc(db, 'sessionCounts', userId);
    const sessionCountData: SessionCountData = {
      userId,
      sessionCount: 1,
      hasUpgraded: false,
      lastUpdated: new Date(),
    };
    
    await setDoc(sessionCountRef, sessionCountData);
    return sessionCountData;
  } catch (error) {
    console.error('Error creating session count:', error);
    throw error;
  }
}

export async function incrementSessionCount(userId: string): Promise<SessionCountData | null> {
  try {
    const sessionCountRef = doc(db, 'sessionCounts', userId);
    
    // First, try to increment the existing document
    await updateDoc(sessionCountRef, {
      sessionCount: increment(1),
      lastUpdated: new Date(),
    });
    
    // Get the updated document
    const updatedDoc = await getDoc(sessionCountRef);
    if (updatedDoc.exists()) {
      const data = updatedDoc.data();
      return {
        userId: updatedDoc.id,
        sessionCount: data.sessionCount || 0,
        hasUpgraded: data.hasUpgraded || false,
        lastUpdated: data.lastUpdated?.toDate() || new Date(),
      };
    }
    
    return null;
  } catch (error) {
    // If the document doesn't exist, create it
    if (error instanceof Error && error.message.includes('No document to update')) {
      return createSessionCount(userId);
    }
    
    console.error('Error incrementing session count:', error);
    return null;
  }
}

export async function updateUpgradeStatus(userId: string, hasUpgraded: boolean): Promise<void> {
  try {
    const sessionCountRef = doc(db, 'sessionCounts', userId);
    await updateDoc(sessionCountRef, {
      hasUpgraded,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error('Error updating upgrade status:', error);
    throw error;
  }
}

export async function resetSessionCount(userId: string): Promise<void> {
  try {
    const sessionCountRef = doc(db, 'sessionCounts', userId);
    await setDoc(sessionCountRef, {
      userId,
      sessionCount: 0,
      hasUpgraded: false,
      lastUpdated: new Date(),
    });
  } catch (error) {
    console.error('Error resetting session count:', error);
    throw error;
  }
} 