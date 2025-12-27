'use client';

import { Plus, Compass, Home } from 'lucide-react';
import Link from 'next/link';
import { useChatStore } from '@/hooks/use-chat-store';
import clsx from 'clsx';
import { useState } from 'react';
import CreateServerModal from '@/components/modals/create-server-modal';

export default function ServerSidebar() {
    const { servers, activeServerId, setActiveServer } = useChatStore();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="w-[72px] bg-zinc-50 border-r border-zinc-200 flex flex-col items-center py-4 gap-3 shrink-0 h-full overflow-y-auto hidden-scrollbar">

            {/* Home / Dashboard Link */}
            <Link
                href="/dashboard"
                className="w-12 h-12 bg-white rounded-[24px] hover:rounded-[16px] flex items-center justify-center shadow-sm cursor-pointer transition-all duration-300 group relative"
                title="Dashboard Utama"
            >
                <div className="absolute left-0 w-1 h-0 bg-zinc-900 rounded-r-lg transition-all duration-300 group-hover:h-5 -translate-x-full"></div>
                <Home className="w-5 h-5 text-zinc-500 group-hover:text-brand-dark" />
            </Link>

            <div className="w-8 h-[2px] bg-zinc-200 rounded-full" />

            {/* Server List */}
            {servers.map((server) => {
                const isActive = activeServerId === server.id;
                return (
                    <button
                        key={server.id}
                        onClick={() => setActiveServer(server.id)}
                        className={clsx(
                            "w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300 group relative",
                            isActive ? "bg-brand-dark rounded-[16px]" : "bg-white hover:bg-brand-dark hover:rounded-[16px]"
                        )}
                        title={server.name}
                    >
                        {/* Active Indicator */}
                        <div className={clsx(
                            "absolute -left-4 w-1 bg-zinc-900 rounded-r-lg transition-all duration-300",
                            isActive ? "h-8" : "h-2 group-hover:h-5 opacity-0 group-hover:opacity-100"
                        )}></div>

                        <span className={clsx(
                            "text-xs font-bold transition-colors",
                            isActive ? "text-brand-light" : "text-zinc-600 group-hover:text-brand-light"
                        )}>
                            {server.shortName}
                        </span>
                    </button>
                );
            })}

            {/* Add Server */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-12 h-12 rounded-[24px] bg-white border border-green-200 border-dashed hover:border-brand-dark hover:border-solid hover:rounded-[16px] flex items-center justify-center text-green-600 hover:text-brand-dark hover:bg-brand-light/20 transition-all duration-300 group mt-auto"
                title="Buat Server Baru"
            >
                <Plus className="w-6 h-6" />
            </button>

            {/* Explore */}
            <button className="w-12 h-12 rounded-[24px] bg-white hover:bg-green-100 hover:rounded-[16px] flex items-center justify-center text-zinc-500 hover:text-green-700 transition-all duration-300 group">
                <Compass className="w-6 h-6" />
            </button>

            <CreateServerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
}
