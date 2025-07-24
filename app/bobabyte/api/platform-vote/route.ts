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

            let allGroups; if (body.round==="groups")allGroups=currContent.groups; else allGroups=currContent.finals;
            let submit = []
            for (let i=0;i<allGroups.length;i++){
                //for all existing groups, try to find our user-casted vote
                //if we found it, we want to have our user-casted vote in allGroups[].votes
                //if you can't find it, then for this group re-create the group
                //EXCLUSIVELY WITHOUT the user's vote in there, whether it is there or not
                let found = false;
                let category = "";
                for (let key of Object.keys(body.votes)){
                    let currCategory = new Set(body.votes[key]);
                    if (currCategory.has(allGroups[i].id)){
                        found = true;
                        category = key;
                        break;
                    }
                }
                let updatedVotes = [];
                for (let j=0;j<allGroups[i].votes.length;j++){
                    if (allGroups[i].votes[j].user!==body.user){
                        updatedVotes.push(allGroups[i].votes[j]);
                    }
                }
                if (found){
                    //if we want the user-submitted vote to be in allGroups[].votes,
                    //then lets create it and push it in!
                    updatedVotes.push({
                        "user":body.user,
                        "category":category
                    });
                }
                allGroups[i].votes=updatedVotes;
                submit.push(allGroups[i]);
            }

            //possible that allGroups has no groups instantiated
            //in that case, lets go thru all submitted votes and
            //see which voted-for groups need a new creation in
            //the database
            for (let key of Object.keys(body.votes)){
                let currCategory = body.votes[key];
                for (let i=0;i<currCategory.length;i++){
                    let found=false;
                    //go thru submitted to see if they exist in db
                    for (let j=0;j<allGroups.length;j++){
                        if (currCategory[i]===allGroups[j].id){
                            found=true;
                            break;
                        }
                    }
                    if (!found){
                        //create a whole new vote profile for this group
                        let newGroup = {
                            id:currCategory[i],
                            votes:[{
                                "user":body.user,
                                "category":key
                            }]
                        }
                        submit.push(newGroup);
                    }
                }
            }
            const filter = {title:"voting"}
            let updateDoc;
            if (body.round==="groups"){
                updateDoc={
                    $set: {
                        groups:submit
                    }
                }
            }else{
                updateDoc={
                    $set: {
                        finals:submit
                    }
                }
            }
            await db.updateOne(filter,updateDoc);
            const sendMsg = {
                accs:submit
            }
            return NextResponse.json(sendMsg);
        }finally{
            await (await client).close();
        }
    }
    await run();
}