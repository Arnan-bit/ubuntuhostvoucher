'use client';
// Firebase Client Configuration (Minimal - Auth Only)
// Updated: Hybrid mode - Firebase Auth only for login, JWT for API calls
// 
// 🎯 IMPORTANT: This file uses centralized config from src/config/environment.ts
// All credentials are loaded from .env.local only - DO NOT hardcode values here
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebase as firebaseConfig } from '@/config/environment';

const config = {
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId
};

function initializeFirebase() {
    if (getApps().length) {
        return getApp();
    }
    return initializeApp(config);
}

const app = initializeFirebase();
const auth = getAuth(app);

export { auth, app };


