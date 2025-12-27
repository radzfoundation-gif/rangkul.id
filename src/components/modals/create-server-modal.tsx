'use client';

import { X, Upload, Hash } from 'lucide-react';
import { useState } from 'react';
import { useChatStore } from '@/hooks/use-chat-store';
import { useSession } from 'next-auth/react';

interface CreateServerModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateServerModal({ isOpen, onClose }: CreateServerModalProps) {
    const { data: session } = useSession();
    const { createServer } = useChatStore();
    const [serverName, setServerName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!serverName.trim() || !session?.user?.id) return;

        setIsLoading(true);
        try {
            const newServer = await createServer(serverName.trim(), session.user.id);
            if (newServer) {
                onClose();
                setServerName('');
            }
        } catch (error) {
            console.error('Failed to create server:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 transition-colors"
                    disabled={isLoading}
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-6 border-b border-zinc-100">
                    <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
                        <Hash className="w-5 h-5 text-brand-dark" />
                        Buat Server Baru
                    </h2>
                    <p className="text-sm text-zinc-500 mt-1">
                        Server adalah komunitas tempat kamu bisa berkumpul dengan teman-teman.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Server Icon Upload (Future feature) */}
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 rounded-full bg-brand-light/20 border-2 border-dashed border-brand-light flex items-center justify-center cursor-pointer hover:bg-brand-light/30 transition-colors group">
                            <Upload className="w-8 h-8 text-brand-dark group-hover:scale-110 transition-transform" />
                        </div>
                        <p className="text-xs text-zinc-400">Upload icon server (opsional)</p>
                    </div>

                    {/* Server Name */}
                    <div>
                        <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                            Nama Server <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            maxLength={100}
                            value={serverName}
                            onChange={(e) => setServerName(e.target.value)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-brand-dark focus:border-brand-dark transition-all"
                            placeholder="Ex: Rangkul Pusat, Komunitas Gen-Z"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-zinc-400 mt-1">
                            Dengan membuat server, kamu setuju dengan <a href="#" className="text-brand-dark underline">Aturan Komunitas</a>
                        </p>
                    </div>

                    {/* Template Selection (Future) */}
                    <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
                        <h3 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">
                            Template (Coming Soon)
                        </h3>
                        <div className="grid grid-cols-2 gap-2">
                            {['Gaming', 'Study Group', 'Mental Health', 'Artists'].map((template) => (
                                <button
                                    key={template}
                                    type="button"
                                    disabled
                                    className="px-3 py-2 text-xs bg-white border border-zinc-200 rounded-md text-zinc-400 cursor-not-allowed"
                                >
                                    {template}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 text-sm font-medium text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors"
                            disabled={isLoading}
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={!serverName.trim() || isLoading}
                            className="flex-1 bg-brand-dark hover:bg-brand-dim text-brand-light font-bold py-3 rounded-lg transition-all shadow-lg shadow-brand-dark/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Buat Server'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
