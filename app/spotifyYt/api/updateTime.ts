import { NextResponse } from 'next/server';
import client from "@/app/resources/mongodb";

export async function POST(req: Request) {
    const body = await req.json();

    try{ //find if im creating a whole new account and then if in a) old acc new device or not and b) new acc new device
        const theName = body.name;
        const theUpdatedDevice = body.updatedDevice;
        const dbTracking = (await client).db("spotifyYt").collection("timeTrack");
        const currContent = await dbTracking.findOne();
        if (currContent==null){
            throw new Error("couldn't find document");
        }
        const currAccs = currContent.accs;
        const submit = []
        let newAcc = true;
        console.log(currAccs,theName,theUpdatedDevice);
        for (let i=0;i<currAccs.length;i++){
            console.log("acc below")
            console.log(currAccs[i])
            if (theName===currAccs[i].name){
                //found old account that we are trying to update
                console.log("found old acc");
                const submitDevices = [];
                let newDevice = true;
                for (let j=0;j<currAccs[i].devices.length;j++){ //find if device alr exists >> old device being updated
                    if (currAccs[i].devices[j].name===theUpdatedDevice.name){
                        //device that is being updated
                        console.log("found old acc and updating device");
                        submitDevices.push(theUpdatedDevice);
                        newDevice = false;
                    }else{
                        submitDevices.push(currAccs[i].devices[j]);
                    }
                }
                if (newDevice){
                    console.log("new device")
                    submitDevices.push(theUpdatedDevice); //will be zeros
                }
                submit.push({
                    name:theName,
                    devices:submitDevices
                })
                newAcc=false;
            }else{
                submit.push(currAccs[i]);
            }
        }
        if (newAcc){
            //create new
            console.log("completely new acc")
            const devs = []
            devs.push(theUpdatedDevice);
            submit.push({
                name:theName,
                devices:devs //will be filled with zeros
            })
        }
        console.log("submit")
        console.log(submit)
        const filter = {title:"accounts"}
        const updateDoc = {
            $set: {
                accs:submit
            }
        }
        await dbTracking.updateOne(filter,updateDoc);
        const sendMsg = {
            accs:submit
        }
        return NextResponse.json(sendMsg);
    }finally{
        await (await client).close();
    }
}
