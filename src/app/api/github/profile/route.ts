import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

interface SocialLink {
    platform: string;
    url: string;
    icon: string;
    username: string;
}

export async function GET() {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = session.user;
    const socialLinks: SocialLink[] = [];

    if (user.twitter_username) {
        socialLinks.push({
            platform: "x",
            url: `https://x.com/${user.twitter_username}`,
            icon: "x",
            username: `@${user.twitter_username}`,
        });
    }

    if (user.blog) {
        const url = user.blog.startsWith("http") ? user.blog : `https://${user.blog}`;
        socialLinks.push({
            platform: "website",
            url: url,
            icon: "globe",
            username: user.blog.replace(/^https?:\/\//, "").replace(/\/$/, ""),
        });
    }

    socialLinks.push({
        platform: "github",
        url: `https://github.com/${user.login}`,
        icon: "github",
        username: user.login,
    });

    if (user.email) {
        socialLinks.push({
            platform: "email",
            url: `mailto:${user.email}`,
            icon: "mail",
            username: user.email,
        });
    }

    return NextResponse.json({
        profile: {
            username: user.login,
            name: user.name || user.login,
            avatar: user.avatar_url,
            bio: user.bio,
            location: user.location,
            followers: user.followers,
            following: user.following,
            publicRepos: user.public_repos,
        },
        socialLinks,
    });
}