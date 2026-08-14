import admin from 'firebase-admin';

if (!admin.apps.length) {
  const credentials = process.env.FIREBASE_ADMIN_CREDENTIALS;
  if (!credentials) throw new Error('FIREBASE_ADMIN_CREDENTIALS not set');
  const parsed = JSON.parse(credentials);
  admin.initializeApp({
    credential: admin.credential.cert(parsed),
  });
}

export const adminAuth = admin.auth();
export default admin;