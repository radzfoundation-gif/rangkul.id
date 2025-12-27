'use client';

import { useState } from 'react';
import { X, Copy, Check, RefreshCw } from 'lucide-react';

interface InviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    serverName: string;
    serverId: string;
    userId: string;
}

export default function InviteModal({ isOpen, onClose, serverName, serverId, userId }: InviteModalProps) {
    const [inviteCode, setInviteCode] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);

    const generateInvite = async () => {
        setLoading(true);
        try {
            const { invitesApi } = await import('@/lib/firestore');
            const result = await invitesApi.create(serverId, userId, serverName);

            if (result.success) {
                setInviteCode(result.data);
            } else {
                alert('Failed to generate invite: ' + result.error.message);
            }
        } catch (error) {
            console.error('Error generating invite:', error);
            alert('Failed to generate invite');
        } finally {
            setLoading(false);
        }
    };

    const inviteLink = inviteCode
        ? `${window.location.origin}/invite/${inviteCode}`
        : '';

    const copyToClipboard = () => {
        if (!inviteLink) return;

        navigator.clipboard.writeText(inviteLink).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    // Auto-generate on open
    if (isOpen && !inviteCode && !loading) {
        generateInvite();
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-200">
                    <h2 className="text-xl font-bold text-zinc-900">Invite People</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-4">
                    <div>
                        <p className="text-sm text-zinc-600 mb-2">
                            Invite link for <span className="font-semibold text-zinc-900">{serverName}</span>
                        </p>

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <RefreshCw className="w-6 h-6 text-brand animate-spin" />
                            </div>
                        ) : inviteCode ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    readOnly
                                    value={inviteLink}
                                    className="flex-1 px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm font-mono text-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand/20"
                                />
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-dark transition-colors flex items-center gap-2 font-medium"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-4 h-4" />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                        ) : null}
                    </div>

                    {inviteCode && (
                        <button
                            onClick={() => {
                                setInviteCode(null);
                                generateInvite();
                            }}
                            className="text-sm text-brand hover:text-brand-dark font-medium flex items-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Generate new link
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
