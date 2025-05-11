import { NextResponse } from "next/server";
import querystring from "querystring";
import {client_id, client_secret, stateKey} from "@/app/resources/keys";
import {cookies} from "next/headers";


export async function GET(req: Request) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const query = querystring.parse(req.url);
    const code = query.code || null;
    const state = query.state || null;
    const host = new URL(req.url).host;
    const origin = "https://"+host;
    const cookieStoreState = (await cookies()).get(stateKey);
    let storedState;
    if (cookieStoreState==undefined){
        storedState = null;
    }else{
        storedState = cookieStoreState.value;
    }

    //NO IDEA IF THIS WORKS
    if (state === null || state !== storedState) {
        return NextResponse.redirect("/spotifyYt/#" +
            querystring.stringify({
                error: "state_mismatch"
            }));
    } else {
        const res =  NextResponse.redirect(origin+"/spotifyYt/app.html?" +
            querystring.stringify({
                success: "true"
            }));
        res.headers.append(
            "Set-Cookie",
            `${stateKey}=; Max-Age=0; Path=/;`
        );
        const authOptions = {
            method: "POST",
            headers: {
                "Authorization": "Basic " + Buffer.from(client_id + ":" + client_secret).toString("base64"),
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: querystring.stringify({
                code: code,
                redirect_uri: origin + "/spotifyYt/api/callback",
                grant_type: "authorization_code"
            })
        };

        const request = await fetch("https://accounts.spotify.com/api/token", authOptions);
        if (request.ok){
            const body = await request.json();
            const access_token = body.access_token;
            const refresh_token = body.refresh_token;

            return NextResponse.redirect(origin+"/spotifyYt/app.html?" +
                querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token,
                    //playlistInfo: lastPlaylist
                })
            );
        }else{
            return NextResponse.redirect(origin+"/spotifyYt/?" +
                querystring.stringify({
                    error: "invalid_token"
                }));
        }
    }
}