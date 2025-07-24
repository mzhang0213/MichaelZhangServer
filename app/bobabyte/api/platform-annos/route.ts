import { NextResponse } from 'next/server';
import client from "@/app/resources/mongodb";

export async function POST(req: Request) {
    const body = await req.json();

    async function run() {
        try{
            await (await client).connect();
            const db_annos = (await client).db("bobabyte2024").collection("annos");
            const currContent = await db_annos.findOne();
            if (currContent==null){
                throw new Error("couldn't find document");
            }

            let annos_content = currContent.annos;
            let submit = [];
            for (let i=0;i<annos_content.length;i++){
                submit.push(annos_content[i]);
            }
            let currAnno = {
                title:body.title,
                date:Date.now(),
                body:body.body
            }
            submit.push(currAnno);

            const filter = {title:"annos"}
            const updateDoc = {
                $set: {
                    annos:submit
                }
            }
            await db_annos.updateOne(filter,updateDoc);
            let msg = {
                body:body.body
            }
            return NextResponse.json(msg);
        }finally{
            await (await client).close();
        }
    }
    return await run();
}
