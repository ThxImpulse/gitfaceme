import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { components, baseProfileConfig, socialLinks } = body;

        const username = session.user.login;

        await prisma.profile.upsert({
            where: { username },
            update: {
                components: JSON.stringify(components),
                baseProfileConfig: JSON.stringify(baseProfileConfig),
                socialLinks: JSON.stringify(socialLinks),
            },
            create: {
                username,
                components: JSON.stringify(components),
                baseProfileConfig: JSON.stringify(baseProfileConfig),
                socialLinks: JSON.stringify(socialLinks),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to save profile:", error);
        return NextResponse.json({ error: "Failed to save profile" }, { status: 500 });
    }
}
