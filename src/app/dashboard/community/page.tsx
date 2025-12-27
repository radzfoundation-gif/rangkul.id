'use client';

import ChatArea from "@/components/community/chat-area";
import ChannelSidebar from "@/components/community/channel-sidebar";
import ServerSidebar from "@/components/community/server-sidebar";
import MemberList from "@/components/community/member-list";
import { MobileProvider, useMobile } from "@/contexts/mobile-context";
import { Menu, X, Users, Hash } from "lucide-react";
import { useChatStore } from "@/hooks/use-chat-store";

function MobileLayout() {
    const { showServerSidebar, showChannelSidebar, showMemberList, toggleServerSidebar, toggleChannelSidebar, toggleMemberList, closeAll } = useMobile();
    const { servers, activeServerId, activeChannelId } = useChatStore();

    const currentChannel = servers
        .find(s => s.id === activeServerId)
        ?.categories?.find(cat => cat.channels.some(ch => ch.id === activeChannelId))
        ?.channels.find(ch => ch.id === activeChannelId);

    return (
        <div className="md:hidden relative flex h-full w-full overflow-hidden">
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-zinc-200 flex items-center px-4 gap-3 z-50">
                <button
                    onClick={toggleChannelSidebar}
                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-zinc-500" />
                        <h1 className="text-sm font-semibold text-zinc-900 truncate">
                            {currentChannel?.name || 'Select a channel'}
                        </h1>
                    </div>
                </div>
                <button
                    onClick={toggleMemberList}
                    className="p-2 hover:bg-zinc-100 rounded-lg transition-colors"
                >
                    <Users className="w-5 h-5" />
                </button>
            </div>

            {/* Overlay */}
            {(showServerSidebar || showChannelSidebar || showMemberList) && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={closeAll}
                />
            )}

            {/* Mobile Sidebars (Drawers) */}
            <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${showServerSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex">
                    <ServerSidebar />
                </div>
            </div>

            <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${showChannelSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex pl-16"> {/* Offset for when server sidebar might be behind, though usually we show one or the other on mobile */}
                    {/* Actually better to just show channel sidebar alone or with server sidebar? 
                        On mobile Discord: usually you swipe to see server list. 
                        Here we'll keep it simple: 
                        ServerSidebar is the leftmost drawer. 
                        ChannelSidebar is a drawer. 
                    */}
                    <div className="w-[72px] h-full bg-zinc-900 shrink-0 absolute left-0" onClick={toggleServerSidebar}>  {/* Pseudo Server Bar for context or just use separate drawers */}
                        {/* Let's stick to the previous simple overlay logic but explicitly separate */}
                    </div>
                    <ChannelSidebar />
                </div>
            </div>

            {/* Reverting complex drawer logic to simple individual drawers for stability */}
            <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 ${showServerSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <ServerSidebar />
            </div>

            <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 ${showChannelSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* When channel sidebar is open, we do NOT show server sidebar to save space, or we show it? 
                    Let's use the layout from before but simplified.
                 */}
                <div className="flex h-full">
                    {/* Placeholder for server sidebar width if needed, or just full overlay */}
                    <ChannelSidebar />
                </div>
            </div>

            <div className={`fixed inset-y-0 right-0 z-40 transition-transform duration-300 ${showMemberList ? 'translate-x-0' : 'translate-x-full'}`}>
                <MemberList />
            </div>

            {/* Mobile Chat Area */}
            <div className="flex-1 w-full pt-14 bg-white">
                <ChatArea />
            </div>
        </div>
    );
}

function DesktopLayout() {
    return (
        <div className="hidden md:flex h-full w-full overflow-hidden">
            {/* Desktop: Static Flex Layout */}
            <div className="shrink-0 z-30">
                <ServerSidebar />
            </div>
            <div className="shrink-0 z-20">
                <ChannelSidebar />
            </div>
            <div className="flex-1 min-w-0 z-10 bg-white">
                <ChatArea />
            </div>
            <div className="shrink-0 z-20 border-l border-zinc-200">
                <MemberList />
            </div>
        </div>
    );
}

function CommunityContent() {
    // We render BOTH but use CSS to hide/show. 
    // This allows React to hydrate comfortably without layout shift flicker if we used window width state.

    // HOWEVER: `useMobile` hooks might conflict if shared logic tries to control desktop state.
    // Desktop layout doesn't use `useMobile` (it's static), so it's safe!
    // Mobile layout uses `useMobile`.

    return (
        <>
            {/* Specific Mobile Implementation */}
            <MobileLayoutImplementation />

            {/* Specific Desktop Implementation */}
            <DesktopLayout />
        </>
    );
}

// Redefining MobileLayout to be cleaner based on previous working code
function MobileLayoutImplementation() {
    const { showServerSidebar, showChannelSidebar, showMemberList, toggleServerSidebar, toggleChannelSidebar, toggleMemberList, closeAll } = useMobile();
    const { servers, activeServerId, activeChannelId } = useChatStore();

    const currentChannel = servers
        .find(s => s.id === activeServerId)
        ?.categories?.find(cat => cat.channels.some(ch => ch.id === activeChannelId))
        ?.channels.find(ch => ch.id === activeChannelId);

    return (
        <div className="md:hidden relative flex h-full w-full overflow-hidden bg-white">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-zinc-200 flex items-center px-4 gap-3 z-50">
                <button onClick={toggleChannelSidebar} className="p-2 hover:bg-zinc-100 rounded-lg">
                    <Menu className="w-5 h-5" />
                </button>
                <div className="flex-1 font-semibold truncate">
                    # {currentChannel?.name || 'Home'}
                </div>
                <button onClick={toggleMemberList} className="p-2 hover:bg-zinc-100 rounded-lg">
                    <Users className="w-5 h-5" />
                </button>
            </div>

            {/* Overlays */}
            {(showServerSidebar || showChannelSidebar || showMemberList) && (
                <div className="fixed inset-0 bg-black/50 z-40" onClick={closeAll} />
            )}

            {/* Server Sidebar Drawer */}
            <div className={`fixed inset-y-0 left-0 z-50 w-[72px] transition-transform duration-300 ${showServerSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <ServerSidebar />
            </div>

            {/* Channel Sidebar Drawer */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 transition-transform duration-300 ${showChannelSidebar ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="h-full flex">
                    <div className="w-[72px] shrink-0" onClick={toggleServerSidebar}></div> {/* Spacer/Trigger */}
                    <ChannelSidebar />
                </div>
            </div>

            {/* Member List Drawer */}
            <div className={`fixed inset-y-0 right-0 z-50 transition-transform duration-300 ${showMemberList ? 'translate-x-0' : 'translate-x-full'}`}>
                <MemberList />
            </div>

            {/* Content */}
            <div className="flex-1 pt-14 h-full">
                <ChatArea />
            </div>
        </div>
    )
}

export default function CommunityPage() {
    return (
        <MobileProvider>
            <CommunityContent />
        </MobileProvider>
    );
}
