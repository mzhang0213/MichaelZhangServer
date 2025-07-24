import { NextResponse } from 'next/server';
import client from "@/app/resources/mongodb";

export async function POST(req: Request) {
    const body = await req.json();

    async function run() {
        try{
            await (await client).connect();
            const db = (await client).db("bobabyte2024").collection("voting");
            const currContent = await db.findOne();

            if (currContent==null){
                throw new Error("couldn't find document");
            }
            let voting; if (body.round==="groups")voting=currContent.groups; else voting=currContent.finals;
            const msg = {
                voting:voting
            }
            return NextResponse.json(msg);
        }finally{
            await (await client).close();
        }
    }
    return await run();
}
