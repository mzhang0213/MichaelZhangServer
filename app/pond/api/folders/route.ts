import { NextResponse } from "next/server";
import { noteCollection } from "../db";

// Port of GET /mmj-getFolders — list all distinct folder names.
export async function GET() {
    try {
        const col = await noteCollection();
        const folders = (await col.distinct("folder")).filter(
            (f): f is string => typeof f === "string" && f.length > 0
        );
        folders.sort((a, b) => a.localeCompare(b));
        return NextResponse.json({ folders });
    } catch (err) {
        console.error("GET /pond/api/folders failed", err);
        return NextResponse.json({ error: "failed to load folders" }, { status: 500 });
    }
}
