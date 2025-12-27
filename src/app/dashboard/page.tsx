'use client';

import MoodTracker from '@/components/dashboard/mood-tracker';
import HelpCards from '@/components/dashboard/help-cards';
import { ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
    const [greeting, setGreeting] = useState('Selamat pagi');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 11) setGreeting('Selamat pagi');
        else if (hour >= 11 && hour < 15) setGreeting('Selamat siang');
        else if (hour >= 15 && hour < 18) setGreeting('Selamat sore');
        else setGreeting('Selamat malam');
    }, []);

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Column */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Welcoming Header */}
                    <div className="bg-gradient-to-br from-brand-dark to-zinc-800 rounded-2xl p-8 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-2xl font-bold mb-2">{greeting}, PandaBerani! 👋</h2>
                            <p className="text-brand-light/90 text-sm max-w-md leading-relaxed">
                                Setiap langkah kecil berharga. Terima kasih sudah bertahan dan memilih untuk tumbuh hari ini.
                            </p>
                        </div>

                        {/* Decoration Circles */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-brand-light/10 rounded-full blur-2xl -ml-10 -mb-10"></div>
                    </div>

                    <MoodTracker />

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-base font-semibold text-zinc-900">Akses Cepat</h3>
                        </div>
                        <HelpCards />
                    </div>

                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">

                    {/* Daily Quote */}
                    <div className="bg-brand-light/10 border border-brand-light/20 rounded-xl p-6">
                        <span className="text-xs font-semibold text-brand-dark uppercase tracking-wider mb-2 block">Kutipan Hari Ini</span>
                        <blockquote className="text-zinc-800 font-medium italic mb-4">
                            "Kamu tidak harus melihat seluruh anak tangga, cukup ambil langkah pertama."
                        </blockquote>
                        <cite className="text-xs text-zinc-500 not-italic">— Martin Luther King Jr.</cite>
                    </div>

                    {/* Activity / Notification Preview */}
                    <div className="bg-white rounded-xl border border-zinc-100 p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-zinc-900">Aktivitas Terbaru</h3>
                            <button className="text-xs text-brand-dark hover:underline">Lihat Semua</button>
                        </div>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-2 h-2 rounded-full bg-brand-light mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="text-xs text-zinc-600 leading-snug">
                                            <span className="font-semibold text-zinc-900">RusaTenang</span> membalas ceritamu di #curhat-aman.
                                        </p>
                                        <span className="text-[10px] text-zinc-400">2 jam lalu</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Job Recommendation Preview */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5">
                        <h3 className="text-sm font-semibold text-zinc-900 mb-1">Rekomendasi Pekerjaan</h3>
                        <p className="text-xs text-zinc-500 mb-4">Berdasarkan minatmu di bidang Logistik.</p>

                        <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm mb-3">
                            <h4 className="text-xs font-semibold text-zinc-900">Admin Gudang</h4>
                            <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-1">
                                JNE Express • Jakarta
                            </span>
                        </div>

                        <button className="w-full text-xs font-medium text-blue-600 flex items-center justify-center gap-1 hover:gap-2 transition-all">
                            Lihat 5 Lowongan Lainnya <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>

                </div>
            </div>
        </>
    );
}
