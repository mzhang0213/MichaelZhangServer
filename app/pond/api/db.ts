import client from "@/app/resources/mongodb";

// Shared accessor for the memo collection. Same cluster/db/collection as the
// old Express "메모장" app: db "mmj", collection "note".
// NOTE: we intentionally do NOT close the shared client — it is a singleton
// promise and closing it breaks subsequent requests.
export async function noteCollection() {
    return (await client).db("mmj").collection("note");
}

// Windows-Notepad behavior: the first non-empty line becomes the display title.
// Notes are stored as HTML (rich text), so convert block tags to newlines, strip
// the rest, and drop any leftover markdown markers so the title reads cleanly.
export function titleFromContent(note: string): string {
    const text = (note ?? "")
        .replace(/<\/?(div|p|h[1-6]|li|blockquote|tr)[^>]*>/gi, "\n") // block tags (open OR close) → newline
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, "&")
        .replace(/&lt;/gi, "<")
        .replace(/&gt;/gi, ">");
    let firstLine = text.split("\n").map((l) => l.trim()).find((l) => l.length > 0);
    if (!firstLine) return "Untitled";
    firstLine = firstLine.replace(/^#{1,6}\s+/, "").replace(/[*_`~]/g, "").trim();
    if (!firstLine) return "Untitled";
    return firstLine.length > 60 ? firstLine.slice(0, 60) + "…" : firstLine;
}
