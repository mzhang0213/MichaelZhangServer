import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const COOKIE = "pond_auth";

// GET → tell the client whether a password is required and whether it's satisfied.
export async function GET() {
    const expected = process.env.POND_PASSWORD;
    const required = !!expected;
    const value = (await cookies()).get(COOKIE)?.value;
    return NextResponse.json({ required, authed: !required || value === expected });
}

// POST { password } → set the auth cookie if it matches. DELETE → log out.
export async function POST(req: Request) {
    const expected = process.env.POND_PASSWORD;
    if (!expected) return NextResponse.json({ ok: true, required: false }); // open if unset
    const body = await req.json().catch(() => ({}));
    if (typeof body.password !== "string" || body.password !== expected) {
        return NextResponse.json({ error: "wrong password" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set(COOKIE, expected, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
    });
    return res;
}

export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete(COOKIE);
    return res;
}
