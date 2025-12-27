import { Triangle, Database, Smile, Wind } from 'lucide-react';

const techItems = [
    { icon: Triangle, name: 'Vercel', color: 'text-zinc-800' },
    { icon: Database, name: 'Supabase', color: 'text-brand-dark' },
    { icon: Smile, name: 'Hugging Face', color: 'text-yellow-600' },
    { icon: Wind, name: 'Tailwind', color: 'text-blue-500' },
];

export default function TechStack() {
    return (
        <section className="border-y border-zinc-100 bg-zinc-50/30 py-16">
            <div className="max-w-7xl mx-auto px-6 flex flex-col items-center">
                <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-8">
                    Built on Modern Serverless Stack
                </h2>
                <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                    {techItems.map((item, index) => (
                        <div key={index} className={`flex items-center gap-2 font-bold text-lg ${item.color}`}>
                            <item.icon className="w-6 h-6" />
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
