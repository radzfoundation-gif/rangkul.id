'use client';

import { useState, useRef } from 'react';
import { X, Upload, Trash2, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useUserContext } from '@/contexts/user-context';
import UserAvatar from '@/components/ui/user-avatar';

interface ProfileSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProfileSettingsModal({ isOpen, onClose }: ProfileSettingsModalProps) {
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
            await storageApi.uploadProfilePhoto(session.user.id, file);
            await refreshProfile();
            alert('Photo uploaded successfully!');
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200">
                    <h2 className="text-xl font-bold text-zinc-900">Profile Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Photo Section */}
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

                    {/* Nickname Section */}
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 mb-2">
                            Nickname
                        </label>
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
                </div>
            </div>
        </div>
    );
}
