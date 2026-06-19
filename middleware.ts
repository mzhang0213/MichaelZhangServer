import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Password gate for the pond notepad's API. If POND_PASSWORD is unset the app is
// open (so a missing env var never locks you out). The /pond/api/auth endpoint is
// always reachable so the client can log in / check status.
export function middleware(req: NextRequest) {
    const expected = process.env.POND_PASSWORD;
    if (!expected) return NextResponse.next();

    const { pathname } = req.nextUrl;
    if (pathname.startsWith("/pond/api/auth")) return NextResponse.next();

    if (req.cookies.get("pond_auth")?.value !== expected) {
        return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/pond/api/:path*"],
};
