import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { noteCollection, titleFromContent } from "../../db";

function toId(id: string): ObjectId | null {
    return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

// Port of POST /mmj-getNote — fetch a single note's full content.
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const _id = toId(id);
        if (!_id) return NextResponse.json({ error: "bad id" }, { status: 400 });
        const col = await noteCollection();
        const doc = await col.findOne({ _id });
        if (!doc) return NextResponse.json({ error: "not found" }, { status: 404 });
        return NextResponse.json({
            id: doc._id.toString(),
            title: doc.title ?? "Untitled",
            folder: doc.folder ?? "misc",
            note: doc.note ?? "",
            createdAt: doc.createdAt ?? null,
            updatedAt: doc.updatedAt ?? null,
        });
    } catch (err) {
        console.error("GET /pond/api/notes/[id] failed", err);
        return NextResponse.json({ error: "failed to load note" }, { status: 500 });
    }
}

// Port of POST /mmj-update — partial update. Send { note } to save content
// (title is re-derived from the first line) and/or { folder } to move the note.
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const _id = toId(id);
        if (!_id) return NextResponse.json({ error: "bad id" }, { status: 400 });
        const body = await req.json().catch(() => ({}));

        const update: Record<string, string | Date> = {};
        if (typeof body.note === "string") {
            update.note = body.note;
            update.title = titleFromContent(body.note);
            update.updatedAt = new Date(); // bump only on actual content edits
        }
        if (typeof body.folder === "string") {
            update.folder = body.folder.trim() || "misc";
        }
        if (Object.keys(update).length === 0)
            return NextResponse.json({ error: "nothing to update" }, { status: 400 });

        const col = await noteCollection();
        const result = await col.updateOne({ _id }, { $set: update });
        if (result.matchedCount === 0)
            return NextResponse.json({ error: "not found" }, { status: 404 });
        return NextResponse.json({ title: update.title, folder: update.folder, updatedAt: update.updatedAt });
    } catch (err) {
        console.error("PUT /pond/api/notes/[id] failed", err);
        return NextResponse.json({ error: "failed to save note" }, { status: 500 });
    }
}

// Port of POST /mmj-deleteNote — delete a single note.
export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const _id = toId(id);
        if (!_id) return NextResponse.json({ error: "bad id" }, { status: 400 });
        const col = await noteCollection();
        const result = await col.deleteOne({ _id });
        return NextResponse.json({ deleted: result.deletedCount });
    } catch (err) {
        console.error("DELETE /pond/api/notes/[id] failed", err);
        return NextResponse.json({ error: "failed to delete note" }, { status: 500 });
    }
}
