import { NextResponse } from "next/server";
import { noteCollection } from "../db";

// Returns every note with full content, grouped by folder — the client turns
// this into a zipped folder structure for download. (Port of GET /mmj-getBackup.)
export async function GET() {
    try {
        const col = await noteCollection();
        const docs = await col.find({}).toArray();
        const grouped: Record<string, { title: string; note: string }[]> = {};
        for (const d of docs) {
            const f = (d.folder as string) || "misc";
            (grouped[f] ??= []).push({ title: d.title ?? "Untitled", note: d.note ?? "" });
        }
        const folders = Object.keys(grouped)
            .sort((a, b) => a.localeCompare(b))
            .map((folder) => ({ folder, notes: grouped[folder] }));
        return NextResponse.json({ folders, count: docs.length });
    } catch (err) {
        console.error("GET /pond/api/backup failed", err);
        return NextResponse.json({ error: "failed to build backup" }, { status: 500 });
    }
}
