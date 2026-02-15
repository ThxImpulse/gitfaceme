import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
    const session = await getSession();

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const nullDropApiKey = process.env.NULLDROP_API;
        if (!nullDropApiKey) {
            console.error("NULLDROP_API key is missing");
            return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
        }

        // Create a new FormData instance to send to NullDrop
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        const response = await fetch("https://nulldrop.xyz/api/v1/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${nullDropApiKey}`,
            },
            body: uploadFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("NullDrop upload failed:", response.status, errorText);
            return NextResponse.json({ error: "Upload failed" }, { status: response.status });
        }

        const data = await response.json();

        // Return the relevant data to the client
        return NextResponse.json(data);

    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}