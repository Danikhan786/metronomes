import { NextResponse } from "next/server"
import { adminDb } from "@/lib/firebase-admin"

export async function POST() {
  try {
    // Clear all collections
    const collections = ['users', 'accounts', 'sessions', 'verificationTokens']
    
    for (const collectionName of collections) {
      const snapshot = await adminDb.collection(collectionName).get()
      
      if (!snapshot.empty) {
        const batch = adminDb.batch()
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref)
        })
        await batch.commit()
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "All user data cleared successfully" 
    })
  } catch (error) {
    console.error("Error clearing data:", error)
    return NextResponse.json(
      { success: false, message: "Failed to clear data" },
      { status: 500 }
    )
  }
} 