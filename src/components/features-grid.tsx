import { VenetianMask, BrainCircuit, Network } from 'lucide-react';

const features = [
    {
        icon: VenetianMask,
        title: 'Anonymous Onboarding',
        description: 'Tanpa email, tanpa data pribadi. Sistem auto-generate username unik (misal: PandaBerani) untuk melindungi privasi korban bullying.',
    },
    {
        icon: BrainCircuit,
        title: 'AI Sentiment Guard',
        description: 'Setiap pesan difilter oleh model NLP Hugging Face sebelum terkirim. Mencegah bullying dan toxic speech secara real-time.',
    },
    {
        icon: Network,
        title: 'Job & Aid Aggregator',
        description: 'Sistem caching otomatis mengambil lowongan entry-level yang aman dari scam, serta akses donasi mikro via Stripe.',
    },
];

export default function FeaturesGrid() {
    return (
        <section id="features" className="py-20 max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="p-6 rounded-2xl border border-zinc-200 bg-zinc-50/50 hover:bg-white hover:border-brand-light/50 transition-colors duration-300"
                    >
                        <div className="w-10 h-10 rounded-lg bg-brand-dark border border-brand-dark flex items-center justify-center mb-4 shadow-sm">
                            <feature.icon className="w-5 h-5 text-brand-light" />
                        </div>
                        <h3 className="text-base font-semibold text-zinc-900 mb-2">{feature.title}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">
                            {feature.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
