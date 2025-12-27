'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { usersApi, UserProfile } from '@/lib/firestore-users';
import NicknameSetupModal from '@/components/modals/nickname-setup-modal';

interface UserContextType {
    userProfile: UserProfile | null;
    refreshProfile: () => Promise<void>;
    isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [showNicknameSetup, setShowNicknameSetup] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkProfile = async () => {
        if (!session?.user?.id) {
            setIsLoading(false);
            return;
        }

        try {
            console.log('🔄 Loading profile for user:', session.user.id);
            const result = await usersApi.getProfile(session.user.id);
            console.log('📥 Profile data received:', result);

            if (result.success) {
                if (result.data) {
                    console.log('✅ User profile:', result.data);
                    setUserProfile(result.data);
                    setShowNicknameSetup(false);
                } else {
                    // Profile doesn't exist, show setup
                    setShowNicknameSetup(true);
                }
            }
        } catch (error) {
            console.error('Error loading user profile:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (status === 'authenticated') {
            checkProfile();
        } else if (status === 'unauthenticated') {
            setUserProfile(null);
            setIsLoading(false);
        }
    }, [session, status]);

    const handleNicknameComplete = async (nickname: string) => {
        await checkProfile(); // Reload profile
    };

    return (
        <UserContext.Provider value={{
            userProfile,
            refreshProfile: checkProfile,
            isLoading
        }}>
            {children}
            <NicknameSetupModal
                isOpen={showNicknameSetup}
                onComplete={handleNicknameComplete}
            />
        </UserContext.Provider>
    );
}

export function useUserContext() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
}
