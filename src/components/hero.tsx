'use client';

import { MessageCircle, Briefcase } from 'lucide-react';

export default function Hero() {
    return (
        <header className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
            {/* Version Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-light bg-brand-light/20 text-brand-dark text-xs font-medium mb-8">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-dark opacity-50"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-dark"></span>
                </span>
                Project Z-Safe v1.0.0-RELEASE
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-zinc-900 mb-6 max-w-3xl leading-[1.1]">
                Ruang aman untuk tumbuh, <br />
                <span className="text-zinc-400">bercerita, dan berdaya.</span>
            </h1>

            {/* Description */}
            <p className="text-zinc-500 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 tracking-[-0.02em]">
                Platform anonim terintegrasi dengan moderasi AI untuk kesehatan mental dan agregator peluang ekonomi bagi yang membutuhkan.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-brand-dark hover:bg-brand-dim text-brand-light text-sm font-medium px-6 py-3 rounded-md shadow-lg shadow-zinc-200 transition-all flex items-center justify-center gap-2 group">
                    <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Gabung Server
                </button>
                <button className="w-full sm:w-auto bg-white border border-zinc-200 hover:bg-brand-light/30 hover:border-brand-light text-zinc-700 hover:text-brand-dark text-sm font-medium px-6 py-3 rounded-md transition-all flex items-center justify-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Cari Lowongan
                </button>
            </div>
        </header>
    );
}
