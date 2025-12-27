'use client';

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function MarketingNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="absolute top-0 w-full z-50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 z-50">
                    <span className="font-extrabold text-2xl text-white tracking-tight">Rangkul</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8 font-semibold text-white text-sm">
                    <Link href="#" className="hover:underline underline-offset-4">Download</Link>
                    <Link href="#" className="hover:underline underline-offset-4">Nitro</Link>
                    <Link href="#" className="hover:underline underline-offset-4">Discover</Link>
                    <Link href="#" className="hover:underline underline-offset-4">Safety</Link>
                    <Link href="#" className="hover:underline underline-offset-4">Support</Link>
                    <Link href="#" className="hover:underline underline-offset-4">Blog</Link>
                    <Link href="#" className="hover:underline underline-offset-4">Careers</Link>
                </div>

                {/* Login Button */}
                <div className="hidden md:block">
                    <Link
                        href="/login"
                        className="bg-white text-zinc-900 px-4 py-2 rounded-full text-xs font-bold hover:shadow-lg hover:text-brand-dark transition-all"
                    >
                        Login
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-white z-50"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    {isMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="fixed inset-0 bg-white z-40 pt-24 px-6 md:hidden animate-in slide-in-from-right duration-300">
                    <div className="flex flex-col gap-6 text-zinc-900 text-lg font-bold">
                        <Link href="#" onClick={() => setIsMenuOpen(false)}>Download</Link>
                        <Link href="#" onClick={() => setIsMenuOpen(false)}>Nitro</Link>
                        <Link href="#" onClick={() => setIsMenuOpen(false)}>Safety</Link>
                        <Link href="#" onClick={() => setIsMenuOpen(false)}>Support</Link>
                        <hr className="border-zinc-200" />
                        <Link href="/login" className="text-brand-dark" onClick={() => setIsMenuOpen(false)}>
                            Login
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
