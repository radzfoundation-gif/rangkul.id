import bcrypt from 'bcrypt';
import { db } from './firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

const SALT_ROUNDS = 10;

export interface AuthUser {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    lastLogin?: Date;
}

export const authUtils = {
    /**
     * Hash a password securely
     */
    async hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, SALT_ROUNDS);
    },

    /**
     * Verify password against hash
     */
    async verifyPassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    },

    /**
     * Validate password strength
     * - Min 8 characters
     * - At least one uppercase
     * - At least one lowercase
     * - At least one number
     */
    validatePassword(password: string): { valid: boolean; message?: string } {
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters' };
        }
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one uppercase letter' };
        }
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one lowercase letter' };
        }
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one number' };
        }
        return { valid: true };
    },

    /**
     * Find user by email
     */
    async getUserByEmail(email: string): Promise<AuthUser | null> {
        try {
            const q = query(
                collection(db, 'auth_users'),
                where('email', '==', email.toLowerCase())
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return null;
            }

            const data = snapshot.docs[0].data();
            return {
                id: snapshot.docs[0].id,
                email: data.email,
                passwordHash: data.passwordHash,
                createdAt: data.createdAt?.toDate() || new Date(),
                lastLogin: data.lastLogin?.toDate(),
            };
        } catch (error) {
            console.error('Error getting user:', error);
            return null;
        }
    },

    /**
     * Create new user with hashed password
     */
    async createUser(email: string, password: string, userId: string): Promise<void> {
        const passwordHash = await this.hashPassword(password);

        await setDoc(doc(db, 'auth_users', userId), {
            email: email.toLowerCase(),
            passwordHash,
            createdAt: new Date(),
        });
    },

    /**
     * Authenticate user
     */
    async authenticate(email: string, password: string): Promise<{ success: boolean; userId?: string; message?: string }> {
        const user = await this.getUserByEmail(email);

        if (!user) {
            return { success: false, message: 'Invalid email or password' };
        }

        const isValid = await this.verifyPassword(password, user.passwordHash);

        if (!isValid) {
            return { success: false, message: 'Invalid email or password' };
        }

        // Update last login
        await setDoc(doc(db, 'auth_users', user.id), {
            lastLogin: new Date()
        }, { merge: true });

        return { success: true, userId: user.id };
    }
};
