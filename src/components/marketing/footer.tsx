'use client';

import Link from "next/link";
import { Twitter, Instagram, Facebook, Youtube } from "lucide-react";

export default function MarketingFooter() {
    return (
        <footer className="bg-black text-white pt-20 pb-16 px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-2">
                        <h2 className="font-extrabold text-3xl text-brand-light mb-6 uppercase leading-none">
                            Temukan<br />Komunitasmu
                        </h2>
                        <div className="flex items-center gap-6">
                            <span className="text-white cursor-pointer hover:text-white/80"><Twitter className="w-6 h-6" /></span>
                            <span className="text-white cursor-pointer hover:text-white/80"><Instagram className="w-6 h-6" /></span>
                            <span className="text-white cursor-pointer hover:text-white/80"><Facebook className="w-6 h-6" /></span>
                            <span className="text-white cursor-pointer hover:text-white/80"><Youtube className="w-6 h-6" /></span>
                        </div>
                    </div>

                    {/* Links Columns */}
                    <div className="space-y-4">
                        <h4 className="text-brand-light text-sm font-medium">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:underline">Download</Link></li>
                            <li><Link href="#" className="hover:underline">Nitro</Link></li>
                            <li><Link href="#" className="hover:underline">Status</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-brand-light text-sm font-medium">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:underline">About</Link></li>
                            <li><Link href="#" className="hover:underline">Jobs</Link></li>
                            <li><Link href="#" className="hover:underline">Brand</Link></li>
                            <li><Link href="#" className="hover:underline">Newsroom</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-brand-light text-sm font-medium">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="#" className="hover:underline">College</Link></li>
                            <li><Link href="#" className="hover:underline">Support</Link></li>
                            <li><Link href="#" className="hover:underline">Safety</Link></li>
                            <li><Link href="#" className="hover:underline">Blog</Link></li>
                            <li><Link href="#" className="hover:underline">Feedback</Link></li>
                            <li><Link href="#" className="hover:underline">Developers</Link></li>
                            <li><Link href="#" className="hover:underline">StreamKit</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-brand-light/20 pt-8 flex items-center justify-between">
                    <span className="font-bold text-xl tracking-tight">Rangkul</span>
                    <Link
                        href="/login"
                        className="bg-[#5865F2] hover:bg-[#4752C4] text-white px-4 py-2 rounded-full text-xs font-bold transition-colors"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </footer>
    );
}
