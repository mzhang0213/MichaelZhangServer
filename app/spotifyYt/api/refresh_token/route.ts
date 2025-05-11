import {NextResponse} from "next/server";
import {client_id, client_secret} from "@/app/resources/keys";

export async function GET(req: Request){
    // requesting access token from refresh token
    const {searchParams} = new URL(req.url);
    const refresh_token = searchParams.get("refresh_token");

    const request = await fetch("https://accounts.spotify.com/api/token",{
        method: "POST",
        headers: {
            'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token || ""
        })
    });
    if (request.ok){
        const body = await request.json();
        return NextResponse.json({
            "access_token": body.access_token
        })
    }else{
        throw new Error("unable to get access token from refresh token");
    }
}