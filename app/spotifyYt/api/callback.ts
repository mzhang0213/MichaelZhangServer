import { NextResponse } from "next/server";
import querystring from "querystring";
import {client_id, client_secret} from "@/app/spotifyYt/api/keys";
import {cookies} from "next/headers";
import {lastPlaylist, stateKey} from "@/app/spotifyYt/api/login";


export async function POST(req: Request) {
    // your application requests refresh and access tokens
    // after checking the state parameter

    const query = querystring.parse(req.url);
    const code = query.code || null;
    const state = query.state || null;
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
        const res =  NextResponse.redirect("/spotifyYt/app.html?" +
            querystring.stringify({
                success: "true"
            }));
        res.headers.append(
            "Set-Cookie",
            `${stateKey}=; Max-Age=0; Path=/;`
        );
        const origin = new URL(req.url).origin;
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

            return NextResponse.redirect("/spotifyYt/app.html?" +
                querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token,
                    playlistInfo: lastPlaylist
                })
            );
        }else{
            return NextResponse.redirect("/spotifyYt/?" +
                querystring.stringify({
                    error: "invalid_token"
                }));
        }
    }
}