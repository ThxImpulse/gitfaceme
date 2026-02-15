import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ username: string }> }
) {
    const { username } = await params;

    try {
        const profile = await prisma.profile.findUnique({
            where: { username },
        });

        if (!profile) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        return NextResponse.json({
            username: profile.username,
            components: JSON.parse(profile.components),
            baseProfileConfig: JSON.parse(profile.baseProfileConfig),
            socialLinks: JSON.parse(profile.socialLinks),
        });
    } catch (error) {
        console.error("Failed to load profile:", error);
        return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
    }
}
