'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import {
    Users, ChevronDown, Hash, Briefcase, HeartHandshake,
    MicOff, Plus, PlusCircle, Send, Bot, ShieldAlert, ExternalLink
} from 'lucide-react';

type TabView = 'chat' | 'jobs';

interface Message {
    id: string;
    username: string;
    content: string;
    time: string;
    isOwn?: boolean;
    isBot?: boolean;
    reactions?: { emoji: string; count: number }[];
    avatarColor: string;
}

export default function AppSimulation() {
    const [activeTab, setActiveTab] = useState<TabView>('chat');
    const [inputValue, setInputValue] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            username: 'KelinciCepat',
            content: 'Kadang rasanya berat banget buat berangkat sekolah. Ada saran ga teman-teman?',
            time: 'Hari ini, 10:42',
            avatarColor: 'bg-blue-100',
        },
        {
            id: '2',
            username: 'RusaTenang',
            content: 'Hai Kelinci! Kamu gak sendiri kok. Coba fokus ke hal kecil yang bikin kamu seneng dulu aja. Semangat ya!',
            time: 'Hari ini, 10:45',
            avatarColor: 'bg-brand-light/50',
            reactions: [{ emoji: '❤️', count: 2 }],
        },
    ]);

    const chatContainerRef = useRef<HTMLDivElement>(null);

    const toxicKeywords = ['bodo', 'bodoh', 'jelek', 'mati', 'hate', 'die', 'stupid'];

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = () => {
        const text = inputValue.trim();
        if (!text) return;

        // Simulate AI Check
        const isToxic = toxicKeywords.some(keyword => text.toLowerCase().includes(keyword));

        if (isToxic) {
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 4000);
            return;
        }

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            username: 'PandaBerani',
            content: text,
            time: 'Just now',
            isOwn: true,
            avatarColor: 'bg-brand-dark',
        };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');

        // Simulate bot reply
        setTimeout(() => {
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                username: 'RangkulBot',
                content: 'Terima kasih sudah berbagi, PandaBerani! Suaramu didengar di sini. 🤗',
                time: 'Just now',
                isBot: true,
                avatarColor: 'bg-brand-light/30',
            };
            setMessages(prev => [...prev, botMessage]);
        }, 1000);
    };

    const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };

    const jobListings = [
        {
            id: '1',
            title: 'Staff Admin Gudang',
            company: 'Logistik Jaya Abadi',
            location: 'Jakarta Barat',
            type: 'Full-time',
            tags: ['Lulusan SMA/SMK', 'Tanpa Pengalaman'],
            postedTime: 'Diposting 2 jam lalu via Adzuna',
        },
        {
            id: '2',
            title: 'Barista & Crew Outlet',
            company: 'Kopi Kenangan',
            location: 'Bandung',
            type: 'Part-time',
            tags: ['Flexible Hours'],
            postedTime: 'Diposting 5 jam lalu',
        },
    ];

    return (
        <section className="px-4 pb-24">
            <div className="max-w-6xl mx-auto border border-zinc-200 shadow-2xl shadow-zinc-200/50 rounded-xl overflow-hidden bg-white h-[600px] flex md:flex-row flex-col">

                {/* Sidebar - Server List */}
                <div className="w-16 bg-zinc-50 border-r border-zinc-200 hidden md:flex flex-col items-center py-4 gap-4">
                    <div className="w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center shadow-sm cursor-pointer hover:scale-105 transition-transform group">
                        <Users className="w-5 h-5 text-brand-light group-hover:rotate-12 transition-transform" />
                    </div>
                    <div className="w-0.5 h-6 bg-zinc-200 rounded-full" />
                    <div
                        className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-400 hover:border-brand-dark hover:text-brand-dark cursor-pointer transition-colors"
                        title="Server Jawa Barat"
                    >
                        <span className="text-xs font-semibold">JB</span>
                    </div>
                    <div
                        className="w-10 h-10 bg-white border border-zinc-200 rounded-full flex items-center justify-center text-zinc-400 hover:border-brand-dark hover:text-brand-dark cursor-pointer transition-colors"
                        title="Server Gen-Z"
                    >
                        <span className="text-xs font-semibold">GZ</span>
                    </div>
                    <div className="mt-auto w-10 h-10 rounded-full bg-brand-light/50 flex items-center justify-center text-brand-dark hover:bg-brand-light cursor-pointer transition-colors">
                        <Plus className="w-5 h-5" />
                    </div>
                </div>

                {/* Channel List */}
                <div className="w-64 bg-zinc-50/50 border-r border-zinc-200 hidden md:flex flex-col">
                    <div className="h-14 border-b border-zinc-100 flex items-center px-4">
                        <span className="font-semibold text-sm tracking-tight text-zinc-800">Rangkul Community</span>
                        <ChevronDown className="ml-auto w-4 h-4 text-zinc-400" />
                    </div>

                    <div className="p-3">
                        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-2">Support Channels</div>
                        <button
                            onClick={() => setActiveTab('chat')}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium mb-1 transition-colors ${activeTab === 'chat'
                                    ? 'bg-brand-light/50 text-brand-dark'
                                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-brand-dark'
                                }`}
                        >
                            <Hash className="w-3.5 h-3.5" />
                            curhat-aman
                        </button>
                        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-brand-dark text-sm font-medium mb-1 transition-colors">
                            <Hash className="w-3.5 h-3.5" />
                            hobby-corner
                        </button>

                        <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mt-6 mb-2 px-2">Empowerment</div>
                        <button
                            onClick={() => setActiveTab('jobs')}
                            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium mb-1 transition-colors ${activeTab === 'jobs'
                                    ? 'bg-brand-light/50 text-brand-dark'
                                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-brand-dark'
                                }`}
                        >
                            <Briefcase className="w-3.5 h-3.5" />
                            loker-semua-bisa
                        </button>
                        <button className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-brand-dark text-sm font-medium mb-1 transition-colors">
                            <HeartHandshake className="w-3.5 h-3.5" />
                            donasi-mikro
                        </button>
                    </div>

                    {/* User Profile */}
                    <div className="mt-auto p-3 border-t border-zinc-200 bg-white">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-dark to-zinc-800 border-2 border-brand-light" />
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-zinc-900">PandaBerani</span>
                                <span className="text-[10px] text-zinc-500">Guest • Online</span>
                            </div>
                            <MicOff className="ml-auto w-3.5 h-3.5 text-zinc-400" />
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col bg-white relative">

                    {/* Chat Interface */}
                    <div className={`flex-1 flex flex-col h-full ${activeTab !== 'chat' ? 'hidden' : ''}`}>
                        {/* Header */}
                        <div className="h-14 border-b border-zinc-100 flex items-center px-4 justify-between shrink-0">
                            <div className="flex items-center gap-2">
                                <Hash className="w-5 h-5 text-zinc-400" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-zinc-900">curhat-aman</span>
                                    <span className="text-xs text-zinc-500">Ruang aman, dimoderasi AI 24/7.</span>
                                </div>
                            </div>
                            <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full border-2 border-white bg-blue-100" />
                                <div className="w-6 h-6 rounded-full border-2 border-white bg-green-100" />
                                <div className="w-6 h-6 rounded-full border-2 border-white bg-brand-light flex items-center justify-center text-[8px] text-brand-dark font-bold">+12</div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto space-y-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex gap-3 ${msg.isOwn ? 'justify-end' : ''}`}>
                                    {!msg.isOwn && (
                                        <div className={`w-8 h-8 rounded-full ${msg.avatarColor} shrink-0 mt-1 ${msg.isBot ? 'flex items-center justify-center border border-brand-light' : ''}`}>
                                            {msg.isBot && <Bot className="w-4 h-4 text-brand-dark" />}
                                        </div>
                                    )}
                                    <div className={msg.isOwn ? 'flex flex-col items-end' : ''}>
                                        {msg.isOwn ? (
                                            <>
                                                <div className="bg-brand-dark text-brand-light px-4 py-2 rounded-2xl rounded-tr-sm text-sm">
                                                    {msg.content}
                                                </div>
                                                <span className="text-[10px] text-zinc-400 mt-1">{msg.time}</span>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-sm font-semibold text-zinc-900">{msg.username}</span>
                                                    <span className="text-[10px] text-zinc-400">{msg.time}</span>
                                                </div>
                                                <p className="text-sm text-zinc-600 leading-relaxed">{msg.content}</p>
                                                {msg.reactions && (
                                                    <div className="flex gap-1 mt-1">
                                                        {msg.reactions.map((reaction, idx) => (
                                                            <span key={idx} className="bg-zinc-50 border border-zinc-200 px-1.5 py-0.5 rounded text-[10px] text-zinc-500 hover:bg-brand-light/30 transition-colors cursor-pointer">
                                                                {reaction.emoji} {reaction.count}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 pt-2 shrink-0">
                            {showWarning && (
                                <div className="mb-2 p-2 bg-red-50 border border-red-100 rounded-md flex items-center gap-2 text-xs text-red-600 animate-pulse">
                                    <ShieldAlert className="w-3.5 h-3.5" />
                                    AI Detection: Pesan mengandung unsur negatif. Mari jaga komunitas tetap aman.
                                </div>
                            )}
                            <div className="relative">
                                <button className="absolute left-3 top-2.5 text-zinc-400 hover:text-brand-dark transition-colors">
                                    <PlusCircle className="w-5 h-5" />
                                </button>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Kirim pesan ke #curhat-aman"
                                    className="w-full bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm rounded-lg pl-10 pr-12 py-2.5 focus:outline-none focus:ring-1 focus:ring-brand-dark placeholder:text-zinc-400"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="absolute right-3 top-2.5 text-zinc-400 hover:text-brand-dark transition-colors"
                                >
                                    <Send className="w-[18px] h-[18px]" />
                                </button>
                            </div>
                            <div className="flex justify-end mt-1">
                                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                    <Bot className="w-2.5 h-2.5" />
                                    Protected by Hugging Face AI
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Job Aggregator Interface */}
                    <div className={`flex-1 flex flex-col h-full ${activeTab !== 'jobs' ? 'hidden' : ''}`}>
                        <div className="h-14 border-b border-zinc-100 flex items-center px-4 justify-between shrink-0 bg-white">
                            <div className="flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-zinc-400" />
                                <div className="flex flex-col">
                                    <span className="text-sm font-semibold text-zinc-900">loker-semua-bisa</span>
                                    <span className="text-xs text-zinc-500">Agregator lowongan entry-level terverifikasi.</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] bg-brand-light text-brand-dark font-medium px-2 py-0.5 rounded border border-brand-light">Live API</span>
                            </div>
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto bg-zinc-50/50">
                            <div className="grid grid-cols-1 gap-3">
                                {jobListings.map((job) => (
                                    <div key={job.id} className="bg-white p-4 rounded-lg border border-zinc-200 shadow-sm hover:shadow-md transition-shadow group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-brand-dark transition-colors">{job.title}</h3>
                                                <p className="text-xs text-zinc-500">{job.company} • {job.location}</p>
                                            </div>
                                            <span className="text-[10px] font-medium px-2 py-0.5 bg-zinc-100 text-zinc-600 rounded">{job.type}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                                            {job.tags.map((tag, idx) => (
                                                <span key={idx} className="text-[10px] px-1.5 py-0.5 border border-zinc-100 rounded text-zinc-500">{tag}</span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-50">
                                            <span className="text-[10px] text-zinc-400">{job.postedTime}</span>
                                            <button className="text-xs font-medium text-brand-dark hover:text-brand-dim flex items-center gap-1 group-hover:underline decoration-brand-light decoration-2">
                                                Apply
                                                <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <p className="text-center text-xs text-zinc-400 mt-6">
                Design inspired by Linear & Vercel. Powered by Supabase & Hugging Face.
            </p>
        </section>
    );
}
