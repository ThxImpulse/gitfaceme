"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import { Terminal, LogOut, User, Loader2, Settings, ChevronDown } from "lucide-react";
import Link from "next/link";
import type { GitHubUser } from "@/lib/auth";
import ProfileEditor from "@/components/editor/ProfileEditor";

const Plasma = dynamic(() => import("@/components/Plasma"), { ssr: false });

export default function EditPage() {
    const [user, setUser] = useState<GitHubUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        async function checkSession() {
            try {
                const res = await fetch("/api/auth/session");
                const data = await res.json();

                if (data.user) {
                    setUser(data.user);
                } else {
                    router.push("/onboarding");
                }
            } catch {
                router.push("/onboarding");
            } finally {
                setLoading(false);
            }
        }

        checkSession();
    }, [router]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#030306] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-[#030306] text-white overflow-hidden relative">

            <div className="fixed inset-0 z-0">
                <Plasma color="#4f46e5" speed={0.15} opacity={0.3} scale={1.2} />
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

            <div className="relative z-10 min-h-screen">
                <nav className="p-6 flex items-center justify-between border-b border-white/5">
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                        <span className="text-lg font-bold tracking-tight">gitface</span>
                        <span className="text-white/30">.me</span>
                    </Link>

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
                                    href="/settings"
                                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/80 hover:bg-white/5 transition-all"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    <Settings className="w-4 h-4" />
                                    Settings
                                </Link>
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-white/5 transition-all border-t border-white/5"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign out
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
                <ProfileEditor username={user.login} />
            </div>
        </div>
    );
}