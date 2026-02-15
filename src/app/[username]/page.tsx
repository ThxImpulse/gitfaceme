import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProfileView from "@/components/gitface/ProfileView";

const RESERVED_ROUTES = new Set(["edit", "onboarding", "pricing", "api", "settings"]);

interface PageProps {
    params: Promise<{ username: string }>;
}

async function getProfileData(username: string) {
    const profile = await prisma.profile.findUnique({
        where: { username },
    });

    if (!profile) return null;

    return {
        username: profile.username,
        components: JSON.parse(profile.components),
        baseProfileConfig: JSON.parse(profile.baseProfileConfig),
        socialLinks: JSON.parse(profile.socialLinks),
    };
}

async function getGitHubProfile(username: string) {
    try {
        const res = await fetch(`https://api.github.com/users/${username}`, {
            headers: {
                "Accept": "application/vnd.github.v3+json",
                ...(process.env.GITHUB_TOKEN ? { "Authorization": `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
        });

        if (!res.ok) return null;

        const data = await res.json();
        return {
            username: data.login,
            name: data.name || data.login,
            avatar: data.avatar_url,
            bio: data.bio,
            location: data.location,
            followers: data.followers,
            following: data.following,
            publicRepos: data.public_repos,
        };
    } catch {
        return null;
    }
}

async function getGitHubRepos(username: string) {
    try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=30`, {
            headers: {
                "Accept": "application/vnd.github.v3+json",
                ...(process.env.GITHUB_TOKEN ? { "Authorization": `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
            },
            next: { revalidate: 300 },
        });

        if (!res.ok) return [];

        const data = await res.json();
        return data.map((repo: Record<string, unknown>) => ({
            name: repo.name as string,
            fullName: repo.full_name as string,
            description: repo.description as string | null,
            stars: repo.stargazers_count as number,
            language: repo.language as string | null,
            fork: repo.fork as boolean,
        }));
    } catch {
        return [];
    }
}

export default async function UserProfilePage({ params }: PageProps) {
    const { username } = await params;

    // Don't handle reserved routes
    if (RESERVED_ROUTES.has(username)) {
        notFound();
    }

    // Fetch saved profile data and GitHub info in parallel
    const [profileData, githubProfile, repos] = await Promise.all([
        getProfileData(username),
        getGitHubProfile(username),
        getGitHubRepos(username),
    ]);

    // Need at least a GitHub profile to show anything
    if (!githubProfile) {
        notFound();
    }

    // If no saved profile, show basic GitHub info
    if (!profileData) {
        return (
            <div className="min-h-screen bg-[#030306] text-white">
                <ProfileView
                    profile={githubProfile}
                    components={[]}
                    socialLinks={[]}
                    baseProfileConfig={{ showBanner: true, linkStyle: "full" }}
                    repos={repos}
                />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030306] text-white">
            <ProfileView
                profile={githubProfile}
                components={profileData.components}
                socialLinks={profileData.socialLinks}
                baseProfileConfig={profileData.baseProfileConfig}
                repos={repos}
            />
        </div>
    );
}