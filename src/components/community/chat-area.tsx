import { Hash, Bell, Pin, Users, Search, HelpCircle, Gift, PlusCircle, Smile, Sticker, Send, ArrowDown } from 'lucide-react';
import { useChatStore } from '@/hooks/use-chat-store';
import { MOCK_USERS } from '@/data/mock-data';
import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { format } from 'date-fns';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import { useUserContext } from '@/contexts/user-context';
import UserAvatar from '@/components/ui/user-avatar';

export default function ChatArea() {
    const { data: session } = useSession();
    const { userProfile } = useUserContext();
    const { servers, activeServerId, activeChannelId, messages, sendMessage, addReaction, removeReaction, setActiveChannel } = useChatStore();

    // Local State
    const [inputValue, setInputValue] = useState('');
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isAtBottom, setIsAtBottom] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Derived Data
    const currentUserId = session?.user?.id || 'guest';
    const currentUsername = userProfile?.nickname || session?.user?.name || 'Guest';
    const currentUserAvatar = userProfile?.avatarColor || 'bg-brand-dark';

    // Derived Data
    const activeServer = servers.find(s => s.id === activeServerId);
    // Find channel deeply
    const currentChannel = servers
        .find(s => s.id === activeServerId)
        ?.categories?.find(cat => cat.channels.some(ch => ch.id === activeChannelId))
        ?.channels.find(ch => ch.id === activeChannelId);


    const channelMessages = messages[activeChannelId] || [];

    // Check if user is at bottom
    const checkIfAtBottom = () => {
        if (!scrollRef.current) return true;
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        const threshold = 100; // pixels from bottom
        return scrollHeight - scrollTop - clientHeight < threshold;
    };

    // Handle scroll event
    const handleScroll = () => {
        const atBottom = checkIfAtBottom();
        setIsAtBottom(atBottom);
        setShowScrollButton(!atBottom);
    };

    // Smart auto-scroll: only scroll if user was already at bottom
    useEffect(() => {
        if (isAtBottom && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [channelMessages, isAtBottom]);

    // Force scroll on channel change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'auto' });
            setIsAtBottom(true);
            setShowScrollButton(false);
        }
    }, [activeChannelId]);

    // Trigger subscription on mount and channel change
    useEffect(() => {
        if (activeChannelId) {
            setActiveChannel(activeChannelId);
        }
    }, [activeChannelId, setActiveChannel]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setIsAtBottom(true);
        setShowScrollButton(false);
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;
        sendMessage(currentUserId, currentUsername, inputValue);
        setInputValue('');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    const handleReactionClick = (messageId: string, emoji: string) => {
        const message = channelMessages.find(m => m.id === messageId);
        if (!message) return;

        const reactions = message.reactions || {};
        const userIds = reactions[emoji] || [];

        // Toggle reaction
        if (userIds.includes(currentUserId)) {
            removeReaction(messageId, currentUserId, emoji);
        } else {
            addReaction(messageId, currentUserId, emoji);
        }
    };

    if (!currentChannel) {
        return (
            <div className="flex-1 flex items-center justify-center bg-white text-zinc-400 flex-col gap-2">
                <Hash className="w-12 h-12 opacity-20" />
                <p>Pilih channel untuk memulai.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white h-full overflow-hidden relative">
            {/* Chat Header */}
            <header className="h-12 px-4 border-b border-zinc-200 flex items-center justify-between shrink-0 bg-white">
                <div className="flex items-center gap-3">
                    <Hash className="w-5 h-5 text-zinc-400" />
                    <div className="flex flex-col">
                        <span className="font-bold text-base text-zinc-900 leading-none">{currentChannel.name}</span>
                        <span className="text-[10px] text-zinc-500 font-medium truncate max-w-[200px]">
                            {currentChannel.type === 'voice' ? 'Voice Channel' : 'Ruang aman Rangkul Project'}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4 text-zinc-400">
                    <Bell className="w-5 h-5 cursor-pointer hover:text-zinc-600" />
                    <Pin className="w-5 h-5 cursor-pointer hover:text-zinc-600" />
                    <Users className="w-5 h-5 cursor-pointer hover:text-zinc-600" />
                    <div className="relative hidden md:block">
                        <input
                            type="text"
                            placeholder="Search"
                            className="bg-zinc-100 text-xs rounded-full pl-3 pr-8 py-1 focus:outline-none focus:ring-1 focus:ring-brand-dark w-36 transition-all focus:w-48"
                        />
                        <Search className="w-3.5 h-3.5 absolute right-3 top-1.5 text-zinc-400" />
                    </div>
                    <HelpCircle className="w-5 h-5 cursor-pointer hover:text-zinc-600" />
                </div>
            </header>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-4 space-y-6"
            >

                {/* Welcome Message */}
                <div className="mt-8 mb-12">
                    <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-4">
                        <Hash className="w-8 h-8 text-zinc-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-zinc-900 mb-2">Selamat datang di #{currentChannel.name}!</h1>
                    <p className="text-zinc-500 text-sm">
                        Ini adalah awal dari channel <span className="font-medium text-zinc-800">#{currentChannel.name}</span>.
                        Silakan bercerita dengan leluasa.
                    </p>
                </div>

                {/* Dynamic Messages */}
                {channelMessages.map((msg, index) => {
                    const isMe = msg.userId === currentUserId;
                    const messageTime = msg.createdAt || new Date();

                    // Show avatar only if previous message was from different user
                    const prevMsg = channelMessages[index - 1];
                    const isSameUser = prevMsg?.userId === msg.userId;
                    const showHeader = !isSameUser;

                    return (
                        <div
                            key={msg.id}
                            className={clsx(
                                "group flex gap-3 hover:bg-zinc-50/50 -mx-4 px-4 py-1 transition-colors relative",
                                showHeader ? "mt-4" : "mt-0.5"
                            )}
                        >
                            {/* Avatar Column */}
                            <div className="w-10 flex-shrink-0 pt-1">
                                {showHeader ? (
                                    <UserAvatar
                                        photoURL={isMe ? userProfile?.photoURL : null}
                                        fallbackColor={isMe ? currentUserAvatar : 'bg-zinc-400'}
                                        name={isMe ? currentUsername : (msg.username || 'Unknown')}
                                        size="md"
                                    />
                                ) : (
                                    <div className="w-10 text-[10px] text-zinc-300 text-center opacity-0 group-hover:opacity-100 pt-1 select-none">
                                        {format(messageTime, 'HH:mm')}
                                    </div>
                                )}
                            </div>

                            {/* Content Column */}
                            <div className="flex-1 min-w-0">
                                {showHeader && (
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <span className={clsx(
                                            "font-bold text-sm hover:underline cursor-pointer",
                                            isMe ? "text-brand-dark" : "text-zinc-900"
                                        )}>
                                            {msg.username || 'Unknown'}
                                        </span>
                                        <span className="text-[10px] text-zinc-400 font-medium">
                                            {format(messageTime, "'today at' HH:mm")}
                                        </span>
                                        {isMe && (
                                            <span className="px-1.5 py-0.5 bg-brand-light/20 text-brand-dark text-[10px] rounded font-bold uppercase tracking-wide">
                                                YOU
                                            </span>
                                        )}
                                    </div>
                                )}

                                <p className={clsx(
                                    "text-[15px] leading-relaxed whitespace-pre-wrap break-words",
                                    "text-zinc-700"
                                )}>
                                    {msg.content}
                                    {msg.editedAt && (
                                        <span className="text-[10px] text-zinc-400 ml-1 select-none">(edited)</span>
                                    )}
                                </p>

                                {/* Reactions */}
                                {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1.5">
                                        {Object.entries(msg.reactions).map(([emoji, userIds]) => {
                                            const count = userIds.length;
                                            const hasReacted = userIds.includes(currentUserId);

                                            return (
                                                <button
                                                    key={emoji}
                                                    onClick={() => handleReactionClick(msg.id, emoji)}
                                                    className={clsx(
                                                        "flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-medium border transition-all active:scale-95 select-none",
                                                        hasReacted
                                                            ? "bg-brand-light/20 border-brand-light/50 text-brand-dark"
                                                            : "bg-zinc-50 border-zinc-200 text-zinc-600 hover:bg-zinc-100"
                                                    )}
                                                >
                                                    <span>{emoji}</span>
                                                    {count > 0 && <span className={hasReacted ? "font-bold" : ""}>{count}</span>}
                                                </button>
                                            );
                                        })}

                                        {/* Add reaction button */}
                                        <button
                                            onClick={() => handleReactionClick(msg.id, '❤️')}
                                            className="px-2 py-0.5 rounded-lg text-xs bg-zinc-50 border border-zinc-200 hover:border-brand-dark opacity-0 group-hover:opacity-100 transition-all ml-1"
                                        >
                                            <Smile className="w-3 h-3 text-zinc-400" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}

                {/* Scroll anchor */}
                <div ref={messagesEndRef} />
            </div>

            {/* Scroll to bottom button */}
            {
                showScrollButton && (
                    <button
                        onClick={scrollToBottom}
                        className="absolute bottom-24 right-8 bg-brand-dark text-white p-3 rounded-full shadow-lg hover:scale-110 transition-all z-10 animate-in fade-in slide-in-from-bottom-4"
                    >
                        <ArrowDown className="w-5 h-5" />
                    </button>
                )
            }

            {/* Input Area */}
            <div className="p-4 px-6 shrink-0 bg-white">
                <div className="bg-zinc-100 rounded-lg p-2.5 flex items-center gap-3 border border-transparent focus-within:border-brand-dark/30 transition-colors">
                    <button className="text-zinc-400 hover:text-zinc-600 p-1 rounded-full hover:bg-zinc-200 transition-colors">
                        <PlusCircle className="w-5 h-5" />
                    </button>

                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Kirim pesan ke #${currentChannel.name}`}
                        className="flex-1 bg-transparent text-sm focus:outline-none text-zinc-800 placeholder:text-zinc-400"
                    />

                    <div className="flex items-center gap-2 text-zinc-400">
                        <Gift className="w-5 h-5 cursor-pointer hover:text-zinc-600 hidden sm:block" />
                        <Sticker className="w-5 h-5 cursor-pointer hover:text-zinc-600 hidden sm:block" />
                        <Smile className="w-5 h-5 cursor-pointer hover:text-zinc-600" />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className={clsx("p-1.5 rounded-md transition-all", inputValue.trim() ? "bg-brand-dark text-brand-light hover:scale-110" : "text-zinc-300 cursor-default")}
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div >
    );
}
