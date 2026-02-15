import { NextResponse } from "next/server";

// Redirect to GitHub OAuth
export async function GET() {
    const clientId = process.env.GITHUB_ID;
    const redirectUri = `${process.env.AUTH_URL || "http://localhost:3000"}/api/auth/callback`;

    const scope = "read:user user:email";

    const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
    githubAuthUrl.searchParams.set("client_id", clientId!);
    githubAuthUrl.searchParams.set("redirect_uri", redirectUri);
    githubAuthUrl.searchParams.set("scope", scope);

    return NextResponse.redirect(githubAuthUrl.toString());
}