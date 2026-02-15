"use client";

import { Plus, Trash2, Github, Globe, Mail, Linkedin, Youtube, Instagram, User, Upload, Loader2, GripVertical } from "lucide-react";
import { X } from "@/components/icons/pack";
import { PlacedComponent, COMPONENT_PROPERTIES, PropertyField } from "./editorTypes";
import { useState, useRef } from "react";

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

const SOCIAL_PLATFORMS = [
    { value: "x", label: "X", icon: X },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
    { value: "youtube", label: "YouTube", icon: Youtube },
    { value: "instagram", label: "Instagram", icon: Instagram },
    { value: "website", label: "Website", icon: Globe },
    { value: "email", label: "Email", icon: Mail },
    { value: "github", label: "GitHub", icon: Github },
];

interface PropertyEditorProps {
    component: PlacedComponent | null;
    repos: GitHubRepo[];
    socialLinks: SocialLink[];
    onUpdate: (id: string, config: Record<string, unknown>) => void;
    onToggleActive: (id: string) => void;
    onAddSocialLink: (link: SocialLink) => void;
    onRemoveSocialLink: (platform: string) => void;
}

export default function PropertyEditor({
    component,
    repos,
    socialLinks,
    onUpdate,
    onToggleActive,
    onAddSocialLink,
    onRemoveSocialLink,
}: PropertyEditorProps) {
    if (!component) {
        return (
            <div className="w-80 bg-[#0d0d12]/90 backdrop-blur-xl border-l border-white/10 p-4">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                    Properties
                </h2>
                <div className="text-center py-12">
                    <p className="text-white/30 text-sm">
                        Select a component to edit its properties
                    </p>
                </div>
            </div>
        );
    }

    const properties = COMPONENT_PROPERTIES[component.type] || [];

    const handleChange = (key: string, value: unknown) => {
        onUpdate(component.id, {
            ...component.config,
            [key]: value
        });
    };

    // Special UI for baseprofile
    // Base Profile Upload Handlers
    const [isUploading, setIsUploading] = useState<string | null>(null); // 'avatar' | 'banner' | null
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(type);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload failed");

            const data = await res.json();
            if (data.success && data.data && data.data.downloadUrl) {
                const key = type === 'avatar' ? 'customAvatar' : 'customBanner';
                onUpdate("baseprofile", {
                    ...component?.config,
                    [key]: data.data.downloadUrl
                });
            }
        } catch (error) {
            console.error(`Failed to upload ${type}:`, error);
            // Optionally add error toast here
        } finally {
            setIsUploading(null);
            if (e.target) e.target.value = ''; // Reset input
        }
    };

    if (component.type === "baseprofile") {
        return (
            <div className="w-80 bg-[#0d0d12]/90 backdrop-blur-xl border-l border-white/10 p-4 overflow-y-auto overflow-x-hidden">
                <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                    Base Profile
                </h2>

                {/* Custom Avatar */}
                <div className="mb-4 pb-4 border-b border-white/10">
                    <label className="block text-sm text-white/60 mb-2">Custom Avatar</label>
                    <div className="flex items-center gap-3">
                        {component.config.customAvatar ? (
                            <div className="relative group">
                                <img
                                    src={String(component.config.customAvatar)}
                                    alt="Custom Avatar"
                                    className="w-12 h-12 rounded-full object-cover border border-white/10"
                                />
                                <button
                                    onClick={() => onUpdate("baseprofile", { ...component.config, customAvatar: null })}
                                    className="absolute -top-1 -right-1 p-0.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                                <User className="w-5 h-5 text-white/20" />
                            </div>
                        )}
                        <div>
                            <input
                                type="file"
                                ref={avatarInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e, 'avatar')}
                            />
                            <button
                                onClick={() => avatarInputRef.current?.click()}
                                disabled={!!isUploading}
                                className="px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white font-medium transition-colors flex items-center gap-2 cursor-pointer"
                            >
                                {isUploading === 'avatar' ? (
                                    <>
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-3 h-3" />
                                        Upload Image
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Custom Banner */}
                <div className="mb-4 pb-4 border-b border-white/10">
                    <label className="block text-sm text-white/60 mb-2">Custom Banner</label>
                    {component.config.customBanner ? (
                        <div className="relative group mb-2">
                            <img
                                src={String(component.config.customBanner)}
                                alt="Custom Banner"
                                className="w-full h-24 object-cover rounded-lg border border-white/10"
                            />
                            <button
                                onClick={() => onUpdate("baseprofile", { ...component.config, customBanner: null })}
                                className="absolute top-1 right-1 p-1 bg-red-500 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ) : null}

                    <input
                        type="file"
                        ref={bannerInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'banner')}
                    />
                    <button
                        onClick={() => bannerInputRef.current?.click()}
                        disabled={!!isUploading}
                        className="w-full px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-white font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isUploading === 'banner' ? (
                            <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="w-3 h-3" />
                                {component.config.customBanner ? "Replace Banner" : "Upload Banner"}
                            </>
                        )}
                    </button>
                </div>

                {/* Banner Toggle */}
                <div className="mb-4 pb-4 border-b border-white/10">
                    <label className="flex items-center justify-between cursor-pointer">
                        <span className="text-sm text-white/70">Show Banner</span>
                        <button
                            onClick={() => handleChange("showBanner", !component.config.showBanner)}
                            className={`
                                w-12 h-6 rounded-full transition-colors relative
                                ${component.config.showBanner !== false ? "bg-indigo-500" : "bg-white/10"}
                            `}
                        >
                            <div
                                className={`
                                    w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform
                                    ${component.config.showBanner !== false ? "translate-x-6" : "translate-x-0.5"}
                                `}
                            />
                        </button>
                    </label>
                </div>

                {/* Link Style */}
                <div className="mb-4 pb-4 border-b border-white/10">
                    <label className="block text-sm text-white/60 mb-2">
                        Social Link Style
                    </label>
                    <select
                        value={String(component.config.linkStyle || "full")}
                        onChange={(e) => handleChange("linkStyle", e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                    >
                        <option value="full" className="bg-[#0d0d12]">Icon + Text</option>
                        <option value="icon" className="bg-[#0d0d12]">Icon Only</option>
                    </select>
                </div>

                {/* About Me */}
                <div className="mb-4 pb-4 border-b border-white/10">
                    <label className="block text-sm text-white/60 mb-3 font-medium uppercase tracking-wider">
                        About Me
                    </label>

                    {/* Title */}
                    <div className="mb-3">
                        <label className="block text-xs text-white/40 mb-1">Title</label>
                        <input
                            type="text"
                            value={String(component.config.aboutMeTitle || "")}
                            onChange={(e) => handleChange("aboutMeTitle", e.target.value)}
                            placeholder="About Me"
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    {/* Content */}
                    <div className="mb-3">
                        <label className="block text-xs text-white/40 mb-1">Content</label>
                        <textarea
                            value={String(component.config.aboutMe || "")}
                            onChange={(e) => handleChange("aboutMe", e.target.value)}
                            placeholder="Write something about yourself..."
                            rows={4}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                    </div>

                    {/* Alignment */}
                    <div className="mb-3">
                        <label className="block text-xs text-white/40 mb-1">Alignment</label>
                        <div className="flex gap-1">
                            {[
                                { value: "left", label: "Left" },
                                { value: "center", label: "Center" },
                                { value: "right", label: "Right" },
                            ].map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleChange("aboutMeAlign", opt.value)}
                                    className={`
                                        flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer
                                        ${(component.config.aboutMeAlign || "center") === opt.value
                                            ? "bg-indigo-500 text-white"
                                            : "bg-white/5 text-white/50 hover:bg-white/10"
                                        }
                                    `}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Font Size */}
                    <div className="mb-3">
                        <label className="block text-xs text-white/40 mb-1">Font Size</label>
                        <select
                            value={String(component.config.aboutMeFontSize || "sm")}
                            onChange={(e) => handleChange("aboutMeFontSize", e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                        >
                            <option value="xs" className="bg-[#0d0d12]">Extra Small</option>
                            <option value="sm" className="bg-[#0d0d12]">Small</option>
                            <option value="base" className="bg-[#0d0d12]">Medium</option>
                            <option value="lg" className="bg-[#0d0d12]">Large</option>
                        </select>
                    </div>

                    {/* Style */}
                    <div>
                        <label className="block text-xs text-white/40 mb-1">Style</label>
                        <select
                            value={String(component.config.aboutMeStyle || "card")}
                            onChange={(e) => handleChange("aboutMeStyle", e.target.value)}
                            className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                        >
                            <option value="card" className="bg-[#0d0d12]">Card</option>
                            <option value="bordered" className="bg-[#0d0d12]">Bordered</option>
                            <option value="minimal" className="bg-[#0d0d12]">Minimal</option>
                            <option value="glass" className="bg-[#0d0d12]">Glass</option>
                        </select>
                    </div>
                </div>

                {/* Social Links Management */}
                <div className="mb-4">
                    <label className="block text-sm text-white/60 mb-3">
                        Social Links
                    </label>

                    <div className="space-y-2 mb-4">
                        {socialLinks.map((link) => {
                            const platform = SOCIAL_PLATFORMS.find(p => p.value === link.platform);
                            const Icon = platform?.icon || Globe;

                            return (
                                <div
                                    key={link.platform}
                                    className="flex items-center gap-2 p-2 bg-white/5 border border-white/10 rounded-lg"
                                >
                                    <Icon className="w-4 h-4 text-white/50" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white truncate">{link.username}</p>
                                        <p className="text-xs text-white/30 truncate">{link.platform}</p>
                                    </div>
                                    {link.platform !== "github" && (
                                        <button
                                            onClick={() => onRemoveSocialLink(link.platform)}
                                            className="p-1 hover:bg-red-500/20 rounded transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Add New Link */}
                    <AddSocialLinkForm
                        existingPlatforms={socialLinks.map(l => l.platform)}
                        onAdd={onAddSocialLink}
                    />
                </div>
            </div>
        );
    }

    const renderField = (field: PropertyField) => {
        const value = component.config[field.key];

        // Special handling for repo field - show dropdown of user's repos
        if (field.key === "repo" && component.type === "pinned-repos") {
            return (
                <select
                    value={String(value || "")}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                    <option value="" className="bg-[#0d0d12]">Select a repository...</option>
                    {repos.map((repo) => (
                        <option key={repo.name} value={repo.name} className="bg-[#0d0d12]">
                            {repo.name} {repo.stars > 0 ? `⭐ ${repo.stars}` : ""}
                        </option>
                    ))}
                </select>
            );
        }

        switch (field.type) {
            case "text":
                return (
                    <input
                        type="text"
                        value={String(value || "")}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                );
            case "number":
                return (
                    <input
                        type="number"
                        value={Number(value) || 0}
                        onChange={(e) => handleChange(field.key, parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                );
            case "select":
                return (
                    <select
                        value={String(value || "")}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                    >
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value} className="bg-[#0d0d12]">
                                {option.label}
                            </option>
                        ))}
                    </select>
                );
            case "boolean":
                return (
                    <button
                        onClick={() => handleChange(field.key, !value)}
                        className={`
                            w-12 h-6 rounded-full transition-colors relative cursor-pointer
                            ${value ? "bg-indigo-500" : "bg-white/10"}
                        `}
                    >
                        <div
                            className={`
                                w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform
                                ${value ? "translate-x-6" : "translate-x-0.5"}
                            `}
                        />
                    </button>
                );
            case "color":
                return (
                    <input
                        type="color"
                        value={String(value || "#ffffff")}
                        onChange={(e) => handleChange(field.key, e.target.value)}
                        className="w-full h-10 bg-transparent border border-white/10 rounded-lg cursor-pointer"
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-80 bg-[#0d0d12]/90 backdrop-blur-xl border-l border-white/10 p-4 overflow-y-auto">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                Properties
            </h2>

            <div className="mb-4 pb-4 border-b border-white/10">
                <p className="text-sm text-white font-medium">
                    {component.type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                </p>
                <p className="text-xs text-white/40">ID: {component.id.slice(0, 8)}</p>
            </div>

            {/* Active Toggle */}
            <div className="mb-4 pb-4 border-b border-white/10">
                <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-sm text-white/70">Active</span>
                    <button
                        onClick={() => onToggleActive(component.id)}
                        className={`
                            w-12 h-6 rounded-full transition-colors relative cursor-pointer
                            ${component.active ? "bg-indigo-500" : "bg-white/10"}
                        `}
                    >
                        <div
                            className={`
                                w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform
                                ${component.active ? "translate-x-6" : "translate-x-0.5"}
                            `}
                        />
                    </button>
                </label>
                {!component.active && (
                    <p className="text-xs text-yellow-400/60 mt-2">This component won't appear on your public profile</p>
                )}
            </div>

            <div className="space-y-4">
                {properties.map((field) => (
                    <div key={field.key}>
                        <label className="block text-sm text-white/60 mb-2">
                            {field.label}
                        </label>
                        {renderField(field)}
                    </div>
                ))}
            </div>

            {properties.length === 0 && (
                <p className="text-white/30 text-sm text-center py-8">
                    No editable properties for this component
                </p>
            )}
        </div>
    );
}

function AddSocialLinkForm({
    existingPlatforms,
    onAdd
}: {
    existingPlatforms: string[];
    onAdd: (link: SocialLink) => void;
}) {
    const [isAdding, setIsAdding] = useState(false);
    const [platform, setPlatform] = useState("");
    const [url, setUrl] = useState("");

    const availablePlatforms = SOCIAL_PLATFORMS.filter(
        p => !existingPlatforms.includes(p.value)
    );

    const handleSubmit = () => {
        if (!platform || !url) return;

        const platformData = SOCIAL_PLATFORMS.find(p => p.value === platform);
        if (!platformData) return;

        // Extract username from URL
        let username = url;
        try {
            const urlObj = new URL(url.startsWith("http") ? url : `https://${url}`);
            username = urlObj.pathname.replace(/^\//, "").split("/")[0] || urlObj.hostname;
        } catch {
            username = url;
        }

        onAdd({
            platform,
            url: url.startsWith("http") ? url : `https://${url}`,
            icon: platform,
            username,
        });

        setPlatform("");
        setUrl("");
        setIsAdding(false);
    };

    if (!isAdding) {
        return (
            <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 w-full px-3 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-sm text-indigo-400 transition-colors cursor-pointer"
            >
                <Plus className="w-4 h-4" />
                Add Social Link
            </button>
        );
    }

    return (
        <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-3">
            <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
            >
                <option value="" className="bg-[#0d0d12]">Select platform...</option>
                {availablePlatforms.map((p) => (
                    <option key={p.value} value={p.value} className="bg-[#0d0d12]">
                        {p.label}
                    </option>
                ))}
            </select>

            <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="URL or username"
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
            />

            <div className="flex gap-2">
                <button
                    onClick={handleSubmit}
                    disabled={!platform || !url}
                    className="flex-1 px-3 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-white/10 disabled:text-white/30 rounded-lg text-sm text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
                >
                    Add
                </button>
                <button
                    onClick={() => {
                        setIsAdding(false);
                        setPlatform("");
                        setUrl("");
                    }}
                    className="px-3 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm text-white/70 transition-colors cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}