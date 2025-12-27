'use client';

import Link from 'next/link';
import { ShieldCheck, ChevronDown, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-zinc-200/50 glass">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-dark rounded-md flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-light" />
          </div>
          <span className="font-semibold tracking-[-0.04em] text-lg text-brand-dark">RANGKUL</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          <Link href="#features" className="hover:text-brand-dark transition-colors">Fitur</Link>
          <Link href="#community" className="hover:text-brand-dark transition-colors">Komunitas</Link>
          <Link href="#jobs" className="hover:text-brand-dark transition-colors">Loker</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block text-xs font-medium text-zinc-500 hover:text-brand-dark transition-colors">
            Login
          </Link>
          <Link
            href="/dashboard"
            className="bg-brand-dark hover:bg-brand-dim text-brand-light text-xs font-medium px-4 py-2 rounded-full transition-all shadow-sm flex items-center gap-1.5"
          >
            Mulai Anonim
            <ArrowRight className="w-3 h-3" />
          </Link>
          <button
            className="md:hidden p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-zinc-100 px-6 py-4 space-y-3">
          <Link href="#features" className="block text-sm font-medium text-zinc-600 hover:text-brand-dark">Fitur</Link>
          <Link href="#community" className="block text-sm font-medium text-zinc-600 hover:text-brand-dark">Komunitas</Link>
          <Link href="#jobs" className="block text-sm font-medium text-zinc-600 hover:text-brand-dark">Loker</Link>
          <button className="block text-sm font-medium text-zinc-600 hover:text-brand-dark">Login</button>
        </div>
      )}
    </nav>
  );
}
