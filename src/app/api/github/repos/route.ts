import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function GET() {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {

        const response = await fetch(
            `https://api.github.com/users/${session.user.login}/repos?sort=updated&per_page=20`,
            {
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    Accept: "application/vnd.github.v3+json",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch repositories");
        }

        const repos = await response.json();

        const simplifiedRepos = repos.map((repo: {
            name: string;
            full_name: string;
            description: string | null;
            stargazers_count: number;
            language: string | null;
            fork: boolean;

        }) => ({
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            stars: repo.stargazers_count,
            language: repo.language,
            fork: repo.fork,
        }));

        return NextResponse.json({ repos: simplifiedRepos });
    } catch (error) {
        console.error("Error fetching repos:", error);
        return NextResponse.json(
            { error: "Failed to fetch repositories" },
            { status: 500 }
        );
    }
}