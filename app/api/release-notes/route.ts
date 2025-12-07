import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
    try {
        const filePath = path.join(process.cwd(), "release-note.md");

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return NextResponse.json(
                { content: "# Release Notes\n\nNo release notes found." },
                { status: 200 }
            );
        }

        const content = fs.readFileSync(filePath, "utf8");

        return NextResponse.json({ content });
    } catch (error) {
        console.error("Error reading release notes:", error);
        return NextResponse.json(
            { error: "Failed to read release notes" },
            { status: 500 }
        );
    }
}
