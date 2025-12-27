import { Server, User, Message } from '@/types';
import { subMinutes } from 'date-fns';

export const MOCK_USERS: User[] = [
    { id: 'u1', username: 'PandaBerani', status: 'online', role: 'guest', avatarUrl: 'bg-brand-dark' },
    { id: 'u2', username: 'KelinciCepat', status: 'online', role: 'guest', avatarUrl: 'bg-blue-500' },
    { id: 'u3', username: 'RusaTenang', status: 'idle', role: 'moderator', avatarUrl: 'bg-green-500' },
    { id: 'u4', username: 'ElangWibawa', status: 'dnd', role: 'admin', avatarUrl: 'bg-red-500' },
    { id: 'u5', username: 'System', status: 'online', role: 'admin', avatarUrl: 'bg-zinc-800' },
];

export const MOCK_MESSAGES: Record<string, Message[]> = {
    'c-curhat': [
        { id: 'm1', content: 'Selamat datang di #curhat-aman! Ruang ini dimonitor AI untuk kenyamanan bersama.', userId: 'u5', createdAt: subMinutes(new Date(), 60) },
        { id: 'm2', content: 'Kadang rasanya berat banget buat berangkat sekolah...', userId: 'u2', createdAt: subMinutes(new Date(), 15) },
        { id: 'm3', content: 'Hai Kelinci! Kamu gak sendiri kok. Semangat ya!', userId: 'u3', createdAt: subMinutes(new Date(), 12), replyToId: 'm2' },
    ],
    'c-loker': [
        { id: 'm4', content: 'Info loker dong untuk lulusan SMK di Bandung.', userId: 'u1', createdAt: subMinutes(new Date(), 30) },
        { id: 'm5', content: 'Cek channel sebelah gan, ada loker barista tuh.', userId: 'u4', createdAt: subMinutes(new Date(), 25) },
    ]
};

export const MOCK_SERVERS: Server[] = [
    {
        id: 's-pusat',
        name: 'Rangkul Pusat',
        shortName: 'RP',
        icon: null,
        members: MOCK_USERS,
        categories: [
            {
                id: 'cat-support', name: 'Support Channels', channels: [
                    { id: 'c-curhat', name: 'curhat-aman', type: 'text', categoryId: 'cat-support', position: 1 },
                    { id: 'c-mental', name: 'kesehatan-mental', type: 'text', categoryId: 'cat-support', position: 2 },
                ]
            },
            {
                id: 'cat-empower', name: 'Empowerment', channels: [
                    { id: 'c-loker', name: 'loker-semua-bisa', type: 'text', categoryId: 'cat-empower', position: 1 },
                    { id: 'c-donasi', name: 'donasi-mikro', type: 'text', categoryId: 'cat-empower', position: 2 },
                    { id: 'c-voice', name: 'sharing-session', type: 'voice', categoryId: 'cat-empower', position: 3 },
                ]
            }
        ]
    },
    {
        id: 's-jabar',
        name: 'Server Jawa Barat',
        shortName: 'JB',
        icon: null,
        members: [MOCK_USERS[0], MOCK_USERS[2]],
        categories: [
            {
                id: 'cat-jb-main', name: 'General', channels: [
                    { id: 'c-jb-umum', name: 'obrolan-warga', type: 'text', categoryId: 'cat-jb-main', position: 1 },
                ]
            }
        ]
    },
    {
        id: 's-genz',
        name: 'Server Gen-Z',
        shortName: 'GZ',
        icon: null,
        members: [MOCK_USERS[0], MOCK_USERS[1]],
        categories: [
            {
                id: 'cat-gz-main', name: 'Hangout', channels: [
                    { id: 'c-gz-mabar', name: 'mabar-skuy', type: 'voice', categoryId: 'cat-gz-main', position: 1 },
                ]
            }
        ]
    }
];
