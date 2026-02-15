"use client";

import { useState, useCallback, useEffect } from "react";
import { Save, Loader2, Check, ExternalLink } from "lucide-react";
import ComponentPalette from "./ComponentPalette";
import EditorCanvas from "./EditorCanvas";
import PropertyEditor from "./PropertyEditor";
import { ComponentDefinition, PlacedComponent } from "./editorTypes";

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

interface ProfileEditorProps {
    username: string;
}

export default function ProfileEditor({ username }: ProfileEditorProps) {
    const [components, setComponents] = useState<PlacedComponent[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [repos, setRepos] = useState<GitHubRepo[]>([]);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [saving, setSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");

    // Base profile config (editable settings for the profile header)
    const [baseProfileConfig, setBaseProfileConfig] = useState<Record<string, unknown>>({
        showBanner: true,
        linkStyle: "full",
        customLinks: [],
    });

    // Fetch user's profile and repos on mount
    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch repos
                const reposRes = await fetch("/api/github/repos");
                const reposData = await reposRes.json();
                if (reposData.repos) {
                    setRepos(reposData.repos);
                }

                // Fetch profile and social links
                const profileRes = await fetch("/api/github/profile");
                const profileData = await profileRes.json();
                if (profileData.profile) {
                    setProfile(profileData.profile);
                    setSocialLinks(profileData.socialLinks || []);
                }

                // Load saved profile data
                const savedRes = await fetch(`/api/profile/${username}`);
                if (savedRes.ok) {
                    const savedData = await savedRes.json();
                    if (savedData.components) {
                        setComponents(savedData.components);
                    }
                    if (savedData.baseProfileConfig) {
                        setBaseProfileConfig(savedData.baseProfileConfig);
                    }
                    if (savedData.socialLinks && savedData.socialLinks.length > 0) {
                        setSocialLinks(prev => {
                            // Merge: keep GitHub auto-detected links, overlay saved custom ones
                            const saved = savedData.socialLinks as SocialLink[];
                            const autoDetected = prev.filter(l => !saved.find(s => s.platform === l.platform));
                            return [...saved, ...autoDetected];
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        }
        fetchData();
    }, [username]);

    const handleSave = useCallback(async () => {
        setSaving(true);
        setSaveStatus("idle");
        try {
            const res = await fetch("/api/profile/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    components,
                    baseProfileConfig,
                    socialLinks,
                }),
            });
            if (res.ok) {
                setSaveStatus("saved");
                setTimeout(() => setSaveStatus("idle"), 3000);
            } else {
                setSaveStatus("error");
            }
        } catch {
            setSaveStatus("error");
        } finally {
            setSaving(false);
        }
    }, [components, baseProfileConfig, socialLinks]);

    const handleDragStart = useCallback(() => {
        // Could be used for drag feedback
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();

        const componentData = e.dataTransfer.getData("component");
        if (componentData) {
            const component: ComponentDefinition = JSON.parse(componentData);
            const newComponent: PlacedComponent = {
                id: `${component.type}-${Date.now()}`,
                type: component.type,
                config: { ...component.defaultConfig },
                active: component.type === "spotify-now-playing" ? false : true,
            };

            // Auto-fill first repo for pinned-repos component
            if (component.type === "pinned-repos" && repos.length > 0) {
                newComponent.config.repo = repos[0].name;
            }

            setComponents(prev => [...prev, newComponent]);
            setSelectedId(newComponent.id);
        }
    }, [repos]);

    const handleSelect = useCallback((id: string) => {
        setSelectedId(id);
    }, []);

    const handleSelectBaseProfile = useCallback(() => {
        setSelectedId("baseprofile");
    }, []);

    const handleRemove = useCallback((id: string) => {
        setComponents(prev => prev.filter(c => c.id !== id));
        if (selectedId === id) {
            setSelectedId(null);
        }
    }, [selectedId]);

    const handleReorder = useCallback((dragIndex: number, hoverIndex: number) => {
        setComponents(prev => {
            const newComponents = [...prev];
            const [removed] = newComponents.splice(dragIndex, 1);
            newComponents.splice(hoverIndex, 0, removed);
            return newComponents;
        });
    }, []);

    const handleToggleActive = useCallback((id: string) => {
        setComponents(prev => prev.map(c =>
            c.id === id ? { ...c, active: !c.active } : c
        ));
    }, []);

    const handleUpdateConfig = useCallback((id: string, config: Record<string, unknown>) => {
        if (id === "baseprofile") {
            setBaseProfileConfig(config);
            // Handle custom links
            if (config.customLinks && Array.isArray(config.customLinks)) {
                // Merge custom links with auto-detected ones
            }
        } else {
            setComponents(prev => prev.map(c =>
                c.id === id ? { ...c, config } : c
            ));
        }
    }, []);

    // Create a virtual baseprofile component for PropertyEditor
    const selectedComponent = selectedId === "baseprofile"
        ? { id: "baseprofile", type: "baseprofile", config: baseProfileConfig, active: true }
        : components.find(c => c.id === selectedId) || null;

    return (
        <div className="flex h-[calc(100vh-73px)]">
            <ComponentPalette onDragStart={handleDragStart} />

            <div className="flex-1 flex flex-col">
                {/* Save bar */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <a
                            href={`/${username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-sm text-white/50 hover:text-white/80 transition-colors"
                        >
                            <ExternalLink className="w-4 h-4" />
                            View profile
                        </a>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer
                            ${saveStatus === "saved"
                                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                : saveStatus === "error"
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                    : "bg-indigo-500 hover:bg-indigo-600 text-white"
                            }
                            disabled:opacity-50 disabled:cursor-not-allowed
                        `}
                    >
                        {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : saveStatus === "saved" ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saving ? "Saving..." : saveStatus === "saved" ? "Saved!" : saveStatus === "error" ? "Error" : "Save Profile"}
                    </button>
                </div>

                <EditorCanvas
                    components={components}
                    selectedId={selectedId}
                    username={username}
                    repos={repos}
                    profile={profile}
                    socialLinks={socialLinks}
                    baseProfileConfig={baseProfileConfig}
                    onSelectBaseProfile={handleSelectBaseProfile}
                    onSelect={handleSelect}
                    onRemove={handleRemove}
                    onReorder={handleReorder}
                    onDrop={handleDrop}
                    onToggleActive={handleToggleActive}
                />
            </div>

            <PropertyEditor
                component={selectedComponent}
                repos={repos}
                socialLinks={socialLinks}
                onUpdate={handleUpdateConfig}
                onToggleActive={handleToggleActive}
                onAddSocialLink={(link) => {
                    setSocialLinks(prev => [...prev, link]);
                }}
                onRemoveSocialLink={(platform) => {
                    setSocialLinks(prev => prev.filter(l => l.platform !== platform));
                }}
            />
        </div>
    );
}