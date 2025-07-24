import { NextResponse } from 'next/server';
import client from "@/app/resources/mongodb";

export async function POST(req: Request) {
    const body = await req.json();

    try{
        const db = (await client).db("bobabyte2024").collection("projects");
        const currContent = await db.findOne();
        if (currContent==null){
            throw new Error("couldn't find document");
        }

        const db_proj = currContent.projects;
        const msg = {
            projects:db_proj
        }
        return NextResponse.json(msg);
    }finally{
        await (await client).close();
    }
}
