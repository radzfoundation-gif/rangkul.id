'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Users, Briefcase, Settings, LogOut, Bell, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { UserProvider } from "@/contexts/user-context";
import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useChatStore } from "@/hooks/use-chat-store";

// Fallback Sidebar component if the imported one fails or for this specific layout
const DashboardSidebar = ({
    isSidebarOpen,
    setIsSidebarOpen,
    sidebarItems,
    pathname
}: {
    isSidebarOpen: boolean,
    setIsSidebarOpen: (isOpen: boolean) => void,
    sidebarItems: any[],
    pathname: string
}) => (
    <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-zinc-200 
        transition-transform duration-300 ease-in-out shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center shadow-lg shadow-brand-dark/20">
                <span className="font-bold text-brand-light">R</span>
            </div>
            <span className="font-bold text-xl text-brand-dark tracking-tight">RANGKUL</span>
        </div>

        <nav className="px-3 mt-6 space-y-1">
            {sidebarItems.map((item) => {
                const isActive = item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname?.startsWith(item.href);

                return (
                    <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                            ? 'bg-brand-light/20 text-brand-dark translate-x-1'
                            : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 hover:translate-x-1'
                            }`}
                    >
                        <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-brand-dark' : 'text-zinc-400 group-hover:text-zinc-600'}`} />
                        {item.label}
                    </Link>
                );
            })}
        </nav>

        <div className="absolute bottom-6 left-0 w-full px-6">
            <button
                onClick={() => {
                    if (confirm('Yakin ingin keluar?')) {
                        signOut({ callbackUrl: '/login' });
                    }
                }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 w-full transition-colors"
            >
                <LogOut className="w-5 h-5" />
                Keluar
            </button>
        </div>
    </aside>
);

const sidebarItems = [
    { icon: Home, label: 'Overview', href: '/dashboard' },
    { icon: Users, label: 'Komunitas', href: '/dashboard/community' },
    { icon: Briefcase, label: 'Lowongan', href: '/dashboard/jobs' },
    { icon: Settings, label: 'Pengaturan', href: '/dashboard/settings' },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { data: session, status } = useSession();

    // Initialize chat store listeners
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            useChatStore.getState().init(session.user.id);
        }
    }, [status, session]);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-50">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-zinc-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    const getPageTitle = () => {
        const item = sidebarItems.find(i => i.href === pathname);
        if (pathname?.startsWith('/dashboard/community')) return 'Komunitas';
        return item ? item.label : 'Overview';
    };

    return (
        <UserProvider>
            <div className="min-h-screen bg-zinc-50/50 flex transition-colors duration-300">
                {/* Mobile Overlay */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-40 md:hidden glass transition-opacity"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                <DashboardSidebar
                    isSidebarOpen={isSidebarOpen}
                    setIsSidebarOpen={setIsSidebarOpen}
                    sidebarItems={sidebarItems}
                    pathname={pathname || ''}
                />

                {/* Main Content */}
                <main className="flex-1 flex flex-col min-w-0">
                    <header className="h-16 border-b border-zinc-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-8 flex items-center justify-between transition-all">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="md:hidden p-2 -ml-2 text-zinc-500 hover:bg-zinc-100 rounded-lg transition-colors"
                            >
                                <Menu className="w-5 h-5" />
                            </button>
                            <h1 className="text-sm font-semibold text-zinc-500 hidden sm:block animate-in fade-in slide-in-from-left-2 duration-300">
                                Dashboard / <span className="text-zinc-900">{getPageTitle()}</span>
                            </h1>
                        </div>

                        <div className="flex items-center gap-4">
                            <button className="relative p-2 text-zinc-400 hover:text-zinc-600 transition-colors">
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                            </button>
                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-dark to-zinc-800 border-2 border-brand-light cursor-pointer shadow-sm hover:shadow-md transition-shadow"></div>
                        </div>
                    </header>

                    <div className={`flex-1 overflow-y-auto ${pathname?.startsWith('/dashboard/community') ? 'p-0 sm:p-8' : 'p-4 sm:p-8'}`}>
                        <div className={`${pathname?.startsWith('/dashboard/community') ? 'h-full' : 'max-w-5xl mx-auto space-y-8'} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            {children}
                        </div>
                    </div>
                </main>
            </div>
        </UserProvider>
    );
}
