'use client';

import { MoreVertical, Reply, Smile, Edit, Trash2, Pin } from 'lucide-react';
import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import clsx from 'clsx';
import { Message, User } from '@/types';
import EmojiPicker from './emoji-picker';

interface MessageItemProps {
    message: Message;
    user: User;
    isOwn: boolean;
    onReply?: (messageId: string) => void;
    onEdit?: (messageId: string, content: string) => void;
    onDelete?: (messageId: string) => void;
    onReaction?: (messageId: string, emoji: string) => void;
}

export default function MessageItem({
    message,
    user,
    isOwn,
    onReply,
    onEdit,
    onDelete,
    onReaction,
}: MessageItemProps) {
    const [showActions, setShowActions] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [emojiPickerPosition, setEmojiPickerPosition] = useState({ x: 0, y: 0 });
    const messageRef = useRef<HTMLDivElement>(null);

    const handleEmojiClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        const rect = (e.target as HTMLElement).getBoundingClientRect();
        setEmojiPickerPosition({
            x: rect.left,
            y: rect.top - 320 // Position above button
        });
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleAddReaction = (emoji: string) => {
        if (onReaction) {
            onReaction(message.id, emoji);
        }
    };

    return (
        <div
            ref={messageRef}
            className={clsx(
                'group flex gap-4 px-4 py-2 hover:bg-zinc-50/50 transition-colors relative',
                isOwn && 'bg-brand-light/5'
            )}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            {/* Avatar */}
            <div
                className={clsx(
                    'w-10 h-10 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-sm',
                    user.avatarUrl || 'bg-zinc-400'
                )}
            >
                {!user.avatarUrl?.includes('/') && user.username[0].toUpperCase()}
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-1">
                    <span
                        className={clsx(
                            'font-semibold text-sm hover:underline cursor-pointer',
                            user.role === 'admin' ? 'text-brand-dark' : 'text-zinc-900'
                        )}
                    >
                        {user.username}
                    </span>
                    {user.role === 'admin' && (
                        <span className="text-[10px] bg-brand-light text-brand-dark px-1.5 rounded font-bold">
                            BOT
                        </span>
                    )}
                    <span className="text-[10px] text-zinc-400">
                        {format(new Date(message.timestamp), 'HH:mm', { locale: idLocale })}
                    </span>
                    {message.editedAt && (
                        <span className="text-[10px] text-zinc-400 italic">(diedit)</span>
                    )}
                </div>

                {/* Message Text */}
                <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-wrap break-words">
                    {message.content}
                </p>

                {/* Reactions */}
                {message.reactions && Object.keys(message.reactions).length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                        {Object.entries(message.reactions).map(([emoji, count]) => (
                            <button
                                key={emoji}
                                onClick={() => handleAddReaction(emoji)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 hover:border-zinc-300 transition-colors text-xs"
                            >
                                <span>{emoji}</span>
                                <span className="text-zinc-600 font-medium">{count}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Hover Actions */}
            {showActions && (
                <div className="absolute -top-4 right-4 bg-white border border-zinc-200 rounded-lg shadow-lg p-1 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <button
                        onClick={handleEmojiClick}
                        className="p-1.5 hover:bg-zinc-100 rounded transition-colors"
                        title="Add Reaction"
                    >
                        <Smile className="w-4 h-4 text-zinc-600" />
                    </button>
                    {onReply && (
                        <button
                            onClick={() => onReply(message.id)}
                            className="p-1.5 hover:bg-zinc-100 rounded transition-colors"
                            title="Reply"
                        >
                            <Reply className="w-4 h-4 text-zinc-600" />
                        </button>
                    )}
                    {isOwn && onEdit && (
                        <button
                            onClick={() => onEdit(message.id, message.content)}
                            className="p-1.5 hover:bg-zinc-100 rounded transition-colors"
                            title="Edit"
                        >
                            <Edit className="w-4 h-4 text-zinc-600" />
                        </button>
                    )}
                    <button
                        className="p-1.5 hover:bg-zinc-100 rounded transition-colors"
                        title="More"
                    >
                        <MoreVertical className="w-4 h-4 text-zinc-600" />
                    </button>
                    {isOwn && onDelete && (
                        <button
                            onClick={() => onDelete(message.id)}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                    )}
                </div>
            )}

            {/* Emoji Picker */}
            {showEmojiPicker && (
                <EmojiPicker
                    isOpen={showEmojiPicker}
                    onClose={() => setShowEmojiPicker(false)}
                    onEmojiSelect={handleAddReaction}
                    position={emojiPickerPosition}
                />
            )}
        </div>
    );
}
