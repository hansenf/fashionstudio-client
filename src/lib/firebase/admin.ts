import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  try {
    const credentials = process.env.FIREBASE_ADMIN_CREDENTIALS;
    
    if (!credentials) {
      throw new Error('FIREBASE_ADMIN_CREDENTIALS is not defined in environment variables');
    }

    const serviceAccount = JSON.parse(credentials);
    
    // Check if already initialized to avoid duplicate initialization
    if (!admin.apps || admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
      console.log('✅ Firebase Admin SDK initialized successfully');
    }
    
    return admin;
  } catch (error) {
    console.error('❌ Failed to initialize Firebase Admin SDK:', error);
    throw error;
  }
};

// Initialize once
const firebaseAdmin = initializeFirebaseAdmin();

// Export services
export const auth = firebaseAdmin.auth();
export const firestore = firebaseAdmin.firestore();
export const storage = firebaseAdmin.storage();

// For backward compatibility
export const adminAuth = auth;
export default firebaseAdmin;