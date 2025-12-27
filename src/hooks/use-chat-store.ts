'use client';

import { create } from 'zustand';
import { Server, Channel, Message, User } from '@/types';
import { MOCK_SERVERS, MOCK_MESSAGES, MOCK_USERS } from '@/data/mock-data';
import { isFirebaseConfigured } from '@/lib/firebase';
import { messagesApi, serversApi } from '@/lib/firestore';
import type { Message as FirestoreMessage } from '@/types/firestore';

interface ChatState {
    // Data
    servers: Server[];
    activeServerId: string;
    activeChannelId: string;
    messages: Record<string, Message[]>; // channelId -> messages

    // Real-time
    unsubscribe: (() => void) | null;
    unsubscribeChannels?: (() => void) | null;

    // Actions
    setActiveServer: (serverId: string) => void;
    setActiveChannel: (channelId: string) => void;
    sendMessage: (userId: string, username: string, content: string, replyToId?: string) => Promise<void>;
    updateMessage: (messageId: string, content: string) => Promise<void>;
    deleteMessage: (messageId: string) => Promise<void>;
    addReaction: (messageId: string, userId: string, emoji: string) => Promise<void>;
    removeReaction: (messageId: string, userId: string, emoji: string) => Promise<void>;

    // Server management
    createServer: (name: string, userId: string, iconUrl?: string) => Promise<Server | null>;
    leaveServer: (serverId: string, userId: string) => Promise<void>;
    init: (userId: string) => void;
}

// Helper to convert Firestore message to app message
const convertFirestoreMessage = (msg: FirestoreMessage): Message => ({
    id: msg.id,
    content: msg.content,
    userId: msg.userId,
    createdAt: msg.createdAt,
    editedAt: msg.editedAt,
    reactions: msg.reactions,
    replyToId: msg.replyToId || undefined,
    timestamp: msg.createdAt, // Backwards compatibility
});

export const useChatStore = create<ChatState>((set, get) => ({
    servers: MOCK_SERVERS,
    activeServerId: MOCK_SERVERS[0].id,
    activeChannelId: MOCK_SERVERS[0].categories[0].channels[0].id,
    messages: MOCK_MESSAGES,
    unsubscribe: null,

    setActiveServer: (serverId) => {
        const server = get().servers.find(s => s.id === serverId);
        if (!server) return;

        const firstChannel = server.categories[0]?.channels[0]?.id;
        set({
            activeServerId: serverId,
            activeChannelId: firstChannel || ''
        });
    },

    setActiveChannel: (channelId) => {
        // Unsubscribe from previous channel
        const { unsubscribe } = get();
        if (unsubscribe) {
            unsubscribe();
        }

        set({ activeChannelId: channelId });

        // Subscribe to new channel if Firebase configured
        if (isFirebaseConfigured()) {
            const unsub = messagesApi.subscribeToChannel(
                channelId,
                (firebaseMessages) => {
                    const convertedMessages = firebaseMessages.map(convertFirestoreMessage);
                    set({
                        messages: {
                            ...get().messages,
                            [channelId]: convertedMessages,
                        }
                    });
                },
                (error) => {
                    console.error('Error subscribing to channel:', error);
                }
            );
            set({ unsubscribe: unsub });
        }
    },

    sendMessage: async (userId: string, username: string, content: string, replyToId?: string) => {
        const { activeChannelId, messages } = get();
        if (!content.trim()) return;

        console.log('💬 sendMessage called:', { userId, username, content, activeChannelId, isFirebaseConfigured: isFirebaseConfigured() });

        const tempId = `temp-${Date.now()}`;
        const newMessage: Message = {
            id: tempId,
            content,
            userId,
            createdAt: new Date(),
            timestamp: new Date(),
            replyToId,
            reactions: {},
        };

        // Optimistic update
        set({
            messages: {
                ...messages,
                [activeChannelId]: [...(messages[activeChannelId] || []), newMessage]
            }
        });

        // Firebase or mock mode
        if (!isFirebaseConfigured()) {
            console.log('🔔 Mock mode - message not saved to Firebase');
            // Mock mode: just keep optimistic update
            setTimeout(() => {
                set({
                    messages: {
                        ...get().messages,
                        [activeChannelId]: get().messages[activeChannelId].map(m =>
                            m.id === tempId ? { ...m, id: `msg-${Date.now()}` } : m
                        )
                    }
                });
            }, 100);
            return;
        }

        // Firebase mode
        console.log('🔥 Firebase mode - sending to Firestore');
        try {
            const result = await messagesApi.send(
                activeChannelId,
                userId,
                content,
                replyToId,
                username
            );

            if (result.success) {
                // Replace temp with real ID
                set({
                    messages: {
                        ...get().messages,
                        [activeChannelId]: get().messages[activeChannelId].map(m =>
                            m.id === tempId ? { ...m, id: result.data } : m
                        )
                    }
                });
            } else {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Rollback
            set({
                messages: {
                    ...get().messages,
                    [activeChannelId]: get().messages[activeChannelId].filter(m => m.id !== tempId)
                }
            });
        }
    },

    updateMessage: async (messageId, content) => {
        const { messages, activeChannelId } = get();
        const oldMessages = messages[activeChannelId];

        // Optimistic update
        set({
            messages: {
                ...messages,
                [activeChannelId]: messages[activeChannelId].map(m =>
                    m.id === messageId ? { ...m, content, editedAt: new Date() } : m
                )
            }
        });

        if (!isFirebaseConfigured()) return;

        try {
            const result = await messagesApi.update(messageId, content);
            if (!result.success) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Error updating message:', error);
            // Rollback
            set({
                messages: {
                    ...get().messages,
                    [activeChannelId]: oldMessages
                }
            });
        }
    },

    deleteMessage: async (messageId) => {
        const { activeChannelId, messages } = get();
        const oldMessages = messages[activeChannelId];

        // Optimistic delete
        set({
            messages: {
                ...get().messages,
                [activeChannelId]: get().messages[activeChannelId].filter(m => m.id !== messageId)
            }
        });

        if (!isFirebaseConfigured()) return;

        try {
            const result = await messagesApi.delete(messageId);
            if (!result.success) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            // Rollback
            set({
                messages: {
                    ...get().messages,
                    [activeChannelId]: oldMessages
                }
            });
        }
    },

    addReaction: async (messageId, userId, emoji) => {
        const { messages, activeChannelId } = get();
        const oldMessages = messages[activeChannelId];

        // Optimistic update - add userId to reaction array
        set({
            messages: {
                ...messages,
                [activeChannelId]: messages[activeChannelId].map(m => {
                    if (m.id !== messageId) return m;
                    const reactions = m.reactions || {};
                    const existingReactions = reactions[emoji] || [];

                    // Don't add if user already reacted
                    if (existingReactions.includes(userId)) return m;

                    return {
                        ...m,
                        reactions: {
                            ...reactions,
                            [emoji]: [...existingReactions, userId]
                        }
                    };
                })
            }
        });

        if (!isFirebaseConfigured()) return;

        try {
            const result = await messagesApi.addReaction(messageId, userId, emoji);
            if (!result.success) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Error adding reaction:', error);
            // Rollback
            set({
                messages: {
                    ...get().messages,
                    [activeChannelId]: oldMessages
                }
            });
        }
    },

    removeReaction: async (messageId, userId, emoji) => {
        const { messages, activeChannelId } = get();
        const oldMessages = messages[activeChannelId];

        // Optimistic update - remove userId from reaction array
        set({
            messages: {
                ...messages,
                [activeChannelId]: messages[activeChannelId].map(m => {
                    if (m.id !== messageId) return m;
                    const reactions = m.reactions || {};
                    const existingReactions = reactions[emoji] || [];

                    const updatedReactions = existingReactions.filter(id => id !== userId);

                    // Remove emoji key if no reactions left
                    if (updatedReactions.length === 0) {
                        const { [emoji]: _, ...rest } = reactions;
                        return { ...m, reactions: rest };
                    }

                    return {
                        ...m,
                        reactions: {
                            ...reactions,
                            [emoji]: updatedReactions
                        }
                    };
                })
            }
        });

        if (!isFirebaseConfigured()) return;

        try {
            const result = await messagesApi.removeReaction(messageId, userId, emoji);
            if (!result.success) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Error removing reaction:', error);
            // Rollback
            set({
                messages: {
                    ...get().messages,
                    [activeChannelId]: oldMessages
                }
            });
        }
    },

    createServer: async (name, userId, iconUrl) => {
        if (!isFirebaseConfigured()) {
            // Mock mode
            const newServer: Server = {
                id: `s-${Date.now()}`,
                name,
                shortName: name.substring(0, 2).toUpperCase(),
                icon: iconUrl || null,
                members: [],
                categories: [{
                    id: 'cat-general',
                    name: 'GENERAL',
                    channels: [{
                        id: `c-${Date.now()}`,
                        name: 'general',
                        type: 'text',
                        categoryId: 'cat-general',
                        position: 0
                    }]
                }]
            };

            set({ servers: [...get().servers, newServer] });
            return newServer;
        }

        // Firebase mode
        try {
            const result = await serversApi.create(name, userId, iconUrl);
            if (result.success) {
                // Return temp object, real one comes from subscription
                return { id: result.data, name } as any;
            } else {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Error creating server:', error);
            return null;
        }
    },

    leaveServer: async (serverId, userId) => {
        const { servers, activeServerId } = get();

        // Optimistic update
        set({
            servers: servers.filter(s => s.id !== serverId)
        });

        // If leaving active server, switch to another one or null
        if (serverId === activeServerId) {
            const remainingServers = servers.filter(s => s.id !== serverId);
            if (remainingServers.length > 0) {
                get().setActiveServer(remainingServers[0].id);
            } else {
                set({ activeServerId: '', activeChannelId: '' });
            }
        }

        if (!isFirebaseConfigured()) return;

        try {
            // Note: In real app we need a separate API call to remove member
            // creating a temporary direct call here or assuming logic exists
            const { serverMembersApi } = await import('@/lib/firestore');
            await serverMembersApi.remove(serverId, userId);
        } catch (error) {
            console.error('Error leaving server:', error);
            // Rollback only if critical, but for leaving usually we just accept UI change
        }
    },

    init: (userId: string) => {
        if (!isFirebaseConfigured()) return;

        // Subscribe to servers for this user
        const unsub = serversApi.subscribeToUserServers(
            userId,
            (servers) => {
                const currentServers = get().servers;

                // Map new server list
                const mappedServers: Server[] = servers.map(s => {
                    // unexpected side effect: finding existing server to preserve its categories if already fetched
                    const existing = currentServers.find(cs => cs.id === s.id);
                    return {
                        id: s.id,
                        name: s.name,
                        shortName: s.name.substring(0, 2).toUpperCase(),
                        icon: s.iconUrl || null,
                        members: [],
                        // Preserve existing categories if available to avoid flicker/clearing
                        categories: existing ? existing.categories : []
                    };
                });

                set({ servers: mappedServers });
            },
            (error) => console.error('Servers subscription error:', error)
        );

        // Listen to active server changes to fetch channels
        useChatStore.subscribe((state, prevState) => {
            if (state.activeServerId !== prevState.activeServerId && state.activeServerId && isFirebaseConfigured()) {
                const { activeServerId, unsubscribeChannels } = state as any; // Need to add unsubscribeChannels to state type

                // Clean up previous subscription
                if (unsubscribeChannels) {
                    unsubscribeChannels();
                }

                // Subscribe to channels for new server
                // We need to implement subscribeToChannels in serversApi first or use query here
                Promise.all([
                    import('@/lib/firebase'),
                    import('firebase/firestore')
                ]).then(([{ db }, { collection, query, where, onSnapshot }]) => {

                    const q = query(
                        collection(db, 'channels'),
                        where('serverId', '==', activeServerId)
                    );

                    const unsubChannels = onSnapshot(q, (snapshot: any) => {
                        const channels = snapshot.docs.map((doc: any) => ({
                            id: doc.id,
                            ...doc.data()
                        }));

                        // Organize into "General" category for now (simplification)
                        // In real app, we would fetch categories separately or group by categoryId
                        const updatedServers = get().servers.map(s => {
                            if (s.id !== activeServerId) return s;

                            return {
                                ...s,
                                categories: [{
                                    id: 'default-cat',
                                    name: 'CHANNELS',
                                    channels: channels.map((c: any) => ({
                                        id: c.id,
                                        name: c.name,
                                        type: c.type,
                                        categoryId: 'default-cat',
                                        position: c.position || 0,
                                        unreadCount: 0
                                    }))
                                }]
                            };
                        });

                        set({ servers: updatedServers });

                        // If no active channel, select first one
                        const { activeChannelId } = get();
                        if (!activeChannelId && channels.length > 0) {
                            get().setActiveChannel(channels[0].id);
                        }
                    });

                    // Store unsub function in state (need to add to interface)
                    set({ unsubscribeChannels: unsubChannels } as any);
                }).catch(err => console.error(err));
            }
        });
    }
}));
