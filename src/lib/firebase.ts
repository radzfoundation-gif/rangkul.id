import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

// Check if Firebase is configured with valid credentials
const IS_CONFIGURED = !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your-api-key' &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY.length > 10 // Basic validation
);

// Use placeholder config for build time or when Firebase is not configured
const firebaseConfig = IS_CONFIGURED ? {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
} : {
    // Safe placeholder config for build time / mock mode
    apiKey: 'AIzaSyDummyKeyForBuildTimeOnlyNotRealKey123456',
    authDomain: 'rangkul-mock.firebaseapp.com',
    projectId: 'rangkul-mock-project',
    storageBucket: 'rangkul-mock.appspot.com',
    messagingSenderId: '123456789',
    appId: '1:123456789:web:mock123456',
};

if (!IS_CONFIGURED && typeof window !== 'undefined') {
    console.log('🔔 Rangkul running in MOCK DATA mode');
    console.log('💡 To enable Firebase: Add credentials to .env.local');
}

// Initialize Firebase (only once)
let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;

try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

    // Initialize Firestore with persistence
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager()
        }),
        experimentalForceLongPolling: true,
    });

    auth = getAuth(app);
    storage = getStorage(app);
} catch (error) {
    // Fallback for build errors - create minimal instances
    console.error('Firebase initialization error (using fallback):', error);
    app = getApps()[0] || initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
}

export { db, auth, storage };

// Initialize Analytics (only in browser)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined' && IS_CONFIGURED && firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
}
export { analytics };

// Export helper
export const isFirebaseConfigured = () => IS_CONFIGURED;

// For development (optional)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectAuthEmulator(auth, 'http://localhost:9099');
}
