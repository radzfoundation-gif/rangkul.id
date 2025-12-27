'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { usersApi } from '@/lib/firestore-users';
import { User, Check, AlertCircle } from 'lucide-react';
import clsx from 'clsx';

interface NicknameSetupModalProps {
    isOpen: boolean;
    onComplete: (nickname: string) => void;
}

export default function NicknameSetupModal({ isOpen, onComplete }: NicknameSetupModalProps) {
    const { data: session } = useSession();
    const [nickname, setNickname] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!nickname.trim()) {
            setError('Nickname tidak boleh kosong');
            return;
        }

        if (nickname.length < 3) {
            setError('Minimal 3 karakter');
            return;
        }

        if (nickname.length > 20) {
            setError('Maksimal 20 karakter');
            return;
        }

        if (!session?.user?.id || !session?.user?.email) return;

        setIsLoading(true);
        try {
            // Check if nickname exists (optional, keeping it simple for now)
            // Create profile
            const result = await usersApi.createProfile(
                session.user.id,
                session.user.email,
                nickname.trim()
            );

            if (result.success) {
                onComplete(nickname.trim());
            } else {
                setError('Gagal menyimpan nickname. Coba lagi.');
            }
        } catch (err) {
            setError('Terjadi kesalahan. Coba lagi.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            {/* Backdrop with blur */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-md" />

            <div className="relative z-10 w-full max-w-sm">
                <div className="bg-white rounded-2xl shadow-2xl border border-zinc-100 p-8 transform transition-all">
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-16 h-16 bg-brand-light/30 rounded-2xl flex items-center justify-center mb-4 text-brand-dark">
                            <User className="w-8 h-8" />
                        </div>
                        <h2 className="text-xl font-bold text-zinc-900 text-center">
                            Selamat Datang!
                        </h2>
                        <p className="text-sm text-zinc-500 text-center mt-2 max-w-[240px]">
                            Mari buat identitas kamu agar lebih dikenal di komunitas.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-zinc-700 uppercase tracking-wider ml-1">
                                Pilih Nickname
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    placeholder="Contoh: RusaTenang"
                                    className={clsx(
                                        "w-full px-4 py-3 rounded-xl bg-zinc-50 border transition-all outline-none",
                                        "focus:bg-white focus:border-brand-dark focus:ring-4 focus:ring-brand-light/20",
                                        error ? "border-red-300 focus:border-red-500" : "border-zinc-200"
                                    )}
                                    autoFocus
                                />
                                {nickname.length >= 3 && !error && (
                                    <div className="absolute right-3 top-3.5 text-green-500">
                                        <Check className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                            {error && (
                                <div className="flex items-center gap-1.5 text-xs text-red-500 ml-1">
                                    <AlertCircle className="w-3.5 h-3.5" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || nickname.length < 3}
                            className={clsx(
                                "w-full py-3.5 rounded-xl font-bold text-sm transition-all transform active:scale-95",
                                "flex items-center justify-center gap-2",
                                isLoading || nickname.length < 3
                                    ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                                    : "bg-brand-dark text-white hover:bg-brand-dim hover:shadow-lg hover:shadow-brand-dark/20"
                            )}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                "Mulai Berinteraksi"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
