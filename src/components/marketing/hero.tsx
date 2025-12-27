'use client';

import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative bg-brand-dark min-h-[600px] md:h-[90vh] overflow-hidden flex flex-col items-center text-center pt-32 pb-16 px-6">
            {/* Background Decorations */}
            <div className="absolute inset-0 z-0">
                {/* Simulated Clouds/Illustration with CSS shapes or placeholder SVGs */}
                <div className="absolute bottom-0 left-0 w-full h-full bg-[url('/hero-bg-mock.svg')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute bottom-0 left-[-20%] w-[60%] h-[80%] bg-teal-400/20 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-0 right-[-20%] w-[60%] h-[80%] bg-purple-400/20 blur-[100px] rounded-full"></div>
            </div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                <h1
                    className="font-extrabold text-white text-4xl md:text-6xl lg:text-[72px] leading-[1.1] mb-8 font-heading uppercase tracking-wide animate-glitch-smooth"
                    data-text="IMAGINE A PLACE..."
                >
                    IMAGINE A PLACE...
                </h1>

                <p className="text-white text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mb-8 opacity-90 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ease-out fill-mode-backwards">
                    ...where you can belong to a school club, a gaming group, or a worldwide art community.
                    Where just you and a handful of friends can spend time together. A place that makes it easy
                    to talk every day and hang out more often.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                    <button className="bg-white text-zinc-900 px-8 py-4 rounded-full font-medium text-lg flex items-center justify-center gap-3 hover:text-brand-dark hover:shadow-xl transition-all group">
                        <Download className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Download for Windows
                    </button>
                    <Link
                        href="/login"
                        className="bg-zinc-900 text-white px-8 py-4 rounded-full font-medium text-lg flex items-center justify-center gap-3 hover:bg-zinc-800 hover:shadow-xl transition-all"
                    >
                        Open Rangkul in your browser
                    </Link>
                </div>
            </div>

            {/* Foreground Illustration Mockup */}
            <div className="absolute bottom-0 left-0 right-0 h-[20%] bg-gradient-to-t from-[#404EED]/50 to-transparent pointer-events-none"></div>
        </div>
    );
}
