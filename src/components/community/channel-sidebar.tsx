'use client';

import { Search, Plus, Hash, Volume2, Mic, Headphones, Settings, ChevronDown, LogOut, UserPlus } from 'lucide-react';
import { useChatStore } from '@/hooks/use-chat-store';
import clsx from 'clsx';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/contexts/user-context';
import InviteModal from '@/components/modals/invite-modal';
import ProfileSettingsModal from '@/components/modals/profile-settings-modal';
import UserAvatar from '@/components/ui/user-avatar';

export default function ChannelSidebar() {
    const router = useRouter();
    const { data: session } = useSession();
    const { userProfile } = useUserContext();
    const { servers, activeServerId, activeChannelId, setActiveChannel, leaveServer } = useChatStore();
    const [showEditNickname, setShowEditNickname] = useState(false); // Future: Edit modal
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showProfileSettings, setShowProfileSettings] = useState(false);

    const currentUserId = session?.user?.id || 'guest';
    const currentUsername = userProfile?.nickname || session?.user?.name || 'Guest';
    const currentUserAvatar = userProfile?.avatarColor || 'bg-brand-dark';

    // Derived Data
    const activeServer = servers.find(s => s.id === activeServerId);

    // Group channels by category and sort by position
    const channelsByCategory = activeServer?.categories?.map(cat => ({
        ...cat,
        channels: cat.channels.sort((a, b) => a.position - b.position)
    })) || [];

    const handleLeaveServer = async () => {
        if (!activeServerId || !currentUserId) return;
        if (confirm(`Yakin ingin keluar dari ${activeServer?.name}?`)) {
            await leaveServer(activeServerId, currentUserId);
            setIsMenuOpen(false);
        }
    };

    return (
        <div className="w-64 bg-zinc-50 flex flex-col h-full border-r border-zinc-200">
            {/* Server Header */}
            <div className="relative">
                <div
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="h-12 px-4 flex items-center justify-between border-b border-zinc-200 hover:bg-zinc-100 transition-colors cursor-pointer group"
                >
                    <span className="font-bold text-zinc-800 truncate">{activeServer?.name || 'Select Server'}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsMenuOpen(false)} />
                        <div className="absolute top-full left-2 right-2 mt-1 bg-white rounded-lg shadow-xl border border-zinc-200 z-20 overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button className="w-full px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors flex items-center justify-between">
                                Server Settings
                                <Settings className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => {
                                    setShowInviteModal(true);
                                    setIsMenuOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors flex items-center justify-between"
                            >
                                Invite People
                                <UserPlus className="w-4 h-4" />
                            </button>
                            <button className="w-full px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors flex items-center justify-between">
                                Create Channel
                                <Plus className="w-4 h-4" />
                            </button>
                            <div className="h-px bg-zinc-100 my-1" />
                            <button
                                onClick={handleLeaveServer}
                                className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center justify-between font-medium"
                            >
                                Leave Server
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Channels List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-6 custom-scrollbar">
                {/* Search */}
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Cari member..."
                        className="w-full bg-white border border-zinc-200 rounded-md py-1.5 pl-8 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-brand-dark focus:border-brand-dark transition-all placeholder:text-zinc-400"
                    />
                    <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2" />
                </div>

                {channelsByCategory.map(category => (
                    <div key={category.id}>
                        <div className="flex items-center justify-between px-1 mb-1 group cursor-pointer">
                            <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider group-hover:text-zinc-600 transition-colors">
                                {category.name}
                            </h3>
                            <Plus className="w-3 h-3 text-zinc-400 opacity-0 group-hover:opacity-100 cursor-pointer hover:text-zinc-800 transition-all" />
                        </div>
                        <div className="space-y-0.5">
                            {category.channels.map(channel => (
                                <button
                                    key={channel.id}
                                    onClick={() => setActiveChannel(channel.id)}
                                    className={clsx(
                                        "w-full flex items-center justify-between px-2 py-1.5 rounded-md text-sm group transition-all",
                                        activeChannelId === channel.id
                                            ? "bg-brand-light/20 text-brand-dark font-medium"
                                            : "text-zinc-600 hover:bg-zinc-200/60 hover:text-zinc-900"
                                    )}
                                >
                                    <div className="flex items-center gap-1.5 truncate">
                                        {channel.type === 'voice' ? (
                                            <Volume2 className="w-4 h-4 shrink-0 opacity-70" />
                                        ) : (
                                            <Hash className="w-4 h-4 shrink-0 opacity-70" />
                                        )}
                                        <span className="truncate">{channel.name}</span>
                                    </div>
                                    {channel.unreadCount && channel.unreadCount > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full font-bold shadow-sm">
                                            {channel.unreadCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* User Control Panel */}
            <div className="h-[52px] bg-zinc-100 px-3 flex items-center gap-2 border-t border-zinc-200 shrink-0">
                <div className="relative">
                    <UserAvatar
                        photoURL={userProfile?.photoURL}
                        fallbackColor={currentUserAvatar}
                        name={currentUsername}
                        size="sm"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-100 rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-zinc-800 truncate leading-tight">
                        {currentUsername}
                    </div>
                    <div className="text-[10px] text-zinc-500 truncate leading-tight">
                        Online
                    </div>
                </div>
                <div className="flex items-center">
                    <button className="p-1.5 text-zinc-500 hover:bg-zinc-200 rounded-md transition-colors relative group">
                        <Mic className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Unmute
                        </span>
                    </button>
                    <button className="p-1.5 text-zinc-500 hover:bg-zinc-200 rounded-md transition-colors relative group">
                        <Headphones className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Deafen
                        </span>
                    </button>
                    <button
                        onClick={() => router.push('/dashboard/settings')}
                        className="p-1.5 text-zinc-500 hover:bg-zinc-200 rounded-md transition-colors relative group"
                    >
                        <Settings className="w-4 h-4" />
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Settings
                        </span>
                    </button>
                </div>
            </div>

            {/* Invite Modal */}
            {showInviteModal && activeServer && (
                <InviteModal
                    isOpen={showInviteModal}
                    onClose={() => setShowInviteModal(false)}
                    serverName={activeServer.name}
                    serverId={activeServerId}
                    userId={currentUserId}
                />
            )}
        </div>
    );
}
