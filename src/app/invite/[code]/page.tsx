'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';

export default function InvitePage() {
    const params = useParams();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [inviteData, setInviteData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);

    const inviteCode = params?.code as string;

    useEffect(() => {
        if (!inviteCode) {
            setError('Invalid invite link');
            setLoading(false);
            return;
        }

        validateInvite();
    }, [inviteCode]);

    const validateInvite = async () => {
        try {
            const { invitesApi } = await import('@/lib/firestore');
            const result = await invitesApi.validate(inviteCode);

            if (result.success) {
                setInviteData(result.data);
            } else {
                setError(result.error.message);
            }
        } catch (err) {
            setError('Failed to load invite');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        if (!session?.user?.id) {
            // Redirect to login with return URL
            router.push(`/login?callbackUrl=/invite/${inviteCode}`);
            return;
        }

        setJoining(true);
        try {
            const { serverMembersApi, invitesApi } = await import('@/lib/firestore');

            // Add user to server
            await serverMembersApi.add(inviteData.serverId, session.user.id);

            // Consume invite
            await invitesApi.consume(inviteData.id);

            // Redirect to server
            router.push('/dashboard/community');
        } catch (err: any) {
            setError(err.message || 'Failed to join server');
            setJoining(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-brand/5 to-brand-dark/10 flex items-center justify-center p-4">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-brand animate-spin mx-auto mb-4" />
                    <p className="text-zinc-600">Loading invite...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-brand/5 to-brand-dark/10 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 mb-2">Invite Invalid</h1>
                    <p className="text-zinc-600 mb-6">{error}</p>
                    <button
                        onClick={() => router.push('/dashboard/community')}
                        className="px-6 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-medium"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand/5 to-brand-dark/10 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
                <div className="text-center mb-6">
                    <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="w-10 h-10 text-brand" />
                    </div>
                    <h1 className="text-2xl font-bold text-zinc-900 mb-2">
                        You've been invited!
                    </h1>
                    <p className="text-zinc-600">
                        Join <span className="font-semibold text-brand">{inviteData?.serverName}</span> on Rangkul
                    </p>
                </div>

                {!session ? (
                    <div className="space-y-3">
                        <button
                            onClick={handleJoin}
                            className="w-full px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-medium"
                        >
                            Sign in to Join
                        </button>
                        <p className="text-xs text-zinc-500 text-center">
                            You'll be redirected to login and then join the server
                        </p>
                    </div>
                ) : (
                    <button
                        onClick={handleJoin}
                        disabled={joining}
                        className="w-full px-6 py-3 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {joining ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Joining...
                            </>
                        ) : (
                            'Join Server'
                        )}
                    </button>
                )}

                <p className="text-xs text-zinc-400 text-center mt-4">
                    By joining, you agree to Rangkul's Community Guidelines
                </p>
            </div>
        </div>
    );
}
