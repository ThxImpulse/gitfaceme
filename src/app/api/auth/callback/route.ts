import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
        return NextResponse.redirect(new URL("/onboarding?error=access_denied", request.url));
    }

    if (!code) {
        return NextResponse.redirect(new URL("/onboarding?error=no_code", request.url));
    }

    try {

        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                client_id: process.env.GITHUB_ID,
                client_secret: process.env.GITHUB_SECRET,
                code,
            }),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.error) {
            console.error("GitHub OAuth error:", tokenData);
            return NextResponse.redirect(new URL("/onboarding?error=token_error", request.url));
        }

        const accessToken = tokenData.access_token;

        const userResponse = await fetch("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/vnd.github.v3+json",
            },
        });

        const userData = await userResponse.json();

        const sessionData = {
            accessToken,
            user: {
                id: userData.id,
                login: userData.login,
                name: userData.name,
                email: userData.email,
                avatar_url: userData.avatar_url,
                bio: userData.bio,
                location: userData.location,
                blog: userData.blog,
                twitter_username: userData.twitter_username,
                public_repos: userData.public_repos,
                followers: userData.followers,
                following: userData.following,
            },
        };

        const cookieStore = await cookies();
        cookieStore.set("session", JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30,
            path: "/",
        });

        return NextResponse.redirect(new URL("/edit", request.url));
    } catch (error) {
        console.error("OAuth callback error:", error);
        return NextResponse.redirect(new URL("/onboarding?error=callback_error", request.url));
    }
}