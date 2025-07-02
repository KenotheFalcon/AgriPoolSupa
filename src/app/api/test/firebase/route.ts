import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminFirestore } from '@/lib/firebase-admin';

export async function GET() {
  try {
    // Get Firebase Admin services
    const adminAuth = await getAdminAuth();
    const db = await getAdminFirestore();

    // Test Firebase Admin Auth
    const testUser = await adminAuth.createUser({
      email: 'test@example.com',
      password: 'testPassword123',
      displayName: 'Test User',
    });

    // Test Firestore
    const testCollection = db.collection('test');
    const testDoc = await testCollection.add({
      timestamp: new Date().toISOString(),
      message: 'Test connection successful',
    });

    // Verify the document was created
    const querySnapshot = await testCollection.get();
    const docs = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Clean up test data
    await adminAuth.deleteUser(testUser.uid);
    await testDoc.delete();

    return NextResponse.json({
      status: 'success',
      message: 'Firebase connection test successful',
      details: {
        auth: 'Firebase Admin Auth is working',
        firestore: 'Firestore is working',
        testData: docs,
      },
    });
  } catch (error: any) {
    console.error('Firebase connection test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Firebase connection test failed',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
