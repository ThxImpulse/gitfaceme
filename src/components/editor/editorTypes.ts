import { LucideIcon } from "lucide-react";

export interface ComponentDefinition {
    id: string;
    type: string;
    name: string;
    icon: LucideIcon;
    description: string;
    defaultConfig: Record<string, unknown>;
}

export interface PlacedComponent {
    id: string;
    type: string;
    config: Record<string, unknown>;
    active: boolean;
}

export interface PropertyField {
    key: string;
    label: string;
    type: "text" | "color" | "select" | "number" | "boolean";
    options?: { value: string; label: string }[];
}

export const COMPONENT_PROPERTIES: Record<string, PropertyField[]> = {

    "baseprofile": [
        { key: "showBanner", label: "Show Banner", type: "boolean" },
        {
            key: "linkStyle", label: "Social Link Style", type: "select", options: [
                { value: "full", label: "Icon + Text" },
                { value: "icon", label: "Icon Only" },
            ]
        },
        { key: "aboutMe", label: "About Me", type: "text" },
        { key: "customLinks", label: "Custom Links (JSON)", type: "text" },
    ],
    "github-stats": [
        {
            key: "theme", label: "Theme", type: "select", options: [
                { value: "github_dark", label: "GitHub Dark" },
                { value: "github", label: "GitHub Light" },
                { value: "dracula", label: "Dracula" },
                { value: "nord_dark", label: "Nord Dark" },
                { value: "monokai", label: "Monokai" },
                { value: "solarized_dark", label: "Solarized Dark" },
            ]
        },
    ],
    "github-streak": [
        {
            key: "theme", label: "Theme", type: "select", options: [
                { value: "github_dark", label: "GitHub Dark" },
                { value: "github", label: "GitHub Light" },
                { value: "dracula", label: "Dracula" },
                { value: "nord_dark", label: "Nord Dark" },
            ]
        },
    ],
    "github-trophies": [
        {
            key: "theme", label: "Theme", type: "select", options: [
                { value: "github_dark", label: "GitHub Dark" },
                { value: "github", label: "GitHub Light" },
                { value: "dracula", label: "Dracula" },
            ]
        },
    ],
    "github-languages": [
        {
            key: "theme", label: "Theme", type: "select", options: [
                { value: "github_dark", label: "GitHub Dark" },
                { value: "github", label: "GitHub Light" },
                { value: "dracula", label: "Dracula" },
                { value: "nord_dark", label: "Nord Dark" },
            ]
        },
    ],
    "github-activity": [
        {
            key: "theme", label: "Theme", type: "select", options: [
                { value: "github_dark", label: "GitHub Dark" },
                { value: "github", label: "GitHub Light" },
            ]
        },
    ],
    "tech-stack": [
        { key: "title", label: "Section Title", type: "text" },
        { key: "technologies", label: "Technologies (comma-separated)", type: "text" },
    ],
    "social-links": [
        { key: "twitter", label: "Twitter Username", type: "text" },
        { key: "linkedin", label: "LinkedIn Username", type: "text" },
        { key: "website", label: "Website URL", type: "text" },
    ],
    "custom-text": [
        { key: "text", label: "Text Content", type: "text" },
        {
            key: "fontSize", label: "Font Size", type: "select", options: [
                { value: "sm", label: "Small" },
                { value: "base", label: "Medium" },
                { value: "lg", label: "Large" },
                { value: "xl", label: "Extra Large" },
            ]
        },
    ],
    "pinned-repos": [
        { key: "repo", label: "Repository Name", type: "text" },
        {
            key: "theme", label: "Theme", type: "select", options: [
                { value: "github_dark", label: "GitHub Dark" },
                { value: "github", label: "GitHub Light" },
                { value: "dracula", label: "Dracula" },
            ]
        },
    ],
    "profile-counter": [
        { key: "name", label: "Counter Name (unique ID)", type: "text" },
        {
            key: "theme", label: "Theme", type: "select", options: [
                { value: "rule34", label: "Rule34" },
                { value: "moebooru", label: "Moebooru" },
                { value: "gelbooru", label: "Gelbooru" },
                { value: "asoul", label: "A-Soul" },
            ]
        },
    ],
    "spotify-now-playing": [
        { key: "spotifyUsername", label: "Spotify Username (from spotify-github-profile)", type: "text" },
        {
            key: "theme", label: "Theme", type: "select", options: [
                { value: "default", label: "Default" },
                { value: "novatorem", label: "Novatorem" },
                { value: "natemoo-re", label: "Natemoo-re" },
            ]
        },
    ],
    "discord-status": [
        { key: "discordId", label: "Discord User ID", type: "text" },
        {
            key: "theme", label: "Theme", type: "select", options: [
                { value: "dark", label: "Dark" },
                { value: "light", label: "Light" },
            ]
        },
    ],
    "wakatime-stats": [
        { key: "wakatimeUsername", label: "WakaTime Username", type: "text" },
        {
            key: "layout", label: "Layout", type: "select", options: [
                { value: "compact", label: "Compact" },
                { value: "default", label: "Default" },
            ]
        },
    ],
};