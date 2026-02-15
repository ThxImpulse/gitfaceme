"use client";

import { Terminal, Sparkles, Globe, BadgeCheck, Check, BarChart3, Layers } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { date } from "@/lib/utils";

const Plasma = dynamic(() => import("@/components/Plasma"), { ssr: false });

const products = [
    {
        id: "custom-badge",
        name: "Custom Badge",
        Icon: Sparkles,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-500/10",
        price: "4.99",
        isNew: false,
        description: "Create your own custom badge with a unique icon and name.",
        features: [
            "Custom Icon & Name",
            "Exclusive Appearance",
            "Editable Anytime"
        ]
    },
    {
        id: "custom-domain",
        name: "Custom Domain",
        Icon: Globe,
        iconColor: "text-cyan-400",
        iconBg: "bg-cyan-500/10",
        price: "9.99",
        isNew: false,
        description: "Use your own domain like you.dev instead of gitface.me/username.",
        features: [
            "Connect Your Domain",
            "SSL Certificate Included",
            "Easy DNS Setup",
            "Remove GitFace Branding"
        ]
    },
    {
        id: "verified",
        name: "Verified Badge",
        Icon: BadgeCheck,
        iconColor: "text-indigo-400",
        iconBg: "bg-indigo-500/10",
        price: "14.99",
        isNew: false,
        description: "Enhance your profile with the verified badge for trust & credibility.",
        features: [
            "Exclusive Verified Badge",
            "Priority Support",
            "Trust & Credibility"
        ]
    },
    {
        id: "analytics",
        name: "Profile Analytics",
        Icon: BarChart3,
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-500/10",
        price: "7.99",
        isNew: false,
        description: "Track who's viewing your profile with detailed visitor analytics.",
        features: [
            "Visitor Count & Trends",
            "Geographic Insights",
            "Referral Sources",
            "Weekly Reports"
        ]
    },
    {
        id: "more-components",
        name: "More Components",
        Icon: Layers,
        iconColor: "text-purple-400",
        iconBg: "bg-purple-500/10",
        price: "6.99",
        isNew: false,
        description: "Unlock additional profile components to showcase more about yourself.",
        features: [
            "Tech Stack Showcase",
            "Project Gallery",
            "Testimonials Section",
            "Timeline View"
        ]
    },
];

export default function PricingPage() {
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
                    <Link href="/" className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-indigo-400" />
                        <span className="text-lg font-bold tracking-tight">gitface</span>
                        <span className="text-white/30">.me</span>
                    </Link>
                    <Link
                        href="/"
                        className="text-white/60 hover:text-white text-sm transition-colors"
                    >
                        ← Back to home
                    </Link>
                </nav>

                <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
                    <div className="text-center mb-12 animate-fade-in" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            Power-ups for your <span className="text-indigo-400">profile</span>
                        </h1>
                        <p className="text-lg text-white/60 max-w-xl mx-auto">
                            Pick the features you want. Pay once, keep forever.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl w-full mb-8">
                        {products.map((item, index) => {
                            const IconComponent = item.Icon;
                            return (
                                <div
                                    key={item.id}
                                    className="bg-[#0d0d12]/80 backdrop-blur-xl border border-white/10 hover:border-indigo-500/40 rounded-2xl p-6 transition-all duration-300 animate-fade-in hover:scale-[1.02] cursor-pointer group relative overflow-hidden"
                                    style={{
                                        opacity: 0,
                                        animationFillMode: 'forwards',
                                        animationDelay: `${50 + index * 100}ms`
                                    }}
                                >
                                    {item.isNew && (
                                        <div className="absolute top-4 right-4 px-2 py-0.5 bg-indigo-500 text-white text-[10px] font-bold uppercase rounded-full">
                                            New
                                        </div>
                                    )}

                                    <div className={`w-12 h-12 rounded-xl ${item.iconBg} flex items-center justify-center mb-4`}>
                                        <IconComponent className={`w-6 h-6 ${item.iconColor}`} />
                                    </div>

                                    <h3 className="text-lg font-bold mb-2">{item.name}</h3>
                                    <p className="text-white/50 text-sm mb-4 leading-relaxed">{item.description}</p>

                                    <ul className="space-y-2 mb-6">
                                        {item.features.map((feature, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                                                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-white">${item.price}</span>
                                            <span className="text-white/30 text-sm">one-time</span>
                                        </div>
                                        <button className="px-4 py-2 text-sm font-medium rounded-lg bg-white/5 border border-white/10 text-white hover:bg-indigo-500 hover:border-indigo-500 transition-all cursor-pointer">
                                            Buy now
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
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