"use client";

import { useState, useRef, useEffect } from "react";
import { date } from "../lib/utils"
import { Github, Terminal, Zap, Camera, ImageIcon, User, ChevronDown, Settings, LogOut } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import type { GitHubUser } from "@/lib/auth";

const Plasma = dynamic(() => import("@/components/Plasma"), { ssr: false });



export default function LandingPage() {

    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("Full-stack developer passionate about building beautiful, performant applications. Open source contributor.");
    const [avatar, setAvatar] = useState<string | null>(null);
    const [banner, setBanner] = useState<string | null>(null);
    const [user, setUser] = useState<GitHubUser | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function checkSession() {
            try {
                const res = await fetch("/api/auth/session");
                const data = await res.json();
                if (data.user) {
                    setUser(data.user);
                }
            } catch {
            }
        }
        checkSession();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const focusInput = () => inputRef.current?.focus();

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setAvatar(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setBanner(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSignOut = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        setUser(null);
        setMenuOpen(false);
    };

    // Logged in view - show packages
    if (user) {
        return (
            <div className="min-h-screen bg-[#030306] text-white overflow-hidden relative">
                <div className="fixed inset-0 z-0">
                    <Plasma color="#4f46e5" speed={0.15} opacity={0.4} scale={1.2} />
                </div>

                <div
                    className="fixed inset-0 z-[1] opacity-[0.02]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />

                <div className="fixed inset-0 z-[3] bg-gradient-to-b from-transparent via-[#030306]/50 to-[#030306]" />
                <div className="fixed inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_0%,#030306_70%)]" />

                <div className="relative z-10 min-h-screen flex flex-col">
                    <nav className="p-6 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-5 h-5 text-indigo-400" />
                            <span className="text-lg font-bold tracking-tight">gitface</span>
                            <span className="text-white/30">.me</span>
                        </div>

                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                            >
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={user.name || user.login}
                                        className="w-8 h-8 rounded-full border border-white/10"
                                    />
                                ) : (
                                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-white/60" />
                                    </div>
                                )}
                                <span className="text-sm text-white/80">{user.name || user.login}</span>
                                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {menuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-[#0d0d12] border border-white/10 rounded-xl shadow-xl overflow-hidden">
                                    <Link
                                        href="/edit"
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 transition-all"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <User className="w-4 h-4" />
                                        My Profile
                                    </Link>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 transition-all"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                    </Link>
                                    <button
                                        onClick={handleSignOut}
                                        className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-all border-t border-white/5 cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </nav>

                    <div className="flex-1 flex flex-col items-center justify-center px-6">
                        <div className="text-center mb-12 animate-fade-in" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Welcome back, <span className="text-indigo-400">{user.name || user.login}</span>
                            </h1>
                            <p className="text-lg text-white/60 max-w-xl mx-auto">
                                Manage your profile, explore power-ups, and make your gitface shine.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mb-8">
                            <Link
                                href="/edit"
                                className="bg-[#0d0d12]/80 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 animate-fade-in hover:scale-[1.02] group"
                                style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: '50ms' }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4">
                                    <User className="w-6 h-6 text-indigo-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">My Profile</h3>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    Edit your bio, links, and customize your public profile page.
                                </p>
                            </Link>

                            <Link
                                href="/pricing"
                                className="bg-[#0d0d12]/80 backdrop-blur-xl border border-white/10 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-300 animate-fade-in hover:scale-[1.02] group"
                                style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: '150ms' }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
                                    <Zap className="w-6 h-6 text-amber-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Power-ups</h3>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    Unlock custom badges, domains, analytics and more features.
                                </p>
                            </Link>

                            <Link
                                href="/settings"
                                className="bg-[#0d0d12]/80 backdrop-blur-xl border border-white/10 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-300 animate-fade-in hover:scale-[1.02] group"
                                style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: '250ms' }}
                            >
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4">
                                    <Settings className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">Settings</h3>
                                <p className="text-white/50 text-sm leading-relaxed">
                                    Manage your account, notifications, and preferences.
                                </p>
                            </Link>
                        </div>
                    </div>

                    <footer className="p-6 flex items-center justify-between text-white/30 text-sm">
                        <span>© {date()} GitFace</span>
                        <div className="flex items-center gap-6">
                            <a href="#" className="hover:text-white transition-colors">About</a>
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }

    // Not logged in - show landing page
    return (

        <div className="min-h-screen bg-[#030306] text-white overflow-hidden relative" onClick={focusInput}>

            <input type="file" ref={avatarInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
            <input type="file" ref={bannerInputRef} onChange={handleBannerChange} accept="image/*" className="hidden" />

            <div className="fixed inset-0 z-0">
                <Plasma color="#4f46e5" speed={0.2} opacity={0.6} scale={1.2} />
            </div>

            <div
                className="fixed inset-0 z-[1] opacity-[0.03]"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="fixed inset-0 z-[3] bg-gradient-to-b from-transparent via-[#030306]/50 to-[#030306]" />
            <div className="fixed inset-0 z-[3] bg-[radial-gradient(ellipse_at_center,transparent_0%,#030306_70%)]" />

            <div className="relative z-10 min-h-screen flex flex-col">
                <nav className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                        <span className="text-lg font-bold tracking-tight">gitface</span>
                        <span className="text-white/30">.me</span>
                    </div>
                    <Link
                        href="/api/auth/login"
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-sm transition-all duration-200 cursor-pointer"
                    >
                        <Github className="w-4 h-4" />
                        Sign in
                    </Link>
                </nav>

                <div className="flex-1 flex items-center">
                    <div className="w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">

                        <div className="space-y-8 animate-fade-in delay-0" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                            <div className="bg-[#0d0d12] border border-white/10 rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10">
                                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                                    <span className="ml-2 text-xs text-white/30 font-mono">gitface — zsh</span>
                                </div>

                                <div className="p-6 space-y-4 min-h-[300px] font-mono text-sm">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-400">➜</span>
                                            <span className="text-cyan-400">~</span>
                                            <span className="text-white/90">gitface init</span>
                                        </div>
                                        <div className="text-white/60 pl-6">✓ Initializing your identity repository...</div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-400">➜</span>
                                            <span className="text-cyan-400">~</span>
                                            <span className="text-white/90">gitface connect --github</span>
                                        </div>
                                        <div className="text-white/60 pl-6 space-y-0.5">
                                            <div>✓ Connected to GitHub</div>
                                            <div>✓ 847 contributions synced</div>
                                            <div>✓ 23 repositories imported</div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-400">➜</span>
                                            <span className="text-cyan-400">~</span>
                                            <span className="text-white/90">gitface push</span>
                                        </div>
                                        <div className="text-white/60 pl-6 space-y-0.5">
                                            <div>✓ Profile initialized</div>
                                            <div>✓ Your .me URL is ready</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-emerald-400">➜</span>
                                        <span className="text-cyan-400">~</span>
                                        <span className="text-white/50">gitface.me/</span>
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                                            placeholder="yourname"
                                            className="bg-transparent text-white w-32 focus:outline-none placeholder:text-white/20 caret-indigo-400"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <a
                                    href={`/onboarding${username ? `?username=${username}` : ''}`}
                                    className="flex-1 py-4 bg-white text-black hover:bg-white/90 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10 cursor-pointer"
                                >
                                    <Zap className="w-5 h-5" />
                                    Claim gitface.me/{username || "yourname"}
                                </a>
                            </div>
                        </div>

                        <div className="hidden lg:block">
                            <div className="relative">
                                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 rounded-3xl blur-2xl" />

                                <div className="relative bg-[#0d0d12]/90 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden animate-fade-in" style={{ animationDelay: '200ms', opacity: 0, animationFillMode: 'forwards' }}>
                                    <div
                                        className="h-32 relative overflow-hidden cursor-pointer group"
                                        onClick={(e) => { e.stopPropagation(); bannerInputRef.current?.click(); }}
                                    >
                                        {banner ? (
                                            <img src={banner} alt="Banner" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900">
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(99,102,241,0.15),transparent_50%)]" />
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <div className="flex items-center gap-2 text-white/80 text-sm">
                                                <ImageIcon className="w-5 h-5" />
                                                <span>Change banner</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="px-6 -mt-12 relative">
                                        <div
                                            className="w-24 h-24 rounded-2xl border-4 border-[#0d0d12] flex items-center justify-center shadow-xl cursor-pointer group overflow-hidden relative"
                                            onClick={(e) => { e.stopPropagation(); avatarInputRef.current?.click(); }}
                                        >
                                            {avatar ? (
                                                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                                                    <User className="w-10 h-10 text-white/20" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                                <Camera className="w-6 h-6 text-white/80" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 pt-4 space-y-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">
                                                {username ? `@${username}` : "Your Name"}
                                            </h3>
                                            <p className="text-white/40 text-sm">
                                                gitface.me/{username || "yourname"}
                                            </p>
                                        </div>

                                        <textarea
                                            value={bio}
                                            onChange={(e) => setBio(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full text-white/60 text-sm bg-transparent border border-transparent hover:border-white/10 focus:border-white/20 rounded-lg p-2 -m-2 resize-none focus:outline-none transition-colors"
                                            rows={3}
                                            placeholder="Write something about yourself..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <footer className="p-6 flex items-center justify-between text-white/30 text-sm">
                    <span>© {date()} GitFace</span>
                    <div className="flex items-center gap-6">
                        <a href="#" className="hover:text-white transition-colors">About</a>
                        <a href="#" className="hover:text-white transition-colors">Privacy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms</a>
                    </div>
                </footer>
            </div>
        </div>
    );
}