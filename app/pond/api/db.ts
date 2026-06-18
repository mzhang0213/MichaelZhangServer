import client from "@/app/resources/mongodb";

// Shared accessor for the memo collection. Same cluster/db/collection as the
// old Express "메모장" app: db "mmj", collection "note".
// NOTE: we intentionally do NOT close the shared client — it is a singleton
// promise and closing it breaks subsequent requests.
export async function noteCollection() {
    return (await client).db("mmj").collection("note");
}

// Windows-Notepad behavior: the first non-empty line becomes the display title.
export function titleFromContent(note: string): string {
    const firstLine = (note ?? "")
        .split("\n")
        .map((l) => l.trim())
        .find((l) => l.length > 0);
    if (!firstLine) return "Untitled";
    return firstLine.length > 60 ? firstLine.slice(0, 60) + "…" : firstLine;
}
