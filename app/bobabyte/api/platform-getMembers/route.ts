import { NextResponse } from 'next/server';
import client from "@/app/resources/mongodb";

export async function POST(req: Request) {
    const body = await req.json();

    async function run() {
        try{
            const db = (await client).db("bobabyte2024").collection("accounts");
            const currContent = await db.findOne();
            if (currContent==null){
                throw new Error("couldn't find document");
            }

            let db_group = currContent.groups;
            let db_users = currContent.usernames;
            let msg:{error:number,members:string[],groupName:string} = {
                error:0,
                members:[],
                groupName:""
            }
            let found = false;
            let memberUsernames = [];
            for (let i=0;i<db_group.length;i++){
                if (db_group[i].id===body.id){
                    //found the group, now ret members
                    found = true;
                    memberUsernames = db_group[i].members;
                    msg.groupName = db_group[i].group;
                }
            }
            //add names into members
            console.log(memberUsernames);
            for (let i=0;i<memberUsernames.length;i++){
                for (let j=0;j<db_users.length;j++){
                    if (memberUsernames[i]===db_users[j].user){
                        msg.members.push(db_users[j]);
                    }
                }
            }
            console.log(msg.members);
            if (!found){
                msg.error=1;
            }
            return NextResponse.json(msg);
        }finally{
            await (await client).close();
        }
    }
    await run();
}
