import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    getDocs,
    serverTimestamp,
    Timestamp,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';
import { db } from './firebase';
import type { Message, Server, Channel, ServerMember, FirestoreResult, FirestoreError } from '@/types/firestore';

// Collections
export const COLLECTIONS = {
    MESSAGES: 'messages',
    SERVERS: 'servers',
    CHANNELS: 'channels',
    USERS: 'users',
    SERVER_MEMBERS: 'server_members',
} as const;

// Helper to handle Firestore errors
const handleError = (error: any): FirestoreError => {
    console.error('Firestore error:', error);
    return {
        code: error.code || 'unknown',
        message: error.message || 'An unknown error occurred'
    };
};

// Message operations
export const messagesApi = {
    async send(channelId: string, userId: string, content: string, replyToId?: string, username?: string): Promise<FirestoreResult<string>> {
        try {
            console.log('📤 Sending message to Firestore:', { channelId, userId, username, content });
            const docRef = await addDoc(collection(db, COLLECTIONS.MESSAGES), {
                channelId,
                userId,
                username: username || 'Unknown',
                content,
                replyToId: replyToId || null,
                reactions: {},
                createdAt: serverTimestamp(),
                editedAt: null,
            });
            console.log('✅ Message sent successfully:', docRef.id);
            return { success: true, data: docRef.id };
        } catch (error) {
            console.error('❌ Error sending message:', error);
            return { success: false, error: handleError(error) };
        }
    },

    async update(messageId: string, content: string): Promise<FirestoreResult<void>> {
        try {
            const msgRef = doc(db, COLLECTIONS.MESSAGES, messageId);
            await updateDoc(msgRef, {
                content,
                editedAt: serverTimestamp(),
            });
            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    async delete(messageId: string): Promise<FirestoreResult<void>> {
        try {
            const msgRef = doc(db, COLLECTIONS.MESSAGES, messageId);
            await deleteDoc(msgRef);
            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    async addReaction(messageId: string, userId: string, emoji: string): Promise<FirestoreResult<void>> {
        try {
            const msgRef = doc(db, COLLECTIONS.MESSAGES, messageId);
            await updateDoc(msgRef, {
                [`reactions.${emoji}`]: arrayUnion(userId)
            });
            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    async removeReaction(messageId: string, userId: string, emoji: string): Promise<FirestoreResult<void>> {
        try {
            const msgRef = doc(db, COLLECTIONS.MESSAGES, messageId);
            await updateDoc(msgRef, {
                [`reactions.${emoji}`]: arrayRemove(userId)
            });
            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    subscribeToChannel(
        channelId: string,
        onUpdate: (messages: Message[]) => void,
        onError?: (error: any) => void
    ): () => void {
        console.log('🔔 Subscribing to channel:', channelId);

        const q = query(
            collection(db, COLLECTIONS.MESSAGES),
            where('channelId', '==', channelId),
            orderBy('createdAt', 'asc')
        );

        return onSnapshot(
            q,
            (snapshot) => {
                console.log('📨 Received', snapshot.docs.length, 'messages for channel:', channelId);
                const messages: Message[] = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        channelId: data.channelId,
                        content: data.content,
                        userId: data.userId,
                        username: data.username || 'Unknown',
                        createdAt: data.createdAt?.toDate() || new Date(),
                        editedAt: data.editedAt?.toDate() || null,
                        reactions: data.reactions || {},
                        replyToId: data.replyToId || undefined,
                    };
                });
                onUpdate(messages);
            },
            (error) => {
                console.error('❌ Error in subscription:', error);
                onError?.(error);
            }
        );
    },
};

// Server operations
export const serversApi = {
    async create(name: string, ownerId: string, iconUrl?: string): Promise<FirestoreResult<string>> {
        try {
            const serverRef = await addDoc(collection(db, COLLECTIONS.SERVERS), {
                name,
                ownerId,
                iconUrl: iconUrl || null,
                createdAt: serverTimestamp(),
            });

            // Create default channel
            await addDoc(collection(db, COLLECTIONS.CHANNELS), {
                serverId: serverRef.id,
                name: 'general',
                type: 'text',
                categoryId: null,
                position: 0,
                createdAt: serverTimestamp(),
            });

            // Add owner as member
            await addDoc(collection(db, COLLECTIONS.SERVER_MEMBERS), {
                serverId: serverRef.id,
                userId: ownerId,
                role: 'owner',
                joinedAt: serverTimestamp(),
            });

            return { success: true, data: serverRef.id };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    async getAll(userId: string): Promise<FirestoreResult<Server[]>> {
        try {
            const q = query(
                collection(db, COLLECTIONS.SERVERS),
                where('ownerId', '==', userId)
            );
            const snapshot = await getDocs(q);
            const servers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: toDate(doc.data().createdAt)
            })) as Server[];
            return { success: true, data: servers };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    subscribeToUserServers(
        userId: string,
        onUpdate: (servers: Server[]) => void,
        onError?: (error: any) => void
    ): () => void {
        console.log('🔔 Subscribing to servers for user:', userId);

        const q = query(
            collection(db, COLLECTIONS.SERVER_MEMBERS),
            where('userId', '==', userId)
        );

        return onSnapshot(
            q,
            async (snapshot) => {
                try {
                    const serverIds = snapshot.docs.map(doc => doc.data().serverId);
                    console.log('MEMBERSHIP UPDATE:', serverIds);

                    if (serverIds.length === 0) {
                        onUpdate([]);
                        return;
                    }

                    // Fetch server details
                    // Note: This is an N+1 query pattern which is acceptable for client-side lists of reasonable size (<100)
                    // For better performance with large lists, use 'in' queries or denormalize server data into member record
                    const servers: Server[] = [];
                    const { getDoc, doc } = await import('firebase/firestore'); // Import dynamically to ensure it's available

                    for (const serverId of serverIds) {
                        try {
                            const serverDoc = await getDoc(doc(db, COLLECTIONS.SERVERS, serverId));
                            if (serverDoc.exists()) {
                                const data = serverDoc.data();
                                servers.push({
                                    id: serverDoc.id,
                                    name: data.name,
                                    ownerId: data.ownerId,
                                    iconUrl: data.iconUrl || null,
                                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                                    members: [],
                                    categories: []
                                } as any);
                            }
                        } catch (e) {
                            console.error(`Failed to load server ${serverId}`, e);
                        }
                    }

                    onUpdate(servers);
                } catch (err) {
                    console.error('Error processing server membership update:', err);
                    onError?.(err);
                }
            },
            (error) => {
                console.error('❌ Error in servers subscription:', error);
                onError?.(error);
            }
        );
    },
};

// Server Members operations
export const serverMembersApi = {
    async add(serverId: string, userId: string, role: 'admin' | 'member' = 'member'): Promise<FirestoreResult<string>> {
        try {
            const docRef = await addDoc(collection(db, COLLECTIONS.SERVER_MEMBERS), {
                serverId,
                userId,
                role,
                joinedAt: serverTimestamp(),
            });
            return { success: true, data: docRef.id };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    async remove(serverId: string, userId: string): Promise<FirestoreResult<void>> {
        try {
            const q = query(
                collection(db, COLLECTIONS.SERVER_MEMBERS),
                where('serverId', '==', serverId),
                where('userId', '==', userId)
            );
            const snapshot = await getDocs(q);
            const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    async getMembers(serverId: string): Promise<FirestoreResult<ServerMember[]>> {
        try {
            const q = query(
                collection(db, COLLECTIONS.SERVER_MEMBERS),
                where('serverId', '==', serverId)
            );
            const snapshot = await getDocs(q);
            const members = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                joinedAt: toDate(doc.data().joinedAt)
            })) as ServerMember[];
            return { success: true, data: members };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },
};

// Invite operations
export const invitesApi = {
    async create(serverId: string, userId: string, serverName: string): Promise<FirestoreResult<string>> {
        try {
            // Generate 9-char alphanumeric code
            const code = Math.random().toString(36).substring(2, 11).toUpperCase();

            const docRef = await addDoc(collection(db, 'invites'), {
                code,
                serverId,
                serverName,
                createdBy: userId,
                createdAt: serverTimestamp(),
                expiresAt: null,
                maxUses: null,
                uses: 0
            });

            return { success: true, data: code };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    async validate(code: string): Promise<FirestoreResult<any>> {
        try {
            const q = query(
                collection(db, 'invites'),
                where('code', '==', code.toUpperCase())
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                return { success: false, error: { code: 'not-found', message: 'Invite not found' } };
            }

            const inviteDoc = snapshot.docs[0];
            const invite = inviteDoc.data();

            // Check expiry
            if (invite.expiresAt && invite.expiresAt.toDate() < new Date()) {
                return { success: false, error: { code: 'expired', message: 'Invite expired' } };
            }

            // Check max uses
            if (invite.maxUses && invite.uses >= invite.maxUses) {
                return { success: false, error: { code: 'max-uses', message: 'Invite limit reached' } };
            }

            return {
                success: true,
                data: {
                    id: inviteDoc.id,
                    ...invite,
                    createdAt: invite.createdAt?.toDate() || new Date()
                }
            };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    },

    async consume(inviteId: string): Promise<FirestoreResult<void>> {
        try {
            const inviteRef = doc(db, 'invites', inviteId);
            await updateDoc(inviteRef, {
                uses: arrayUnion(new Date().toISOString()) // Track each use
            });
            return { success: true, data: undefined };
        } catch (error) {
            return { success: false, error: handleError(error) };
        }
    }
};

// Helper to convert Firestore timestamp
export const toDate = (timestamp: any): Date => {
    if (timestamp instanceof Timestamp) {
        return timestamp.toDate();
    }
    if (timestamp?.toDate) {
        return timestamp.toDate();
    }
    return new Date(timestamp);
};
