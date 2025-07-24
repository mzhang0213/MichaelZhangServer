import { NextResponse } from 'next/server';
import client from "@/app/resources/mongodb";

export async function POST(req: Request) {
    const body = await req.json();

    async function run() {
        try{
            await (await client).connect();
            const dbTracking = (await client).db("bobabyte2024").collection("accounts");
            const currContent = await dbTracking.findOne();
            if (currContent==null){
                throw new Error("couldn't find document");
            }

            const usernames = currContent.usernames;
            let found=false;
            let msg = {
                error:0,
                user: undefined,
                first: undefined,
                last: undefined
            }
            for (let i=0;i<usernames.length;i++){
                if (body.user==usernames[i].user){
                    //usernames[i] is the correct registered username
                    msg.user=usernames[i].user;
                    msg.first=usernames[i].first;
                    msg.last=usernames[i].last;
                    found=true;
                }
            }
            if (!found){
                msg.error=1;
                console.log("toast");
            }
            return NextResponse.json(msg); //sent as json
        }finally{
            await (await client).close();
        }
    }
    return await run();
}
