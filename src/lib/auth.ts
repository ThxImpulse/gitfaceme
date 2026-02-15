import { cookies } from "next/headers";

export interface GitHubUser {
    id: number;
    login: string;
    name: string | null;
    email: string | null;
    avatar_url: string;
    bio: string | null;
    location: string | null;
    blog: string | null;
    twitter_username: string | null;
    public_repos: number;
    followers: number;
    following: number;
}

export interface Session {
    accessToken: string;
    user: GitHubUser;
}

export async function getSession(): Promise<Session | null> {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
        return null;
    }

    try {
        return JSON.parse(sessionCookie.value) as Session;
    } catch {
        return null;
    }
}

export async function getUser(): Promise<GitHubUser | null> {
    const session = await getSession();
    return session?.user || null;
}