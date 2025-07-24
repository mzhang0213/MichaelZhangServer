import { NextResponse } from 'next/server';
import client from "@/app/resources/mongodb";

export async function GET() {
    try{
        await (await client).connect();
        const dbTracking = (await client).db("spotifyYt").collection("timeTrack");
        const result = await dbTracking.findOne();
        return NextResponse.json(result);
    }finally{
        await (await client).close();
    }
}