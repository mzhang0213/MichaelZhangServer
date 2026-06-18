import { NextResponse } from "next/server";
import { noteCollection, titleFromContent } from "../db";

// Port of POST /mmj-getFolder (list notes in a folder) + a no-folder variant
// that returns every note grouped by folder for the home/welcome page.
export async function GET(req: Request) {
    try {
        const folder = new URL(req.url).searchParams.get("folder");
        const col = await noteCollection();

        if (folder) {
            const docs = await col
                .find({ folder }, { projection: { title: 1, createdAt: 1, updatedAt: 1 } })
                .toArray();
            const notes = docs.map((d) => ({
                id: d._id.toString(),
                title: d.title ?? "Untitled",
                createdAt: d.createdAt ?? null,
                updatedAt: d.updatedAt ?? null,
            }));
            return NextResponse.json({ notes });
        }

        // No folder → return all notes grouped by folder for the welcome page.
        const docs = await col
            .find({}, { projection: { title: 1, folder: 1, createdAt: 1, updatedAt: 1 } })
            .toArray();
        const grouped: Record<string, { id: string; title: string; createdAt: Date | null; updatedAt: Date | null }[]> = {};
        for (const d of docs) {
            const f = (d.folder as string) || "misc";
            (grouped[f] ??= []).push({
                id: d._id.toString(),
                title: d.title ?? "Untitled",
                createdAt: d.createdAt ?? null,
                updatedAt: d.updatedAt ?? null,
            });
        }
        const folders = Object.keys(grouped)
            .sort((a, b) => a.localeCompare(b))
            .map((name) => ({ folder: name, notes: grouped[name] }));
        return NextResponse.json({ folders });
    } catch (err) {
        console.error("GET /pond/api/notes failed", err);
        return NextResponse.json({ error: "failed to load notes" }, { status: 500 });
    }
}

// Port of POST /mmj-newNote — create an empty note in a folder.
export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => ({}));
        const folder = typeof body.folder === "string" && body.folder.trim() ? body.folder.trim() : "misc";
        const note = typeof body.note === "string" ? body.note : "";
        const title = titleFromContent(note);
        const now = new Date();
        const col = await noteCollection();
        const result = await col.insertOne({ title, folder, note, createdAt: now, updatedAt: now });
        return NextResponse.json({ id: result.insertedId.toString(), title, folder, note, createdAt: now, updatedAt: now });
    } catch (err) {
        console.error("POST /pond/api/notes failed", err);
        return NextResponse.json({ error: "failed to create note" }, { status: 500 });
    }
}
