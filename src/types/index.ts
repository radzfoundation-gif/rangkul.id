export type User = {
    id: string;
    username: string;
    avatarUrl?: string; // Color code or image URL
    status: 'online' | 'idle' | 'dnd' | 'offline';
    role: 'admin' | 'moderator' | 'guest';
    customStatus?: string;
};

export type Message = {
    id: string;
    content: string;
    userId: string;
    username?: string; // Sender's display name
    createdAt: Date; // Changed from timestamp
    editedAt?: Date | null; // Added for edit tracking
    reactions?: Record<string, string[]>; // Changed from number to array of userIds
    replyToId?: string;
    // Backwards compatibility
    timestamp?: Date; // Deprecated, use createdAt
};

export type Channel = {
    id: string;
    name: string;
    type: 'text' | 'voice';
    categoryId?: string;
    position: number;
    unreadCount?: number;
};

export type Category = {
    id: string;
    name: string;
    channels: Channel[];
};

export type Server = {
    id: string;
    name: string;
    icon: string | null; // null = text fallback
    shortName: string;
    categories: Category[];
    members: User[];
};
