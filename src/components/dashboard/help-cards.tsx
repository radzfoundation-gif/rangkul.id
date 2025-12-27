import { LifeBuoy, HeartHandshake, Phone, BookOpen } from 'lucide-react';

const helpOptions = [
    {
        icon: LifeBuoy,
        title: 'Butuh Teman Cerita?',
        desc: 'Masuk ke ruang chat anonim yang aman.',
        action: 'Mulai Chat',
        href: '/dashboard/community',
        color: 'bg-brand-light/20 text-brand-dark',
    },
    {
        icon: HeartHandshake,
        title: 'Donasi Mikro',
        desc: 'Bantu teman komunitas mulai dari Rp10.000.',
        action: 'Donasi',
        href: '/dashboard/donate',
        color: 'bg-blue-50 text-blue-600',
    },
    {
        icon: BookOpen,
        title: 'Panduan Self-Care',
        desc: 'Tips praktis menjaga kesehatan mental.',
        action: 'Baca',
        href: '/dashboard/guides',
        color: 'bg-pink-50 text-pink-600',
    },
    {
        icon: Phone,
        title: 'Hotline Darurat',
        desc: 'Hubungi profesional jika butuh bantuan segera.',
        action: 'Lihat Nomor',
        href: '/help',
        color: 'bg-zinc-100 text-zinc-700',
    },
];

export default function HelpCards() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {helpOptions.map((option, idx) => (
                <div
                    key={idx}
                    className="bg-white p-5 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col items-start"
                >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${option.color}`}>
                        <option.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-semibold text-zinc-900 mb-1">{option.title}</h3>
                    <p className="text-xs text-zinc-500 mb-4 leading-relaxed flex-1">
                        {option.desc}
                    </p>
                    <button className="text-xs font-medium px-3 py-1.5 rounded-md bg-zinc-50 text-zinc-900 hover:bg-zinc-100 transition-colors w-full text-center">
                        {option.action}
                    </button>
                </div>
            ))}
        </div>
    );
}
