import { NextResponse } from "next/server";
import { noteCollection } from "../../db";

// Port of POST /mmj-deleteFolder — delete every note in a folder.
export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ folder: string }> }
) {
    try {
        const { folder } = await params;
        const name = decodeURIComponent(folder);
        const col = await noteCollection();
        const result = await col.deleteMany({ folder: name });
        return NextResponse.json({ deleted: result.deletedCount });
    } catch (err) {
        console.error("DELETE /pond/api/folders/[folder] failed", err);
        return NextResponse.json({ error: "failed to delete folder" }, { status: 500 });
    }
}
