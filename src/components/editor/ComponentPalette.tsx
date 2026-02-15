"use client";

import { BarChart3, Code2, FileText, Link2, Type, GitFork, Trophy, Flame, Activity, Eye, Music, MessageCircle, Clock } from "lucide-react";
import { ComponentDefinition } from "./editorTypes";

const AVAILABLE_COMPONENTS: ComponentDefinition[] = [

    {
        id: "github-stats",
        type: "github-stats",
        name: "Profile Details",
        icon: BarChart3,
        description: "Your GitHub profile overview",
        defaultConfig: { theme: "github_dark" }
    },
    {
        id: "github-streak",
        type: "github-streak",
        name: "Stats Card",
        icon: Flame,
        description: "Commits, PRs, issues & contributions",
        defaultConfig: { theme: "github_dark" }
    },
    {
        id: "github-trophies",
        type: "github-trophies",
        name: "Productive Time",
        icon: Trophy,
        description: "When you're most active",
        defaultConfig: { theme: "github_dark" }
    },
    {
        id: "github-languages",
        type: "github-languages",
        name: "Top Languages",
        icon: Code2,
        description: "Repos by programming language",
        defaultConfig: { theme: "github_dark" }
    },
    {
        id: "github-activity",
        type: "github-activity",
        name: "Activity Graph",
        icon: Activity,
        description: "Your contribution activity graph",
        defaultConfig: { theme: "github_dark" }
    },
    {
        id: "pinned-repos",
        type: "pinned-repos",
        name: "Pinned Repo",
        icon: GitFork,
        description: "Show a pinned repository",
        defaultConfig: { repo: "", theme: "github_dark" }
    },

    {
        id: "profile-counter",
        type: "profile-counter",
        name: "Profile Counter",
        icon: Eye,
        description: "Visitor counter for your profile",
        defaultConfig: { name: "", theme: "rule34" }
    },
    {
        id: "spotify-now-playing",
        type: "spotify-now-playing",
        name: "Spotify Now Playing",
        icon: Music,
        description: "Show currently playing track",
        defaultConfig: { spotifyId: "" }
    },
    {
        id: "discord-status",
        type: "discord-status",
        name: "Discord Status",
        icon: MessageCircle,
        description: "Your Discord presence",
        defaultConfig: { discordId: "" }
    },
    {
        id: "wakatime-stats",
        type: "wakatime-stats",
        name: "WakaTime Stats",
        icon: Clock,
        description: "Your coding time stats",
        defaultConfig: { wakatimeUsername: "" }
    },

    {
        id: "tech-stack",
        type: "tech-stack",
        name: "Tech Stack",
        icon: Code2,
        description: "Showcase your technologies",
        defaultConfig: { title: "Tech Stack", technologies: "react,typescript,nodejs,python" }
    },

    {
        id: "social-links",
        type: "social-links",
        name: "Social Links",
        icon: Link2,
        description: "Your social media links",
        defaultConfig: { twitter: "", linkedin: "", website: "" }
    },
    {
        id: "custom-text",
        type: "custom-text",
        name: "Custom Text",
        icon: Type,
        description: "Add custom text block",
        defaultConfig: { text: "Your text here...", fontSize: "base" }
    },
];

interface ComponentPaletteProps {
    onDragStart: (component: ComponentDefinition) => void;
}

export default function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
    const githubComponents = AVAILABLE_COMPONENTS.filter(c => c.type.startsWith("github-") || c.type === "pinned-repos");
    const integrationComponents = AVAILABLE_COMPONENTS.filter(c => ["profile-counter", "spotify-now-playing", "discord-status", "wakatime-stats"].includes(c.type));
    const contentComponents = AVAILABLE_COMPONENTS.filter(c => ["tech-stack", "social-links", "custom-text"].includes(c.type));

    const renderComponent = (component: ComponentDefinition) => {
        const Icon = component.icon;
        return (
            <div
                key={component.id}
                draggable
                onDragStart={(e) => {
                    e.dataTransfer.setData("component", JSON.stringify(component));
                    onDragStart(component);
                }}
                className="flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/40 rounded-xl cursor-grab active:cursor-grabbing transition-all group"
            >
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                        {component.name}
                    </p>
                    <p className="text-xs text-white/40 truncate">
                        {component.description}
                    </p>
                </div>
            </div>
        );
    };

    return (
        <div className="w-64 bg-[#0d0d12]/90 backdrop-blur-xl border-r border-white/10 p-4 overflow-y-auto">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                Components
            </h2>

            <div className="mb-6">
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">GitHub</h3>
                <div className="space-y-2">
                    {githubComponents.map(renderComponent)}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Integrations</h3>
                <div className="space-y-2">
                    {integrationComponents.map(renderComponent)}
                </div>
            </div>

            <div>
                <h3 className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Content</h3>
                <div className="space-y-2">
                    {contentComponents.map(renderComponent)}
                </div>
            </div>
        </div>
    );
}

export { AVAILABLE_COMPONENTS };