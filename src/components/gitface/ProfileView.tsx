"use client";

import { BookOpen, MapPin, Users, Github, Globe, Mail, Linkedin, Youtube, Instagram, Star, GitFork } from "lucide-react";
import { X } from "@/components/icons/pack";
import Image from "next/image";

interface PlacedComponent {
    id: string;
    type: string;
    config: Record<string, unknown>;
    active: boolean;
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

const FULL_WIDTH_TYPES = new Set([
    "github-stats",
    "github-activity",
    "discord-status",
    "tech-stack",
    "custom-text",
    "social-links",
    "profile-counter",
]);

interface ProfileViewProps {
    profile: UserProfile;
    components: PlacedComponent[];
    socialLinks: SocialLink[];
    baseProfileConfig: Record<string, unknown>;
    repos?: { name: string; fullName: string; description: string | null; stars: number; language: string | null; fork: boolean }[];
}

function ViewComponentPreview({ component, username, repos }: { component: PlacedComponent; username: string; repos?: ProfileViewProps["repos"] }) {
    const config = component.config;
    const theme = String(config.theme || "github_dark");
    const baseUrl = "https://github-profile-summary-cards.vercel.app/api/cards";

    switch (component.type) {
        case "github-stats":
            return (
                <img
                    src={`${baseUrl}/profile-details?username=${username}&theme=${theme}`}
                    alt="GitHub Stats"
                    className="w-full rounded-xl"
                />
            );
        case "github-streak":
            return (
                <img
                    src={`${baseUrl}/stats?username=${username}&theme=${theme}`}
                    alt="GitHub Stats Card"
                    className="w-full rounded-xl"
                />
            );
        case "github-trophies":
            return (
                <img
                    src={`${baseUrl}/productive-time?username=${username}&theme=${theme}&utcOffset=1`}
                    alt="Productive Time"
                    className="w-full rounded-xl"
                />
            );
        case "github-languages":
            return (
                <img
                    src={`${baseUrl}/repos-per-language?username=${username}&theme=${theme}`}
                    alt="Top Languages"
                    className="w-full rounded-xl"
                />
            );
        case "github-activity":
            return (
                <img
                    src={`https://github-readme-activity-graph.vercel.app/graph?username=${username}&theme=${theme === 'github_dark' ? 'github-dark' : 'github-light'}&hide_border=true`}
                    alt="Activity Graph"
                    className="w-full rounded-xl"
                />
            );
        case "tech-stack": {
            const techs = String(config.technologies || "react,typescript,nodejs,python").split(",").map(t => t.trim().toLowerCase());
            return (
                <div>
                    <p className="text-sm text-white/50 mb-3">{String(config.title || "Tech Stack")}</p>
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
        }

        case "social-links": {
            const links: { name: string; url: unknown }[] = [];
            if (config.twitter) links.push({ name: 'twitter', url: config.twitter });
            if (config.linkedin) links.push({ name: 'linkedin', url: config.linkedin });
            if (config.website) links.push({ name: 'web', url: config.website });
            return (
                <div className="flex gap-2 flex-wrap">
                    {links.map((link, i) => (
                        <img
                            key={i}
                            src={`https://img.shields.io/badge/${link.name}-000000?style=for-the-badge&logo=${link.name}&logoColor=white`}
                            alt={link.name}
                            className="h-7"
                        />
                    ))}
                </div>
            );
        }
        case "custom-text": {
            const fontSize = String(config.fontSize || "base");
            const sizeClass: Record<string, string> = { sm: "text-sm", base: "text-base", lg: "text-lg", xl: "text-xl" };
            return (
                <p className={`text-white/70 ${sizeClass[fontSize] || "text-base"}`}>
                    {String(config.text || "")}
                </p>
            );
        }
        case "pinned-repos": {
            const repoName = String(config.repo || "");
            const repoData = repos?.find(r => r.name === repoName);
            const langColor = repoData?.language
                ? LANGUAGE_COLORS[repoData.language.toLowerCase()] || LANGUAGE_COLORS.default
                : LANGUAGE_COLORS.default;

            if (!repoName || !repoData) return null;
            return (
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-white/30" />
                        <a
                            href={`https://github.com/${username}/${repoData.name}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-indigo-400 hover:underline"
                        >
                            {repoData.name}
                        </a>
                        {repoData.fork && (
                            <span className="text-xs text-white/25 bg-white/5 px-1.5 py-0.5 rounded">Fork</span>
                        )}
                    </div>
                    <p className="text-xs text-white/40 mb-3 line-clamp-2">
                        {repoData.description || `A repository by ${username}`}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-white/35">
                        {repoData.language && (
                            <span className="flex items-center gap-1.5">
                                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: langColor }} />
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
            );
        }
        case "profile-counter": {
            const counterName = String(config.name || username || "visitor");
            const counterTheme = String(config.theme || "rule34");
            return (
                <div className="flex justify-center">
                    <img
                        src={`https://count.getloli.com/get/@${counterName}?theme=${counterTheme}`}
                        alt="Profile Views"
                        className="h-24"
                    />
                </div>
            );
        }
        case "spotify-now-playing": {
            const spotifyUser = String(config.spotifyUsername || "");
            const spotifyTheme = String(config.theme || "default");
            if (!spotifyUser) return null;
            return (
                <img
                    src={`https://spotify-github-profile.kittinanx.com/api/view?uid=${spotifyUser}&cover_image=true&theme=${spotifyTheme}&bar_color=53b14f&bar_color_cover=false`}
                    alt="Spotify Now Playing"
                    className="w-full rounded-xl"
                />
            );
        }
        case "discord-status": {
            const discordId = String(config.discordId || "");
            const discordTheme = String(config.theme || "dark");
            if (!discordId) return null;
            return (
                <img
                    src={`https://lanyard.cnrad.dev/api/${discordId}?theme=${discordTheme}&bg=0d0d12&animated=true`}
                    alt="Discord Status"
                    className="w-full rounded-xl"
                />
            );
        }
        case "wakatime-stats": {
            const wakatimeUser = String(config.wakatimeUsername || "");
            const wakatimeLayout = String(config.layout || "compact");
            if (!wakatimeUser) return null;
            return (
                <img
                    src={`https://github-readme-stats.vercel.app/api/wakatime?username=${wakatimeUser}&layout=${wakatimeLayout}&theme=dark&hide_border=true&bg_color=0d0d12`}
                    alt="WakaTime Stats"
                    className="w-full"
                />
            );
        }
        default:
            return null;
    }
}

export default function ProfileView({ profile, components, socialLinks, baseProfileConfig, repos }: ProfileViewProps) {
    const showBanner = baseProfileConfig.showBanner !== false;
    const linkStyle = String(baseProfileConfig.linkStyle || "full");
    const aboutMe = String(baseProfileConfig.aboutMe || "");
    const customAvatar = baseProfileConfig.customAvatar ? String(baseProfileConfig.customAvatar) : null;
    const customBanner = baseProfileConfig.customBanner ? String(baseProfileConfig.customBanner) : null;
    const activeComponents = components.filter(c => c.active);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Banner — full width, flush to top */}
            {showBanner && (
                <div className="h-48 relative shrink-0 overflow-hidden">
                    {customBanner ? (
                        <>
                            <Image
                                src={customBanner}
                                alt="Profile Banner"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-transparent to-transparent" />
                        </>
                    ) : (
                        <>
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 opacity-70" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#030306] via-transparent to-transparent" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.4),transparent_50%),radial-gradient(circle_at_70%_60%,rgba(168,85,247,0.3),transparent_50%)]" />
                        </>
                    )}
                </div>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col justify-center max-w-3xl w-full mx-auto px-5 pb-16">
                {/* Avatar */}
                <div className={`flex justify-center ${showBanner ? "-mt-16" : "pt-12"} mb-6`}>
                    <div className="relative">
                        <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-60 blur-sm" />
                        <Image
                            src={customAvatar || profile.avatar}
                            alt={profile.name}
                            width={144}
                            height={144}
                            className="relative w-36 h-36 rounded-full border-4 border-[#030306] shadow-[0_8px_32px_rgba(0,0,0,0.5)] object-cover bg-[#030306]"
                        />
                    </div>
                </div>

                {/* Profile info — centered  */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-white mb-1">{profile.name}</h1>
                    <p className="text-white/35 mb-4">@{profile.username}</p>

                    {profile.bio && (
                        <p className="text-white/50 text-[15px] leading-relaxed max-w-lg mx-auto mb-5">
                            {profile.bio}
                        </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-6 text-sm text-white/40 mb-6">
                        {profile.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-indigo-400/70" />
                                {profile.location}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-indigo-400/70" />
                            <strong className="text-white/70">{profile.followers}</strong> followers
                        </span>
                        <span className="flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-400/70" />
                            <strong className="text-white/70">{profile.publicRepos}</strong> repos
                        </span>
                    </div>

                    {/* About Me + Social Links card */}
                    {(() => {
                        const aboutMeTitle = String(baseProfileConfig.aboutMeTitle || "About Me");
                        const aboutMeAlign = String(baseProfileConfig.aboutMeAlign || "center");
                        const aboutMeFontSize = String(baseProfileConfig.aboutMeFontSize || "sm");
                        const aboutMeStyle = String(baseProfileConfig.aboutMeStyle || "card");
                        const hasSocials = socialLinks.length > 0;
                        const hasAboutMe = !!aboutMe;

                        if (!hasAboutMe && !hasSocials) return null;

                        const alignClass: Record<string, string> = {
                            left: "text-left",
                            center: "text-center",
                            right: "text-right",
                        };
                        const fontSizeClass: Record<string, string> = {
                            xs: "text-xs",
                            sm: "text-sm",
                            base: "text-base",
                            lg: "text-lg",
                        };
                        const styleClass: Record<string, string> = {
                            card: "bg-white/[0.03] rounded-xl p-5",
                            bordered: "border border-white/10 rounded-xl p-5",
                            minimal: "py-4",
                            glass: "bg-white/[0.05] backdrop-blur-md border border-white/[0.08] rounded-xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
                        };

                        const socialsJsx = hasSocials ? (
                            <div className={`flex flex-wrap gap-2.5 ${hasAboutMe ? "mt-4 pt-4 border-t border-white/[0.06]" : ""} ${aboutMeAlign === "center" || !hasAboutMe ? "justify-center" : aboutMeAlign === "right" ? "justify-end" : "justify-start"}`}>
                                {socialLinks.map((link) => {
                                    const Icon = SOCIAL_ICONS[link.icon] || SOCIAL_ICONS[link.platform] || Globe;
                                    return (
                                        <a
                                            key={link.platform}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`
                                                group inline-flex items-center gap-2 text-sm text-white/50
                                                bg-white/[0.05] hover:bg-white/[0.1] rounded-lg
                                                transition-all duration-200
                                                ${linkStyle === "icon" ? "p-2.5" : "px-4 py-2"}
                                            `}
                                        >
                                            <Icon className="w-4 h-4 text-white/40 group-hover:text-indigo-400 transition-colors" />
                                            {linkStyle === "full" && <span className="group-hover:text-white/80 transition-colors">{link.username}</span>}
                                        </a>
                                    );
                                })}
                            </div>
                        ) : null;

                        if (!hasAboutMe) {
                            // Just social links, no about me
                            return <div className="mb-6">{socialsJsx}</div>;
                        }

                        return (
                            <div className={`max-w-lg mx-auto mb-6 ${styleClass[aboutMeStyle] || styleClass.card} ${alignClass[aboutMeAlign] || "text-center"}`}>
                                {aboutMeTitle && (
                                    <h3 className="text-sm font-semibold text-white/60 mb-2">{aboutMeTitle}</h3>
                                )}
                                <p className={`text-white/45 ${fontSizeClass[aboutMeFontSize] || "text-sm"} leading-relaxed whitespace-pre-wrap`}>{aboutMe}</p>
                                {socialsJsx}
                            </div>
                        );
                    })()}
                </div>

                {/* Separator */}
                {activeComponents.length > 0 && (
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />
                )}

                {/* Components grid */}
                {activeComponents.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeComponents.map(component => {
                            const isFullWidth = FULL_WIDTH_TYPES.has(component.type);
                            return (
                                <div
                                    key={component.id}
                                    className={`
                                        bg-white/[0.03] rounded-2xl p-5
                                        hover:bg-white/[0.05] transition-colors duration-300
                                        ${isFullWidth ? "md:col-span-2" : ""}
                                    `}
                                >
                                    <ViewComponentPreview component={component} username={profile.username} repos={repos} />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}