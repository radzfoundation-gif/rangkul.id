import { ShieldCheck } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white py-12 px-6 border-t border-zinc-200">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-brand-dark rounded-sm flex items-center justify-center">
                        <ShieldCheck className="w-3 h-3 text-brand-light" />
                    </div>
                    <span className="font-semibold tracking-[-0.04em] text-sm text-brand-dark">RANGKUL</span>
                </div>

                <div className="text-xs text-zinc-400 text-center md:text-right">
                    © 2025 Project Z-Safe. Open Source Initiative.<br />
                    Designed for Safety & Empowerment.
                </div>
            </div>
        </footer>
    );
}
