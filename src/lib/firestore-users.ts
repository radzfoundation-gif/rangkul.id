import {
    collection,
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    query,
    where,
    getDocs,
} from 'firebase/firestore';
import { db } from './firebase';
import type { FirestoreResult, FirestoreError } from '@/types/firestore';

// Helper to handle Firestore errors
const handleError = (error: any): FirestoreError => {
    console.error('Firestore error:', error);
    return {
        code: error.code || 'unknown',
        message: error.message || 'An unknown error occurred'
    };
};

export interface UserProfile {
    userId: string;
    email: string;
    nickname: string;
    avatarColor: string;
    photoURL?: string | null;
    createdAt: Date;
    updatedAt?: Date;
}

// Generate random avatar color
const generateRandomColor = (): string => {
    const colors = [
        'bg-purple-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-orange-500',
        'bg-red-500',
        'bg-pink-500',
        'bg-indigo-500',
        'bg-teal-500',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

// User profile operations
export const usersApi = {
    async getProfile(userId: string): Promise<FirestoreResult<UserProfile | null>> {
        try {
            const docRef = doc(db, 'users', userId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                return {
                    success: true,
                    data: {
                        userId: data.userId,
                        email: data.email,
                        nickname: data.nickname,
                        avatarColor: data.avatarColor,
                        photoURL: data.photoURL || null,
                        createdAt: data.createdAt?.toDate() || new Date(),
                        updatedAt: data.updatedAt?.toDate(),
                    }
                };
            }

            return { success: true, data: null };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    async createProfile(
        userId: string,
        email: string,
        nickname: string
    ): Promise<FirestoreResult<void>> {
        try {
            await setDoc(doc(db, 'users', userId), {
                userId,
                email,
                nickname,
                avatarColor: generateRandomColor(),
                createdAt: serverTimestamp(),
            });

            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    async updateNickname(userId: string, nickname: string): Promise<FirestoreResult<void>> {
        try {
            await updateDoc(doc(db, 'users', userId), {
                nickname,
                updatedAt: serverTimestamp(),
            });

            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    async updateProfile(userId: string, updates: Partial<{ nickname: string; photoURL: string | null; avatarColor: string }>): Promise<FirestoreResult<void>> {
        try {
            await updateDoc(doc(db, 'users', userId), {
                ...updates,
                updatedAt: serverTimestamp(),
            });

            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    async checkNicknameExists(nickname: string): Promise<FirestoreResult<boolean>> {
        try {
            const q = query(
                collection(db, 'users'),
                where('nickname', '==', nickname)
            );
            const snapshot = await getDocs(q);

            return { success: true, data: !snapshot.empty };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },
};
