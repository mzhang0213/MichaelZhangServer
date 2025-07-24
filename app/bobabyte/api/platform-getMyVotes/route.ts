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

            let msg;
            let votes; if (body.round==="groups")votes=currContent.groups; else votes=currContent.finals;
            let submit: { [key: string]: string[] } = {};
            for (let i=0;i<votes.length;i++){
                let found = -1;
                for (let j=0;j<votes[i].votes.length;j++){
                    if (votes[i].votes[j].user===body.user){
                        found=j;
                    }
                }
                if (found!==-1){
                    let currCat = votes[i].votes[found].category;
                    if (submit[currCat]===undefined){
                        submit[currCat]=[]
                    }
                    submit[currCat].push(votes[i].id);
                }
            }
            msg = {
                votes:submit
            }
            return NextResponse.json(msg);
        }finally{
            await (await client).close();
        }
    }
    return await run();
}
