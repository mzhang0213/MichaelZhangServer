import { NextResponse } from 'next/server';
import client from "@/app/resources/mongodb";

export async function POST(req: Request) {
    const body = await req.json();

    async function run() {
        try {
            const dbTracking = (await client).db("bobabyte2024").collection("accounts");
            const currContent = await dbTracking.findOne();
            if (currContent==null){
                throw new Error("couldn't find document");
            }

            const staff = currContent.staff;
            let found = false;
            let msg = {
                error: 0
            }
            for (let i = 0; i < staff.length; i++) {
                if (body.user == staff[i]) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                msg.error = 1;
                console.log("toast");
            }
            NextResponse.json(msg)
        }finally{
            await (await client).close();
        }
    }
    await run();
}
