'use client';

import { useState, useRef } from 'react';
import { Upload, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useUserContext } from '@/contexts/user-context';
import UserAvatar from '@/components/ui/user-avatar';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const { userProfile, refreshProfile } = useUserContext();
    const [uploading, setUploading] = useState(false);
    const [nickname, setNickname] = useState(userProfile?.nickname || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !session?.user?.id) return;

        setUploading(true);
        try {
            const { storageApi } = await import('@/lib/firebase-storage');
            const url = await storageApi.uploadProfilePhoto(session.user.id, file);
            console.log('✅ Photo uploaded successfully:', url);
            await refreshProfile();
            alert('Photo uploaded successfully!');
            // Force page reload to clear cache
            window.location.reload();
        } catch (error: any) {
            alert('Failed to upload photo: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemovePhoto = async () => {
        if (!session?.user?.id || !userProfile?.photoURL) return;
        if (!confirm('Remove profile photo?')) return;

        setUploading(true);
        try {
            const { storageApi } = await import('@/lib/firebase-storage');
            await storageApi.removeProfilePhoto(session.user.id);
            await refreshProfile();
        } catch (error: any) {
            alert('Failed to remove photo: ' + error.message);
        } finally {
            setUploading(false);
        }
    };

    const handleSaveNickname = async () => {
        if (!session?.user?.id || !nickname.trim()) return;

        try {
            const { usersApi } = await import('@/lib/firestore-users');
            await usersApi.updateNickname(session.user.id, nickname.trim());
            await refreshProfile();
            alert('Nickname updated!');
        } catch (error) {
            alert('Failed to update nickname');
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="h-14 px-4 md:px-6 border-b border-zinc-200 flex items-center gap-2 md:gap-4">
                <button
                    onClick={() => router.push('/dashboard/community')}
                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-zinc-600" />
                </button>
                <h1 className="text-base md:text-lg font-bold text-zinc-900">Profile Settings</h1>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
                <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
                    {/* Profile Photo Section */}
                    <div className="bg-zinc-50 rounded-xl p-4 md:p-6 border border-zinc-200">
                        <h2 className="text-sm font-semibold text-zinc-700 mb-4">Profile Photo</h2>
                        <div className="flex flex-col items-center space-y-4">
                            <UserAvatar
                                photoURL={userProfile?.photoURL}
                                fallbackColor={userProfile?.avatarColor}
                                name={userProfile?.nickname || 'User'}
                                size="xl"
                            />

                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                                >
                                    {uploading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4" />
                                    )}
                                    Upload Photo
                                </button>

                                {userProfile?.photoURL && (
                                    <button
                                        onClick={handleRemovePhoto}
                                        disabled={uploading}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Remove
                                    </button>
                                )}
                            </div>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                            />

                            <p className="text-xs text-zinc-500">Max 5MB • JPG, PNG, WebP</p>
                        </div>
                    </div>

                    {/* Nickname Section */}
                    <div className="bg-zinc-50 rounded-xl p-4 md:p-6 border border-zinc-200">
                        <h2 className="text-sm font-semibold text-zinc-700 mb-4">Nickname</h2>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className="flex-1 px-3 py-2 border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/20"
                                placeholder="Enter nickname"
                            />
                            <button
                                onClick={handleSaveNickname}
                                className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors font-medium"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Account Info */}
                    <div className="bg-zinc-50 rounded-xl p-4 md:p-6 border border-zinc-200">
                        <h2 className="text-sm font-semibold text-zinc-700 mb-4">Account Information</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-zinc-500">Email</label>
                                <p className="text-sm text-zinc-900">{session?.user?.email || 'Not available'}</p>
                            </div>
                            <div>
                                <label className="text-xs text-zinc-500">User ID</label>
                                <p className="text-sm text-zinc-900 font-mono">{session?.user?.id || 'Not available'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
