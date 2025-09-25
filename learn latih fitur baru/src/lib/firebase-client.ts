
'use client';
// This file is intended for client-side use only.
// It initializes Firebase with a client-safe configuration using a singleton pattern.
import { initializeApp, getApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const appId = "HostVoucher-ai-tracking-stable";

// Use a function to ensure this only runs once.
function initializeFirebase() {
    if (getApps().length) {
        return getApp();
    }
    return initializeApp(firebaseConfig);
}

const app: FirebaseApp = initializeFirebase();
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);
const db: Firestore = getFirestore(app);

export { auth, storage, db, app, appId };

