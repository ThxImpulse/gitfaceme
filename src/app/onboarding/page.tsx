"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
    Terminal,
    Github,
    ArrowRight
} from "lucide-react";

const Plasma = dynamic(() => import("@/components/Plasma"), { ssr: false });

export default function OnboardingPage() {
    const searchParams = useSearchParams();
    const username = searchParams.get("username") || "";

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
                    <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                        <span className="text-lg font-bold tracking-tight">gitface</span>
                        <span className="text-white/30">.me</span>
                    </Link>
                </nav>

                <div className="flex-1 flex flex-col items-center justify-center px-6 -mt-16">
                    <div className="text-center mb-12 animate-fade-in" style={{ opacity: 0, animationFillMode: 'forwards' }}>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent">
                            {username ? (
                                <>Hey, <span className="text-indigo-400">@{username}</span>!</>
                            ) : (
                                <>Your <span className="text-indigo-400">developer</span> identity</>
                            )}
                        </h1>

                        <p className="text-lg text-white/60 max-w-2xl mx-auto">
                            Create a professional profile that showcases your projects,
                            skills, and achievements all in one place.
                        </p>
                    </div>

                    <div className="text-center animate-fade-in" style={{ opacity: 0, animationFillMode: 'forwards', animationDelay: '200ms' }}>
                        <Link
                            href="/api/auth/login"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-white/90 rounded-xl font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-white/10"
                        >
                            <Github className="w-5 h-5" />
                            Continue with GitHub
                            <ArrowRight className="w-5 h-5" />
                        </Link>

                        <p className="text-white/40 text-sm mt-4">
                            By signing in you agree to our{' '}
                            <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a>
                            {' '}and{' '}
                            <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}