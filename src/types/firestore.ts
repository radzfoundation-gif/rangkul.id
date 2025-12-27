// Firestore Type Definitions

export interface Message {
    id: string;
    channelId: string;
    userId: string;
    content: string;
    replyToId?: string | null;
    reactions: Record<string, string[]>; // emoji -> array of userIds
    createdAt: Date;
    editedAt: Date | null;
}

export interface Server {
    id: string;
    name: string;
    ownerId: string;
    iconUrl?: string | null;
    createdAt: Date;
}

export interface Channel {
    id: string;
    serverId: string;
    name: string;
    type: 'text' | 'voice';
    categoryId?: string | null;
    position: number;
    createdAt: Date;
}

export interface ServerMember {
    id: string;
    serverId: string;
    userId: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: Date;
}

export interface User {
    id: string;
    username: string;
    avatar?: string;
    status?: 'online' | 'offline' | 'away';
    createdAt: Date;
}

// API Response types
export interface FirestoreError {
    code: string;
    message: string;
}

export type FirestoreResult<T> =
    | { success: true; data: T }
    | { success: false; error: FirestoreError };
