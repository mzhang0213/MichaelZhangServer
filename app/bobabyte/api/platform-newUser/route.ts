import { NextResponse } from 'next/server';
import client from "@/app/resources/mongodb";

export async function POST(req: Request) {
    const body = await req.json();

    async function run() {
        try{
            await (await client).connect();
            const db = (await client).db("bobabyte2024").collection("accounts");
            const currContent = await db.findOne();
            if (currContent==null){
                throw new Error("couldn't find document");
            }

            let submit = currContent.usernames;
            let msg = {
                error:0
            }
            for (let i=0;i<body.names.length;i++){
                let newUser = body.names[i];
                if(body.names[i].user===undefined||body.names[i].user===null||body.names[i].user===""){
                    let newName = (body.names[i].first.charAt(0)+body.names[i].last.charAt(0)).toLowerCase();
                    for (let j=0;j<5;j++)newName+=Math.floor(Math.random()*10);
                    newUser.user = newName;
                }
                submit.push(newUser);
            }
            const filter = {title:"accounts"}
            const updateDoc = {
                $set: {
                    usernames:submit
                }
            }
            await db.updateOne(filter,updateDoc);
            return NextResponse.json(msg);
        }finally{
            await (await client).close();
        }
    }
    await run();
}
