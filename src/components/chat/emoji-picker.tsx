'use client';

import { Smile } from 'lucide-react';
import { useState } from 'react';

const EMOJI_CATEGORIES = {
    'Sering Digunakan': ['😊', '❤️', '👍', '😂', '🎉', '🔥', '✨', '💯'],
    'Emosi': ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴'],
    'Gesture': ['👋', '🤚', '🖐', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
    'Simbol': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'],
};

interface EmojiPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onEmojiSelect: (emoji: string) => void;
    position?: { x: number; y: number };
}

export default function EmojiPicker({ isOpen, onClose, onEmojiSelect, position }: EmojiPickerProps) {
    const [activeCategory, setActiveCategory] = useState('Sering Digunakan');

    if (!isOpen) return null;

    const handleEmojiClick = (emoji: string) => {
        onEmojiSelect(emoji);
        onClose();
    };

    const style = position ? {
        top: `${position.y}px`,
        left: `${position.x}px`,
    } : {};

    return (
        <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={onClose} />

            {/* Emoji Picker */}
            <div
                className="fixed z-50 bg-white rounded-xl shadow-2xl border border-zinc-200 w-80 max-h-96 overflow-hidden"
                style={style}
            >
                {/* Category Tabs */}
                <div className="border-b border-zinc-100 p-2 flex gap-1 overflow-x-auto scrollbar-thin">
                    {Object.keys(EMOJI_CATEGORIES).map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors shrink-0 ${activeCategory === category
                                    ? 'bg-brand-light text-brand-dark'
                                    : 'text-zinc-600 hover:bg-zinc-100'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Emoji Grid */}
                <div className="p-3 grid grid-cols-8 gap-1 max-h-64 overflow-y-auto">
                    {EMOJI_CATEGORIES[activeCategory as keyof typeof EMOJI_CATEGORIES].map((emoji, index) => (
                        <button
                            key={`${emoji}-${index}`}
                            onClick={() => handleEmojiClick(emoji)}
                            className="text-2xl hover:bg-zinc-100 rounded-lg p-2 transition-colors cursor-pointer hover:scale-125 transform"
                            title={emoji}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                {/* Search (Future Feature) */}
                <div className="border-t border-zinc-100 p-2">
                    <div className="relative">
                        <Smile className="w-4 h-4 absolute left-2 top-2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Cari emoji..."
                            disabled
                            className="w-full pl-8 pr-3 py-1.5 text-xs bg-zinc-50 rounded-lg border border-zinc-200 cursor-not-allowed"
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
