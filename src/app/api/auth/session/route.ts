import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) {
        return NextResponse.json({ user: null }, { status: 401 });
    }

    try {
        const session = JSON.parse(sessionCookie.value);
        return NextResponse.json({ user: session.user });
    } catch {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}