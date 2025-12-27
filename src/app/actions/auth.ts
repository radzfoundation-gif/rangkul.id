'use server';

import { authUtils } from "@/lib/auth-utils";
import { usersApi } from "@/lib/firestore-users";
import { v4 as uuidv4 } from 'uuid';

export async function registerUser(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!name || !email || !password) {
        return { success: false, message: 'All fields are required' };
    }

    try {
        // 1. Check if user already exists
        const existingAuthUser = await authUtils.getUserByEmail(email);
        if (existingAuthUser) {
            return { success: false, message: 'Email already registered' };
        }

        // 2. Validate password
        const passwordValidation = authUtils.validatePassword(password);
        if (!passwordValidation.valid) {
            return { success: false, message: passwordValidation.message };
        }

        const userId = uuidv4();

        // 3. Create Auth User (Email + Hashed Password)
        await authUtils.createUser(email, password, userId);

        // 4. Create Public Profile
        await usersApi.createProfile(userId, email, name);

        return { success: true };
    } catch (error: any) {
        console.error('Registration error:', error);
        return { success: false, message: error.message || 'Failed to register' };
    }
}
