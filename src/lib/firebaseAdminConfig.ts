
import * as admin from 'firebase-admin';

// This script initializes the Firebase Admin SDK for server-side operations.
// It uses a robust, multi-stage initialization process suitable for local development,
// CI/CD, and production Google Cloud environments.

// Only attempt to initialize if no apps are already running.
if (!admin.apps.length) {
  let initialized = false;

  // Attempt 1: Use default credentials (Recommended for deployed/CI environments)
  try {
    admin.initializeApp();
    initialized = true;
  } catch (error: any) {
    // This error is expected if default credentials aren't configured.
  }

  // Attempt 2: Use explicit credentials from environment variables (Fallback for local dev)
  if (!initialized) {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKeyInput = process.env.FIREBASE_PRIVATE_KEY;

    if (projectId && clientEmail && privateKeyInput) {
       try {
        const privateKey = privateKeyInput.replace(/\\n/g, '\n');
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
        initialized = true;
       } catch (error: any) {
        console.error("ADMIN_SDK: Explicit credential initialization FAILED.", error);
       }
    }
  }
}

// After all initialization attempts, perform a final check.
if (!admin.apps.length) {
  throw new Error(
    'CRITICAL: Firebase Admin SDK failed to initialize. ' +
    'None of the initialization methods succeeded. Please verify your server environment configuration.'
  );
}

// Export the initialized services.
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
