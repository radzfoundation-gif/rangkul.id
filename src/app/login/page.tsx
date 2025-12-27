'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";
import { User, Lock, ArrowRight, Eye, EyeOff, Mail, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import clsx from "clsx";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Check URL query params for errors
    const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const errorParam = searchParams?.get('error');
    const registeredParam = searchParams?.get('registered');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading("form");
        setError(null);

        try {
            const res = await signIn("credentials", {
                email: email,
                password: password,
                callbackUrl: "/dashboard/community",
                redirect: false, // Handle locally to show errors
            });

            if (res?.error) {
                if (res.error === "CredentialsSignin") {
                    setError("Email atau sandi salah. Silakan coba lagi.");
                } else {
                    setError("Terjadi kesalahan saat masuk.");
                }
                setIsLoading(null);
            } else {
                // Successful login will redirect automatically via callbackUrl if we used redirect:true,
                // but with redirect:false we must handle it:
                window.location.href = "/dashboard/community";
            }
        } catch (err) {
            setError("Gagal menghubungi server.");
            setIsLoading(null);
        }
    };

    return (
        <div className="min-h-screen flex bg-white font-body">
            {/* Left Side - Branding & Vision */}
            <div className="hidden lg:flex w-1/2 bg-brand-dark relative overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-light/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <span className="font-bold text-brand-dark text-xl">R</span>
                        </div>
                        <span className="font-bold text-2xl tracking-tight">RANGKUL</span>
                    </div>

                    <h1 className="text-5xl font-bold leading-tight mb-6">
                        Temukan Peluang,<br />
                        Bangun Komunitas.
                    </h1>
                    <p className="text-brand-light/90 text-lg max-w-md leading-relaxed">
                        Platform komunitas inklusif yang menghubungkan talenta dengan peluang kerja yang setara.
                    </p>
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-4 text-sm font-medium text-brand-light/80">
                        <div className="flex -space-x-3">
                            <div className="w-10 h-10 rounded-full bg-purple-500 border-2 border-brand-dark flex items-center justify-center text-lg">🐼</div>
                            <div className="w-10 h-10 rounded-full bg-green-500 border-2 border-brand-dark flex items-center justify-center text-lg">🦌</div>
                            <div className="w-10 h-10 rounded-full bg-orange-500 border-2 border-brand-dark flex items-center justify-center text-lg">🐱</div>
                        </div>
                        <div>
                            <span className="text-white font-bold block">1,200+ Member</span>
                            <span>Bergabunglah dengan komunitas kami</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
                <div className="max-w-md w-full space-y-8">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex justify-center mb-8">
                        <div className="w-12 h-12 bg-brand-dark rounded-xl flex items-center justify-center shadow-lg">
                            <span className="font-bold text-white text-xl">R</span>
                        </div>
                    </div>

                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold text-zinc-900">Selamat Datang Kembali</h2>
                        <p className="mt-2 text-zinc-500">Masuk untuk melanjutkan perjalananmu.</p>
                    </div>

                    {registeredParam && (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-center gap-3 border border-green-100">
                            <CheckCircle2 className="w-5 h-5 shrink-0" />
                            <div>
                                <p className="font-semibold">Akun berhasil dibuat!</p>
                                <p className="text-sm">Silakan masuk dengan email dan password Anda.</p>
                            </div>
                        </div>
                    )}

                    {(error || errorParam) && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100 animate-in fade-in slide-in-from-top-2">
                            <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center shrink-0">!</div>
                            <p className="font-medium text-sm">
                                {error || (errorParam === "CredentialsSignin" ? "Login gagal. Periksa kembali email & password Anda." : "Terjadi kesalahan.")}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-all"
                                        placeholder="nama@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-zinc-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-10 pr-12 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-brand-dark transition-all"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 text-brand-dark focus:ring-brand-dark" />
                                <span className="text-zinc-600">Ingat saya</span>
                            </label>
                            <Link href="#" className="font-medium text-brand-dark hover:underline">Lupa password?</Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading === 'form'}
                            className="w-full bg-brand-dark text-white py-3 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-wait flex items-center justify-center gap-2"
                        >
                            {isLoading === 'form' ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Masuk Sekarang
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-zinc-500">Atau masuk dengan</span>
                        </div>
                    </div>

                    {/* Google Sign In */}
                    <button
                        onClick={() => signIn('google', { callbackUrl: '/dashboard/community' })}
                        className="w-full py-3 border-2 border-zinc-200 rounded-xl font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Masuk dengan Google
                    </button>

                    <p className="text-center text-sm text-zinc-500">
                        Belum punya akun?{' '}
                        <Link href="/register" className="font-bold text-brand-dark hover:underline">
                            Daftar sekarang
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

