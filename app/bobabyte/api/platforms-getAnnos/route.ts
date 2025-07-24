import { NextResponse } from 'next/server';
import client from "@/app/resources/mongodb";

export async function GET() {
    try{
        const db_annos = (await client).db("bobabyte2024").collection("annos");
        const currContent = await db_annos.findOne();
        if (currContent==null){
            throw new Error("couldn't find document");
        }

        const all_annos = currContent.annos;
        let msg = {
            annos:all_annos
        }
        return NextResponse.json(msg);
    }finally{
        await (await client).close();
    }
}
