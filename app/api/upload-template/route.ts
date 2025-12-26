
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { writeFile } from "fs/promises";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const slug = formData.get("slug") as string | null;

        if (!file || !slug) {
            return NextResponse.json({ error: "Missing file or slug" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Ensure templates directory exists
        const templatesDir = path.resolve(process.cwd(), "templates");
        if (!fs.existsSync(templatesDir)) {
            fs.mkdirSync(templatesDir, { recursive: true });
        }

        // Save file as [slug].docx
        const filePath = path.join(templatesDir, `${slug}.docx`);
        await writeFile(filePath, buffer);

        return NextResponse.json({ success: true, path: filePath });
    } catch (error) {
        console.error("Error uploading template:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
