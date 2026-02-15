"use client";

import { Trash2, GripVertical, BarChart3, Code2, FileText, Link2, Type, GitFork, Trophy, Flame, Activity, Star, BookOpen, MapPin, Users, Github, Globe, Mail, Linkedin, Youtube, Instagram, Settings2, Eye, EyeOff, Music, MessageCircle, Clock } from "lucide-react";
import { X } from "@/components/icons/pack";
import { PlacedComponent } from "./editorTypes";
import Image from "next/image";

interface GitHubRepo {
    name: string;
    fullName: string;
    description: string | null;
    stars: number;
    language: string | null;
    fork: boolean;
}

interface SocialLink {
    platform: string;
    url: string;
    icon: string;
    username: string;
}

interface UserProfile {
    username: string;
    name: string;
    avatar: string;
    bio: string | null;
    location: string | null;
    followers: number;
    following: number;
    publicRepos: number;
}

const COMPONENT_ICONS: Record<string, React.ElementType> = {
    "github-stats": BarChart3,
    "github-streak": Flame,
    "github-trophies": Trophy,
    "github-languages": Code2,
    "github-activity": Activity,
    "tech-stack": Code2,

    "social-links": Link2,
    "custom-text": Type,
    "pinned-repos": GitFork,
    "profile-counter": Eye,
    "spotify-now-playing": Music,
    "discord-status": MessageCircle,
    "wakatime-stats": Clock,
};

const COMPONENT_NAMES: Record<string, string> = {
    "github-stats": "Profile Details",
    "github-streak": "Stats Card",
    "github-trophies": "Productive Time",
    "github-languages": "Top Languages",
    "github-activity": "Activity Graph",
    "tech-stack": "Tech Stack",

    "social-links": "Social Links",
    "custom-text": "Custom Text",
    "pinned-repos": "Pinned Repos",
    "profile-counter": "Profile Counter",
    "spotify-now-playing": "Spotify Now Playing",
    "discord-status": "Discord Status",
    "wakatime-stats": "WakaTime Stats",
};

const SOCIAL_ICONS: Record<string, React.ElementType> = {
    github: Github,
    x: X,
    globe: Globe,
    website: Globe,
    mail: Mail,
    email: Mail,
    linkedin: Linkedin,
    youtube: Youtube,
    instagram: Instagram,
};

const LANGUAGE_COLORS: Record<string, string> = {
    javascript: "#f1e05a",
    typescript: "#3178c6",
    python: "#3572A5",
    java: "#b07219",
    go: "#00ADD8",
    rust: "#dea584",
    cpp: "#f34b7d",
    c: "#555555",
    csharp: "#239120",
    ruby: "#701516",
    php: "#4F5D95",
    swift: "#F05138",
    kotlin: "#A97BFF",
    html: "#e34c26",
    css: "#563d7c",
    vue: "#41b883",
    react: "#61dafb",
    default: "#8b949e",
};

interface EditorCanvasProps {
    components: PlacedComponent[];
    selectedId: string | null;
    username: string;
    repos: GitHubRepo[];
    profile: UserProfile | null;
    socialLinks: SocialLink[];
    baseProfileConfig: Record<string, unknown>;
    onSelectBaseProfile: () => void;
    onSelect: (id: string) => void;
    onRemove: (id: string) => void;
    onReorder: (dragIndex: number, hoverIndex: number) => void;
    onDrop: (e: React.DragEvent) => void;
    onToggleActive: (id: string) => void;
}

function ProfileHeader({
    profile,
    socialLinks,
    config,
    isSelected,
    onClick
}: {
    profile: UserProfile;
    socialLinks: SocialLink[];
    config: Record<string, unknown>;
    isSelected: boolean;
    onClick: () => void;
}) {
    const showBanner = config.showBanner !== false;
    const linkStyle = String(config.linkStyle || "full");
    const customAvatar = config.customAvatar ? String(config.customAvatar) : null;
    const customBanner = config.customBanner ? String(config.customBanner) : null;

    return (
        <div
            onClick={onClick}
            className={`
                bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border rounded-2xl overflow-hidden mb-6 cursor-pointer transition-all
                ${isSelected ? "ring-2 ring-indigo-500 border-transparent" : "border-white/10 hover:border-white/20"}
            `}
        >
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <span className="text-xs text-white/50 font-medium uppercase tracking-wider">Base Profile</span>
                <Settings2 className="w-4 h-4 text-white/30" />
            </div>
            {showBanner && (
                <div className="h-32 relative bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 overflow-hidden">
                    {customBanner ? (
                        <>
                            <Image
                                src={customBanner}
                                alt="Profile Banner"
                                fill
                                className="object-cover opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d12] via-transparent to-transparent" />
                        </>
                    ) : (
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-30" />
                    )}
                </div>
            )}

            {/* Avatar & Info */}
            <div className="px-6 pb-6">
                <div className={`flex items-end gap-4 ${showBanner ? "-mt-12" : "pt-4"} mb-4`}>
                    <div className="relative">
                        <Image
                            src={customAvatar || profile.avatar}
                            alt={profile.name}
                            width={96}
                            height={96}
                            className="w-24 h-24 rounded-full border-4 border-[#0d0d12] bg-[#0d0d12] object-cover"
                        />
                        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#0d0d12]" />
                    </div>
                    <div className="flex-1 pb-2">
                        <h2 className="text-xl font-bold text-white">{profile.name}</h2>
                        <p className="text-sm text-white/50">@{profile.username}</p>
                    </div>
                </div>

                {/* Bio */}
                {profile.bio && (
                    <p className="text-sm text-white/70 mb-4 leading-relaxed">
                        {profile.bio}
                    </p>
                )}

                {/* About Me preview */}
                {(() => {
                    const aboutMeText = String(config.aboutMe || "");
                    const aboutMeTitleText = String(config.aboutMeTitle || "About Me");
                    if (!aboutMeText) return null;
                    return (
                        <div className="bg-white/[0.03] rounded-lg p-3 mb-4">
                            {aboutMeTitleText && (
                                <p className="text-xs font-semibold text-white/50 mb-1">{aboutMeTitleText}</p>
                            )}
                            <p className="text-xs text-white/40 leading-relaxed line-clamp-3 whitespace-pre-wrap">{aboutMeText}</p>
                        </div>
                    );
                })()}

                {/* Location & Stats */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/50 mb-4">
                    {profile.location && (
                        <span className="flex items-center gap-1.5">
                            <MapPin className="w-4 h-4" />
                            {profile.location}
                        </span>
                    )}
                    <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        <strong className="text-white">{profile.followers}</strong> followers
                    </span>
                    <span className="flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4" />
                        <strong className="text-white">{profile.publicRepos}</strong> repos
                    </span>
                </div>

                {socialLinks.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {socialLinks.map((link) => {
                            const Icon = SOCIAL_ICONS[link.icon] || SOCIAL_ICONS[link.platform] || Globe;
                            return (
                                <a
                                    key={link.platform}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className={`
                                        flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/40 rounded-lg text-sm text-white/70 hover:text-white transition-all
                                        ${linkStyle === "icon" ? "p-2" : "px-3 py-1.5"}
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {linkStyle === "full" && <span>{link.username}</span>}
                                </a>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

function ComponentPreview({ component, username, repos }: { component: PlacedComponent; username: string; repos: GitHubRepo[] }) {
    const config = component.config;
    const theme = String(config.theme || "github_dark");

    const baseUrl = "https://github-profile-summary-cards.vercel.app/api/cards";

    switch (component.type) {
        case "github-stats":
            return (
                <div className="p-4">
                    <img
                        src={`${baseUrl}/profile-details?username=${username}&theme=${theme}`}
                        alt="GitHub Stats"
                        className="w-full"
                    />
                </div>
            );
        case "github-streak":
            return (
                <div className="p-4">
                    <img
                        src={`${baseUrl}/stats?username=${username}&theme=${theme}`}
                        alt="GitHub Stats Card"
                        className="w-full"
                    />
                </div>
            );
        case "github-trophies":
            return (
                <div className="p-4">
                    <img
                        src={`${baseUrl}/productive-time?username=${username}&theme=${theme}&utcOffset=1`}
                        alt="Productive Time"
                        className="w-full"
                    />
                </div>
            );
        case "github-languages":
            return (
                <div className="p-4">
                    <img
                        src={`${baseUrl}/repos-per-language?username=${username}&theme=${theme}`}
                        alt="Top Languages"
                        className="w-full"
                    />
                </div>
            );
        case "github-activity":
            return (
                <div className="p-4">
                    <img
                        src={`https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=${theme === 'github_dark' ? 'github-dark' : 'github-light'}&hide_border=true`}
                        alt="Activity Graph"
                        className="w-full"
                    />
                </div>
            );
        case "tech-stack":
            const techs = String(config.technologies || "react,typescript,nodejs,python").split(",").map(t => t.trim().toLowerCase());
            return (
                <div className="p-4">
                    <p className="text-sm text-white/60 mb-3">{String(config.title || "Tech Stack")}</p>
                    <div className="flex flex-wrap gap-2">
                        {techs.map((tech, i) => (
                            <img
                                key={i}
                                src={`https://img.shields.io/badge/${tech}-000000?style=for-the-badge&logo=${tech}&logoColor=white`}
                                alt={tech}
                                className="h-7"
                            />
                        ))}
                    </div>
                </div>
            );

        case "social-links":
            const links = [];
            if (config.twitter) links.push({ name: 'twitter', url: config.twitter });
            if (config.linkedin) links.push({ name: 'linkedin', url: config.linkedin });
            if (config.website) links.push({ name: 'web', url: config.website });
            return (
                <div className="p-4 flex gap-2">
                    {links.length > 0 ? links.map((link, i) => (
                        <img
                            key={i}
                            src={`https://img.shields.io/badge/${link.name}-000000?style=for-the-badge&logo=${link.name}&logoColor=white`}
                            alt={link.name}
                            className="h-7"
                        />
                    )) : (
                        <p className="text-sm text-white/40">Add your social links in properties</p>
                    )}
                </div>
            );
        case "custom-text":
            const fontSize = String(config.fontSize || "base");
            const sizeClass: Record<string, string> = {
                sm: "text-sm",
                base: "text-base",
                lg: "text-lg",
                xl: "text-xl"
            };
            return (
                <div className="p-4">
                    <p className={`text-white/80 ${sizeClass[fontSize] || "text-base"}`}>
                        {String(config.text || "Your custom text here...")}
                    </p>
                </div>
            );
        case "pinned-repos":
            const repoName = String(config.repo || "");
            const repoData = repos.find(r => r.name === repoName);
            const langColor = repoData?.language
                ? LANGUAGE_COLORS[repoData.language.toLowerCase()] || LANGUAGE_COLORS.default
                : LANGUAGE_COLORS.default;

            return (
                <div className="p-4">
                    {repoName && repoData ? (
                        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-lg p-4 hover:border-indigo-500/30 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-white/40" />
                                <span className="text-sm font-medium text-indigo-400 hover:underline cursor-pointer">
                                    {repoData.name}
                                </span>
                                {repoData.fork && (
                                    <span className="text-xs text-white/30 bg-white/5 px-1.5 py-0.5 rounded">Fork</span>
                                )}
                            </div>
                            <p className="text-xs text-white/50 mb-3 line-clamp-2">
                                {repoData.description || `A repository by ${username}`}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-white/40">
                                {repoData.language && (
                                    <span className="flex items-center gap-1.5">
                                        <span
                                            className="w-2.5 h-2.5 rounded-full"
                                            style={{ backgroundColor: langColor }}
                                        />
                                        {repoData.language}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5" />
                                    {repoData.stars}
                                </span>
                                <span className="flex items-center gap-1">
                                    <GitFork className="w-3.5 h-3.5" />
                                    Fork
                                </span>
                            </div>
                        </div>
                    ) : repoName ? (
                        <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                            <p className="text-sm text-white/40">Loading repository data...</p>
                        </div>
                    ) : (
                        <p className="text-sm text-white/40">Select a repository from the dropdown</p>
                    )}
                </div>
            );
        case "profile-counter":
            const counterName = String(config.name || username || "visitor");
            const counterTheme = String(config.theme || "rule34");
            return (
                <div className="p-4 flex justify-center">
                    <img
                        src={`https://count.getloli.com/get/@${counterName}?theme=${counterTheme}`}
                        alt="Profile Views"
                        className="h-24"
                    />
                </div>
            );
        case "spotify-now-playing":
            const spotifyUser = String(config.spotifyUsername || "");
            const spotifyTheme = String(config.theme || "default");
            return (
                <div className="p-4">
                    {spotifyUser ? (
                        <img
                            src={`https://spotify-github-profile.kittinanx.com/api/view?uid=${spotifyUser}&cover_image=true&theme=${spotifyTheme}&bar_color=53b14f&bar_color_cover=false`}
                            alt="Spotify Now Playing"
                            className="w-full rounded-lg"
                        />
                    ) : (
                        <div className="bg-gradient-to-r from-green-500/10 to-green-600/5 border border-green-500/20 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                                <Music className="w-8 h-8 text-green-500" />
                                <div>
                                    <p className="text-sm font-medium text-white">Spotify Now Playing</p>
                                    <p className="text-xs text-white/40">Shows your currently playing track</p>
                                </div>
                            </div>
                            <div className="text-xs text-white/50 space-y-1">
                                <p>1. Go to <span className="text-green-400">spotify-github-profile.kittinanx.com</span></p>
                                <p>2. Login with Spotify to get your UID</p>
                                <p>3. Paste the UID in properties panel</p>
                            </div>
                        </div>
                    )}
                </div>
            );
        case "discord-status":
            const discordId = String(config.discordId || "");
            const discordTheme = String(config.theme || "dark");
            return (
                <div className="p-4">
                    {discordId ? (
                        <img
                            src={`https://lanyard.cnrad.dev/api/${discordId}?theme=${discordTheme}&bg=0d0d12&animated=true`}
                            alt="Discord Status"
                            className="w-full rounded-lg"
                        />
                    ) : (
                        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 rounded-lg p-4 flex items-center gap-3">
                            <MessageCircle className="w-8 h-8 text-indigo-400" />
                            <div>
                                <p className="text-sm font-medium text-white">Discord Status</p>
                                <p className="text-xs text-white/40">Enter your Discord User ID in properties</p>
                            </div>
                        </div>
                    )}
                </div>
            );
        case "wakatime-stats":
            const wakatimeUser = String(config.wakatimeUsername || "");
            const wakatimeLayout = String(config.layout || "compact");
            return (
                <div className="p-4">
                    {wakatimeUser ? (
                        <img
                            src={`https://github-readme-stats.vercel.app/api/wakatime?username=${wakatimeUser}&layout=${wakatimeLayout}&theme=dark&hide_border=true&bg_color=0d0d12`}
                            alt="WakaTime Stats"
                            className="w-full"
                        />
                    ) : (
                        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/5 border border-blue-500/20 rounded-lg p-4 flex items-center gap-3">
                            <Clock className="w-8 h-8 text-blue-400" />
                            <div>
                                <p className="text-sm font-medium text-white">WakaTime Stats</p>
                                <p className="text-xs text-white/40">Enter your WakaTime username in properties</p>
                            </div>
                        </div>
                    )}
                </div>
            );
        default:
            return <div className="h-16 bg-white/5 rounded-lg flex items-center justify-center text-white/30 text-sm">Unknown component</div>;
    }
}

export default function EditorCanvas({
    components,
    selectedId,
    username,
    repos,
    profile,
    socialLinks,
    baseProfileConfig,
    onSelectBaseProfile,
    onSelect,
    onRemove,
    onReorder,
    onDrop,
    onToggleActive
}: EditorCanvasProps) {
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    return (
        <div
            className="flex-1 p-6 overflow-y-auto"
            onDragOver={handleDragOver}
            onDrop={onDrop}
        >
            <div className="max-w-2xl mx-auto">
                {/* Profile Header - Always visible and clickable for editing */}
                {profile && (
                    <ProfileHeader
                        profile={profile}
                        socialLinks={socialLinks}
                        config={baseProfileConfig}
                        isSelected={selectedId === "baseprofile"}
                        onClick={onSelectBaseProfile}
                    />
                )}

                {/* Components */}
                {components.length === 0 ? (
                    <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center">
                        <p className="text-white/40 text-sm mb-2">
                            Drag components here
                        </p>
                        <p className="text-white/20 text-xs">
                            Add stats, graphs, and more to your profile
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {components.map((component, index) => {
                            const Icon = COMPONENT_ICONS[component.type] || FileText;
                            const isSelected = selectedId === component.id;

                            return (
                                <div
                                    key={component.id}
                                    draggable
                                    onDragStart={(e) => {
                                        e.dataTransfer.setData("reorder", String(index));
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                    }}
                                    onDrop={(e) => {
                                        e.stopPropagation();
                                        const reorderIndex = e.dataTransfer.getData("reorder");
                                        if (reorderIndex) {
                                            onReorder(parseInt(reorderIndex), index);
                                        }
                                    }}
                                    onClick={() => onSelect(component.id)}
                                    className={`
                                        bg-[#0d0d12]/80 backdrop-blur-xl rounded-xl overflow-hidden cursor-pointer transition-all
                                        ${isSelected
                                            ? "ring-2 ring-indigo-500 border-transparent"
                                            : "border border-white/10 hover:border-white/20"
                                        }
                                        ${!component.active ? "opacity-50" : ""}
                                    `}
                                >
                                    <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border-b border-white/5">
                                        <GripVertical className="w-4 h-4 text-white/30 cursor-grab" />
                                        <Icon className="w-4 h-4 text-indigo-400" />
                                        <span className="text-sm text-white/70 flex-1">
                                            {COMPONENT_NAMES[component.type] || component.type}
                                        </span>
                                        {!component.active && (
                                            <span className="text-[10px] uppercase tracking-wider text-yellow-400/70 bg-yellow-400/10 px-1.5 py-0.5 rounded font-medium">Off</span>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onToggleActive(component.id);
                                            }}
                                            className="p-1 hover:bg-white/10 rounded transition-colors cursor-pointer"
                                            title={component.active ? "Disable component" : "Enable component"}
                                        >
                                            {component.active
                                                ? <Eye className="w-4 h-4 text-white/40" />
                                                : <EyeOff className="w-4 h-4 text-yellow-400/60" />
                                            }
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onRemove(component.id);
                                            }}
                                            className="p-1 hover:bg-red-500/20 rounded transition-colors cursor-pointer"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400" />
                                        </button>
                                    </div>
                                    <ComponentPreview component={component} username={username} repos={repos} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}