
console.log("ADMIN_SDK_CONFIG: firebaseAdminConfig.ts - SCRIPT EXECUTION STARTED (SERVER-SIDE)");

import * as admin from 'firebase-admin';

// Log the values of critical environment variables AT THE START of the module
// This helps diagnose if they are being loaded from .env.local at all.
console.log("ADMIN_SDK_CONFIG: Reading environment variables from process.env...");
console.log(`ADMIN_SDK_CONFIG: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID = ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
console.log(`ADMIN_SDK_CONFIG: process.env.FIREBASE_CLIENT_EMAIL = ${process.env.FIREBASE_CLIENT_EMAIL}`);
console.log(`ADMIN_SDK_CONFIG: process.env.FIREBASE_PRIVATE_KEY is ${process.env.FIREBASE_PRIVATE_KEY ? 'Present (content not logged for security)' : 'NOT Present or undefined'}`);
console.log(`ADMIN_SDK_CONFIG: process.env.GOOGLE_APPLICATION_CREDENTIALS = ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
console.log(`ADMIN_SDK_CONFIG: process.env.FIREBASE_CONFIG = ${process.env.FIREBASE_CONFIG}`);


// These environment variables are specific to the SERVER-SIDE Firebase Admin SDK.
// They are NOT prefixed with NEXT_PUBLIC_ (except for PROJECT_ID which can be reused if public)
// and should be kept secure.

const privateKeyInput = process.env.FIREBASE_PRIVATE_KEY;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;

let privateKey: string | undefined = undefined;
if (privateKeyInput) {
  try {
    // Replace literal '\n' with actual newline characters for the private key
    privateKey = privateKeyInput.replace(/\\n/g, '\n');
    console.log("ADMIN_SDK_CONFIG: FIREBASE_PRIVATE_KEY processed successfully.");
  } catch (e) {
    console.error("ADMIN_SDK_CONFIG: Error processing FIREBASE_PRIVATE_KEY (e.g., .replace function failed). Ensure it's a string.", e);
    privateKey = undefined; // Ensure it's undefined if processing fails
  }
}


if (!admin.apps.length) {
  let initialized = false;
  console.log("ADMIN_SDK_CONFIG: No existing Firebase Admin app found. Attempting initialization...");

  // Attempt 1: Initialize with explicit service account key from .env.local
  console.log("ADMIN_SDK_CONFIG: Attempt 1 - Using service account credentials from environment variables (FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, NEXT_PUBLIC_FIREBASE_PROJECT_ID).");
  if (projectId && clientEmail && privateKey) {
    console.log("ADMIN_SDK_CONFIG: All three required env vars for Attempt 1 (projectId, clientEmail, privateKey) are present and processed.");
    try {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
       console.log("ADMIN_SDK_CONFIG: Successfully initialized with service account credentials from environment variables (Attempt 1).");
       initialized = true;
    } catch (error: any) {
      console.error('ADMIN_SDK_CONFIG: Initialization error with service account credentials from environment variables (Attempt 1). Check if the values are correct and properly formatted (especially privateKey).', error.message);
    }
  } else {
    const missingVars = [];
    if (!projectId) missingVars.push("NEXT_PUBLIC_FIREBASE_PROJECT_ID");
    if (!clientEmail) missingVars.push("FIREBASE_CLIENT_EMAIL");
    if (!privateKeyInput) missingVars.push("FIREBASE_PRIVATE_KEY (raw input from env was missing)");
    if (privateKeyInput && !privateKey) missingVars.push("FIREBASE_PRIVATE_KEY (after processing, e.g. .replace failed)");

    console.warn(`ADMIN_SDK_CONFIG: Service account credentials ( ${missingVars.join(', ')} ) not fully provided or processed correctly in environment variables for Attempt 1. Skipping this initialization method.`);
  }

  // Attempt 2: Initialize with GOOGLE_APPLICATION_CREDENTIALS environment variable (points to a JSON file)
  if (!initialized && process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.log("ADMIN_SDK_CONFIG: Attempt 2 - Using GOOGLE_APPLICATION_CREDENTIALS environment variable.");
    try {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(), // This uses GOOGLE_APPLICATION_CREDENTIALS
      });
      console.log("ADMIN_SDK_CONFIG: Successfully initialized with GOOGLE_APPLICATION_CREDENTIALS (Attempt 2).");
      initialized = true;
    } catch (error: any) {
        console.error('ADMIN_SDK_CONFIG: Initialization error with GOOGLE_APPLICATION_CREDENTIALS (Attempt 2). Ensure the path is correct and the file is valid JSON.', error.message);
    }
  } else if (!initialized) {
    console.warn("ADMIN_SDK_CONFIG: GOOGLE_APPLICATION_CREDENTIALS environment variable not set, or initialization already succeeded with Attempt 1. Skipping Attempt 2.");
  }

  // Attempt 3: Initialize with default environment credentials (e.g., GCE, Cloud Run, or FIREBASE_CONFIG env var)
  if (!initialized) {
    console.log("ADMIN_SDK_CONFIG: Attempt 3 - Using default environment credentials (suitable for GCE, Cloud Run, or if FIREBASE_CONFIG is set).");
    try {
        // If FIREBASE_CONFIG is set in env, initializeApp() will use it.
        // Otherwise, in Google Cloud environments, it uses Application Default Credentials.
        admin.initializeApp();
        console.log("ADMIN_SDK_CONFIG: Successfully initialized with default environment credentials (Attempt 3) (e.g., FIREBASE_CONFIG or Application Default Credentials).");
        initialized = true;
    } catch(error: any) {
        console.warn(
        'ADMIN_SDK_CONFIG: Auto-initialization with default credentials (Attempt 3) failed. ' +
        'This usually means the application is not running in a Google Cloud environment with implicit credentials, and FIREBASE_CONFIG is not set, or initialization already succeeded with prior attempts. ' +
        `Details: ${error.message}`
        );
    }
  }

  // Final Check: After all attempts, check if an app exists.
  if (!admin.apps.length) {
    // This error means none of the above initialization methods succeeded.
    // The console logs/warns above should provide more specific reasons.
    throw new Error(
      'CRITICAL: Firebase Admin SDK failed to initialize. Default app does not exist. ' +
      'None of the initialization methods (service account key from env, GOOGLE_APPLICATION_CREDENTIALS, or default environment credentials) were successful. ' +
      'Please review the server logs for specific errors from each attempt. ' +
      'Ensure that the required Firebase Admin SDK environment variables are correctly set for your server-side environment and that the server has been restarted.'
    );
  }
} else {
    console.log("ADMIN_SDK_CONFIG: Firebase Admin app already initialized.");
}


export const adminAuth = admin.auth();
export const adminDb = admin.firestore();
console.log("ADMIN_SDK_CONFIG: firebaseAdminConfig.ts - SCRIPT EXECUTION FINISHED (adminAuth and adminDb exported).");
