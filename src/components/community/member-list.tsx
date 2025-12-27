'use client';

import { Users as UsersIcon, Search, Shield, Crown, ChevronDown } from 'lucide-react';
import { useChatStore } from '@/hooks/use-chat-store';
import { MOCK_USERS } from '@/data/mock-data';
import clsx from 'clsx';
import { User } from '@/types';
import { useState } from 'react';

export default function MemberList() {
    const { servers, activeServerId } = useChatStore();
    const [searchQuery, setSearchQuery] = useState('');

    const activeServer = servers.find(s => s.id === activeServerId);
    const members = activeServer?.members || MOCK_USERS;

    // Group members by status
    const onlineMembers = members.filter(m => m.status === 'online');
    const idleMembers = members.filter(m => m.status === 'idle');
    const dndMembers = members.filter(m => m.status === 'dnd');
    const offlineMembers = members.filter(m => m.status === 'offline');

    const filteredMembers = (memberList: User[]) => {
        if (!searchQuery) return memberList;
        return memberList.filter(m =>
            m.username.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const MemberItem = ({ member }: { member: User }) => {
        const statusColors = {
            online: 'bg-green-500',
            idle: 'bg-yellow-500',
            dnd: 'bg-red-500',
            offline: 'bg-zinc-400'
        };

        const getRoleIcon = () => {
            if (member.role === 'admin') return <Crown className="w-3 h-3 text-yellow-500" />;
            if (member.role === 'moderator') return <Shield className="w-3 h-3 text-blue-500" />;
            return null;
        };

        return (
            <button className="w-full px-2 py-1.5 rounded hover:bg-zinc-100 flex items-center gap-2 group transition-colors">
                <div className="relative">
                    <div
                        className={clsx(
                            'w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs',
                            member.avatarUrl || 'bg-zinc-400'
                        )}
                    >
                        {!member.avatarUrl?.includes('/') && member.username[0].toUpperCase()}
                    </div>
                    <div className={clsx(
                        'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
                        statusColors[member.status]
                    )} />
                </div>
                <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1">
                        {getRoleIcon()}
                        <span className={clsx(
                            'text-sm font-medium truncate',
                            member.status === 'offline' ? 'text-zinc-400' : 'text-zinc-700'
                        )}>
                            {member.username}
                        </span>
                    </div>
                    {member.customStatus && (
                        <p className="text-xs text-zinc-400 truncate">{member.customStatus}</p>
                    )}
                </div>
            </button>
        );
    };

    const MemberGroup = ({ title, members, count }: { title: string; members: User[]; count: number }) => {
        const [isCollapsed, setIsCollapsed] = useState(false);
        const filtered = filteredMembers(members);

        if (filtered.length === 0) return null;

        return (
            <div className="mb-3">
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="w-full px-2 py-1 flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-wider hover:text-zinc-700 transition-colors"
                >
                    <div className="flex items-center gap-1">
                        <ChevronDown className={clsx(
                            'w-3 h-3 transition-transform',
                            isCollapsed && '-rotate-90'
                        )} />
                        {title} — {count}
                    </div>
                </button>
                {!isCollapsed && (
                    <div className="space-y-0.5 mt-1">
                        {filtered.map(member => (
                            <MemberItem key={member.id} member={member} />
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-60 bg-zinc-50 border-l border-zinc-200 flex flex-col h-full shrink-0">
            {/* Header */}
            <div className="p-3 border-b border-zinc-200">
                <div className="flex items-center gap-2 mb-2">
                    <UsersIcon className="w-4 h-4 text-zinc-500" />
                    <h3 className="text-sm font-semibold text-zinc-900">
                        Members — {members.length}
                    </h3>
                </div>
                <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-2 top-2 text-zinc-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari member..."
                        className="w-full pl-7 pr-2 py-1.5 text-xs bg-white border border-zinc-200 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-dark"
                    />
                </div>
            </div>

            {/* Member List */}
            <div className="flex-1 overflow-y-auto p-2">
                <MemberGroup title="Online" members={onlineMembers} count={onlineMembers.length} />
                <MemberGroup title="Idle" members={idleMembers} count={idleMembers.length} />
                <MemberGroup title="Do Not Disturb" members={dndMembers} count={dndMembers.length} />
                <MemberGroup title="Offline" members={offlineMembers} count={offlineMembers.length} />
            </div>
        </div>
    );
}
